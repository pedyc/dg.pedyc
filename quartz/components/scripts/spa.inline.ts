import micromorph from "micromorph"
import { FullSlug, RelativeURL, getFullSlug, normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"
import { cacheManager, LRUCache } from "./storage"

// 静态资源缓存 - 使用已有的 LRUCache
const staticResourceCache = new LRUCache<{ content: string; contentType: string }>(20)

// 需要缓存的静态资源扩展名
const STATIC_EXTENSIONS = ['.css', '.woff', '.woff2', '.ttf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']

/**
 * 检查是否为静态资源
 */
function isStaticResource(url: string): boolean {
  return STATIC_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext))
}

/**
 * 覆盖 fetch 拦截静态资源请求
 */
function setupStaticResourceCaching() {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return

  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    // 只缓存同源的静态资源
    if (isStaticResource(url) && url.startsWith(window.location.origin)) {
      // 检查缓存
      const cached = staticResourceCache.get(url)
      if (cached) {
        // 返回缓存的响应
        return new Response(cached.content, {
          status: 200,
          headers: { 'Content-Type': cached.contentType }
        })
      }

      // 发起请求并缓存
      try {
        const response = await originalFetch(input, init)
        if (response.ok) {
          const content = await response.text()
          staticResourceCache.set(url, {
            content,
            contentType: response.headers.get('Content-Type') || getContentType(url)
          })
          return new Response(content, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          })
        }
        return response
      } catch {
        return originalFetch(input, init)
      }
    }

    return originalFetch(input, init)
  }
}

/**
 * 根据文件扩展名获取 Content-Type
 */
function getContentType(url: string): string {
  const ext = url.toLowerCase().split('.').pop() || ''
  const types: Record<string, string> = {
    css: 'text/css',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon'
  }
  return types[ext] || 'application/octet-stream'
}

// 初始化静态资源缓存
setupStaticResourceCaching()

// adapted from `micromorph`
// https://github.com/natemoo-re/micromorph
const NODE_TYPE_ELEMENT = 1
let announcer = document.createElement("route-announcer")
const isElement = (target: EventTarget | null): target is Element =>
  (target as Node)?.nodeType === NODE_TYPE_ELEMENT
const isLocalUrl = (href: string) => {
  try {
    const url = new URL(href)
    if (window.location.origin === url.origin) {
      return true
    }
  } catch (e) {}
  return false
}

const isSamePage = (url: URL): boolean => {
  const sameOrigin = url.origin === window.location.origin
  const samePath = url.pathname === window.location.pathname
  return sameOrigin && samePath
}

const getOpts = ({ target }: Event): { url: URL; scroll?: boolean } | undefined => {
  if (!isElement(target)) return
  if (target.attributes.getNamedItem("target")?.value === "_blank") return
  const a = target.closest("a")
  if (!a) return
  if ("routerIgnore" in a.dataset) return
  const { href } = a
  if (!isLocalUrl(href)) return
  return { url: new URL(href), scroll: "routerNoscroll" in a.dataset ? false : undefined }
}

function notifyNav(url: FullSlug) {
  const event: CustomEventMap["nav"] = new CustomEvent("nav", { detail: { url } })
  document.dispatchEvent(event)
}

const cleanupFns: Set<(...args: any[]) => void> = new Set()
window.addCleanup = (fn) => cleanupFns.add(fn)

function startLoading() {
  const loadingBar = document.createElement("div")
  loadingBar.className = "navigation-progress"
  loadingBar.style.width = "0"
  if (!document.body.contains(loadingBar)) {
    document.body.appendChild(loadingBar)
  }

  setTimeout(() => {
    loadingBar.style.width = "80%"
  }, 100)
}

let isNavigating = false
let p: DOMParser

/**
 * 获取页面内容 - 优先使用缓存
 */
async function getPageContent(url: URL): Promise<string | null> {
  const cacheKey = url.pathname

  // 1. 检查缓存
  const cached = cacheManager.getContent(cacheKey)
  if (cached) {
    console.log("[Navigate] Cache hit:", cacheKey)
    return cached.html
  }

  // 2. 缓存未命中，发起网络请求
  const contents = await fetchCanonical(url)
    .then((res) => {
      const contentType = res.headers.get("content-type")
      if (contentType?.startsWith("text/html")) {
        return res.text()
      } else {
        window.location.assign(url)
        return null
      }
    })
    .catch(() => {
      window.location.assign(url)
      return null
    })

  // 3. 将请求结果存入缓存
  if (contents) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(contents, "text/html")
    cacheManager.setContent(cacheKey, {
      html: contents,
      text: doc.body.textContent?.trim() || "",
      title: doc.querySelector("title")?.textContent || cacheKey,
      links: Array.from(doc.querySelectorAll("a.internal"))
        .map(a => a.getAttribute("href") || "")
        .filter(Boolean),
      tags: []
    })
  }

  return contents
}

async function _navigate(url: URL, isBack: boolean = false) {
  isNavigating = true
  startLoading()
  p = p || new DOMParser()

  // 使用带缓存的内容获取
  const contents = await getPageContent(url)

  if (!contents) return

  // notify about to nav
  const event: CustomEventMap["prenav"] = new CustomEvent("prenav", { detail: {} })
  document.dispatchEvent(event)

  // cleanup old
  cleanupFns.forEach((fn) => fn())
  cleanupFns.clear()

  const html = p.parseFromString(contents, "text/html")
  normalizeRelativeURLs(html, url)

  let title = html.querySelector("title")?.textContent
  if (title) {
    document.title = title
  } else {
    const h1 = document.querySelector("h1")
    title = h1?.innerText ?? h1?.textContent ?? url.pathname
  }
  if (announcer.textContent !== title) {
    announcer.textContent = title
  }
  announcer.dataset.persist = ""
  html.body.appendChild(announcer)

  // morph body
  await micromorph(document.body, html.body)

  // scroll into place and add history
  if (!isBack) {
    if (url.hash) {
      const el = document.getElementById(decodeURIComponent(url.hash.substring(1)))
      el?.scrollIntoView()
    } else {
      window.scrollTo({ top: 0 })
    }
  }

  // now, patch head, re-executing scripts
  const elementsToRemove = document.head.querySelectorAll(":not([data-persist])")
  elementsToRemove.forEach((el) => el.remove())
  const elementsToAdd = html.head.querySelectorAll(":not([data-persist])")
  elementsToAdd.forEach((el) => document.head.appendChild(el))

  // delay setting the url until now
  // at this point everything is loaded so changing the url should resolve to the correct addresses
  if (!isBack) {
    history.pushState({}, "", url)
  }

  notifyNav(getFullSlug(window))
  delete announcer.dataset.persist
}

async function navigate(url: URL, isBack: boolean = false) {
  if (isNavigating) return
  isNavigating = true
  try {
    await _navigate(url, isBack)
  } catch (e) {
    console.error(e)
    window.location.assign(url)
  } finally {
    isNavigating = false
  }
}

window.spaNavigate = navigate

function createRouter() {
  if (typeof window !== "undefined") {
    window.addEventListener("click", async (event) => {
      const { url } = getOpts(event) ?? {}
      // dont hijack behaviour, just let browser act normally
      if (!url || event.ctrlKey || event.metaKey) return
      event.preventDefault()

      if (isSamePage(url) && url.hash) {
        const el = document.getElementById(decodeURIComponent(url.hash.substring(1)))
        el?.scrollIntoView()
        history.pushState({}, "", url)
        return
      }

      navigate(url, false)
    })

    window.addEventListener("popstate", (event) => {
      const { url } = getOpts(event) ?? {}
      if (window.location.hash && window.location.pathname === url?.pathname) return
      navigate(new URL(window.location.toString()), true)
      return
    })
  }

  return new (class Router {
    go(pathname: RelativeURL) {
      const url = new URL(pathname, window.location.toString())
      return navigate(url, false)
    }

    back() {
      return window.history.back()
    }

    forward() {
      return window.history.forward()
    }
  })()
}

createRouter()
notifyNav(getFullSlug(window))

if (!customElements.get("route-announcer")) {
  const attrs = {
    "aria-live": "assertive",
    "aria-atomic": "true",
    style:
      "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px",
  }

  customElements.define(
    "route-announcer",
    class RouteAnnouncer extends HTMLElement {
      constructor() {
        super()
      }
      connectedCallback() {
        for (const [key, value] of Object.entries(attrs)) {
          this.setAttribute(key, value)
        }
      }
    },
  )
}
