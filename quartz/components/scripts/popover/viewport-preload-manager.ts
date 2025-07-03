import { getContentUrl } from "../../../util/path"
import { FailedLinksManager } from "./failed-links-manager"
import { PreloadManager } from "./preload-manager"
import { PopoverErrorHandler } from "./error-handler"
import { ICleanupManager } from "../managers/CleanupManager"
import { globalResourceManager, globalUnifiedContentCache } from "../managers/index"
import { UnifiedCacheKeyGenerator } from "../cache/unified-cache"

import { PopoverConfig } from "./config"

// 全局状态
const linkCheckInProgress = new Set<string>()
const elementMetadata = new WeakMap<
  HTMLElement,
  { lastInteraction: number; preloadPriority: number }
>()

/**
 * 优化的视口预加载管理器 - 单例模式
 * 实现ICleanupManager接口，统一资源管理
 */
export class ViewportPreloadManager implements ICleanupManager {
  private static instance: ViewportPreloadManager | null = null
  private observer: IntersectionObserver | null = null
  private observedLinks = new Set<HTMLAnchorElement>()
  private isInitialized = false

  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor() {}

  /**
   * 获取单例实例
   * @returns ViewportPreloadManager实例
   */
  static getInstance(): ViewportPreloadManager {
    if (!ViewportPreloadManager.instance) {
      ViewportPreloadManager.instance = new ViewportPreloadManager()
    }
    return ViewportPreloadManager.instance
  }

  /**
   * 初始化视口预加载
   */
  initialize(): void {
    // 防止重复初始化
    if (this.isInitialized) {
      console.debug("[ViewportPreloadManager] Already initialized, skipping...")
      return
    }

    const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]

    if (!("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver not supported, viewport preloading disabled.")
      return
    }

    if (links.length === 0) {
      console.debug("No internal links found for viewport preloading")
      this.isInitialized = true
      return
    }

    this.observer = globalResourceManager.registerIntersectionObserver(
      new IntersectionObserver(
        async (entries, obs) => {
          const visibleLinks = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => {
              const link = entry.target as HTMLAnchorElement
              // 根据链接在视口中的位置计算优先级
              const boundingClientRect = entry.boundingClientRect
              const viewportHeight = window.innerHeight || document.documentElement.clientHeight
              const center = viewportHeight / 2
              const distanceToCenter = Math.abs(
                boundingClientRect.top + boundingClientRect.height / 2 - center,
              )
              // 距离中心越近，优先级越高
              const priority = Math.max(
                0,
                100 - Math.floor((distanceToCenter / viewportHeight) * 100),
              )

              elementMetadata.set(link, { lastInteraction: Date.now(), preloadPriority: priority })
              return link
            })

          console.debug(
            `[ViewportPreloadManager Debug] ${entries.length} entries, ${visibleLinks.length} visible links`,
          )
          if (visibleLinks.length > 0) {
            console.debug(
              `[ViewportPreloadManager Debug] Processing visible links:`,
              visibleLinks.map((l) => l.href),
            )
            try {
              // 批量检查可见链接并获取成功预加载的数量
              const preloadedCount = await this.batchCheckLinks(visibleLinks)

              // 监控缓存大小
              const cacheStats = globalUnifiedContentCache.instance.getStats()
              const hitRate = cacheStats.hitRate
              if (hitRate > 0.5) {
                console.warn(`[Popover] Unified cache warning: ${hitRate}% hit rate`)
              }

              if (preloadedCount > 0) {
                console.debug(`Successfully preloaded ${preloadedCount} links from viewport`)
              }
            } catch (error) {
              console.warn("Error in batch link checking:", error)
            }

            // 停止观察已处理的链接
            visibleLinks.forEach((link) => obs.unobserve(link))
          }
        },
        {
          rootMargin: PopoverConfig.VIEWPORT_MARGIN,
          threshold: PopoverConfig.INTERSECTION_THRESHOLD,
        },
      ),
    )

    links.forEach((link) => {
      this.observer!.observe(link)
      this.observedLinks.add(link)
    })

    this.isInitialized = true
    console.debug("[ViewportPreloadManager] Initialized successfully")
    // 注册观察器到资源管理器
    // Observer will be automatically cleaned up when disconnected
  }

  /**
   * 批量链接有效性检查，优化性能和错误处理
   * @param linksToCheck - 需要检查的链接数组
   * @returns Promise<number> - 返回成功预加载的链接数量
   */
  private async batchCheckLinks(linksToCheck: HTMLAnchorElement[]): Promise<number> {
    // 限制批量检查的数量以避免性能问题
    // 使用自适应批量大小
    const adaptiveBatchSize = PopoverConfig.getAdaptiveBatchSize()
    const linksToProcess = linksToCheck.slice(0, adaptiveBatchSize)

    const checkPromises = linksToProcess.map(async (link) => {
      let cacheKey: string | undefined
      try {
        const contentUrl = getContentUrl(link.href)
        cacheKey = UnifiedCacheKeyGenerator.generateContentKey(contentUrl.toString())

        // 避免重复检查
        if (
          FailedLinksManager.isFailedLink(cacheKey) ||
          globalUnifiedContentCache.instance.has(cacheKey) ||
          linkCheckInProgress.has(cacheKey)
        ) {
          return null
        }

        // 记录元素交互信息
        elementMetadata.set(link, {
          lastInteraction: Date.now(),
          preloadPriority: 1,
        })

        linkCheckInProgress.add(cacheKey)
        try {
          // The link validity check is now handled by PreloadManager
          // 根据交互信息设置优先级，例如：最近交互的链接优先级更高
          const priority = elementMetadata.get(link)?.preloadPriority || 0
          return { url: contentUrl, priority }
        } finally {
          linkCheckInProgress.delete(cacheKey)
        }
      } catch (error) {
        if (cacheKey) {
          FailedLinksManager.addFailedLink(cacheKey)
        }
        PopoverErrorHandler.handleError(error as Error, "ViewportPreloadManager.batchCheckLinks")
        return null
      }
    })

    // 过滤出有效的URL和对应的优先级
    const validUrlsWithPriority = (await Promise.allSettled(checkPromises))
      .filter(
        (result): result is PromiseFulfilledResult<{ url: URL; priority: number }> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value)

    // 委托给PreloadManager进行实际预加载，避免重复逻辑
    const preloadManager = PreloadManager.getInstance()
    const preloadPromises = validUrlsWithPriority.map(({ url, priority }) =>
      preloadManager.preloadLinkContent(url.toString(), priority),
    )

    const preloadResults = await Promise.allSettled(preloadPromises)
    const successfulPreloads = preloadResults.filter(
      (result) => result.status === "fulfilled",
    ).length

    return successfulPreloads
  }

  /**
   * 清理资源 - 实现ICleanupManager接口
   */
  cleanup(): void {
    this.observer?.disconnect()
    this.observer = null
    this.observedLinks.clear()
    this.isInitialized = false
  }

  /**
   * 静态清理方法 - 保持向后兼容
   */
  static cleanup(): void {
    const instance = ViewportPreloadManager.getInstance()
    instance.cleanup()
  }

  /**
   * 重置单例实例
   */
  static resetInstance(): void {
    if (ViewportPreloadManager.instance) {
      ViewportPreloadManager.instance.cleanup()
      ViewportPreloadManager.instance = null
    }
  }

  /**
   * 获取统计信息 - 实现ICleanupManager接口
   */
  getStats(): {
    observedLinksCount: number
    linkCheckInProgressCount: number
    isObserverActive: boolean
    isInitialized: boolean
  } {
    return {
      observedLinksCount: this.observedLinks.size,
      linkCheckInProgressCount: linkCheckInProgress.size,
      isObserverActive: this.observer !== null,
      isInitialized: this.isInitialized,
    }
  }

  /**
   * 静态方法获取统计信息 - 保持向后兼容
   */
  static getStats(): {
    observedLinksCount: number
    linkCheckInProgressCount: number
    isObserverActive: boolean
    isInitialized: boolean
  } {
    const instance = ViewportPreloadManager.getInstance()
    return instance.getStats()
  }

  /**
   * 静态方法初始化 - 保持向后兼容
   */
  static initialize(): void {
    const instance = ViewportPreloadManager.getInstance()
    instance.initialize()
  }
}

/**
 * 智能视口预加载，添加批量检查和优先级管理
 * 使用IntersectionObserver监控可见链接并进行批量预加载
 */
export function initializeViewportPreloading(): void {
  const manager = ViewportPreloadManager.getInstance()
  manager.initialize()
}

// 导出全局状态供外部访问
export { linkCheckInProgress, elementMetadata }
