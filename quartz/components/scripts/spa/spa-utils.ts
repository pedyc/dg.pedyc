import micromorph from "micromorph"
import { FullSlug, isInternalLink } from "../../../util/path"
import { globalResourceManager } from "../managers/index"

export { micromorph }

// adapted from `micromorph`
// https://github.com/natemoo-re/micromorph
const NODE_TYPE_ELEMENT = 1

/**
 * 检查给定的目标是否为HTML元素。
 * @param target 要检查的目标对象。
 * @returns 如果目标是HTML元素，则返回true，否则返回false。
 */
export const isElement = (target: EventTarget | null): target is Element =>
  (target as Node)?.nodeType === NODE_TYPE_ELEMENT

/**
 * 检查URL是否为本地URL（同源）。
 * 统一使用path.ts中的isInternalLink函数
 * @param href 要检查的URL字符串。
 * @returns 如果URL是本地URL，则返回true，否则返回false。
 */
export const isLocalUrl = isInternalLink

/**
 * 检查两个URL是否指向同一页面（同源且同路径）。
 * @param url 要比较的URL对象。
 * @returns 如果URL指向同一页面，则返回true，否则返回false。
 */
export const isSamePage = (url: URL): boolean => {
  const sameOrigin = url.origin === window.location.origin
  const samePath = url.pathname === window.location.pathname
  return sameOrigin && samePath
}

/**
 * 从事件中提取导航选项，例如目标URL和滚动行为。
 * @param opts 包含target的选项对象。
 * @returns 包含navigate标志和可选滚动行为的对象。
 */
export const getOpts = ({
  target,
}: {
  target: EventTarget | null
}): { navigate: boolean; scroll?: boolean } => {
  if (!isElement(target)) return { navigate: false }
  if (target.attributes.getNamedItem("target")?.value === "_blank") return { navigate: false }
  const a = target.closest("a")
  if (!a) return { navigate: false }
  if ("routerIgnore" in a.dataset) return { navigate: false }
  const { href } = a
  if (!isLocalUrl(href)) return { navigate: false }
  return { navigate: true, scroll: "routerNoscroll" in a.dataset ? false : undefined }
}

/**
 * 触发导航事件通知。
 * @param url 导航目标URL。
 * @param type 事件类型，默认为"nav"。
 */
export function notifyNav(url: FullSlug, type: string = "nav") {
  const event = new CustomEvent(type, { detail: { url } })
  document.dispatchEvent(event)
}

// 声明全局加载条变量
let loadingBar: HTMLElement | null = null

/**
 * 显示导航加载进度条。
 */
export function startLoading() {
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

let domParser: DOMParser | null = null

/**
 * 获取DOM解析器实例（懒加载）。
 * @returns DOMParser实例。
 */
export function getDOMParser(): DOMParser {
  if (!domParser) {
    domParser = new DOMParser()
  }
  return domParser
}

/**
 * 统一处理滚动到目标元素或页面顶部。
 * @param url 目标URL。
 * @returns 是否成功滚动到hash目标。
 */
export function scrollToTarget(url: URL): boolean {
  if (url.hash) {
    const el = document.getElementById(decodeURIComponent(url.hash.substring(1)))
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      return true
    }
  }
  return false
}
