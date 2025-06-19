import { PopoverConfig } from './config'
import { PopoverErrorHandler } from './error-handler'
import { getContentUrl } from '../../../util/path'

// 类型定义

interface PreloadQueueItem {
  href: string
  priority: number
  resolve: () => void
}

// 全局状态
const preloadingInProgress = new Set<string>()
const failedLinks = new Set<string>()

// 预加载缓存（从popover.inline导入）
import { preloadedCache } from './cache'
import { FailedLinksManager } from './failed-links-manager'

/**
 * 预加载管理器
 * 管理链接内容的预加载，包括并发控制和队列管理
 */
export class PreloadManager {
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
    const cacheKey = contentUrl.toString()

    // 检查是否已经在缓存中或正在预加载
    if (preloadedCache.has(cacheKey) || preloadingInProgress.has(cacheKey)) {
      return
    }

    // 检查是否为失败链接
    if (failedLinks.has(cacheKey)) {
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
  private static async executePreload(href: string, _priority: number): Promise<boolean> {
    const contentUrl = getContentUrl(href)
    const cacheKey = contentUrl.toString()

    this.currentPreloads++
    preloadingInProgress.add(cacheKey)

    try {
      const response = await fetch(contentUrl.toString(), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest', // To identify AJAX requests on server-side if needed
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('text/html')) {
        const html = await response.text()
        preloadedCache.set(cacheKey, html, PopoverConfig.CACHE_TTL)
      } else if (contentType.includes('image/')) {
        preloadedCache.set(cacheKey, contentUrl.toString(), PopoverConfig.CACHE_TTL)
      } else if (contentType.includes('application/pdf')) {
        preloadedCache.set(cacheKey, contentUrl.toString(), PopoverConfig.CACHE_TTL)
      } else {
        throw new Error(`Unsupported content type: ${contentType}`)
      }
      // 如果之前被标记为失败，现在成功了，就从失败列表中移除
      if (failedLinks.has(cacheKey)) {
        failedLinks.delete(cacheKey)
      }
      // 同时通知 FailedLinksManager 移除该链接
      FailedLinksManager.removeFailedLink(cacheKey)
      return true
    } catch (error) {
      PopoverErrorHandler.handleError(error as Error, 'Preloading link content', cacheKey)
      failedLinks.add(cacheKey)
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
   * 清理预加载状态
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
      failedLinksCount: failedLinks.size
    }
  }
}

// 导出全局状态供外部访问
export { preloadingInProgress, failedLinks }