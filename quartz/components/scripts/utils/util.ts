import { OptimizedCacheManager } from "../managers/OptimizedCacheManager"

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
  },
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
export function monitorCacheSize<V>(
  cache: OptimizedCacheManager<V>,
  warningThreshold: number,
  maxSize: number,
): void {
  const currentSize = cache.getStats().size
  if (currentSize >= warningThreshold) {
    console.warn(
      `Cache size (${currentSize}) approaching limit (${maxSize}). Consider clearing old entries.`,
    )
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
  processHtmlContentFn?: (
    contents: string,
    normalizeUrl: URL,
    cacheKey: string,
  ) => Promise<DocumentFragment>,
): Promise<{ data: string | DocumentFragment; type: string } | null> {
  if (!contentTypeHeader || typeof contentTypeHeader !== "string") {
    console.warn("Invalid content type header provided")
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
