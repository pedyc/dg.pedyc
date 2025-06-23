// 在文件顶部添加类型声明
declare global {
  interface Window {
    cleanup: () => void
  }
}

import { getContentUrl } from "../../util/path"

import { computePosition, flip, inline, shift } from "@floating-ui/dom"

import {
  // PopoverError, // Not directly used, re-exported by index.ts
  HTMLContentProcessor,
  PreloadManager,
  FailedLinksManager,
  ViewportPreloadManager,
  LinkEventManager,
  PopoverConfig,
} from "./popover/index"

import { globalResourceManager } from "./managers/index"

// 从 popover/cache.ts 导入 preloadedCache
import { preloadedCache } from "./popover/cache"
// 导入统一存储管理器
import { UnifiedStorageManager } from "./managers/UnifiedStorageManager"

let activeAnchor: HTMLAnchorElement | null = null

// 在初始化时加载失败链接
FailedLinksManager.loadFailedLinks()

// addFailedLink 函数已移至 FailedLinksManager.addFailedLink

// HTML 处理函数已移至 HTMLContentProcessor
// renderPopoverContent, render404Content, processHtmlContent 等函数已模块化

// updateDocumentHead, renderPopoverContent, renderNotFoundContent 函数已移至 HTMLContentProcessor
// 使用相应的 HTMLContentProcessor 方法替代本地实现

// processHtmlContent 函数已移至 HTMLContentProcessor
// 使用 HTMLContentProcessor.processHtmlContent 替代本地实现

// parseContentType 和 preloadLinkContent 函数已移至相应的工具类
// 使用 PreloadManager.preloadLinkContent 替代本地实现

/**
 * 处理鼠标进入链接的事件，显示弹窗
 * @param this 触发事件的 HTMLAnchorElement
 * @param event 鼠标事件对象
 */
async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = (activeAnchor = this)

  if (link.dataset.noPopover === "true") {
    return
  }

  /**
   * 设置弹窗的位置
   * @param popoverElement 弹窗的 HTMLElement
   */
  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  /**
   * 显示弹窗并处理内部导航（如果URL中包含hash）
   * @param popoverElement 弹窗的 HTMLElement
   * @param targetHash 目标URL中的hash值，用于滚动到特定标题
   */
  function showPopover(popoverElement: HTMLElement, targetHash: string) {
    clearActivePopover()
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement)

    if (targetHash !== "") {
      const targetAnchor = `#popover-internal-${targetHash.slice(1)}`
      const heading = popoverElement
        .querySelector(".popover-inner")
        ?.querySelector(targetAnchor) as HTMLElement | null
      if (heading) {
        popoverElement
          .querySelector(".popover-inner")!
          .scroll({ top: heading.offsetTop - 12, behavior: "instant" })
      }
    }
  }

  // 统一使用path.ts中的URL处理函数，避免重复处理逻辑
  const originalUrl = new URL(link.href)
  const originalHash = decodeURIComponent(originalUrl.hash)

  // 使用getContentUrl确保URL处理一致性，但保留原始URL用于hash处理
  const contentUrl = getContentUrl(link.href)
  const contentUrlString = contentUrl.toString()
  // 确保缓存键与SPA导航保持一致，使用相同的URL处理逻辑
  const cacheKey = contentUrlString

  // 调试日志：记录URL处理过程
  console.debug("[Popover] URL processing:", {
    originalHref: link.href,
    originalHash: originalHash,
    contentUrl: contentUrlString,
    cacheKey: cacheKey,
  })

  // 使用处理后的contentUrl生成popoverId，确保唯一性
  const popoverIdSuffix = originalHash ? originalHash.slice(1) : "root"
  const pathId = contentUrl.pathname.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/^-+|-+$/g, "")
  const popoverId = `popover-${pathId}-${popoverIdSuffix}`

  const prevPopoverElement = document.getElementById(popoverId)
  if (prevPopoverElement) {
    showPopover(prevPopoverElement, originalHash)
    return
  }

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverElement.appendChild(popoverInner)

  // 检查是否为失败链接
  if (FailedLinksManager.isFailedLink(cacheKey)) {
    console.debug("[Popover] Rendering failed link content for:", cacheKey)
    HTMLContentProcessor.renderNotFoundContent(popoverInner, cacheKey)
  } else {
    // 首先尝试从预加载缓存中获取内容
    const cachedData = preloadedCache.get(cacheKey)
    // 创建存储管理器实例
    const storageManager = new UnifiedStorageManager()

    console.debug("[Popover] Cache check:", {
      cacheKey: cacheKey,
      memoryCache: !!cachedData,
      sessionStorage: !!storageManager.getSessionItem(cacheKey),
    })
    if (cachedData) {
      console.debug("[Popover] Using memory cache for:", cacheKey)
      // OptimizedCacheManager 直接返回数据，需要包装成 CachedItem 格式
      const cachedItem = {
        data: cachedData,
        timestamp: Date.now(),
        ttl: PopoverConfig.CACHE_TTL,
        size: 0,
        type: "html" as const,
      }
      HTMLContentProcessor.renderPopoverContent(popoverInner, cachedItem)
    } else {
      // 如果内存缓存未命中，尝试从sessionStorage读取
      const sessionContent = storageManager.getSessionItem(cacheKey)
      if (sessionContent) {
        console.debug("[Popover] Using sessionStorage cache for:", cacheKey)
        try {
          // sessionStorage中的内容已经是原始HTML，需要直接解析而不是重复处理
          // 避免重复调用processContent导致重复存储到sessionStorage
          // 使用原始URL（包含hash）进行内容处理，确保相对链接正确解析
          const processedContent = await HTMLContentProcessor.parseStoredContent(
            sessionContent,
            originalUrl,
          )
          const cachedItem = {
            data: processedContent,
            timestamp: Date.now(),
            ttl: PopoverConfig.CACHE_TTL,
            size: sessionContent.length,
            type: "html" as const,
          }
          // 将处理后的内容存入内存缓存以便下次使用
          preloadedCache.set(cacheKey, processedContent, PopoverConfig.CACHE_TTL)
          HTMLContentProcessor.renderPopoverContent(popoverInner, cachedItem)
        } catch (error) {
          console.error("Failed to parse stored content for:", cacheKey, error)
          // 如果解析失败，清除可能损坏的缓存并重新获取
          storageManager.removeSessionItem(cacheKey)
          HTMLContentProcessor.renderNotFoundContent(popoverInner, cacheKey)
        }
      } else {
        // 如果sessionStorage也未命中，则立即 fetch (作为优先加载)
        console.debug("[Popover] No cache found, fetching content for:", cacheKey)
        try {
          // 使用 contentUrlString 进行预加载，以确保与 cacheKey 一致
          await PreloadManager.preloadLinkContent(contentUrlString)
          const newlyCachedData = preloadedCache.get(cacheKey) // 仍然使用 cacheKey 获取缓存
          if (newlyCachedData) {
            // 包装成 CachedItem 格式
            const newlyCachedItem = {
              data: newlyCachedData,
              timestamp: Date.now(),
              ttl: PopoverConfig.CACHE_TTL,
              size: 0,
              type: "html" as const,
            }
            HTMLContentProcessor.renderPopoverContent(popoverInner, newlyCachedItem)
          } else {
            HTMLContentProcessor.renderNotFoundContent(popoverInner, cacheKey)
          }
        } catch (error) {
          // PopoverError is re-exported by popover/index.ts, but not directly used here.
          // If it's needed, it should be imported explicitly.
          // const popoverError = new PopoverError('Failed to load popover content', cacheKey)
          // console.error(popoverError.message, error)
          console.error("Failed to load popover content for:", cacheKey, error) // Simplified error logging
          HTMLContentProcessor.renderNotFoundContent(popoverInner, cacheKey)
        }
      }
    }
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    popoverElement.remove()
    return
  }

  showPopover(popoverElement, originalHash)
}

/**
 * 清除当前活动的弹窗
 */
function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover.active-popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

// 视口预加载功能已移至 ViewportPreloadManager
// 使用 ViewportPreloadManager.initializeViewportPreloading() 替代本地实现

// 使用ResourceManager统一管理事件监听器
globalResourceManager.addEventListener(document as unknown as EventTarget, "nav", () => {
  // 使用 LinkEventManager 设置事件监听器
  LinkEventManager.setupLinkEventListeners(mouseEnterHandler, clearActivePopover)

  // 初始化视口预加载逻辑
  ViewportPreloadManager.initialize()
})

// 在 popover.inline.ts 中添加
globalResourceManager.addEventListener(
  document as unknown as EventTarget,
  "DOMContentLoaded",
  () => {
    LinkEventManager.setupLinkEventListeners(mouseEnterHandler, clearActivePopover)
    ViewportPreloadManager.initialize()
  },
)
