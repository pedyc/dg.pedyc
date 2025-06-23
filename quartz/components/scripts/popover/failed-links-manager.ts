/**
 * 失败链接管理器模块
 * 优化的失败链接管理器
 * 提供更好的性能和内存管理，使用统一存储管理器
 * 使用UnifiedStorageManager统一管理存储
 */
import { PopoverConfig } from "./config"
import { PopoverErrorHandler } from "./error-handler"
import { UnifiedStorageManager } from "../managers/UnifiedStorageManager"
import { globalResourceManager } from "../managers/index"
import { ICleanupManager } from "../managers/CleanupManager"
export class FailedLinksManager implements ICleanupManager {
  private static pendingLinks = new Set<string>()
  private static batchSaveTimer: number | null = null
  private static failedLinks = new Set<string>()

  /**
   * 从localStorage加载失败链接列表
   */
  static loadFailedLinks(): void {
    try {
      const stored = UnifiedStorageManager.safeGetItem(localStorage, PopoverConfig.STORAGE_KEY)
      if (stored) {
        const links = JSON.parse(stored)
        if (Array.isArray(links)) {
          // 只加载最近的失败链接，避免内存过载
          const recentLinks = links.slice(-PopoverConfig.MAX_FAILED_LINKS)
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
        } else {
          console.warn("Invalid failed links data format in localStorage")
        }
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Loading failed links from localStorage")
      // 清除损坏的数据
      UnifiedStorageManager.safeRemoveItem(localStorage, PopoverConfig.STORAGE_KEY)
    }
  }

  /**
   * 批量保存失败链接到localStorage
   * 使用防抖机制减少localStorage写入频率
   */
  static async batchSaveFailedLinks(): Promise<void> {
    if (this.pendingLinks.size === 0) return

    try {
      // 检查失败链接数量限制
      if (this.failedLinks.size > PopoverConfig.MAX_FAILED_LINKS) {
        console.warn(
          `Failed links count (${this.failedLinks.size}) exceeds maximum (${PopoverConfig.MAX_FAILED_LINKS}), clearing old entries`,
        )
        const linksArray = Array.from(this.failedLinks)
        const keepCount = Math.floor(PopoverConfig.MAX_FAILED_LINKS * 0.8) // 保留80%
        this.failedLinks.clear()
        linksArray.slice(-keepCount).forEach((link) => this.failedLinks.add(link))
      }

      // 保存到存储
      const linksToSave = Array.from(this.failedLinks)
      UnifiedStorageManager.safeSetItem(
        localStorage,
        PopoverConfig.STORAGE_KEY,
        JSON.stringify(linksToSave),
      )

      // 清空待保存列表
      this.pendingLinks.clear()
      this.batchSaveTimer = null
      console.debug(`Saved ${linksToSave.length} failed links to localStorage`)
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Saving failed links to localStorage")
      // 如果保存失败，清空待保存队列以避免内存泄漏
      this.pendingLinks.clear()
      this.batchSaveTimer = null
    }
  }

  /**
   * 添加失败链接（使用批量保存）
   * @param url 失败的链接URL
   */
  static addFailedLink(url: string): void {
    if (!url || typeof url !== "string") {
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

        this.batchSaveTimer = globalResourceManager.setTimeout(
          () => FailedLinksManager.batchSaveFailedLinks(),
          PopoverConfig.BATCH_SAVE_DELAY,
        )
      }
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Adding failed link", url)
    }
  }

  /**
   * 检查链接是否为失败链接
   * @param url 链接URL
   * @returns 是否为失败链接
   */
  static isFailedLink(url: string): boolean {
    return this.failedLinks.has(url)
  }

  /**
   * 移除指定的失败链接
   * @param url 要移除的链接URL
   */
  static removeFailedLink(url: string): void {
    if (!url || typeof url !== "string") {
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
        // No need to set changed = true here as pendingLinks is a subset for saving
      }

      if (changed) {
        // 如果确实移除了链接，则立即触发保存
        // 以确保localStorage状态尽快更新
        if (this.batchSaveTimer) {
          clearTimeout(this.batchSaveTimer)
        }
        // 直接调用 batchSaveFailedLinks 来更新 localStorage
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
   * @param maxAge 最大年龄（毫秒）
   */
  static async cleanupExpiredLinks(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const failures = JSON.parse(
        UnifiedStorageManager.safeGetItem(localStorage, "popover-failures") || "{}",
      )
      const now = Date.now()
      let cleaned = 0

      for (const [url, data] of Object.entries(failures)) {
        if (typeof data === "object" && data && "timestamp" in data) {
          if (now - (data as any).timestamp > maxAge) {
            delete failures[url]
            this.failedLinks.delete(url)
            cleaned++
          }
        }
      }

      if (cleaned > 0) {
        try {
          UnifiedStorageManager.safeSetItem(
            localStorage,
            "popover-failures",
            JSON.stringify(failures),
          )
        } catch (error) {
          console.warn("Failed to save failure statistics:", error)
        }
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
    failedLinksCount: number
    pendingLinksCount: number
    maxFailedLinks: number
  } {
    return {
      failedLinksCount: this.failedLinks.size,
      pendingLinksCount: this.pendingLinks.size,
      maxFailedLinks: PopoverConfig.MAX_FAILED_LINKS,
    }
  }

  /**
   * 清空所有失败链接数据
   */
  static clear(): void {
    this.failedLinks.clear()
    this.pendingLinks.clear()
    if (this.batchSaveTimer) {
      clearTimeout(this.batchSaveTimer)
      this.batchSaveTimer = null
    }
  }

  /**
   * 清理资源 - 实现ICleanupManager接口
   */
  cleanup(): void {
    FailedLinksManager.clear()
  }

  /**
   * 静态清理方法
   */
  static cleanup(): void {
    this.clear()
  }

  /**
   * 获取失败链接集合（只读）
   */
  static getFailedLinks(): ReadonlySet<string> {
    return this.failedLinks
  }
}
