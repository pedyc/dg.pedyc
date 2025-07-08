/**
 * 失败链接管理器模块
 * 优化的失败链接管理器
 * 提供更好的性能和内存管理，使用统一存储管理器
 * 使用UnifiedStorageManager统一管理存储
 * 应用统一缓存配置和缓存键生成逻辑
 */
import { PopoverConfig } from "./index"
import { PopoverErrorHandler } from "./error-handler"
import { UnifiedStorageManager } from "../managers/UnifiedStorageManager"
import { globalResourceManager } from "../managers/index"
import { ICleanupManager } from "../managers/CleanupManager"
import { getCacheConfig } from "../cache/unified-cache"
import { CacheKeyFactory } from "../cache"
export class FailedLinksManager implements ICleanupManager {
  private static pendingLinks = new Set<string>()
  private static batchSaveTimer: number | null = null
  private static failedLinks = new Set<string>()

  // 使用统一缓存配置
  private static readonly _cacheConfig = getCacheConfig("DEFAULT")

  // 生成统一的存储键
  private static readonly FAILED_LINKS_STORAGE_KEY =
    CacheKeyFactory.generateSystemKey("failed_links")
  private static readonly FAILURE_STATS_STORAGE_KEY =
    CacheKeyFactory.generateSystemKey("failure_stats")

  // 失败统计数据缓存
  private static _failureStatsCache: Record<string, any> | null = null
  private static _failureStatsCacheTime = 0
  private static readonly CACHE_DURATION = 5000 // 5秒缓存

  /**
   * 验证URL是否有效
   * @param url 要验证的URL
   * @returns 是否为有效URL
   */
  private static isValidUrl(url: string): boolean {
    return Boolean(url && typeof url === "string" && url.length > 0)
  }

  /**
   * 获取失败统计数据（带缓存）
   * @returns 失败统计数据对象
   */
  private static getFailureStats(): Record<string, any> {
    const now = Date.now()
    if (this._failureStatsCache && now - this._failureStatsCacheTime < this.CACHE_DURATION) {
      return this._failureStatsCache
    }

    try {
      const statsData = JSON.parse(
        UnifiedStorageManager.safeGetItem(localStorage, this.FAILURE_STATS_STORAGE_KEY) || "{}",
      )
      this._failureStatsCache = statsData || {}
      this._failureStatsCacheTime = now
      return this._failureStatsCache!
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Parsing failure stats")
      this._failureStatsCache = {}
      this._failureStatsCacheTime = now
      return this._failureStatsCache
    }
  }

  /**
   * 更新失败统计数据缓存
   * @param stats 新的统计数据
   */
  private static updateFailureStatsCache(stats: Record<string, any>): void {
    this._failureStatsCache = stats
    this._failureStatsCacheTime = Date.now()

    try {
      UnifiedStorageManager.safeSetItem(
        localStorage,
        this.FAILURE_STATS_STORAGE_KEY,
        JSON.stringify(stats),
      )
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Updating failure stats cache")
    }
  }

  /**
   * 从localStorage加载失败链接列表
   */
  static loadFailedLinks(): void {
    // 首先执行存储键迁移

    try {
      const stored = UnifiedStorageManager.safeGetItem(localStorage, this.FAILED_LINKS_STORAGE_KEY)
      if (stored) {
        const links = JSON.parse(stored)
        if (Array.isArray(links)) {
          // 只加载最近的失败链接，避免内存过载
          const recentLinks = links.slice(-this._cacheConfig.capacity)
          const validLinks = recentLinks.filter(
            (link) => typeof link === "string" && link.length > 0,
          )
          validLinks.forEach((link) => this.failedLinks.add(link))
          console.debug(`Loaded ${validLinks.length} failed links from localStorage`)

          if (validLinks.length !== recentLinks.length) {
            console.warn(
              `Filtered out ${recentLinks.length - validLinks.length} invalid failed links`,
            )
          }

          // 加载后立即清理过期的失败链接
          this.cleanupExpiredLinks()
        } else {
          console.warn("Invalid failed links data format in localStorage")
        }
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Loading failed links from localStorage")
      // 清除损坏的数据
      UnifiedStorageManager.safeRemoveItem(localStorage, this.FAILED_LINKS_STORAGE_KEY)
    }
  }

  /**
   * 批量保存失败链接到localStorage
   * 使用防抖机制减少localStorage写入频率
   */
  static async batchSaveFailedLinks(): Promise<void> {
    try {
      // 如果有待保存的链接，先记录时间戳
      if (this.pendingLinks.size > 0) {
        const pendingArray = Array.from(this.pendingLinks)
        this.batchRecordFailureTimestamps(pendingArray)
        this.pendingLinks.clear()
      }

      // 检查失败链接数量限制
      if (this.failedLinks.size > this._cacheConfig.capacity) {
        console.warn(
          `Failed links count (${this.failedLinks.size}) exceeds maximum (${this._cacheConfig.capacity}), clearing old entries`,
        )
        const linksArray = Array.from(this.failedLinks)
        const keepCount = Math.floor(this._cacheConfig.capacity * 0.8) // 保留80%
        this.failedLinks.clear()
        linksArray.slice(-keepCount).forEach((link) => this.failedLinks.add(link))
      }

      // 保存到存储
      const linksToSave = Array.from(this.failedLinks)
      UnifiedStorageManager.safeSetItem(
        localStorage,
        this.FAILED_LINKS_STORAGE_KEY,
        JSON.stringify(linksToSave),
      )

      console.debug(`Saved ${linksToSave.length} failed links to localStorage`)
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Saving failed links to localStorage")
    } finally {
      // 确保清理状态
      this.pendingLinks.clear()
      this.batchSaveTimer = null
    }
  }

  /**
   * 检查失败链接是否过期
   * 使用统一缓存配置的TTL
   * @param url 链接URL
   * @returns 是否过期
   */
  private static isFailedLinkExpired(url: string): boolean {
    try {
      const failures = this.getFailureStats()

      if (failures[url] && typeof failures[url] === "object" && "timestamp" in failures[url]) {
        const timestamp = failures[url].timestamp
        const now = Date.now()
        return now - timestamp > this._cacheConfig.ttl
      }

      return false // 如果没有时间戳信息，认为未过期
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Checking failed link expiration", url)
      return false
    }
  }

  /**
   * 批量记录失败链接的时间戳
   * @param urls 失败的链接URL数组
   */
  private static batchRecordFailureTimestamps(urls: string[]): void {
    if (urls.length === 0) return

    try {
      const failures = this.getFailureStats()
      const now = Date.now()

      for (const url of urls) {
        failures[url] = {
          timestamp: now,
          count: (failures[url]?.count || 0) + 1,
        }
      }

      this.updateFailureStatsCache(failures)
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Batch recording failure timestamps")
    }
  }

  /**
   * 添加失败链接（使用批量保存）
   * @param url 失败的链接URL
   */
  static addFailedLink(url: string): void {
    if (!this.isValidUrl(url)) {
      console.warn("Invalid URL provided to addFailedLink:", url)
      return
    }

    try {
      // 只有当链接不在主集合中时才添加
      if (!this.failedLinks.has(url)) {
        this.failedLinks.add(url)
        this.pendingLinks.add(url)

        // 设置批量保存定时器
        if (this.batchSaveTimer) {
          clearTimeout(this.batchSaveTimer)
        }

        this.batchSaveTimer = globalResourceManager.instance.setTimeout(
          () => this.batchSaveFailedLinks(),
          PopoverConfig.BATCH_SAVE_DELAY,
        )
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Adding failed link", url)
    }
  }

  /**
   * 检查链接是否为失败链接
   * 考虑TTL过期时间
   * @param url 链接URL
   * @returns 是否为失败链接
   */
  static isFailedLink(url: string): boolean {
    if (!this.isValidUrl(url)) {
      return false
    }

    if (!this.failedLinks.has(url)) {
      return false
    }

    // 检查是否过期
    if (this.isFailedLinkExpired(url)) {
      // 如果过期，从失败链接集合中移除
      this.failedLinks.delete(url)
      this.pendingLinks.delete(url)
      return false
    }

    return true
  }

  /**
   * 移除指定的失败链接
   * @param url 要移除的链接URL
   */
  static removeFailedLink(url: string): void {
    if (!this.isValidUrl(url)) {
      console.warn("Invalid URL provided to removeFailedLink:", url)
      return
    }

    try {
      let changed = false
      if (this.failedLinks.has(url)) {
        this.failedLinks.delete(url)
        changed = true
      }
      if (this.pendingLinks.has(url)) {
        this.pendingLinks.delete(url)
      }

      if (changed) {
        // 同时从失败统计中移除
        const failures = this.getFailureStats()
        if (failures[url]) {
          delete failures[url]
          this.updateFailureStatsCache(failures)
        }

        // 立即触发保存以确保localStorage状态更新
        if (this.batchSaveTimer) {
          clearTimeout(this.batchSaveTimer)
        }
        this.batchSaveFailedLinks()
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Removing failed link", url)
    }
  }

  /**
   * 强制保存所有待保存的失败链接
   */
  static forceSave(): void {
    if (this.batchSaveTimer) {
      clearTimeout(this.batchSaveTimer)
      this.batchSaveTimer = null
    }
    this.batchSaveFailedLinks()
  }

  /**
   * 清理过期的失败链接（统一存储管理）
   * 使用统一的清理逻辑，避免与cleanupExpiredFailedLinks重复
   * @param maxAge 最大年龄（毫秒），默认使用配置的TTL
   */
  static async cleanupExpiredLinks(maxAge?: number): Promise<void> {
    const actualMaxAge = maxAge || this._cacheConfig.ttl

    try {
      const failures = this.getFailureStats()
      const now = Date.now()
      let cleaned = 0
      const expiredUrls: string[] = []

      // 找出过期的链接
      for (const [url, data] of Object.entries(failures)) {
        if (typeof data === "object" && data && "timestamp" in data) {
          if (now - (data as any).timestamp > actualMaxAge) {
            expiredUrls.push(url)
          }
        }
      }

      // 批量移除过期链接
      if (expiredUrls.length > 0) {
        for (const url of expiredUrls) {
          this.failedLinks.delete(url)
          this.pendingLinks.delete(url)
          delete failures[url]
          cleaned++
        }

        // 更新缓存和存储
        this.updateFailureStatsCache(failures)

        // 同时更新失败链接列表
        const linksArray = Array.from(this.failedLinks)
        UnifiedStorageManager.safeSetItem(
          localStorage,
          this.FAILED_LINKS_STORAGE_KEY,
          JSON.stringify(linksArray),
        )

        console.debug(`Cleaned up ${cleaned} expired failed links`)
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Cleaning up expired failed links")
    }
  }

  /**
   * 获取失败链接统计信息
   */
  static getStats(): {
    totalFailedLinks: number
    cacheCapacity: number
    memoryUsage: string
    failureDetails: Record<string, any>
  } {
    try {
      const failures = this.getFailureStats()

      return {
        totalFailedLinks: this.failedLinks.size,
        cacheCapacity: this._cacheConfig.capacity,
        memoryUsage: `${Math.round((JSON.stringify(Array.from(this.failedLinks)).length / 1024) * 100) / 100} KB`,
        failureDetails: failures,
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Getting failed links stats")
      return {
        totalFailedLinks: this.failedLinks.size,
        cacheCapacity: this._cacheConfig.capacity,
        memoryUsage: "0 KB",
        failureDetails: {},
      }
    }
  }

  /**
   * 获取调试信息
   */
  static getDebugInfo(): Record<string, any> {
    try {
      const failures = this.getFailureStats()

      return {
        failedLinksCount: this.failedLinks.size,
        pendingLinksCount: this.pendingLinks.size,
        cacheCapacity: this._cacheConfig.capacity,
        cacheTTL: this._cacheConfig.ttl,
        maxMemoryMB: this._cacheConfig.maxMemoryMB,
        storageKeys: {
          failedLinks: this.FAILED_LINKS_STORAGE_KEY,
          failureStats: this.FAILURE_STATS_STORAGE_KEY,
        },
        failureDetails: failures,
        memoryUsage: `${Math.round((JSON.stringify(Array.from(this.failedLinks)).length / 1024) * 100) / 100} KB`,
        cacheInfo: {
          statsCache: this._failureStatsCache ? "cached" : "not cached",
          cacheAge: this._failureStatsCacheTime ? Date.now() - this._failureStatsCacheTime : 0,
        },
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Getting debug info")
      return {
        error: "Failed to get debug info",
        failedLinksCount: this.failedLinks.size,
        pendingLinksCount: this.pendingLinks.size,
      }
    }
  }

  /**
   * 清空所有失败链接数据
   */
  static clear(): void {
    this.failedLinks.clear()
    this.pendingLinks.clear()

    // 清理定时器
    if (this.batchSaveTimer) {
      clearTimeout(this.batchSaveTimer)
      this.batchSaveTimer = null
    }

    // 清理缓存
    this._failureStatsCache = null
    this._failureStatsCacheTime = 0

    // 清理存储
    try {
      UnifiedStorageManager.safeRemoveItem(localStorage, this.FAILED_LINKS_STORAGE_KEY)
      UnifiedStorageManager.safeRemoveItem(localStorage, this.FAILURE_STATS_STORAGE_KEY)
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Clearing failed links storage")
    }
  }

  /**
   * 清理资源 - 实现ICleanupManager接口
   */
  cleanup(): void {
    FailedLinksManager.clear()
  }

  /**
   * 静态清理方法 - 提供完整的清理功能
   */
  static cleanup(): void {
    // 清理过期链接
    this.cleanupExpiredLinks()
    // 强制保存待保存的链接
    this.forceSave()
    // 清空内存中的数据
    this.clear()
  }

  /**
   * 获取失败链接集合（只读）
   */
  static getFailedLinks(): ReadonlySet<string> {
    return this.failedLinks
  }
}
