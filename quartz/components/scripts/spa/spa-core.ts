// micromorph已在spa-services.ts中使用
import { getFullSlug, RelativeURL } from "../../../util/path"
import { globalResourceManager, globalStorageManager, globalCacheManager } from "../managers/index"
import { clearAllPopovers } from "../popover/index"
import { getOpts, notifyNav, startLoading } from "./spa-utils"
import {
  getContentForNavigation,
  updatePageContent,
  handleSamePageNavigation,
  cleanupNavigationState,
} from "./spa-services"

// 使用全局管理器实例，避免重复创建
export const storageManager = globalStorageManager
export const spaContentCache = globalCacheManager

export let announcer = document.createElement("route-announcer")

/**
 * 内部导航实现函数
 * 重构后的简化版本，使用统一的服务函数
 */
function createNavigateFunction(announcer: HTMLElement) {
  return async function _navigate(url: URL, isBack: boolean = false): Promise<void> {
    // 开始加载
    startLoading()

    try {
      notifyNav(getFullSlug(window), "prenav")
      // 获取内容
      const contents = await getContentForNavigation(url)
      if (!contents) {
        // 需要完整页面跳转
        window.location.assign(url)
        return
      }

      // 触发prenav事件

      // 清理导航状态
      cleanupNavigationState()

      // 清理弹窗和旧资源
      clearAllPopovers()
      // 注意：不调用 globalResourceManager.cleanup() 以避免清理缓存
      // 使用选择性清理，保留SPA路由相关的关键事件监听器

      globalResourceManager.instance.cleanupNonCriticalResources()

      // 重新渲染图谱和浏览器
      // const newUrl = getFullSlug(window)
      // window.dispatchEvent(new CustomEvent('reinit-graph', { detail: { url: newUrl } }))
      // window.dispatchEvent(new CustomEvent('reinit-explorer', { detail: { url: newUrl } }))

      // 更新页面内容
      updatePageContent(contents, url, isBack, announcer)
    } catch (error) {
      console.error("Navigation failed:", error)
      window.location.assign(url)
      return
    }

    // 触发导航完成事件
    notifyNav(getFullSlug(window))
  }
}

/**
 * 公开的导航函数
 * 封装了错误处理和导航状态管理
 */
export function createNavigate(announcer: HTMLElement) {
  const _navigate = createNavigateFunction(announcer)

  return async function navigate(url: RelativeURL, isBack: boolean = false): Promise<void> {
    const fullUrl = new URL(url, window.location.toString())
    return _navigate(fullUrl, isBack)
  }
}

// navigate函数现在通过createNavigate创建

/**
 * 创建路由器
 * 设置事件监听器和导航处理逻辑
 * @param {HTMLElement} announcer 用于路由公告的 HTMLElement
 */
export function createRouter(announcer: HTMLElement) {
  if (typeof window === "undefined") {
    return {
      go: (url: RelativeURL) => {
        const fullUrl = new URL(url, window.location.toString())
        window.location.assign(fullUrl)
      },
      back: () => window.history.back(),
      forward: () => window.history.forward(),
    }
  }

  // 创建导航函数
  const navigate = createNavigate(announcer)

  // 导航状态管理
  let isNavigating = false
  let navigationTimeout: ReturnType<typeof setTimeout> | null = null

  /**
   * 处理点击事件
   * 重构后的简化版本
   */
  const handleClick = async (e: Event): Promise<void> => {
    const mouseEvent = e as MouseEvent
    const target = mouseEvent.target as Element
    const anchor = target.closest("a")
    if (!anchor) return

    const url = new URL(anchor.href)
    const opts = getOpts({ target: anchor })

    // [SPA DEBUG] 确保此日志在任何提前返回之前输出，以确认 handleClick 是否被触发

    if (!opts.navigate) return

    mouseEvent.preventDefault()
    mouseEvent.stopPropagation()

    // 使用统一的同页面导航处理
    if (handleSamePageNavigation(url)) {
      return
    }

    // 执行SPA导航
    if (isNavigating) return
    isNavigating = true
    // 设置一个短的超时，以处理快速连续的导航请求
    navigationTimeout = setTimeout(() => {
      isNavigating = false
    }, 500) // 500ms 内的重复点击将被忽略

    try {
      await navigate(url.pathname as RelativeURL)
    } catch (error) {
      console.error("Navigation failed:", error)
      window.location.assign(url)
    } finally {
      isNavigating = false
      if (navigationTimeout) {
        clearTimeout(navigationTimeout)
        navigationTimeout = null
      }
    }
  }

  /**
   * 处理浏览器前进后退事件
   * 重构后的简化版本
   */
  const handlePopstate = async () => {
    const currentUrl = new URL(window.location.toString())

    // 修复：移除错误的同页面判断
    // 在popstate事件中，URL已经改变，但页面内容还未更新
    // 不应该使用isSamePage判断，因为它会错误地认为是同页面导航

    if (isNavigating) return
    isNavigating = true
    // 设置一个短的超时，以处理快速连续的导航请求
    navigationTimeout = setTimeout(() => {
      isNavigating = false
    }, 500) // 500ms 内的重复点击将被忽略

    try {
      // 标记为历史导航（回退操作）- 修复：传入true表示这是浏览器历史导航
      await navigate(currentUrl.pathname as RelativeURL, true)
    } catch (error) {
      console.error("Popstate navigation failed:", error)
      // 如果SPA导航失败，进行完整页面刷新
      window.location.reload()
    } finally {
      isNavigating = false
      if (navigationTimeout) {
        clearTimeout(navigationTimeout)
        navigationTimeout = null
      }
    }
  }

  // 使用 globalResourceManager 管理事件监听器

  globalResourceManager.instance.addEventListener(window, "click", handleClick)
  globalResourceManager.instance.addEventListener(window, "popstate", handlePopstate)

  // 输出当前事件监听器统计信息
  const stats = globalResourceManager.instance.getStats()

  return new (class Router {
    /**
     * 导航到指定路径
     * @param {RelativeURL} pathname 目标路径
     * @returns {Promise<void>}
     */
    go(pathname: RelativeURL): Promise<void> {
      if (isNavigating) return Promise.resolve()
      isNavigating = true
      const url = new URL(pathname, window.location.toString())
      return navigate(pathname, false)
        .catch((error) => {
          console.error("Router navigation failed:", error)
          window.location.assign(url)
          return Promise.resolve()
        })
        .finally(() => {
          isNavigating = false
        })
    }

    back() {
      return window.history.back()
    }

    forward() {
      return window.history.forward()
    }
  })()
}

export function initializeRouteAnnouncer(): HTMLElement {
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

  // 检查是否已存在 route-announcer 元素，避免重复添加
  let announcer = document.querySelector("route-announcer") as HTMLElement
  if (!announcer) {
    announcer = document.createElement("route-announcer")
    // 确保 document.body 存在后再添加元素
    if (document.body) {
      document.body.appendChild(announcer)
    } else {
      // 如果 body 不存在，等待 DOMContentLoaded 事件
      document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(announcer)
      })
    }
  }
  return announcer
}
