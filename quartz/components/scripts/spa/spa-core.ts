import micromorph from "micromorph"
import { normalizeRelativeURLs, getContentUrl, getFullSlug, RelativeURL } from "../../../util/path"
import { fetchCanonical } from "../utils/util"
import { CacheKeyGenerator, sanitizeCacheKey, getCacheConfig } from "../config/cache-config"
import {
  globalResourceManager,
  GlobalCleanupManager,
  OptimizedCacheManager,
  UnifiedStorageManager,
} from "../managers/index"
import {
  isSamePage,
  getOpts,
  notifyNav,
  startLoading,
  getDOMParser,
  scrollToTarget,
} from "./spa-utils"

// 使用统一存储管理器
export const storageManager = new UnifiedStorageManager()

// 使用优化缓存管理器进行内容缓存
export const spaContentCache = new OptimizedCacheManager<string>(getCacheConfig("URL_CACHE"))

export let announcer = document.createElement("route-announcer")
export let isNavigating = false

/**
 * 内部导航实现函数
 * @param url 目标URL
 * @param isBack 是否为后退操作（影响缓存策略和历史记录）
 */
export async function _navigate(url: URL, isBack: boolean = false) {
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
  const loadingBar = document.querySelector(".navigation-progress")
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
      window.scrollTo({ top: 0, behavior: "smooth" })
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
export async function navigate(url: URL, isBack: boolean = false) {
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

/**
 * 创建并初始化SPA路由器
 * @returns Router实例
 */
export function createRouter() {
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

export function initializeRouteAnnouncer() {
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
}
