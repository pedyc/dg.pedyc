/**
 * 简化的URL处理器 - 统一URL处理逻辑
 * 目标：减少代码冗余，提高可维护性，统一URL处理流程
 */

// 核心URL处理接口
export interface URLProcessingOptions {
  /** 是否移除hash */
  removeHash?: boolean
  /** 是否标准化路径 */
  normalizePath?: boolean
  /** 是否验证URL */
  validate?: boolean
  /** 缓存类型 */
  cacheType?: "content" | "link" | "search"
}

// URL处理结果
export interface URLProcessingResult {
  /** 原始URL */
  original: string
  /** 处理后的URL */
  processed: URL
  /** 缓存键 */
  cacheKey: string
  /** 是否有效 */
  isValid: boolean
  /** 错误信息 */
  error?: string
}

/**
 * 统一URL处理器类
 * 整合所有URL相关操作，减少重复逻辑
 */
export class SimplifiedURLHandler {
  private static instance: SimplifiedURLHandler | null = null

  // 缓存键前缀映射
  private readonly CACHE_PREFIXES = {
    content: "content_",
    link: "link_",
    search: "search_",
  } as const

  private constructor() {}

  static getInstance(): SimplifiedURLHandler {
    if (!SimplifiedURLHandler.instance) {
      SimplifiedURLHandler.instance = new SimplifiedURLHandler()
    }
    return SimplifiedURLHandler.instance
  }

  /**
   * 统一URL处理入口
   * @param href 原始URL字符串
   * @param options 处理选项
   * @returns 处理结果
   */
  processURL(href: string, options: URLProcessingOptions = {}): URLProcessingResult {
    const {
      removeHash = true,
      normalizePath = true,
      validate = true,
      cacheType = "content",
    } = options

    try {
      // 1. 基础验证
      if (validate && !this.isValidURL(href)) {
        return {
          original: href,
          processed: new URL("about:blank"),
          cacheKey: "",
          isValid: false,
          error: "Invalid URL format",
        }
      }

      // 2. 预处理URL字符串
      let processedHref = href
      if (removeHash) {
        processedHref = processedHref.split("#")[0]
      }

      // 3. 创建URL对象
      const url = new URL(processedHref)

      // 4. 路径标准化
      if (normalizePath) {
        url.pathname = this.normalizePath(url.pathname)
      }

      // 5. 生成缓存键
      const cacheKey = this.generateCacheKey(url.toString(), cacheType)
      console.debug(`[URLHandler Debug] Cache Key: ${cacheKey}`)

      return {
        original: href,
        processed: url,
        cacheKey,
        isValid: true,
      }
    } catch (error) {
      return {
        original: href,
        processed: new URL("about:blank"),
        cacheKey: "",
        isValid: false,
        error: (error as Error).message,
      }
    }
  }

  /**
   * 快速获取内容URL（最常用场景）
   * @param href 原始URL
   * @returns 处理后的URL对象
   */
  getContentURL(href: string): URL {
    const result = this.processURL(href, {
      removeHash: true,
      normalizePath: true,
      validate: true,
      cacheType: "content",
    })

    if (!result.isValid) {
      throw new Error(`Invalid URL: ${href} - ${result.error}`)
    }

    return result.processed
  }

  /**
   * 快速获取缓存键
   * @param href 原始URL
   * @param type 缓存类型
   * @returns 缓存键
   */
  getCacheKey(href: string, type: "content" | "link" | "search" = "content"): string {
    const result = this.processURL(href, { cacheType: type })
    return result.cacheKey
  }

  /**
   * 批量处理URL
   * @param hrefs URL数组
   * @param options 处理选项
   * @returns 处理结果数组
   */
  processBatch(hrefs: string[], options: URLProcessingOptions = {}): URLProcessingResult[] {
    return hrefs.map((href) => this.processURL(href, options))
  }

  /**
   * 验证URL是否有效
   * @param href URL字符串
   * @returns 是否有效
   */
  private isValidURL(href: string): boolean {
    if (!href || typeof href !== "string" || href.length === 0) {
      return false
    }

    try {
      new URL(href)
      return true
    } catch {
      return false
    }
  }

  /**
   * 标准化路径 - 移除重复段
   * @param pathname 路径字符串
   * @returns 标准化后的路径
   */
  private normalizePath(pathname: string): string {
    // 1. 预处理：移除末尾的 .md
    if (pathname.endsWith(".md")) {
      pathname = pathname.slice(0, -3)
    }

    // 2. 预处理：移除末尾的 /index
    if (pathname.endsWith("/index")) {
      pathname = pathname.slice(0, -6)
    }

    // 3. 预处理：移除末尾的 /
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.slice(0, -1)
    }

    // 如果路径在处理后为空，说明是根目录的索引页
    if (pathname === "") {
      return "/"
    }

    // 4. 分割与去重（移除所有重复段，不仅仅是连续重复）
    const segments = pathname.split("/").filter(Boolean)
    const uniqueSegments: string[] = []
    const seen = new Set<string>()
    
    for (const segment of segments) {
      if (!seen.has(segment)) {
        seen.add(segment)
        uniqueSegments.push(segment)
      }
    }

    // 5. 重组路径
    const normalizedPath = "/" + uniqueSegments.join("/")

    return normalizedPath
  }

  /**
   * 生成缓存键
   * @param url 处理后的URL字符串
   * @param type 缓存类型
   * @returns 缓存键
   */

  private generateCacheKey(url: string, type: "content" | "link" | "search"): string {
    const encodedUrl = encodeURIComponent(url);
    const prefix = this.CACHE_PREFIXES[type];
    return `${prefix}${encodedUrl}`;
  }



  /**
   * 检查是否为内部链接
   * @param href URL字符串
   * @returns 是否为内部链接
   */
  isInternalLink(href: string): boolean {
    try {
      const url = new URL(href)
      return url.origin === window.location.origin
    } catch {
      return false
    }
  }

  /**
   * 检查是否应该预加载
   * @param href URL字符串
   * @returns 是否应该预加载
   */
  shouldPreload(href: string): boolean {
    if (!this.isInternalLink(href)) {
      return false
    }

    try {
      const url = new URL(href)

      // 排除下载文件
      const downloadExtensions = [".pdf", ".zip", ".rar", ".7z", ".tar", ".gz"]
      if (downloadExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))) {
        return false
      }

      // 排除API端点
      if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin/")) {
        return false
      }

      // 排除同页面hash跳转
      if (url.pathname === window.location.pathname && url.hash) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * 检查是否为同一页面
   * @param url URL对象
   * @returns 是否为同一页面
   */
  isSamePage(url: URL): boolean {
    return url.origin === window.location.origin && url.pathname === window.location.pathname
  }
}

// 导出单例实例
export const urlHandler = SimplifiedURLHandler.getInstance()

// 向后兼容的函数导出
export function getContentUrl(href: string): URL {
  return urlHandler.getContentURL(href)
}

export function createUrl(href: string): URL {
  const result = urlHandler.processURL(href, { validate: true })
  if (!result.isValid) {
    throw new Error(`Invalid URL: ${href} - ${result.error}`)
  }
  return result.processed
}

export function isInternalLink(href: string): boolean {
  return urlHandler.isInternalLink(href)
}

export function shouldPreload(href: string): boolean {
  return urlHandler.shouldPreload(href)
}

export function isSamePage(url: URL): boolean {
  return urlHandler.isSamePage(url)
}

// 缓存键生成函数
export function generateContentKey(url: string): string {
  return urlHandler.getCacheKey(url, "content")
}

export function generateLinkKey(url: string): string {
  return urlHandler.getCacheKey(url, "link")
}

export function generateSearchKey(query: string): string {
  return urlHandler.getCacheKey(query, "search")
}
