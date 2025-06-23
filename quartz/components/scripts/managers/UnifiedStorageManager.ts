import type { ICleanupManager } from "./CleanupManager"

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
  private static readonly QUOTA_CLEANUP_THRESHOLD = 0.9 // 90%
  private static readonly STORAGE_PREFIX = "quartz_"
  private static readonly DEFAULT_QUOTA = 10 * 1024 * 1024 // 10MB
  private static readonly LARGE_ITEM_THRESHOLD = 10000 // 10KB

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
      if (quota.percentage > this.QUOTA_CLEANUP_THRESHOLD) {
        console.warn("存储配额即将耗尽，执行清理...")
        this.cleanupStorage(storage)

        // 重新检查配额
        const newQuota = await this.checkStorageQuota(storage)
        if (newQuota.percentage > this.QUOTA_CLEANUP_THRESHOLD) {
          console.warn("清理后配额仍然不足，执行紧急清理...")
          this.emergencyCleanup(storage)
        }
      }
    } catch (error) {
      console.warn("配额检查失败:", error)
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
      console.log(`清理了 ${keysToRemove.length} 个过期项目`)
    } catch (error) {
      console.error("清理存储失败:", error)
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
      // 尝试解析为 JSON 以检查过期时间
      const parsed = JSON.parse(value)
      if (parsed && typeof parsed === "object" && parsed.expiry && parsed.expiry < now) {
        return true
      }
    } catch {
      // 如果不是 JSON 格式，检查是否是大文件（优先清理）
      if (value.length > this.LARGE_ITEM_THRESHOLD) {
        return true
      }
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
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          keys.push(key)
        }
      }

      // 移除一半的项目
      const toRemove = Math.ceil(keys.length / 2)
      for (let i = 0; i < toRemove; i++) {
        storage.removeItem(keys[i])
      }

      console.warn(`紧急清理：移除了 ${toRemove} 个存储项`)
    } catch (error) {
      console.error("紧急清理失败:", error)
    }
  }

  /**
   * 添加前缀到键名
   * @param key 原始键名
   * @returns 带前缀的键名
   */
  private static addPrefix(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`
  }

  // SessionStorage 方法
  async setSessionItem(key: string, value: string): Promise<boolean> {
    return UnifiedStorageManager.safeSetItem(
      sessionStorage,
      UnifiedStorageManager.addPrefix(key),
      value,
    )
  }

  getSessionItem(key: string): string | null {
    return UnifiedStorageManager.safeGetItem(sessionStorage, UnifiedStorageManager.addPrefix(key))
  }

  removeSessionItem(key: string): void {
    UnifiedStorageManager.safeRemoveItem(sessionStorage, UnifiedStorageManager.addPrefix(key))
  }

  // LocalStorage 方法
  async setLocalItem(key: string, value: string): Promise<boolean> {
    return UnifiedStorageManager.safeSetItem(
      localStorage,
      UnifiedStorageManager.addPrefix(key),
      value,
    )
  }

  getLocalItem(key: string): string | null {
    return UnifiedStorageManager.safeGetItem(localStorage, UnifiedStorageManager.addPrefix(key))
  }

  removeLocalItem(key: string): void {
    UnifiedStorageManager.safeRemoveItem(localStorage, UnifiedStorageManager.addPrefix(key))
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
   */
  async getStorageStats(): Promise<StorageStats> {
    const [localQuota, sessionQuota] = await Promise.all([
      UnifiedStorageManager.checkStorageQuota(localStorage),
      UnifiedStorageManager.checkStorageQuota(sessionStorage),
    ])

    return {
      localStorage: {
        used: localQuota.used,
        total: localQuota.total,
        percentage: localQuota.percentage,
      },
      sessionStorage: {
        used: sessionQuota.used,
        total: sessionQuota.total,
        percentage: sessionQuota.percentage,
      },
    }
  }

  /**
   * 清理所有存储
   */
  cleanupAllStorage(): void {
    UnifiedStorageManager.cleanupStorage(localStorage)
    UnifiedStorageManager.cleanupStorage(sessionStorage)
  }

  // 实现 ICleanupManager 接口
  cleanup(): void {
    this.cleanupAllStorage()
  }

  getStats(): Promise<StorageStats> {
    return this.getStorageStats()
  }
}
