import type { ICleanupManager } from "./CleanupManager"
import {
  CacheMonitorConfig,
  type CacheConfig,
  getCacheConfig,
  CacheKeyRules,
  CACHE_THRESHOLDS,
} from "../cache/unified-cache"

/**
 * 存储配置接口
 */
export interface StorageConfig {
  /** 最大存储大小（字节） */
  maxSize?: number
  /** 内存阈值（0-1） */
  memoryThreshold?: number
  /** 是否启用自动清理 */
  autoCleanup?: boolean
  /** 清理策略 */
  cleanupStrategy?: "lru" | "fifo" | "size"
}

/**
 * 存储配额信息接口
 */
interface StorageQuota {
  used: number
  total: number
  percentage: number
  available: number
}

/**
 * 存储统计信息接口
 */
interface StorageStats {
  localStorage: Omit<StorageQuota, "available">
  sessionStorage: Omit<StorageQuota, "available">
}

/**
 * 统一存储管理器
 * 统一管理 localStorage 和 sessionStorage，提供配额检查、自动清理等功能
 */
export class UnifiedStorageManager implements ICleanupManager {
  private static readonly config: CacheConfig = getCacheConfig("DEFAULT")
  private static readonly DEFAULT_QUOTA = CACHE_THRESHOLDS.MAX_MEMORY_USAGE // 使用统一配置

  /**
   * 检查存储配额使用情况
   * @param storage 存储对象 (localStorage 或 sessionStorage)
   * @returns 配额使用情况对象
   */
  static async checkStorageQuota(storage: Storage): Promise<StorageQuota> {
    // 尝试使用现代 API 获取配额信息
    try {
      if (navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate()
        const used = estimate.usage || 0
        const total = estimate.quota || this.DEFAULT_QUOTA
        return {
          used,
          total,
          percentage: total > 0 ? used / total : 0,
          available: total - used,
        }
      }
    } catch (error) {
      console.warn("无法获取存储配额信息:", error)
    }

    // 降级方案：估算当前存储使用量
    const estimatedSize = this.calculateStorageSize(storage)
    return {
      used: estimatedSize,
      total: this.DEFAULT_QUOTA,
      percentage: estimatedSize / this.DEFAULT_QUOTA,
      available: this.DEFAULT_QUOTA - estimatedSize,
    }
  }

  /**
   * 计算存储大小
   * @param storage 存储对象
   * @returns 估算的存储大小（字节）
   */
  private static calculateStorageSize(storage: Storage): number {
    let size = 0
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          const value = storage.getItem(key)
          size += (key.length + (value?.length || 0)) * 2 // UTF-16 编码
        }
      }
    } catch (error) {
      console.warn("无法估算存储大小:", error)
    }
    return size
  }

  /**
   * 安全设置存储项
   * @param storage 存储对象
   * @param key 键名
   * @param value 值
   * @returns 是否设置成功
   */
  static async safeSetItem(storage: Storage, key: string, value: string): Promise<boolean> {
    // 预检查配额并清理
    await this.checkAndCleanupIfNeeded(storage)

    return this.attemptSetItem(storage, key, value)
  }

  /**
   * 检查配额并在需要时清理
   * @param storage 存储对象
   */
  private static async checkAndCleanupIfNeeded(storage: Storage): Promise<void> {
    try {
      const quota = await this.checkStorageQuota(storage)
      const threshold = this.config.memoryThreshold || 0.9

      if (quota.percentage > threshold) {
        if (CacheMonitorConfig.CONSOLE_WARNINGS) {
          console.warn("存储配额即将耗尽，执行清理...")
        }
        this.cleanupStorage(storage)

        // 重新检查配额
        const newQuota = await this.checkStorageQuota(storage)
        if (newQuota.percentage > threshold) {
          if (CacheMonitorConfig.CONSOLE_WARNINGS) {
            console.warn("清理后配额仍然不足，执行紧急清理...")
          }
          this.emergencyCleanup(storage)
        }
      }
    } catch (error) {
      if (CacheMonitorConfig.CONSOLE_WARNINGS) {
        console.warn("配额检查失败:", error)
      }
    }
  }

  /**
   * 尝试设置存储项，包含重试逻辑
   * @param storage 存储对象
   * @param key 键名
   * @param value 值
   * @returns 是否设置成功
   */
  private static attemptSetItem(storage: Storage, key: string, value: string): boolean {
    try {
      storage.setItem(key, value)
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        return this.handleQuotaExceeded(storage, key, value)
      }
      console.error("设置存储项失败:", error)
      return false
    }
  }

  /**
   * 处理配额超限错误
   * @param storage 存储对象
   * @param key 键名
   * @param value 值
   * @returns 是否设置成功
   */
  private static handleQuotaExceeded(storage: Storage, key: string, value: string): boolean {
    console.warn("存储配额超限，尝试清理后重试...")
    this.cleanupStorage(storage)

    try {
      storage.setItem(key, value)
      return true
    } catch (retryError) {
      console.warn("清理后重试仍失败，执行紧急清理...")
      this.emergencyCleanup(storage)

      try {
        storage.setItem(key, value)
        return true
      } catch (finalError) {
        console.error("最终设置失败:", finalError)
        return false
      }
    }
  }

  /**
   * 安全获取存储项
   * @param storage 存储对象
   * @param key 键名
   * @returns 存储的值或 null
   */
  static safeGetItem(storage: Storage, key: string): string | null {
    try {
      return storage.getItem(key)
    } catch (error) {
      console.error("获取存储项失败:", error)
      return null
    }
  }

  /**
   * 安全移除存储项
   * @param storage 存储对象
   * @param key 键名
   */
  static safeRemoveItem(storage: Storage, key: string): void {
    try {
      storage.removeItem(key)
    } catch (error) {
      console.error("移除存储项失败:", error)
    }
  }

  /**
   * 清理过期数据
   * @param storage 存储对象
   */
  static cleanupStorage(storage: Storage): void {
    try {
      const keysToRemove = this.findExpiredKeys(storage)
      this.removeKeys(storage, keysToRemove)

      if (CacheMonitorConfig.CONSOLE_WARNINGS && keysToRemove.length > 0) {
        console.log(`清理了 ${keysToRemove.length} 个过期项目`)
      }
    } catch (error) {
      if (CacheMonitorConfig.CONSOLE_WARNINGS) {
        console.error("清理存储失败:", error)
      }
    }
  }

  /**
   * 查找过期的键
   * @param storage 存储对象
   * @returns 需要删除的键数组
   */
  private static findExpiredKeys(storage: Storage): string[] {
    const keysToRemove: string[] = []
    const now = Date.now()

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (!key) continue

      // 只清理以缓存前缀开头的键，使用统一配置
      const isCacheKey = Object.values(CacheKeyRules.PREFIXES).some((prefix) =>
        key.startsWith(prefix),
      )

      if (!isCacheKey) continue

      const value = storage.getItem(key)
      if (!value) continue

      if (this.isExpiredItem(value, now)) {
        keysToRemove.push(key)
      }
    }

    return keysToRemove
  }

  /**
   * 检查项目是否过期
   * @param value 存储的值
   * @param now 当前时间戳
   * @returns 是否过期
   */
  private static isExpiredItem(value: string, now: number): boolean {
    try {
      const parsed = JSON.parse(value)
      if (parsed && typeof parsed === "object" && parsed.timestamp) {
        const age = now - parsed.timestamp
        // 使用配置中的TTL，默认为24小时
        const maxAge = (this.config.ttl || 24 * 60 * 60) * 1000
        return age > maxAge
      }
    } catch {
      // 不是JSON格式，检查大小
      const sizeInBytes = new Blob([value]).size
      // 使用配置中的最大内存限制，默认使用统一配置
      const maxSize = (this.config.maxMemoryMB || CACHE_THRESHOLDS.LARGE_CONTENT_SIZE / 1024) * 1024
      return sizeInBytes > maxSize
    }
    return false
  }

  /**
   * 批量删除键
   * @param storage 存储对象
   * @param keys 要删除的键数组
   */
  private static removeKeys(storage: Storage, keys: string[]): void {
    keys.forEach((key) => {
      try {
        storage.removeItem(key)
      } catch (error) {
        console.warn(`删除键 ${key} 失败:`, error)
      }
    })
  }

  /**
   * 紧急清理：移除一半的存储项
   * @param storage 存储对象
   */
  static emergencyCleanup(storage: Storage): void {
    try {
      const keys: string[] = []
      const keyPrefix = this.config.keyPrefix || "sys_"

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(keyPrefix)) {
          keys.push(key)
        }
      }

      // 移除一半的项目
      const toRemove = Math.ceil(keys.length / 2)
      for (let i = 0; i < toRemove; i++) {
        storage.removeItem(keys[i])
      }

      if (CacheMonitorConfig.CONSOLE_WARNINGS) {
        console.warn(`紧急清理：移除了 ${toRemove} 个存储项`)
      }
    } catch (error) {
      if (CacheMonitorConfig.CONSOLE_WARNINGS) {
        console.error("紧急清理失败:", error)
      }
    }
  }

  // SessionStorage 方法
  async setSessionItem(key: string, value: string): Promise<boolean> {
    // 直接使用传入的key，不再添加额外前缀，确保与内存缓存键一致
    return UnifiedStorageManager.safeSetItem(sessionStorage, key, value)
  }

  getSessionItem(key: string): string | null {
    // 直接使用传入的key，不再添加额外前缀，确保与内存缓存键一致
    return UnifiedStorageManager.safeGetItem(sessionStorage, key)
  }

  removeSessionItem(key: string): void {
    // 直接使用传入的key，不再添加额外前缀，确保与内存缓存键一致
    UnifiedStorageManager.safeRemoveItem(sessionStorage, key)
  }

  // LocalStorage 方法
  async setLocalItem(key: string, value: string): Promise<boolean> {
    // 直接使用传入的key，不再添加额外前缀，确保与内存缓存键一致
    return UnifiedStorageManager.safeSetItem(localStorage, key, value)
  }

  getLocalItem(key: string): string | null {
    // 直接使用传入的key，不再添加额外前缀，确保与内存缓存键一致
    return UnifiedStorageManager.safeGetItem(localStorage, key)
  }

  removeLocalItem(key: string): void {
    // 直接使用传入的key，不再添加额外前缀，确保与内存缓存键一致
    UnifiedStorageManager.safeRemoveItem(localStorage, key)
  }

  /**
   * 通用存储操作方法
   * @param storageType 存储类型 ('local' | 'session')
   * @param key 键名
   * @param value 值（可选，用于设置操作）
   * @returns 对于 get 操作返回值，对于 set 操作返回是否成功，对于 remove 操作无返回值
   */
  async setItem(storageType: "local" | "session", key: string, value: string): Promise<boolean> {
    return storageType === "local" ? this.setLocalItem(key, value) : this.setSessionItem(key, value)
  }

  getItem(storageType: "local" | "session", key: string): string | null {
    return storageType === "local" ? this.getLocalItem(key) : this.getSessionItem(key)
  }

  removeItem(storageType: "local" | "session", key: string): void {
    return storageType === "local" ? this.removeLocalItem(key) : this.removeSessionItem(key)
  }

  /**
   * 获取存储统计信息
   * @returns 存储统计
   */
  getStorageStats(): {
    localStorage: { used: number; available: number; itemCount: number }
    sessionStorage: { used: number; available: number; itemCount: number }
  } {
    const getStats = (storage: Storage) => {
      let used = 0
      let itemCount = 0
      const keyPrefix = UnifiedStorageManager.config.keyPrefix || "sys_"

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(keyPrefix)) {
          const value = storage.getItem(key)
          if (value) {
            used += new Blob([key + value]).size
            itemCount++
          }
        }
      }

      const maxCapacity =
        (UnifiedStorageManager.config.capacity ||
          CACHE_THRESHOLDS.HUGE_CONTENT_SIZE / (1024 * 1024)) *
        1024 *
        1024 // 使用统一配置的容量限制
      return {
        used,
        available: Math.max(0, maxCapacity - used),
        itemCount,
      }
    }

    return {
      localStorage: getStats(localStorage),
      sessionStorage: getStats(sessionStorage),
    }
  }

  /**
   * 清理所有存储
   */
  cleanupAllStorage(): void {
    const now = Date.now()
    const cleanupInterval = (UnifiedStorageManager.config.cleanupIntervalMs || 60) * 60 * 1000 // 转换为毫秒

    // 检查是否需要清理（基于配置的清理间隔）
    const lastCleanup = parseInt(localStorage.getItem("last_cleanup") || "0")
    if (now - lastCleanup < cleanupInterval) {
      return // 还未到清理时间
    }

    UnifiedStorageManager.cleanupStorage(localStorage)
    UnifiedStorageManager.cleanupStorage(sessionStorage)

    // 记录清理时间
    localStorage.setItem("last_cleanup", now.toString())

    // 触发自定义事件，通知其他模块缓存已清理
    document.dispatchEvent(new CustomEvent("cacheCleared", { detail: {} }))
  }

  // 实现 ICleanupManager 接口
  cleanup(): void {
    this.cleanupAllStorage()
  }

  getStats(): Promise<StorageStats> {
    const stats = this.getStorageStats()
    const storageStats: StorageStats = {
      localStorage: {
        used: stats.localStorage.used,
        total: stats.localStorage.used + stats.localStorage.available,
        percentage:
          stats.localStorage.used / (stats.localStorage.used + stats.localStorage.available),
      },
      sessionStorage: {
        used: stats.sessionStorage.used,
        total: stats.sessionStorage.used + stats.sessionStorage.available,
        percentage:
          stats.sessionStorage.used / (stats.sessionStorage.used + stats.sessionStorage.available),
      },
    }
    return Promise.resolve(storageStats)
  }
}
