import { createUrl } from '../../../util/path'

/**
 * 链接验证器
 * 提供链接有效性检查和预加载条件判断
 */
export class LinkValidator {
  /**
   * 检查是否为内部链接
   * @param href 链接地址
   * @returns 是否为内部链接
   */
  static isInternalLink(href: string): boolean {
    try {
      const url = createUrl(href)
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
      const url = createUrl(href)
      // 排除特殊协议和锚点链接
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
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
      const url = createUrl(href)
      
      // 排除下载链接
      const downloadExtensions = ['.pdf', '.zip', '.rar', '.7z', '.tar', '.gz']
      if (downloadExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
        return false
      }
      
      // 排除API端点
      if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin/')) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }
}