/**
 * 预加载管理器模块
 */
import { ICleanupManager } from "../managers/CleanupManager";
import { globalUnifiedContentCache, urlCacheManager } from "../managers/index";
import { CacheLayer } from "../cache";
import { PopoverConfig } from ".";
import { PopoverErrorHandler } from "./error-handler"
import { urlHandler } from "../utils/simplified-url-handler"
import { FailedLinksManager } from "./failed-links-manager"
import { HTMLContentProcessor } from "./html-processor"

// 直接从全局管理器获取链接有效性缓存实例
const linkValidityCache = urlCacheManager.instance;

// 类型定义
interface PreloadQueueItem {
  href: string
  priority: number // 预加载优先级，数值越大优先级越高
  resolve: () => void
  reject: (reason?: any) => void // 添加 reject 方法用于处理预加载失败
}

// 全局状态
const preloadingInProgress = new Set<string>()

/**
 * 预加载管理器 - 单例模式
 * 管理链接内容的预加载，包括并发控制和队列管理
 * 实现ICleanupManager接口，统一资源管理
 */
export class PreloadManager implements ICleanupManager {
  private static instance: PreloadManager | null = null
  private readonly MAX_CONCURRENT_PRELOADS = PopoverConfig.MAX_CONCURRENT_PRELOADS
  private currentPreloads = 0
  private preloadQueue: PreloadQueueItem[] = []
  private isInitialized = false

  /**
   * 私有构造函数，防止外部直接实例化
   */
  private constructor() { }

  /**
   * 获取单例实例
   * @returns PreloadManager实例
   */
  static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager()
    }
    return PreloadManager.instance
  }

  /**
   * 预加载链接内容
   * @param href 链接地址
   * @param priority 预加载优先级，数值越大优先级越高
   * @returns Promise<void>
   */
  async preloadLinkContent(href: string, priority: number = 0): Promise<void> {
    // 使用简化URL处理器确保缓存键一致性
    const urlResult = urlHandler.processURL(href, {
      cacheType: 'content',
      validate: true,
      removeHash: true,
      normalizePath: true
    })

    if (!urlResult.isValid) {
      console.warn(`[PreloadManager] Invalid URL: ${href} - ${urlResult.error}`)
      return
    }

    const { processed: contentUrl, cacheKey } = urlResult

    // 打印预加载请求的原始信息
    console.debug(`[PreloadManager Debug] Initiating preload for href: ${href}, priority: ${priority}`)
    // 打印 URL 处理结果
    console.debug(`[PreloadManager Debug] Processed URL: ${contentUrl.toString()}, Cache Key: ${cacheKey}`)
    // 检查并打印缓存状态和预加载状态
    console.debug(`[PreloadManager Debug] Is content already in cache? ${globalUnifiedContentCache.instance.has(cacheKey)}`)
    console.debug(`[PreloadManager Debug] Is content currently preloading? ${preloadingInProgress.has(cacheKey)}`)

    // 检查是否已经在缓存中或正在预加载
    if (globalUnifiedContentCache.instance.has(cacheKey) || preloadingInProgress.has(cacheKey)) {
      // 如果内容已在缓存中或正在预加载，则跳过并打印调试信息
      console.debug(`[PreloadManager Debug] Content for ${cacheKey} already cached or preloading, skipping.`)
      return
    }

    // 检查是否为失败链接
    if (FailedLinksManager.isFailedLink(cacheKey)) {
      // 如果链接被标记为失败，则跳过并打印调试信息
      console.debug(`[PreloadManager Debug] Link ${cacheKey} marked as failed, skipping preload.`)
      return
    }

    // 如果当前预加载数量已达上限，加入队列
    if (this.currentPreloads >= this.MAX_CONCURRENT_PRELOADS) {
      // 如果达到最大并发预加载数量，则将任务加入队列并打印调试信息
      console.debug(`[PreloadManager Debug] Max concurrent preloads (${this.MAX_CONCURRENT_PRELOADS}) reached. Queuing ${cacheKey} with priority ${priority}. Current preloads: ${this.currentPreloads}, Queue length: ${this.preloadQueue.length + 1}.`)
      return new Promise<void>((resolve, reject) => {
        this.preloadQueue.push({ href, priority, resolve, reject })
        this.preloadQueue.sort((a, b) => b.priority - a.priority) // 优先级高的排在前面
      })
    }

    // 开始执行预加载任务，并打印调试信息
    console.debug(`[PreloadManager Debug] Starting execution for ${href} (Cache Key: ${cacheKey}) with priority ${priority}.`)
    await this.executePreload(href, priority)
  }

  /**
   * 执行预加载（合并链接验证和内容获取）
   * @param href 链接地址
   * @param priority 优先级
   * @returns Promise<boolean> 是否成功预加载
   */
  private async executePreload(href: string, _priority: number): Promise<boolean> {
    // 使用简化URL处理器
    const urlResult = urlHandler.processURL(href, {
      cacheType: 'content',
      validate: true,
      removeHash: true,
      normalizePath: true
    })

    if (!urlResult.isValid) {
      console.warn(`[PreloadManager] Invalid URL: ${href} - ${urlResult.error}`)
      return false
    }

    const { processed: contentUrl, cacheKey } = urlResult
    const validityCacheKey = urlHandler.getCacheKey(contentUrl.toString(), 'link')

    // 首先检查统一缓存中是否已经存在内容，如果存在则直接返回，避免重复请求
    if (globalUnifiedContentCache.instance.has(cacheKey)) {
      console.debug(`[PreloadManager Debug] Content for ${cacheKey} found in unified cache, skipping HTTP request.`)
      return true
    }

    // 检查缓存中的链接有效性，如果明确标记为失败则跳过
    if (linkValidityCache.has(validityCacheKey) && !linkValidityCache.get(validityCacheKey)) {
      FailedLinksManager.addFailedLink(cacheKey)
      return false
    }

    this.currentPreloads++
    preloadingInProgress.add(cacheKey)

    try {
      // 直接获取内容，通过响应状态判断链接有效性，避免额外的 HEAD 请求
      const response = await fetch(contentUrl.toString(), {
        headers: {
          "X-Requested-With": "XMLHttpRequest", // To identify AJAX requests on server-side if needed
        },
      })

      if (!response.ok) {
        // 如果响应不成功，更新链接有效性缓存为 false，并抛出错误
        linkValidityCache.set(validityCacheKey, false, PopoverConfig.FAILED_LINK_CACHE_TTL)
        console.warn(`[PreloadManager] HTTP error for ${contentUrl.toString()}: ${response.status} ${response.statusText}`)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // 标记链接为有效
      linkValidityCache.set(validityCacheKey, true)

      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("text/html")) {
        const html = await response.text()
        // 打印原始 HTML 内容的调试信息
        console.debug(`[PreloadManager Debug] Raw HTML received for ${cacheKey}: Length = ${html.length}, Preview = ${html.substring(0, 200)}...`)

        const content = await HTMLContentProcessor.processContent(html, contentUrl, cacheKey)
        // 打印处理后的内容调试信息
        console.debug(`[PreloadManager Debug] Processed content for ${cacheKey}: Has child nodes = ${content.hasChildNodes()}, Child element count = ${content.childElementCount}, Text content preview = ${content.textContent?.substring(0, 100)}...`)

        if (!content.hasChildNodes()) {
          console.warn(`[PreloadManager] Processed content for ${cacheKey} is empty.`)
          throw new Error("无效的HTML内容：处理后内容为空")
        }

        // 将 DocumentFragment 转换为 HTML 字符串
        // 使用临时div容器来获取正确的HTML字符串，避免XMLSerializer的兼容性问题
        const tempDiv = document.createElement("div")
        tempDiv.appendChild(content.cloneNode(true))
        const htmlString = tempDiv.innerHTML
        console.debug("[Preload Debug] Serialized HTML:", {
          length: htmlString.length,
          preview: htmlString.substring(0, 200) + "...",
        })

        // 使用统一缓存管理器存储，优先存储在弹窗缓存层
        globalUnifiedContentCache.instance.set(cacheKey, htmlString, CacheLayer.SESSION)
      } else if (contentType.includes("image/")) {
        globalUnifiedContentCache.instance.set(cacheKey, contentUrl.toString(), CacheLayer.SESSION)
      } else if (contentType.includes("application/pdf")) {
        globalUnifiedContentCache.instance.set(cacheKey, contentUrl.toString(), CacheLayer.SESSION)
      } else {
        throw new Error(`Unsupported content type: ${contentType}`)
      }
      // 如果之前被标记为失败，现在成功了，就从失败列表中移除
      FailedLinksManager.removeFailedLink(cacheKey)
      return true
    } catch (error) {
      // 捕获并处理预加载过程中的错误
      PopoverErrorHandler.handleError(error as Error, "Preloading link content", cacheKey)
      console.error(`[PreloadManager] Error preloading ${href} (Cache Key: ${cacheKey}):`, error)

      // 区分错误类型，避免将临时网络错误永久标记为失败
      const errorMessage = (error as Error).message.toLowerCase()
      const isTemporaryError =
        errorMessage.includes("timeout") ||
        errorMessage.includes("network") ||
        errorMessage.includes("fetch")

      // 更新链接有效性缓存
      if (!isTemporaryError) {
        // 非临时错误：标记为失败并添加到失败链接管理器
        linkValidityCache.set(validityCacheKey, false, PopoverConfig.FAILED_LINK_CACHE_TTL)
        FailedLinksManager.addFailedLink(cacheKey)
      } else {
        // 临时错误：短期标记为失败，但不添加到永久失败列表
        linkValidityCache.set(
          validityCacheKey,
          false,
          Math.min(PopoverConfig.FAILED_LINK_CACHE_TTL, 300000),
        ) // 最多5分钟
      }

      return false
    } finally {
      // 预加载任务完成（无论成功或失败），减少当前预加载计数并从进行中集合中移除
      this.currentPreloads--
      preloadingInProgress.delete(cacheKey)
      console.debug(`[PreloadManager Debug] Finished preload attempt for ${cacheKey}. Current preloads: ${this.currentPreloads}, Queue length: ${this.preloadQueue.length}.`)

      // 处理队列中的下一个任务
      this.processQueue()
    }
  }

  /**
   * 处理预加载队列
   */
  private processQueue(): void {
    // 确保队列按优先级排序，优先级高的在前
    this.preloadQueue.sort((a, b) => b.priority - a.priority)

    while (this.preloadQueue.length > 0 && this.currentPreloads < this.MAX_CONCURRENT_PRELOADS) {
      const next = this.preloadQueue.shift()!
      this.executePreload(next.href, next.priority)
        .then(() => next.resolve())
        .catch((reason) => next.reject(reason)) // 处理预加载失败的情况
    }
  }

  /**
   * 清理预加载状态 - 实现ICleanupManager接口
   */
  cleanup(): void {
    preloadingInProgress.clear()
    this.preloadQueue.length = 0
    this.currentPreloads = 0
    this.isInitialized = false
  }

  /**
   * 静态清理方法 - 保持向后兼容
   */
  static cleanup(): void {
    const instance = PreloadManager.getInstance()
    instance.cleanup()
  }

  /**
   * 重置单例实例
   */
  static resetInstance(): void {
    if (PreloadManager.instance) {
      PreloadManager.instance.cleanup()
      PreloadManager.instance = null
    }
  }

  /**
   * 获取预加载统计信息
   */
  getStats(): {
    currentPreloads: number
    queueLength: number
    preloadingCount: number
    failedLinksCount: number
    isInitialized: boolean
  } {
    return {
      currentPreloads: this.currentPreloads,
      queueLength: this.preloadQueue.length,
      preloadingCount: preloadingInProgress.size,
      failedLinksCount: FailedLinksManager.getStats().totalFailedLinks,
      isInitialized: this.isInitialized,
    }
  }

  /**
   * 静态方法获取统计信息 - 保持向后兼容
   */
  static getStats(): {
    currentPreloads: number
    queueLength: number
    preloadingCount: number
    failedLinksCount: number
    isInitialized: boolean
  } {
    const instance = PreloadManager.getInstance()
    return instance.getStats()
  }

  /**
   * 静态方法预加载链接内容 - 保持向后兼容
   * @param href 链接地址
   * @param priority 预加载优先级
   * @returns Promise<void>
   */
  static async preloadLinkContent(href: string, priority: number = 0): Promise<void> {
    const instance = PreloadManager.getInstance()
    return instance.preloadLinkContent(href, priority)
  }
}

// 导出全局状态供外部访问
export { preloadingInProgress }
