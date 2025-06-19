import { OptimizedCacheManager } from '../managers/OptimizedCacheManager'
import { PopoverError } from '../popover/error-handler'
import { getCacheConfig, CacheKeyGenerator } from '../config/cache-config'

export function registerEscapeHandler(outsideContainer: HTMLElement | null, cb: () => void) {
  if (!outsideContainer) return
  function click(this: HTMLElement, e: HTMLElementEventMap["click"]) {
    if (e.target !== this) return
    e.preventDefault()
    e.stopPropagation()
    cb()
  }

  function esc(e: HTMLElementEventMap["keydown"]) {
    if (!e.key.startsWith("Esc")) return
    e.preventDefault()
    cb()
  }

  outsideContainer?.addEventListener("click", click)
  window.addCleanup(() => outsideContainer?.removeEventListener("click", click))
  document.addEventListener("keydown", esc)
  window.addCleanup(() => document.removeEventListener("keydown", esc))
}

export function removeAllChildren(node: HTMLElement) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

// AliasRedirect emits HTML redirects which also have the link[rel="canonical"]
// containing the URL it's redirecting to.
// Extracting it here with regex is _probably_ faster than parsing the entire HTML
// with a DOMParser effectively twice (here and later in the SPA code), even if
// way less robust - we only care about our own generated redirects after all.
const canonicalRegex = /<link rel="canonical" href="([^"]*)">/

export async function fetchCanonical(url: URL): Promise<Response> {
  const res = await fetch(`${url}`)
  if (!res.headers.get("content-type")?.startsWith("text/html")) {
    return res
  }

  // reading the body can only be done once, so we need to clone the response
  // to allow the caller to read it if it's was not a redirect
  const text = await res.clone().text()
  const [_, redirect] = text.match(canonicalRegex) ?? []
  return redirect ? fetch(`${new URL(redirect, url)}`) : res
}



// 使用统一的缓存配置
const linkValidityCacheConfig = getCacheConfig('LINK_VALIDITY_CACHE')
const linkValidityCache = new OptimizedCacheManager<boolean>({
  maxSize: linkValidityCacheConfig.capacity,
  maxMemoryMB: 10,
  defaultTTL: linkValidityCacheConfig.ttl,
  cleanupIntervalMs: 600000
})


const invalidLinks = new Set<string>()

/**
 * 检查链接是否有效，使用HEAD请求减少带宽消耗
 * @param url 要检查的URL
 * @returns Promise<boolean> 链接是否有效
 */
export async function isLinkValid(url: URL): Promise<boolean> {
  const cacheKey = CacheKeyGenerator.link(url.toString(), 'validity')

  // 检查缓存
  if (linkValidityCache.has(cacheKey)) {
    return linkValidityCache.get(cacheKey) || false
  }

  // 检查已知无效链接
  if (invalidLinks.has(cacheKey)) {
    return false
  }

  try {
    // 使用HEAD请求检查链接有效性，减少带宽消耗
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(url.toString(), {
      method: 'HEAD',
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const isValid = response.ok
    linkValidityCache.set(cacheKey, isValid, 60 * 60 * 1000) // 1小时TTL

    if (!isValid) {
      invalidLinks.add(cacheKey)
    }

    return isValid
  } catch (error) {
    // 网络错误或超时，标记为无效
    linkValidityCache.set(cacheKey, false, 30 * 60 * 1000) // 30分钟TTL for failed links
    invalidLinks.add(cacheKey)
    return false
  }
}

/**
 * 增强的fetchCanonical函数，添加链接有效性检查
 */
export async function fetchCanonicalWithValidation(url: URL): Promise<Response | null> {
  // 先检查链接有效性
  const isValid = await isLinkValid(url)
  if (!isValid) {
    console.warn(`Skipping invalid link: ${url.toString()}`);
    return null
  }

  return fetchCanonical(url)
}

// 添加性能统计
export const preloadStats = {
  totalChecks: 0,
  validLinks: 0,
  invalidLinks: 0,
  cacheHits: 0,

  getSuccessRate(): number {
    return this.totalChecks > 0 ? this.validLinks / this.totalChecks : 0
  },

  getCacheHitRate(): number {
    return this.totalChecks > 0 ? this.cacheHits / this.totalChecks : 0
  }
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}



/**
 * 监控缓存大小并在接近限制时发出警告
 * @param cache - 优化缓存管理器实例
 * @param warningThreshold - 警告阈值
 * @param maxSize - 最大缓存大小
 */
export function monitorCacheSize<V>(cache: OptimizedCacheManager<V>, warningThreshold: number, maxSize: number): void {
  const currentSize = cache.getStats().size
  if (currentSize >= warningThreshold) {
    console.warn(`Cache size (${currentSize}) approaching limit (${maxSize}). Consider clearing old entries.`)
  }
}

/**
 * 创建优化的URL对象，避免重复创建
 * @param url - 原始URL
 * @returns 标准化的URL对象
 */
export function createOptimizedUrl(url: string | URL): URL {
  try {
    return typeof url === 'string' ? new URL(url) : url
  } catch (error) {
    throw new PopoverError('Invalid URL provided', url.toString())
  }
}

/**
 * 解析内容类型并返回处理后的数据
 * @param contentTypeHeader - HTTP Content-Type 头部值
 * @param url - 内容的URL
 * @param contents - 内容字符串（可选）
 * @param cacheKey - 缓存键（可选）
 * @param processHtmlContentFn - 处理HTML内容的函数
 * @returns 解析后的内容数据和类型，如果无法解析则返回null
 */
export async function parseContentType(
  contentTypeHeader: string,
  url: URL,
  contents?: string,
  cacheKey?: string,
  processHtmlContentFn?: (contents: string, normalizeUrl: URL, cacheKey: string) => Promise<DocumentFragment>
): Promise<{ data: string | DocumentFragment; type: string } | null> {
  if (!contentTypeHeader || typeof contentTypeHeader !== 'string') {
    console.warn('Invalid content type header provided')
    return null
  }

  const [contentType] = contentTypeHeader.split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")

  if (!contentTypeCategory) {
    return null
  }

  switch (contentTypeCategory) {
    case "image":
      return { data: url.toString(), type: "image" }
    case "application":
      if (typeInfo === "pdf") {
        return { data: url.toString(), type: "pdf" }
      }
      return null
    default: // html
      if (!contents || !cacheKey || !processHtmlContentFn) {
        return null
      }
      const normalizeUrl = new URL(url.pathname, url.origin)
      const fragment = await processHtmlContentFn(contents, normalizeUrl, cacheKey)
      return { data: fragment, type: "html" }
  }
}