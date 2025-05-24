import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null

// 全局缓存预加载的内容，键为规范化的 URL 字符串，值为包含数据和类型的对象
const preloadedCache = new Map<string, { data: string | DocumentFragment; type: string }>()
// 记录正在预加载的 URL，防止重复发起请求
const preloadingInProgress = new Set<string>()

/**
 * 预加载指定 URL 的内容并存入缓存
 * @param url 要预加载的 URL 对象
 * @param isPriority 是否为优先加载（例如，用户已悬停但缓存未命中）
 */
async function preloadLinkContent(url: URL, isPriority: boolean = false) {
  const cacheKey = url.toString() // 使用完整的 URL (无 hash 和 query) 作为缓存键
  if (preloadedCache.has(cacheKey) || (!isPriority && preloadingInProgress.has(cacheKey))) {
    // 如果已缓存，或者非优先加载且正在预加载，则跳过
    return
  }

  preloadingInProgress.add(cacheKey)
  try {
    const response = await fetchCanonical(new URL(url.pathname, url.origin))
    if (!response) {
      preloadingInProgress.delete(cacheKey)
      return
    }

    const contentTypeHeader = response.headers.get("Content-Type")
    if (!contentTypeHeader) {
      preloadingInProgress.delete(cacheKey)
      return
    }

    const [contentType] = contentTypeHeader.split(";")
    const [contentTypeCategory, typeInfo] = contentType.split("/")

    let dataToCache: string | DocumentFragment
    let cacheType: string = contentTypeCategory

    switch (contentTypeCategory) {
      case "image":
        dataToCache = url.toString()
        break
      case "application":
        if (typeInfo === "pdf") {
          dataToCache = url.toString()
          cacheType = "pdf"
        } else {
          preloadingInProgress.delete(cacheKey)
          return
        }
        break
      default: // html
        const contents = await response.text()
        const html = p.parseFromString(contents, "text/html")
        normalizeRelativeURLs(html, new URL(url.pathname, url.origin))
        html.querySelectorAll("[id]").forEach((el) => {
          el.id = `popover-internal-${el.id}`
        })
        const popoverHintElements = [...html.getElementsByClassName("popover-hint")]
        const fragment = document.createDocumentFragment()
        if (popoverHintElements.length > 0) {
          popoverHintElements.forEach(el => fragment.appendChild(el.cloneNode(true)))
        } else if (html.body) {
          Array.from(html.body.children).forEach(child => fragment.appendChild(child.cloneNode(true)))
        }
        dataToCache = fragment
        cacheType = "html"
        break
    }
    preloadedCache.set(cacheKey, { data: dataToCache, type: cacheType })
  } catch (err) {
    console.error(`Error preloading ${cacheKey}:`, err)
  } finally {
    preloadingInProgress.delete(cacheKey)
  }
}

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
      const heading = popoverElement.querySelector(".popover-inner")?.querySelector(targetAnchor) as HTMLElement | null
      if (heading) {
        popoverElement.querySelector(".popover-inner")!.scroll({ top: heading.offsetTop - 12, behavior: "instant" })
      }
    }
  }

  const targetUrl = new URL(link.href)
  const originalHash = decodeURIComponent(targetUrl.hash)
  const contentUrl = new URL(targetUrl.pathname, targetUrl.origin)
  const cacheKey = contentUrl.toString()
  const popoverIdSuffix = originalHash ? originalHash.slice(1) : "root"
  const popoverId = `popover-${link.pathname.replace(/[^a-zA-Z0-9-_]/g, '-')}-${popoverIdSuffix}`

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

  // 尝试从预加载缓存中获取内容
  if (preloadedCache.has(cacheKey)) {
    const cachedItem = preloadedCache.get(cacheKey)!
    popoverInner.dataset.contentType = cachedItem.type
    switch (cachedItem.type) {
      case "image":
        const img = document.createElement("img")
        img.src = cachedItem.data as string
        img.alt = new URL(cachedItem.data as string).pathname
        popoverInner.appendChild(img)
        break
      case "pdf":
        const pdf = document.createElement("iframe")
        pdf.src = cachedItem.data as string
        popoverInner.appendChild(pdf)
        break
      case "html":
        popoverInner.appendChild((cachedItem.data as DocumentFragment).cloneNode(true))
        break;
    }
  } else {
    // 如果缓存未命中，则立即 fetch (作为优先加载)
    // 同时，preloadLinkContent 内部会处理缓存的填充
    await preloadLinkContent(contentUrl, true)
    // 再次尝试从缓存获取，因为 preloadLinkContent 应该是同步填充缓存的（如果成功）
    if (preloadedCache.has(cacheKey)) {
      const cachedItem = preloadedCache.get(cacheKey)!
      popoverInner.dataset.contentType = cachedItem.type
      switch (cachedItem.type) {
        case "image":
          const img = document.createElement("img")
          img.src = cachedItem.data as string
          img.alt = new URL(cachedItem.data as string).pathname
          popoverInner.appendChild(img)
          break
        case "pdf":
          const pdf = document.createElement("iframe")
          pdf.src = cachedItem.data as string
          popoverInner.appendChild(pdf)
          break
        case "html":
          popoverInner.appendChild((cachedItem.data as DocumentFragment).cloneNode(true))
          break;
      }
    } else {
      // 如果 fetch 后仍然没有缓存（例如请求失败），可以显示错误或不显示弹窗
      console.warn(`Content for ${cacheKey} could not be loaded for popover.`)
      return; // 或者创建一个提示信息
    }
  }

  if (document.getElementById(popoverId)) {
    return;
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

/**
 * 初始化 IntersectionObserver 来预加载视口内的链接内容
 */
function initializeViewportPreloading() {
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]

  if (!("IntersectionObserver" in window)) {
    // IntersectionObserver 不支持，可以考虑退化策略或不进行预加载
    console.warn("IntersectionObserver not supported, viewport preloading disabled.")
    return
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target as HTMLAnchorElement
        const targetUrl = new URL(link.href)
        const contentUrl = new URL(targetUrl.pathname, targetUrl.origin)
        preloadLinkContent(contentUrl) // 开始预加载
        obs.unobserve(link) // 预加载后停止观察该链接，避免重复触发
      }
    })
  }, {
    rootMargin: "200px 0px", // 预加载视口下方 200px 内的链接
    threshold: 0.01 // 元素有 1% 进入视口即触发
  })

  links.forEach(link => {
    observer.observe(link)
  })

  // 清理 observer
  window.addCleanup(() => {
    observer.disconnect()
  })
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

  // 初始化视口预加载逻辑
  initializeViewportPreloading()
})
