import micromorph from "micromorph"
import { FullSlug, RelativeURL, getFullSlug, normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./utils/util"
import { getContentUrl, clearUrlCache } from "../../util/path"
import { CacheKeyGenerator, sanitizeCacheKey, getCacheConfig } from "./config/cache-config"
// 导入管理器模块，实现统一的资源管理
import { globalResourceManager, GlobalCleanupManager, OptimizedCacheManager, UnifiedStorageManager } from "./managers/index"

// 清理URL处理器缓存以确保修复后的逻辑生效
clearUrlCache()

/**
 * 全局清理函数实现
 * 将清理任务注册到 globalResourceManager 中
 * @param fn 清理函数
 */
window.addCleanup = (fn: (...args: any[]) => void) => {
  globalResourceManager.addCleanupTask(fn)
}

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
  } catch (e) { }
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

/**
 * 触发导航事件通知
 * @param url 导航目标URL
 */
function notifyNav(url: FullSlug) {
  const event: CustomEventMap["nav"] = new CustomEvent("nav", { detail: { url } })
  document.dispatchEvent(event)
}

// 使用统一存储管理器
const storageManager = new UnifiedStorageManager()

// 使用优化缓存管理器进行内容缓存
const spaContentCache = new OptimizedCacheManager<string>(getCacheConfig("URL_CACHE"))

// 声明全局加载条变量
let loadingBar: HTMLElement | null = null



/**
 * 显示导航加载进度条
 */
function startLoading() {
  // 清理之前的加载条
  const existingBar = document.querySelector(".navigation-progress")
  if (existingBar) {
    existingBar.remove()
  }

  loadingBar = document.createElement("div")
  loadingBar.className = "loading-bar"
  loadingBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: var(--accent);
    z-index: 9999;
    transition: width 0.3s ease;
  `
  document.body.appendChild(loadingBar)

  // 使用 globalResourceManager 管理定时器
  globalResourceManager.setTimeout(() => {
    if (loadingBar) {
      loadingBar.style.width = "80%"
    }
  }, 100)

  // 清理函数将在finally块中处理
}

let isNavigating = false
let domParser: DOMParser | null = null

/**
 * 获取DOM解析器实例（懒加载）
 * @returns DOMParser实例
 */
function getDOMParser(): DOMParser {
  if (!domParser) {
    domParser = new DOMParser()
  }
  return domParser
}

/**
 * 内部导航实现函数
 * @param url 目标URL
 * @param isBack 是否为后退操作（影响缓存策略和历史记录）
 */
async function _navigate(url: URL, isBack: boolean = false) {
  startLoading()
  const parser = getDOMParser()

  // 使用统一的URL处理函数确保与popover系统缓存键一致
  const processedUrl = getContentUrl(url.toString())
  const cacheKey = CacheKeyGenerator.content(sanitizeCacheKey(processedUrl.toString()))
  let contents: string | undefined | null = null

  // 首先尝试从内存缓存获取
  if (spaContentCache.has(cacheKey)) {
    contents = spaContentCache.get(cacheKey)
  } else {
    // 然后尝试从 sessionStorage 获取缓存
    const cachedContent = storageManager.getSessionItem(cacheKey)
    if (cachedContent) {
      contents = cachedContent
      // 将 sessionStorage 中的内容加载到内存缓存
      spaContentCache.set(cacheKey, cachedContent)
    }
  }

  // 如果没有缓存，则发起网络请求
  if (!contents) {
    contents = await fetchCanonical(processedUrl)
      .then((res) => {
        const contentType = res.headers.get("content-type")
        if (contentType?.startsWith("text/html")) {
          return res.text()
        } else {
          window.location.assign(url)
          return null // 明确返回 null，避免后续处理
        }
      })
      .catch(() => {
        window.location.assign(url)
        return null // 明确返回 null
      })

    // 如果成功获取内容并且不是回退操作，则存入缓存
    if (contents && !isBack) {
      try {
        // 存入内存缓存
        spaContentCache.set(cacheKey, contents)
        // 存入 sessionStorage
        storageManager.setSessionItem(cacheKey, contents)
      } catch (e) {
        console.warn("Failed to cache content:", e)
        // 如果存储失败，清理管理器会自动处理
      }
    }
  }

  if (!contents) return

  // notify about to nav
  const event: CustomEventMap["prenav"] = new CustomEvent("prenav", { detail: {} })
  document.dispatchEvent(event)

  // 清理加载条
  if (loadingBar && loadingBar.parentNode) {
    loadingBar.remove()
  }

  // 使用全局清理管理器清理旧资源
  GlobalCleanupManager.cleanupAll()

  const html = parser.parseFromString(contents, "text/html")
  normalizeRelativeURLs(html, processedUrl)

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
  micromorph(document.body, html.body)

  // scroll into place and add history
  if (!isBack) {
    if (!scrollToTarget(url)) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // now, patch head, re-executing scripts
  const elementsToRemove = document.head.querySelectorAll(":not([spa-preserve])")
  elementsToRemove.forEach((el) => el.remove())
  const elementsToAdd = html.head.querySelectorAll(":not([spa-preserve])")
  elementsToAdd.forEach((el) => document.head.appendChild(el))

  // delay setting the url until now
  // at this point everything is loaded so changing the url should resolve to the correct addresses
  // 只有在非回退操作且不是同页面导航时才添加历史记录，避免重复的历史记录条目
  if (!isBack && !isSamePage(url)) {
    history.pushState({}, "", url)
  }

  notifyNav(getFullSlug(window))
  delete announcer.dataset.persist
}

/**
 * 执行SPA导航
 * @param url 目标URL
 * @param isBack 是否为后退操作
 */
async function navigate(url: URL, isBack: boolean = false) {
  if (isNavigating) return

  isNavigating = true
  try {
    await _navigate(url, isBack)
  } catch (error) {
    console.error("SPA Navigation failed:", {
      url: url.toString(),
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      isBack,
    })
    window.location.assign(url)
  } finally {
    isNavigating = false
    // 确保清理加载进度条
    const loadingBar = document.querySelector(".navigation-progress")
    if (loadingBar) {
      loadingBar.remove()
    }
  }
}

window.spaNavigate = navigate

/**
 * 统一处理滚动到目标元素或页面顶部
 * @param url 目标URL
 * @returns 是否成功滚动到hash目标
 */
function scrollToTarget(url: URL): boolean {
  if (url.hash) {
    const el = document.getElementById(decodeURIComponent(url.hash.substring(1)))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      return true
    }
  }
  return false
}

/**
 * 创建并初始化SPA路由器
 * @returns Router实例
 */
function createRouter() {
  if (typeof window !== "undefined") {
    
    /**
     * 处理点击事件的导航逻辑
     * @param event 点击事件
     */
    const handleClick = async (event: Event) => {
      const { url } = getOpts(event) ?? {}
      // dont hijack behaviour, just let browser act normally
      if (!url || (event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey) return
      event.preventDefault()

      if (isSamePage(url) && url.hash) {
        // 同页面hash跳转：只更新URL和滚动，不触发完整导航
        history.pushState({}, "", url)
        scrollToTarget(url)
        return
      }

      // 正常导航：不需要手动管理历史记录
      navigate(url, false)
    }

    /**
     * 处理浏览器前进后退事件
     * 简化逻辑：popstate事件本身就表示历史记录变化
     */
    const handlePopstate = () => {
      const currentUrl = new URL(window.location.toString())
      // 统一标记为历史导航，让浏览器处理前进后退逻辑
      navigate(currentUrl, true)
    }

    // 使用 globalResourceManager 管理事件监听器
    globalResourceManager.addEventListener(window, "click", handleClick)
    globalResourceManager.addEventListener(window, "popstate", handlePopstate)
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
