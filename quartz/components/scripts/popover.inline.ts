import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"
import { cacheManager, dispatchCacheEvent, type ContentCacheItem } from "./storage"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null

/**
 * 解析缓存的内容并创建 popover
 */
function createPopoverFromCache(
  link: HTMLAnchorElement,
  targetUrl: URL,
  content: ContentCacheItem,
  clientX: number,
  clientY: number,
  hash: string,
  contentType: string,
): HTMLElement | null {
  // 使用参数避免未使用警告
  void clientX
  void clientY
  void hash
  const popoverId = `popover-${link.pathname}`

  // 检查是否已存在 popover
  if (document.getElementById(popoverId)) {
    return document.getElementById(popoverId)
  }

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.dataset.contentType = contentType
  popoverElement.appendChild(popoverInner)

  // 使用缓存的 HTML
  const html = p.parseFromString(content.html, "text/html")
  normalizeRelativeURLs(html, targetUrl)

  // prepend all IDs inside popovers to prevent duplicates
  html.querySelectorAll("[id]").forEach((el) => {
    const targetID = `popover-internal-${el.id}`
    el.id = targetID
  })

  const elts = [...html.getElementsByClassName("popover-hint")]
  if (elts.length === 0) return null

  elts.forEach((elt) => popoverInner.appendChild(elt))

  return popoverElement
}

async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = (activeAnchor = this)
  if (link.dataset.noPopover === "true") {
    return
  }

  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  function showPopover(popoverElement: HTMLElement) {
    clearActivePopover()
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement as HTMLElement)

    if (hash !== "") {
      const targetAnchor = `#popover-internal-${hash.slice(1)}`
      const heading = popoverInner.querySelector(targetAnchor) as HTMLElement | null
      if (heading) {
        // leave ~12px of buffer when scrolling to a heading
        popoverInner.scroll({ top: heading.offsetTop - 12, behavior: "instant" })
      }
    }
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""

  // 获取不带 hash 和 query 的路径作为缓存 key
  const cacheKey = targetUrl.pathname
  const popoverId = `popover-${link.pathname}`

  // 检查是否已有 popover 元素
  if (document.getElementById(popoverId)) {
    showPopover(document.getElementById(popoverId)!)
    return
  }

  // ===== 缓存检查 =====
  const cachedContent = cacheManager.getContent(cacheKey)

  if (cachedContent) {
    // ===== 缓存命中 =====
    console.log("[Popover] Cache hit:", cacheKey)

    // 触发缓存事件，通知其他组件
    dispatchCacheEvent({
      type: "hit",
      key: cacheKey,
      value: cachedContent,
      source: cachedContent ? "memory" : "network",
    })

    const popoverElement = createPopoverFromCache(
      link,
      targetUrl,
      cachedContent,
      clientX,
      clientY,
      hash,
      "text/html",
    )

    if (!popoverElement) return

    document.body.appendChild(popoverElement)
    if (activeAnchor !== this) {
      return
    }
    showPopover(popoverElement)
    return
  }

  // ===== 缓存未命中，发起网络请求 =====
  const response = await fetchCanonical(targetUrl).catch((err) => {
    console.error(err)
    return null
  })

  if (!response) return

  const [contentTypeHeader] = response.headers.get("Content-Type")!.split(";")
  const [contentTypeCategory, typeInfo] = contentTypeHeader.split("/")

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.dataset.contentType = contentTypeHeader ?? undefined
  popoverElement.appendChild(popoverInner)

  switch (contentTypeCategory) {
    case "image":
      const img = document.createElement("img")
      img.src = targetUrl.toString()
      img.alt = targetUrl.pathname
      popoverInner.appendChild(img)
      break
    case "application":
      if (typeInfo === "pdf") {
        const pdf = document.createElement("iframe")
        pdf.src = targetUrl.toString()
        popoverInner.appendChild(pdf)
      }
      break
    default:
      const contents = await response.text()

      // ===== 存入缓存 =====
      const contentCacheItem: ContentCacheItem = {
        html: contents,
        text: p.parseFromString(contents, "text/html").body.textContent?.trim() || "",
        title:
          p.parseFromString(contents, "text/html").querySelector("title")?.textContent || cacheKey,
        links: Array.from(p.parseFromString(contents, "text/html").querySelectorAll("a.internal"))
          .map((a) => a.getAttribute("href") || "")
          .filter(Boolean),
        tags: [],
      }
      cacheManager.setContent(cacheKey, contentCacheItem)

      // 触发缓存事件
      dispatchCacheEvent({
        type: "hit",
        key: cacheKey,
        value: contentCacheItem,
        source: "network",
      })

      const html = p.parseFromString(contents, "text/html")
      normalizeRelativeURLs(html, targetUrl)
      html.querySelectorAll("[id]").forEach((el) => {
        const targetID = `popover-internal-${el.id}`
        el.id = targetID
      })
      const elts = [...html.getElementsByClassName("popover-hint")]
      if (elts.length === 0) return

      elts.forEach((elt) => popoverInner.appendChild(elt))
  }

  if (document.getElementById(popoverId)) {
    return
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    return
  }
  // TODO active-popover
  showPopover(popoverElement)
}

function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

document.addEventListener("nav", () => {
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  for (const link of links) {
    link.addEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseleave", clearActivePopover)
    window.addCleanup(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler)
      link.removeEventListener("mouseleave", clearActivePopover)
    })
  }
})
