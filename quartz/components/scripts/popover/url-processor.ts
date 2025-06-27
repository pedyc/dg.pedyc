import {
  isInternalLink,
  isValidInternalLink,
  shouldPreload,
  createUrl,
  getContentUrl,
  clearUrlCache,
  getUrlCacheStats,
} from "../../../util/path"

/**
 * URL处理器
 * 提供URL相关操作的统一接口，所有实现都委托给path.ts中的函数
 * @deprecated 建议直接使用 path.ts 中的函数
 */
export class URLProcessor {
  /**
   * 检查是否为内部链接
   * @param href 链接地址
   * @returns 是否为内部链接
   */
  static isInternalLink(href: string): boolean {
    return isInternalLink(href)
  }

  /**
   * 检查是否为有效的内部链接
   * @param href 链接地址
   * @returns 是否为有效的内部链接
   */
  static isValidInternalLink(href: string): boolean {
    return isValidInternalLink(href)
  }

  /**
   * 检查链接是否应该被预加载
   * @param href 链接地址
   * @returns 是否应该预加载
   */
  static shouldPreload(href: string): boolean {
    return shouldPreload(href)
  }

  /**
   * 创建URL对象，带缓存优化
   * @param href URL字符串
   * @returns URL对象
   */
  static createUrl(href: string): URL {
    return createUrl(href)
  }

  /**
   * 获取标准化的URL对象
   * @param href URL字符串
   * @returns 标准化的URL对象
   */
  static getUrl(href: string): URL {
    return createUrl(href)
  }

  /**
   * 获取用于内容缓存的URL（移除hash并去重路径）
   * @param href URL字符串
   * @returns 用于缓存的URL对象
   */
  static getContentUrl(href: string): URL {
    return getContentUrl(href)
  }

  /**
   * 清空URL缓存
   */
  static clearCache(): void {
    clearUrlCache()
  }

  /**
   * 获取缓存统计信息
   */
  static getCacheStats(): any {
    return getUrlCacheStats()
  }
}
