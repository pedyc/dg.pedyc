import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { getContentUrl } from "../../../util/path"
import { HTMLContentProcessor, PreloadManager, FailedLinksManager, PopoverConfig } from "./index"
import { UnifiedCacheKeyGenerator } from "../cache/unified-cache"
import { globalUnifiedContentCache } from "../managers/index"

let activeAnchor: HTMLAnchorElement | null = null

/**
 * 清除当前活动的弹窗
 */
export function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover.active-popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

/**
 * 清除所有弹窗元素（用于 SPA 导航时的完全清理）
 */
export function clearAllPopovers() {
  // 移除所有弹窗元素
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => {
    popoverElement.remove()
  })

  // 清理所有链接的绑定标记，确保重新绑定事件
  const allLinks = document.querySelectorAll("a[data-popover-bound]")
  allLinks.forEach((link) => {
    link.removeAttribute("data-popover-bound")
  })
  activeAnchor = null
}

/**
 * 处理鼠标进入链接的事件，显示弹窗
 * @param this 触发事件的 HTMLAnchorElement
 * @param event 鼠标事件对象
 */
export async function mouseEnterHandler(
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
    console.debug("[Popover Debug] showPopover called with:", {
      popoverId: popoverElement.id,
      hasContent: popoverElement.querySelector(".popover-inner")?.children.length || 0,
      targetHash,
    })
    clearActivePopover()
    popoverElement.classList.add("active-popover")
    console.debug(
      "[Popover Debug] Added active-popover class, element classes:",
      popoverElement.className,
    )
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
  // 使用统一的缓存键生成器，确保与SPA系统一致
  const cacheKey = UnifiedCacheKeyGenerator.generateContentKey(contentUrlString)

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
    // 确保弹窗元素在DOM中，如果之前被移除但未销毁
    if (!document.body.contains(prevPopoverElement)) {
      document.body.appendChild(prevPopoverElement)
    }
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
    // 尝试从统一缓存管理器获取内容
    const cachedData = globalUnifiedContentCache.get(cacheKey)

    if (cachedData) {
      console.log(`[Popover Debug] Popover content for ${cacheKey} loaded from: Unified Cache`)
      console.debug("[Popover Debug] Cached data details:", {
        cacheKey,
        dataType: typeof cachedData,
        dataLength: typeof cachedData === "string" ? cachedData.length : "N/A",
        dataPreview:
          typeof cachedData === "string" ? cachedData.substring(0, 100) + "..." : cachedData,
      })

      // 包装成 CachedItem 格式
      const cachedItem = {
        data: cachedData,
        timestamp: Date.now(),
        ttl: PopoverConfig.CACHE_TTL,
        size: cachedData.length,
        type: "html" as const,
      }
      HTMLContentProcessor.renderPopoverContent(popoverInner, cachedItem)
    } else {
      // 如果缓存未命中，则立即 fetch 并使用统一缓存管理器存储
      console.log(`[Popover Debug] Popover content for ${cacheKey} loaded from: HTTP Request`)
      try {
        // 使用 contentUrlString 进行预加载
        await PreloadManager.preloadLinkContent(contentUrlString)

        // 再次尝试从统一缓存获取（PreloadManager应该已经存储了内容）
        const newlyCachedData = globalUnifiedContentCache.get(cacheKey)
        console.debug("[Popover Debug] After preload, cached data:", {
          found: !!newlyCachedData,
          dataType: typeof newlyCachedData,
          dataLength: typeof newlyCachedData === "string" ? newlyCachedData.length : "N/A",
        })

        if (newlyCachedData) {
          // 包装成 CachedItem 格式
          const newlyCachedItem = {
            data: newlyCachedData,
            timestamp: Date.now(),
            ttl: PopoverConfig.CACHE_TTL,
            size: newlyCachedData.length,
            type: "html" as const,
          }
          console.debug(
            "[Popover Debug] About to render newly cached content with item:",
            newlyCachedItem,
          )
          HTMLContentProcessor.renderPopoverContent(popoverInner, newlyCachedItem)
        } else {
          console.warn("[Popover Debug] No content found after preload, rendering not found")
          HTMLContentProcessor.renderNotFoundContent(popoverInner, cacheKey)
        }
      } catch (error) {
        console.error("Failed to load popover content for:", cacheKey, error)
        HTMLContentProcessor.renderNotFoundContent(popoverInner, cacheKey)
      }
    }
  }

  document.body.appendChild(popoverElement)
  showPopover(popoverElement, originalHash)
}
