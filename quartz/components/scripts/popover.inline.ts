// 在文件顶部添加类型声明
declare global {
  interface Window {
    cleanup: () => void
  }
}

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

        // 将原始 HTML 文本存入 sessionStorage，用于页面跳转时复用
        try {
          sessionStorage.setItem(cacheKey, contents)
        } catch (e) {
          console.warn(`Failed to save content to sessionStorage for ${cacheKey}:`, e)
          // 如果 sessionStorage 满了或者其他原因导致存储失败，可以考虑清理旧的缓存项
          // 例如：sessionStorage.clear(); 或者实现一个更智能的 LRU 清理策略
        }

        normalizeRelativeURLs(html, new URL(url.pathname, url.origin))
        html.querySelectorAll("[id]").forEach((el) => {
          el.id = `popover-internal-${el.id}`
        })
        const popoverHintElements = [...html.getElementsByClassName("popover-hint")]
        const fragment = document.createDocumentFragment()
        if (popoverHintElements.length > 0) {
          popoverHintElements.forEach((el) => fragment.appendChild(el.cloneNode(true)))
        } else if (html.body) {
          Array.from(html.body.children).forEach((child) =>
            fragment.appendChild(child.cloneNode(true)),
          )
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

  const targetUrl = new URL(link.href)
  const originalHash = decodeURIComponent(targetUrl.hash)
  const contentUrl = new URL(targetUrl.pathname, targetUrl.origin)
  const cacheKey = contentUrl.toString()
  const popoverIdSuffix = originalHash ? originalHash.slice(1) : "root"
  const popoverId = `popover-${link.pathname.replace(/[^a-zA-Z0-9-_]/g, "-")}-${popoverIdSuffix}`

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
        break
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
          break
      }
    } else {
      // 如果 fetch 后仍然没有缓存（例如请求失败），可以显示错误或不显示弹窗
      console.warn(`Content for ${cacheKey} could not be loaded for popover.`)
      return // 或者创建一个提示信息
    }
  }

  if (document.getElementById(popoverId)) {
    return
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

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement
          const targetUrl = new URL(link.href)
          const contentUrl = new URL(targetUrl.pathname, targetUrl.origin)
          preloadLinkContent(contentUrl) // 开始预加载
          obs.unobserve(link) // 预加载后停止观察该链接，避免重复触发
        }
      })
    },
    {
      rootMargin: "200px 0px", // 预加载视口下方 200px 内的链接
      threshold: 0.01, // 元素有 1% 进入视口即触发
    },
  )

  links.forEach((link) => {
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

    /**
     * 处理内部链接点击事件，尝试从 sessionStorage 加载内容。
     * @param event 点击事件对象
     */
    const wikilinkClickHandler = async (event: MouseEvent) => {
      event.preventDefault() // 阻止默认跳转

      const anchorElement = event.currentTarget as HTMLAnchorElement
      const originalTargetUrl = new URL(anchorElement.href) // 保留原始解析的URL，主要为了获取hash

      // contentUrl 用于 sessionStorage key，通常是 clean URL (无 hash, 有时无 search)
      const contentUrl = new URL(originalTargetUrl.pathname, originalTargetUrl.origin)
      if (originalTargetUrl.search) contentUrl.search = originalTargetUrl.search // 保留查询参数
      const cacheKey = contentUrl.toString()

      // 构建用于浏览器导航的最终URL
      const urlForBrowser = new URL(cacheKey)
      if (originalTargetUrl.hash) {
        urlForBrowser.hash = originalTargetUrl.hash
      }
      const cachedContent = sessionStorage.getItem(cacheKey)
      if (cachedContent) {
        console.log(`Loading from sessionStorage: ${cacheKey}`)
        const newDoc = p.parseFromString(cachedContent, "text/html")

        normalizeRelativeURLs(newDoc, urlForBrowser)

        document.body.innerHTML = newDoc.body.innerHTML

        // 更新 head (这是一个复杂的操作，简化处理可能不完美)
        // 简单的替换 title:
        const newTitle = newDoc.querySelector("head > title")
        const oldTitle = document.head.querySelector("title")
        if (newTitle && oldTitle) {
          oldTitle.textContent = newTitle.textContent
        } else if (newTitle) {
          document.head.appendChild(newTitle.cloneNode(true))
        }
        // 注意：更复杂的 head 更新需要更细致的逻辑来处理 stylesheets, scripts, meta tags 等。
        // 直接替换 document.head 是有问题的。可以考虑遍历 newDoc.head 的子元素并更新或添加到当前的 document.head。
        // 例如，更新或添加 meta description, canonical link 等。
        // 简单的 innerHTML 替换，但要小心脚本：
        // document.head.innerHTML = newDoc.head.innerHTML; // 可能导致脚本不执行或样式闪烁

        // 优化 head 更新逻辑：更精细地处理 title, meta, link 标签
        // 更新或添加 title
        const newTitleElement = newDoc.head.querySelector("title")
        const currentTitleElement = document.head.querySelector("title")
        if (newTitleElement) {
          if (currentTitleElement) {
            currentTitleElement.textContent = newTitleElement.textContent
          } else {
            document.head.appendChild(newTitleElement.cloneNode(true))
          }
        } else if (currentTitleElement) {
          // currentTitleElement.remove(); // 可选：如果新页面无标题，移除旧标题
        }

        // 更新或添加重要的 meta 标签 (例如 description, keywords, og:*)，忽略 charset 和 viewport
        const importantMetaNames = ["description", "keywords"]
        const importantMetaProperties = ["og:title", "og:description", "og:image", "og:url"]
        const importantMetaItemprops = ["name", "property", "itemprop"]

        newDoc.head.querySelectorAll("meta").forEach((newMeta) => {
          const isImportant = importantMetaItemprops.some((attr) => {
            const value = newMeta.getAttribute(attr)
            if (!value) return false
            return importantMetaNames.includes(value) || importantMetaProperties.includes(value)
          })

          if (isImportant) {
            const attrToMatch = importantMetaItemprops.find((attr) => newMeta.hasAttribute(attr))
            if (attrToMatch) {
              const valueToMatch = newMeta.getAttribute(attrToMatch)
              const existingMeta = document.head.querySelector(
                `meta[${attrToMatch}="${valueToMatch}"]`,
              )
              if (existingMeta) {
                // 更新现有 meta 标签的 content 属性
                existingMeta.setAttribute("content", newMeta.getAttribute("content") || "")
              } else {
                // 添加新的 meta 标签
                document.head.appendChild(newMeta.cloneNode(true))
              }
            }
          }
        })

        // 更新或添加重要的 link 标签 (例如 canonical, alternate, preconnect, preload, prefetch)
        const importantLinkRels = ["canonical", "alternate", "preconnect", "preload", "prefetch"]

        newDoc.head.querySelectorAll("link").forEach((newLink) => {
          const rel = newLink.getAttribute("rel")
          if (rel && importantLinkRels.includes(rel)) {
            // 对于 canonical 和 alternate，通常只有一个，可以直接替换或更新 href
            if (rel === "canonical" || rel === "alternate") {
              const existingLink = document.head.querySelector(`link[rel="${rel}"]`)
              if (existingLink) {
                existingLink.setAttribute("href", newLink.getAttribute("href") || "")
              } else {
                document.head.appendChild(newLink.cloneNode(true))
              }
            } else {
              // 对于 preconnect, preload, prefetch 等，可能需要添加新的
              // 简单的添加，更复杂的逻辑可能需要检查是否已存在相同的 href
              document.head.appendChild(newLink.cloneNode(true))
            }
          }
        })

        // 注意：脚本和样式表的处理更为复杂，直接添加可能导致重复加载或执行问题。
        // 对于样式表，可以考虑动态创建 <link> 或 <style> 标签并添加到 head，但需要管理移除旧的。
        // 对于脚本，通常不应该在页面内容替换后重新执行，除非它们是动态加载且设计为可重复执行的。
        // 当前方案依赖于 nav 事件触发后的重新初始化逻辑来处理脚本和样式。

        // 更新浏览器历史记录和地址栏
        // history.pushState({}, "", targetUrl.toString()); // 旧代码
        history.pushState({}, "")

        clearActivePopover()

        const oldCleanup = window.cleanup
        if (typeof oldCleanup === "function") {
          oldCleanup()
        }

        // 派发 nav 事件，让其他依赖导航的组件重新初始化
        document.dispatchEvent(new CustomEvent("nav", { detail: { url: urlForBrowser.pathname } }))

        // 派发自定义事件以重新初始化图谱
        // 使用 requestAnimationFrame 确保 DOM 更新已基本完成
        requestAnimationFrame(() => {
          console.log("Dispatching reinit-graph event from popover.")
          document.dispatchEvent(new CustomEvent("reinit-graph", { detail: {} }))
        })

        if (urlForBrowser.hash) {
          const element = document.getElementById(urlForBrowser.hash.substring(1))
          if (element) {
            element.scrollIntoView()
          }
        }
      } else {
        console.log(`Not found in sessionStorage, navigating to: ${urlForBrowser.toString()}`)
        window.location.assign(urlForBrowser.toString())
      }
    }

    window.addCleanup(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler)
      link.removeEventListener("mouseleave", clearActivePopover)
      link.removeEventListener("click", wikilinkClickHandler) // 清理 click 监听器
    })
  }

  // 初始化视口预加载逻辑
  initializeViewportPreloading()
})
