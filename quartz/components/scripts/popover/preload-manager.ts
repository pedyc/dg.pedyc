/**
 * 预加载管理器模块
 */
import { OptimizedCacheManager } from "../managers/OptimizedCacheManager"
import { getCacheConfig, CacheKeyGenerator, sanitizeCacheKey } from "../config/cache-config"
import { ICleanupManager } from "../managers/CleanupManager"
import { globalResourceManager } from "../managers/index"
import { PopoverConfig } from "./config"
import { PopoverErrorHandler } from "./error-handler"
import { getContentUrl } from "../../../util/path"

const linkValidityCache = new OptimizedCacheManager<boolean>(getCacheConfig("LINK_VALIDITY_CACHE"))

// 类型定义

interface PreloadQueueItem {
  href: string
  priority: number
  resolve: () => void
}

// 全局状态
const preloadingInProgress = new Set<string>()

// 预加载缓存（从popover.inline导入）
import { preloadedCache } from "./cache"
import { FailedLinksManager } from "./failed-links-manager"
import { HTMLContentProcessor } from "./html-processor"

/**
 * 预加载管理器
 * 管理链接内容的预加载，包括并发控制和队列管理
 * 实现ICleanupManager接口，统一资源管理
 */
export class PreloadManager implements ICleanupManager {
  private static readonly MAX_CONCURRENT_PRELOADS = PopoverConfig.MAX_CONCURRENT_PRELOADS
  private static currentPreloads = 0
  private static preloadQueue: PreloadQueueItem[] = []

  /**
   * 预加载链接内容
   * @param href 链接地址
   * @returns Promise<void>
   */
  static async preloadLinkContent(href: string): Promise<void> {
    // 使用统一的URL处理函数确保缓存键一致性
    const contentUrl = getContentUrl(href)
    const cacheKey = CacheKeyGenerator.content(sanitizeCacheKey(contentUrl.toString()))

    // 检查是否已经在缓存中或正在预加载
    if (preloadedCache.has(cacheKey) || preloadingInProgress.has(cacheKey)) {
      return
    }

    // 检查是否为失败链接
    if (FailedLinksManager.isFailedLink(cacheKey)) {
      return
    }

    // 如果当前预加载数量已达上限，加入队列
    if (this.currentPreloads >= this.MAX_CONCURRENT_PRELOADS) {
      return new Promise<void>((resolve) => {
        this.preloadQueue.push({ href, priority: 0, resolve: () => resolve() })
      })
    }

    await this.executePreload(href, 0)
  }

  /**
   * 执行预加载
   * @param href 链接地址
   * @param priority 优先级
   * @returns Promise<boolean> 是否成功预加载
   */
  private static async isLinkValid(url: URL): Promise<boolean> {
    const cacheKey = CacheKeyGenerator.link(sanitizeCacheKey(url.toString()), "validity")

    if (linkValidityCache.has(cacheKey)) {
      return linkValidityCache.get(cacheKey) || false
    }

    try {
      const controller = new AbortController()
      const timeoutId = globalResourceManager.setTimeout(
        () => controller.abort(),
        PopoverConfig.LINK_VALIDATION_TIMEOUT,
      )

      const response = await fetch(url.toString(), {
        method: "HEAD",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const isValid = response.ok
      linkValidityCache.set(cacheKey, isValid)

      return isValid
    } catch (error) {
      linkValidityCache.set(cacheKey, false, PopoverConfig.FAILED_LINK_CACHE_TTL)
      return false
    }
  }

  private static async executePreload(href: string, _priority: number): Promise<boolean> {
    const contentUrl = getContentUrl(href)
    const cacheKey = CacheKeyGenerator.content(sanitizeCacheKey(contentUrl.toString()))

    // First, check if the link is valid
    if (!(await this.isLinkValid(contentUrl))) {
      FailedLinksManager.addFailedLink(cacheKey)
      return false
    }

    this.currentPreloads++
    preloadingInProgress.add(cacheKey)

    try {
      const response = await fetch(contentUrl.toString(), {
        headers: {
          "X-Requested-With": "XMLHttpRequest", // To identify AJAX requests on server-side if needed
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("text/html")) {
        const html = await response.text()
        const content = await HTMLContentProcessor.processContent(html, contentUrl, cacheKey)

        if (!content.hasChildNodes()) {
          throw new Error("无效的HTML内容：处理后内容为空")
        }

        // 将 DocumentFragment 转换为 HTML 字符串
        const serializer = new XMLSerializer()
        const htmlString = serializer.serializeToString(content)

        preloadedCache.set(cacheKey, htmlString, PopoverConfig.CACHE_TTL)
      } else if (contentType.includes("image/")) {
        preloadedCache.set(cacheKey, contentUrl.toString(), PopoverConfig.CACHE_TTL)
      } else if (contentType.includes("application/pdf")) {
        preloadedCache.set(cacheKey, contentUrl.toString(), PopoverConfig.CACHE_TTL)
      } else {
        throw new Error(`Unsupported content type: ${contentType}`)
      }
      // 如果之前被标记为失败，现在成功了，就从失败列表中移除
      FailedLinksManager.removeFailedLink(cacheKey)
      return true
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, "Preloading link content", cacheKey)

      // 区分错误类型，避免将临时网络错误永久标记为失败
      const errorMessage = (error as Error).message.toLowerCase()
      const isTemporaryError =
        errorMessage.includes("timeout") ||
        errorMessage.includes("network") ||
        errorMessage.includes("fetch")

      // 只有非临时错误才标记为失败链接
      if (!isTemporaryError) {
        FailedLinksManager.addFailedLink(cacheKey)
      }

      return false
    } finally {
      this.currentPreloads--
      preloadingInProgress.delete(cacheKey)

      // 处理队列中的下一个任务
      this.processQueue()
    }
  }

  /**
   * 处理预加载队列
   */
  private static processQueue(): void {
    if (this.preloadQueue.length > 0 && this.currentPreloads < this.MAX_CONCURRENT_PRELOADS) {
      const next = this.preloadQueue.shift()!
      this.executePreload(next.href, next.priority).then(() => next.resolve())
    }
  }

  /**
   * 清理预加载状态 - 实现ICleanupManager接口
   */
  cleanup(): void {
    PreloadManager.cleanup()
  }

  /**
   * 静态清理方法
   */
  static cleanup(): void {
    preloadingInProgress.clear()
    this.preloadQueue.length = 0
    this.currentPreloads = 0
  }

  /**
   * 获取预加载统计信息
   */
  static getStats(): {
    currentPreloads: number
    queueLength: number
    preloadingCount: number
    failedLinksCount: number
  } {
    return {
      currentPreloads: this.currentPreloads,
      queueLength: this.preloadQueue.length,
      preloadingCount: preloadingInProgress.size,
      failedLinksCount: FailedLinksManager.getStats().totalFailedLinks,
    }
  }
}

// 导出全局状态供外部访问
export { preloadingInProgress }
