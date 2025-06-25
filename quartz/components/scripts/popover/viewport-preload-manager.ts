import { getContentUrl } from "../../../util/path"
import { FailedLinksManager } from "./failed-links-manager"
import { PreloadManager } from "./preload-manager"
import { PopoverErrorHandler } from "./error-handler"
import { ICleanupManager } from "../managers/CleanupManager"
import { globalResourceManager } from "../managers/index"
import { CacheKeyGenerator, sanitizeCacheKey } from "../config/cache-config"

import { preloadedCache } from "./cache"
import { PopoverConfig } from "./config"

// 全局状态
const linkCheckInProgress = new Set<string>()
const elementMetadata = new WeakMap<
  HTMLElement,
  { lastInteraction: number; preloadPriority: number }
>()

/**
 * 优化的视口预加载管理器
 * 实现ICleanupManager接口，统一资源管理
 */
export class ViewportPreloadManager implements ICleanupManager {
  private static observer: IntersectionObserver | null = null
  private static observedLinks = new Set<HTMLAnchorElement>()

  /**
   * 初始化视口预加载
   */
  static initialize(): void {
    const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]

    if (!("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver not supported, viewport preloading disabled.")
      return
    }

    if (links.length === 0) {
      console.debug("No internal links found for viewport preloading")
      return
    }

    this.observer = globalResourceManager.registerIntersectionObserver(
      new IntersectionObserver(
        async (entries, obs) => {
          const visibleLinks = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target as HTMLAnchorElement)

          if (visibleLinks.length > 0) {
            try {
              // 批量检查可见链接并获取成功预加载的数量
              const preloadedCount = await this.batchCheckLinks(visibleLinks)

              // 监控缓存大小
              const cacheSize = preloadedCache.getStats().size
              if (cacheSize > PopoverConfig.CACHE_WARNING_THRESHOLD) {
                console.warn(
                  `[Popover] Viewport preload cache warning: ${cacheSize}/${PopoverConfig.CACHE_SIZE}`,
                )
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

    // 注册观察器到资源管理器
    // Observer will be automatically cleaned up when disconnected
  }

  /**
   * 批量链接有效性检查，优化性能和错误处理
   * @param linksToCheck - 需要检查的链接数组
   * @returns Promise<number> - 返回成功预加载的链接数量
   */
  private static async batchCheckLinks(linksToCheck: HTMLAnchorElement[]): Promise<number> {
    // 限制批量检查的数量以避免性能问题
    // 使用自适应批量大小
    const adaptiveBatchSize = PopoverConfig.getAdaptiveBatchSize()
    const linksToProcess = linksToCheck.slice(0, adaptiveBatchSize)

    const checkPromises = linksToProcess.map(async (link) => {
      let cacheKey: string | undefined
      try {
        const contentUrl = getContentUrl(link.href)
        cacheKey = CacheKeyGenerator.content(sanitizeCacheKey(contentUrl.toString()))

        // 避免重复检查
        if (
          FailedLinksManager.isFailedLink(cacheKey) ||
          preloadedCache.has(cacheKey) ||
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
          return contentUrl
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

    const validUrls = (await Promise.allSettled(checkPromises))
      .filter(
        (result): result is PromiseFulfilledResult<URL> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value)

    // 委托给PreloadManager进行实际预加载，避免重复逻辑
    const preloadPromises = validUrls.map((url) =>
      PreloadManager.preloadLinkContent(url.toString()),
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
    ViewportPreloadManager.cleanup()
  }

  /**
   * 静态清理方法
   */
  static cleanup(): void {
    this.observer?.disconnect()
    this.observer = null
    this.observedLinks.clear()
  }

  /**
   * 获取统计信息 - 实现ICleanupManager接口
   */
  static getStats(): {
    observedLinksCount: number
    linkCheckInProgressCount: number
    isObserverActive: boolean
  } {
    return {
      observedLinksCount: this.observedLinks.size,
      linkCheckInProgressCount: linkCheckInProgress.size,
      isObserverActive: this.observer !== null,
    }
  }
}

/**
 * 智能视口预加载，添加批量检查和优先级管理
 * 使用IntersectionObserver监控可见链接并进行批量预加载
 */
export function initializeViewportPreloading(): void {
  ViewportPreloadManager.initialize()
}

// 导出全局状态供外部访问
export { linkCheckInProgress, elementMetadata }
