/**
 * SPA 导航服务模块
 * 提供统一的内容获取、页面更新等核心服务
 */

import { normalizeRelativeURLs, getFullSlug } from "../../../util/path"
import { urlHandler } from "../utils/simplified-url-handler"
import { fetchCanonical } from "../utils/util"
import { globalUnifiedContentCache } from "../managers/index"
import { CacheLayer } from "../cache"
import { getDOMParser, scrollToTarget, isSamePage, micromorph } from "./spa-utils"
import { HTMLContentProcessor } from "../popover/html-processor"
/**
 * 统一的内容获取服务
 * 使用统一缓存管理器，避免重复存储相同内容
 * @param url 目标URL
 * @param preferredLayer 首选缓存层（可选）
 * @returns 内容字符串或null（需要完整页面跳转）
 */
export async function getContentForNavigation(
  url: URL,
  preferredLayer: CacheLayer = CacheLayer.MEMORY,
): Promise<string | null> {
  // 使用简化URL处理器
  const urlResult = urlHandler.processURL(url.toString(), {
    cacheType: "content",
    validate: true,
    removeHash: true,
    normalizePath: true,
  })

  if (!urlResult.isValid) {
    console.warn(`[SPA] Invalid URL: ${url.toString()} - ${urlResult.error}`)
    return null
  }

  const { processed: processedUrl, cacheKey } = urlResult

  // 详细的调试信息

  // 尝试从统一缓存获取内容（检查所有缓存层）
  let contents = globalUnifiedContentCache.instance.get(cacheKey)
  if (contents) {
    // 检查缓存内容是否为预处理的HTML片段（来自弹窗预加载）
    if (HTMLContentProcessor.isPreprocessedContent(contents)) {
      contents = HTMLContentProcessor.reconstructHtmlForSpa(contents, processedUrl)
    }
    return contents
  } else {
    try {
      const res = await fetchCanonical(processedUrl)
      const contentType = res.headers.get("content-type")

      if (!contentType?.startsWith("text/html")) {
        console.warn(`[SPA] 非HTML内容，需要完整页面跳转: ${contentType}`)
        return null // 非HTML内容，需要完整页面跳转
      }

      contents = await res.text()

      // 使用统一缓存管理器存储内容，自动避免重复存储
      try {
        globalUnifiedContentCache.instance.set(cacheKey, contents, preferredLayer)
      } catch (e) {}
    } catch (error) {
      console.error("[SPA] Failed to fetch content for SPA navigation:", error)
      return null // 网络错误，需要完整页面跳转
    }
  }

  return contents
}

/**
 * 统一的页面更新处理
 * 处理DOM更新、标题设置、滚动等操作
 * @param contents HTML内容
 * @param url 目标URL
 * @param isBack 是否为后退操作
 * @param announcer 路由公告器元素
 */
export function updatePageContent(
  contents: string,
  url: URL,
  isBack: boolean,
  announcer: HTMLElement,
): void {
  const parser = getDOMParser()
  const urlResult = urlHandler.processURL(url.toString(), { validate: true })
  const processedUrl = urlResult.isValid ? urlResult.processed : url

  // 检查是否为重构的SPA内容（只包含quartz-body内容）
  const isReconstructedContent = contents.includes("<!-- SPA_RECONSTRUCTED_CONTENT -->")

  if (isReconstructedContent) {
    updateQuartzBodyContent(contents, url, isBack, announcer)
  } else {
    // 标准的完整页面更新流程
    updateFullPageContent(contents, url, isBack, announcer, parser, processedUrl)
  }
}

/**
 * 更新quartz-body内容（用于重构的SPA内容）
 * @param contents 重构的HTML内容
 * @param url 目标URL
 * @param isBack 是否为后退操作
 * @param announcer 路由公告器元素
 */
function updateQuartzBodyContent(
  contents: string,
  url: URL,
  isBack: boolean,
  announcer: HTMLElement,
): void {
  const parser = getDOMParser()

  // 解析重构的内容
  const tempDoc = parser.parseFromString(contents, "text/html")
  const newQuartzBody = tempDoc.querySelector("#quartz-body")
  const currentQuartzBody = document.querySelector("#quartz-body")

  if (!newQuartzBody || !currentQuartzBody) {
    console.warn("[SPA] quartz-body not found, falling back to full page update")
    const fallbackUrlResult = urlHandler.processURL(url.toString(), { validate: true })
    const fallbackProcessedUrl = fallbackUrlResult.isValid ? fallbackUrlResult.processed : url
    updateFullPageContent(contents, url, isBack, announcer, parser, fallbackProcessedUrl)
    return
  }

  // 更新标题
  const title =
    tempDoc.querySelector("title")?.textContent ||
    newQuartzBody.querySelector("h1")?.textContent ||
    url.pathname.split("/").pop() ||
    "Page"
  document.title = title

  // 更新路由公告器
  if (announcer.textContent !== title) {
    announcer.textContent = title
  }
  announcer.dataset.persist = ""

  // 智能更新：只更新center区域，保持侧边栏组件不变
  const newCenterContent = newQuartzBody.querySelector(".center")
  const currentCenterContent = currentQuartzBody.querySelector(".center")

  if (newCenterContent && currentCenterContent) {
    // 将路由公告器添加到新的center内容中
    const newPageHeader = newCenterContent.querySelector(".page-header")
    if (newPageHeader) {
      newPageHeader.appendChild(announcer)
    } else {
      newCenterContent.prepend(announcer)
    }

    // 只更新center区域内容
    micromorph(currentCenterContent, newCenterContent)
  } else {
    // 如果没有找到center结构，回退到完整更新
    newQuartzBody.appendChild(announcer)
    micromorph(currentQuartzBody, newQuartzBody)
  }

  // 处理滚动
  if (!scrollToTarget(url)) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 更新历史记录
  if (!isBack && !isSamePage(url)) {
    history.pushState({}, "", url)
  }

  // 清理公告器状态
  delete announcer.dataset.persist

  // 触发nav事件，让explorer和graph等组件更新
  const navEvent = new CustomEvent("nav", {
    detail: { url: getFullSlug(window) },
  })
  document.dispatchEvent(navEvent)

  console.debug("[SPA Debug] Content updated successfully, nav event dispatched")
}

/**
 * 完整页面更新处理（标准流程）
 * @param contents HTML内容
 * @param url 目标URL
 * @param isBack 是否为后退操作
 * @param announcer 路由公告器元素
 * @param parser DOM解析器
 * @param processedUrl 处理后的URL
 */
function updateFullPageContent(
  contents: string,
  url: URL,
  isBack: boolean,
  announcer: HTMLElement,
  parser: DOMParser,
  processedUrl: URL,
): void {
  // 解析HTML
  const html = parser.parseFromString(contents, "text/html")
  normalizeRelativeURLs(html, processedUrl)

  // 更新标题
  let title = html.querySelector("title")?.textContent
  if (title) {
    document.title = title
  } else {
    const h1 = document.querySelector("h1")
    title = h1?.innerText ?? h1?.textContent ?? url.pathname
  }

  // 更新路由公告器
  if (announcer.textContent !== title) {
    announcer.textContent = title
  }
  announcer.dataset.persist = ""
  html.body.appendChild(announcer)

  // 更新页面内容
  micromorph(document.body, html.body)

  // 处理滚动
  if (!scrollToTarget(url)) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 更新head元素
  const elementsToRemove = document.head.querySelectorAll(":not([spa-preserve])")
  elementsToRemove.forEach((el) => el.remove())
  const elementsToAdd = html.head.querySelectorAll(":not([spa-preserve])")
  elementsToAdd.forEach((el) => document.head.appendChild(el))

  // 更新历史记录 - 修复：浏览器前进后退时不应该再次pushState
  if (!isBack && !isSamePage(url)) {
    history.pushState({}, "", url)
  }

  // 清理公告器状态
  delete announcer.dataset.persist
}

/**
 * 统一的同页面导航处理
 * 处理hash跳转和滚动逻辑
 * @param url 目标URL
 * @returns 是否为同页面导航
 */
export function handleSamePageNavigation(url: URL): boolean {
  if (isSamePage(url)) {
    if (url.hash) {
      // 同页面hash跳转：只更新URL和滚动，不触发完整导航
      history.pushState({}, "", url)
      scrollToTarget(url)
    }
    return true
  }
  return false
}

/**
 * 清理导航相关的UI状态
 * 统一处理加载条清理、弹窗清理等
 */
export function cleanupNavigationState(): void {
  // 清理加载条
  const loadingBar = document.querySelector(".navigation-progress")
  if (loadingBar && loadingBar.parentNode) {
    loadingBar.remove()
  }
}
