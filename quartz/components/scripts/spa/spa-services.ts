/**
 * SPA 导航服务模块
 * 提供统一的内容获取、页面更新等核心服务
 */

import { getContentUrl, normalizeRelativeURLs } from "../../../util/path"
import { fetchCanonical } from "../utils/util"
import { UnifiedCacheKeyGenerator } from "../cache/unified-cache"
import { globalUnifiedContentCache, CacheLayer } from "../managers/index"
import { getDOMParser, scrollToTarget, isSamePage, micromorph } from "./spa-utils"

/**
 * 统一的内容获取服务
 * 使用统一缓存管理器，避免重复存储相同内容
 * @param url 目标URL
 * @param preferredLayer 首选缓存层（可选）
 * @returns 内容字符串或null（需要完整页面跳转）
 */
export async function getContentForNavigation(
  url: URL,
  preferredLayer: CacheLayer = CacheLayer.MEMORY
): Promise<string | null> {
  const processedUrl = getContentUrl(url.toString())
  const cacheKey = UnifiedCacheKeyGenerator.generateContentKey(processedUrl.toString())

  // 尝试从统一缓存获取内容
  let contents = globalUnifiedContentCache.get(cacheKey)
  if (contents) {
    console.log(`[SPA Debug] Page content for ${cacheKey} loaded from: Unified Cache`)
    return contents
  }

  // 如果没有缓存，发起网络请求
  console.log(`[SPA Debug] Page content for ${cacheKey} loaded from: HTTP Request`)
  try {
    const res = await fetchCanonical(processedUrl)
    const contentType = res.headers.get("content-type")

    if (!contentType?.startsWith("text/html")) {
      return null // 非HTML内容，需要完整页面跳转
    }

    contents = await res.text()

    // 使用统一缓存管理器存储内容，自动避免重复存储
    try {
      globalUnifiedContentCache.set(cacheKey, contents, preferredLayer)
      console.log(`[SPA Debug] Content cached using unified cache manager`)
    } catch (e) {
      console.warn("Failed to cache content:", e)
    }
  } catch (error) {
    console.error("Failed to fetch content for SPA navigation:", error)
    return null // 网络错误，需要完整页面跳转
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
  const processedUrl = getContentUrl(url.toString())

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
