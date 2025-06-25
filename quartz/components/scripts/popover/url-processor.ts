import { preloadedCache } from "./cache"
import { removeDuplicatePathSegments } from "../../../util/path"
import { CacheKeyGenerator, sanitizeCacheKey } from "../config/cache-config"
import { PopoverConfig } from "./config"

/**
 * URL处理器
 * 统一处理URL相关操作，包括创建、获取、缓存和优化
 * 使用统一的缓存管理器
 */
export class URLProcessor {
  /**
   * 检查是否为内部链接
   * @param href 链接地址
   * @returns 是否为内部链接
   */
  static isInternalLink(href: string): boolean {
    try {
      const url = this.createUrl(href)
      return url.origin === window.location.origin
    } catch {
      return false
    }
  }

  /**
   * 检查是否为有效的内部链接
   * @param href 链接地址
   * @returns 是否为有效的内部链接
   */
  static isValidInternalLink(href: string): boolean {
    if (!this.isInternalLink(href)) {
      return false
    }

    try {
      const url = this.createUrl(href)
      // 排除特殊协议和锚点链接
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return false
      }

      // 排除纯锚点链接（同页面内跳转）
      if (url.pathname === window.location.pathname && url.hash) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * 检查链接是否应该被预加载
   * @param href 链接地址
   * @returns 是否应该预加载
   */
  static shouldPreload(href: string): boolean {
    if (!this.isValidInternalLink(href)) {
      return false
    }

    try {
      const url = this.createUrl(href)

      // 排除下载链接
      const downloadExtensions = [".pdf", ".zip", ".rar", ".7z", ".tar", ".gz"]
      if (downloadExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))) {
        return false
      }

      // 排除API端点
      if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin/")) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  private static urlCache = preloadedCache

  /**
   * 创建URL对象，带缓存优化
   * @param href URL字符串
   * @returns URL对象
   */
  static createUrl(href: string): URL {
    const cacheKey = CacheKeyGenerator.content(sanitizeCacheKey(href))
    const cached = this.urlCache.get(cacheKey)
    if (cached) {
      return cached
    }

    const url = new URL(href)
    this.urlCache.set(cacheKey, url, PopoverConfig.CACHE_TTL)
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
    this.urlCache.set(cacheKey, processedUrl, PopoverConfig.CACHE_TTL)
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
    processedUrl.hash = "" // 移除hash用于缓存

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
