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
    // startLoading()

    // try {
    //   // 获取内容
    //   const contents = await getContentForNavigation(url)
    //   if (!contents) {
    //     // 需要完整页面跳转
    //     window.location.assign(url)
    //     return
    //   }

    //   // 触发prenav事件
    //   notifyNav(getFullSlug(window), "prenav")

    //   // 清理导航状态
    //   cleanupNavigationState()

    //   // 清理弹窗和旧资源
    //   clearAllPopovers()
    //   // 注意：不调用 globalResourceManager.cleanup() 以避免清理缓存
    //   // 只清理观察器和事件监听器，保留缓存数据
    //   globalResourceManager.cleanupObserversAndListeners()

    //   // 更新页面内容
    //   updatePageContent(contents, url, isBack, announcer)
    // } catch (error) {


    
    //   console.error("Navigation failed:", error)
    //   window.location.assign(url)
    //   return
    // }

    // // 触发导航完成事件
    // notifyNav(getFullSlug(window))
    startLoading()
    window.location.assign(url)

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
 */
export function createRouter() {
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

  // 初始化路由公告器
  const announcer = initializeRouteAnnouncer()

  // 创建导航函数
  const navigate = createNavigate(announcer)

  // 导航状态管理
  let isNavigating = false

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
    try {
      await navigate(url.pathname as RelativeURL)
    } catch (error) {
      console.error("Navigation failed:", error)
      window.location.assign(url)
    } finally {
      isNavigating = false
      cleanupNavigationState()
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
    try {
      // 标记为历史导航（回退操作）- 修复：传入true表示这是浏览器历史导航
      await navigate(currentUrl.pathname as RelativeURL, true)
    } catch (error) {
      console.error("Popstate navigation failed:", error)
      // 如果SPA导航失败，进行完整页面刷新
      window.location.reload()
    } finally {
      isNavigating = false
      cleanupNavigationState()
    }
  }

  // 使用 globalResourceManager 管理事件监听器
  globalResourceManager.addEventListener(window, "click", handleClick)
  globalResourceManager.addEventListener(window, "popstate", handlePopstate)

  return new (class Router {
    go(pathname: RelativeURL) {
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
          cleanupNavigationState()
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

  const announcer = document.createElement("route-announcer")
  document.body.appendChild(announcer)
  return announcer
}
