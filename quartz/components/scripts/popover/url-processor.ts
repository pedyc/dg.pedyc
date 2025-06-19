import { preloadedCache } from './cache'
import { removeDuplicatePathSegments } from '../../../util/path'
import { CacheKeyGenerator } from '../config/cache-config'

/**
 * URL处理器
 * 统一处理URL相关操作，包括创建、获取、缓存和优化
 * 使用统一的缓存管理器
 */
export class URLProcessor {
  private static urlCache = preloadedCache
  private static readonly CACHE_TTL = 30 * 60 * 1000 // 30分钟TTL

  /**
   * 创建URL对象，带缓存优化
   * @param href URL字符串
   * @returns URL对象
   */
  static createUrl(href: string): URL {
    const cached = this.urlCache.get(href)
    if (cached) {
      return cached
    }

    const url = new URL(href)
    this.urlCache.set(href, url, this.CACHE_TTL)
    return url
  }

  /**
   * 获取标准化的URL对象
   * @param href URL字符串
   * @returns 标准化的URL对象
   */
  static getUrl(href: string): URL {
    return this.createUrl(href)
  }

  /**
   * 获取用于内容缓存的URL（移除hash并去重路径）
   * @param href URL字符串
   * @returns 用于缓存的URL对象
   */
  static getContentUrl(href: string): URL {
    const cacheKey = CacheKeyGenerator.content(href)
    const cached = this.urlCache.get(cacheKey)
    if (cached) {
      return cached
    }

    const url = this.createUrl(href)
    const processedUrl = this.processUrlPath(url)

    // 缓存处理后的URL
    this.urlCache.set(cacheKey, processedUrl, this.CACHE_TTL)
    return processedUrl
  }

  /**
   * 处理URL路径，去除重复段
   * @param url 原始URL对象
   * @returns 处理后的URL对象
   */
  private static processUrlPath(url: URL): URL {
    // 使用统一的路径去重函数
    const cleanedPath = removeDuplicatePathSegments(url.pathname)

    // 创建新的URL对象
    const processedUrl = new URL(url.toString())
    processedUrl.pathname = cleanedPath
    processedUrl.hash = '' // 移除hash用于缓存

    return processedUrl
  }

  // 重复模式检查逻辑已移至 utils/util.ts 统一管理

  /**
   * 清空URL缓存
   */
  static clearCache(): void {
    this.urlCache.clear()
  }

  /**
   * 获取缓存统计信息
   */
  static getCacheStats(): any {
    return this.urlCache.getStats()
  }
}