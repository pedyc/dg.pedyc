import { PopoverConfig } from "./config"
import { PopoverError } from "./error-handler"
import { normalizeRelativeURLs, removeDuplicatePathSegments } from "../../../util/path"
import { updatePageHead } from "../utils/html-utils"
import { UnifiedStorageManager } from "../managers/UnifiedStorageManager"

export type cachedItem = {
  data: any
  timestamp: number
  ttl: number
  size: number
  type: "html" | "image" | "pdf"
}

// 全局解析器实例
const p = new DOMParser()

/**
 * HTML内容处理器
 * 统一处理HTML内容的解析、标准化和缓存
 */
export class HTMLContentProcessor {
  /**
   * 处理HTML内容的预加载
   * @param contents - HTML内容字符串
   * @param normalizeUrl - 用于标准化相对URL的基础URL
   * @param cacheKey - 缓存键
   * @returns 处理后的文档片段
   */
  static async processContent(
    contents: string,
    normalizeUrl: URL,
    cacheKey: string,
    storeInSession: boolean = true,
  ): Promise<DocumentFragment> {
    if (!contents || typeof contents !== "string") {
      throw new PopoverError("Invalid HTML contents provided", cacheKey)
    }

    const html = p.parseFromString(contents, "text/html")

    if (storeInSession) {
      try {
        const storageManager = new UnifiedStorageManager()
        await storageManager.setSessionItem(cacheKey, contents)
      } catch (error) {
        console.warn("Failed to cache processed content:", error)
      }
    }

    normalizeRelativeURLs(html, normalizeUrl)
    this.cleanupDuplicatePaths(html)
    html.querySelectorAll("[id]").forEach((el) => {
      el.id = `${PopoverConfig.POPOVER_INTERNAL_PREFIX}${el.id}`
    })

    const fragment = document.createDocumentFragment()
    const popoverHintElements = [...html.getElementsByClassName("popover-hint")]

    if (popoverHintElements.length > 0) {
      popoverHintElements.forEach((el) => fragment.appendChild(el.cloneNode(true)))
    } else if (html.body) {
      // 使用 DocumentFragment 批量添加
      const bodyFragment = document.createDocumentFragment()
      Array.from(html.body.children).forEach((child) =>
        bodyFragment.appendChild(child.cloneNode(true)),
      )
      fragment.appendChild(bodyFragment)
    }

    return fragment
  }

  /**
   * 解析已存储的HTML内容，避免重复处理和存储
   * @param contents - 已存储的HTML内容字符串
   * @param normalizeUrl - 用于规范化URL的基础URL
   * @returns 处理后的DocumentFragment
   */
  static async parseStoredContent(contents: string, normalizeUrl: URL): Promise<DocumentFragment> {
    // 调用 processContent 并禁用 sessionStorage 存储
    return this.processContent(contents, normalizeUrl, "", false)
  }

  /**
   * 清理HTML文档中的重复路径（公共方法）
   * @param html - 解析后的HTML文档
   */
  static cleanupDuplicatePathsInDocument(html: Document): void {
    this.cleanupDuplicatePaths(html)
  }

  /**
   * 清理HTML文档中的重复路径
   * @param html - 解析后的HTML文档
   */
  private static cleanupDuplicatePaths(html: Document): void {
    // 处理所有href属性
    html.querySelectorAll("[href]").forEach((element) => {
      const href = element.getAttribute("href")
      if (href && href.startsWith("/")) {
        const cleanedHref = removeDuplicatePathSegments(href)
        if (cleanedHref !== href) {
          element.setAttribute("href", cleanedHref)
          console.log(`[HTMLProcessor] Cleaned duplicate path: ${href} -> ${cleanedHref}`)
        }
      }
    })

    // 处理所有src属性
    html.querySelectorAll("[src]").forEach((element) => {
      const src = element.getAttribute("src")
      if (src && src.startsWith("/")) {
        const cleanedSrc = removeDuplicatePathSegments(src)
        if (cleanedSrc !== src) {
          element.setAttribute("src", cleanedSrc)
          console.log(`[HTMLProcessor] Cleaned duplicate path: ${src} -> ${cleanedSrc}`)
        }
      }
    })
  }

  // 路径去重逻辑已移至 utils/util.ts 统一管理

  /**
   * 更新页面头部信息
   * @param newDoc 新文档
   */
  static updatePageHead(newDoc: Document): void {
    updatePageHead(newDoc) // Call imported function
  }

  /**
   * 渲染弹窗内容
   * @param container 容器元素
   * @param cachedItem 缓存的内容项
   */
  static renderPopoverContent(container: HTMLElement, cachedItem: cachedItem): void {
    console.debug("[Popover Debug] renderPopoverContent called with:", {
      hasContainer: !!container,
      hasCachedItem: !!cachedItem,
      cachedItemType: cachedItem?.type,
      hasData: !!cachedItem?.data,
      dataType: typeof cachedItem?.data,
      dataLength: typeof cachedItem?.data === "string" ? cachedItem.data.length : "N/A",
    })

    if (!cachedItem || !cachedItem.data) {
      console.warn("[Popover Debug] No cached item or data, rendering not found content")
      HTMLContentProcessor.renderNotFoundContent(container, "Unknown")
      return
    }

    container.dataset.contentType = cachedItem.type

    switch (cachedItem.type) {
      case "image":
        console.debug("[Popover Debug] Rendering image content")
        const img = document.createElement("img")
        img.src = cachedItem.data as string
        img.alt = new URL(cachedItem.data as string).pathname
        container.appendChild(img)
        break
      case "pdf":
        console.debug("[Popover Debug] Rendering PDF content")
        const pdf = document.createElement("iframe")
        pdf.src = cachedItem.data as string
        container.appendChild(pdf)
        break
      case "html":
        console.debug("[Popover Debug] Rendering HTML content")
        // 检查 cachedItem.data 的类型并相应处理
        if (cachedItem.data && typeof cachedItem.data.cloneNode === "function") {
          console.debug("[Popover Debug] Data is DocumentFragment, cloning directly")
          // 如果是 DocumentFragment，直接克隆
          const clonedFragment = (cachedItem.data as DocumentFragment).cloneNode(true)
          container.appendChild(clonedFragment)
          console.debug(
            "[Popover Debug] DocumentFragment appended, children count:",
            container.children.length,
          )
        } else if (typeof cachedItem.data === "string") {
          console.debug("[Popover Debug] Data is HTML string, parsing...")
          // 如果是 HTML 字符串，使用与 parseStoredContent 相同的逻辑处理
          try {
            const html = p.parseFromString(cachedItem.data as string, "text/html")
            console.debug("[Popover Debug] HTML parsed successfully:", {
              bodyExists: !!html.body,
              bodyChildren: html.body?.children.length || 0,
              bodyTextContent: html.body?.textContent?.substring(0, 200) + "...",
              documentTitle: html.title,
              htmlPreview: (cachedItem.data as string).substring(0, 500) + "...",
            })

            const fragment = document.createDocumentFragment()

            // 查找 popover-hint 元素，如果没有则使用 body 内容
            const popoverHintElements = [...html.getElementsByClassName("popover-hint")]
            console.debug(
              "[Popover Debug] Found popover-hint elements:",
              popoverHintElements.length,
            )

            if (popoverHintElements.length > 0) {
              // 如果有 popover-hint 元素，只使用这些元素
              popoverHintElements.forEach((el) => {
                console.debug("[Popover Debug] Adding popover-hint element:", {
                  tagName: el.tagName,
                  className: el.className,
                  textContent: el.textContent?.substring(0, 100) + "...",
                })
                fragment.appendChild(el.cloneNode(true))
              })
              console.debug("[Popover Debug] Added popover-hint elements to fragment")
            } else if (html.body) {
              // 如果没有 popover-hint 元素，使用 body 的所有子元素
              console.debug(
                "[Popover Debug] No popover-hint elements, using body children:",
                html.body.children.length,
              )
              Array.from(html.body.children).forEach((child) => {
                fragment.appendChild(child.cloneNode(true))
              })
              console.debug("[Popover Debug] Added body children to fragment")
            } else {
              console.warn("[Popover Debug] No body element found in parsed HTML")
            }

            container.appendChild(fragment)
            console.debug("[Popover Debug] Fragment appended to container:", {
              finalChildrenCount: container.children.length,
              containerTextContent: container.textContent?.substring(0, 200) + "...",
              containerInnerHTML: container.innerHTML.substring(0, 300) + "...",
            })

            // 检查容器内容是否为空
            if (container.children.length === 0 && container.textContent?.trim() === "") {
              console.warn("[Popover Debug] Container is empty after rendering, showing error")
              HTMLContentProcessor.renderNotFoundContent(container, "Empty content after parsing")
            }
          } catch (error) {
            console.warn("[Popover Debug] Failed to parse HTML string:", error)
            HTMLContentProcessor.renderNotFoundContent(container, "Failed to parse content")
          }
        } else {
          console.warn(
            "[Popover Debug] Invalid content data type:",
            typeof cachedItem.data,
            cachedItem.data,
          )
          HTMLContentProcessor.renderNotFoundContent(container, "Invalid content format")
        }
        break
      default:
        console.warn("[Popover Debug] Unknown content type:", cachedItem.type)
        HTMLContentProcessor.renderNotFoundContent(container, "Unknown content type")
        break
    }
  }

  /**
   * 渲染404内容
   * @param container 容器元素
   * @param url 失败的URL
   */
  static renderNotFoundContent(container: HTMLElement, url: string): void {
    const errorDiv = document.createElement("div")
    errorDiv.className = "popover-error"
    errorDiv.innerHTML = `
      <h1>404 Page</h1>
      <p>无法加载内容</p>
      <p class="popover-error-url">${url}</p>
    `
    container.appendChild(errorDiv)
  }

  /**
   * 为SPA导航重构HTML片段内容
   * @param fragmentHTML HTML片段字符串
   * @param baseUrl 基础URL用于构建页面
   * @returns 重构的HTML内容（标记为SPA重构内容）
   */
  static reconstructHtmlForSpa(fragmentHTML: string, baseUrl: URL): string {
    console.debug("[HTMLProcessor Debug] Reconstructing content for SPA navigation:", {
      fragmentLength: fragmentHTML.length,
      fragmentPreview: fragmentHTML.substring(0, 200) + "...",
      baseUrl: baseUrl.toString(),
    })

    // 解析片段内容
    const parser = new DOMParser()
    const tempDoc = parser.parseFromString(`<div>${fragmentHTML}</div>`, "text/html")
    const fragmentContainer = tempDoc.querySelector("div")

    if (!fragmentContainer) {
      console.warn("[HTMLProcessor Debug] Failed to parse fragment, returning as-is")
      return fragmentHTML
    }

    // 恢复原始ID（移除popover-internal-前缀）
    fragmentContainer.querySelectorAll('[id^="popover-internal-"]').forEach((el) => {
      const originalId = el.id.replace("popover-internal-", "")
      if (originalId) {
        el.id = originalId
      }
    })

    // 构建标题
    const title =
      fragmentContainer.querySelector("h1")?.textContent ||
      fragmentContainer.querySelector("h2")?.textContent ||
      baseUrl.pathname.split("/").pop() ||
      "Page"

    // 分析内容结构，提取beforeBody和主要内容
    const contentElements = Array.from(fragmentContainer.children)
    let beforeBodyContent = ""
    let mainContent = ""

    // 查找popover-hint内容作为beforeBody（面包屑、标题、元数据等）
    const popoverHintElement = fragmentContainer.querySelector(".popover-hint")
    if (popoverHintElement) {
      beforeBodyContent = popoverHintElement.innerHTML
      // 移除popover-hint元素，剩余内容作为主要内容
      popoverHintElement.remove()
      mainContent = fragmentContainer.innerHTML
    } else {
      // 如果没有popover-hint，尝试智能分离
      const titleElements = contentElements.filter(
        (el) =>
          el.tagName === "H1" ||
          el.tagName === "H2" ||
          el.classList.contains("article-title") ||
          el.classList.contains("content-meta") ||
          el.classList.contains("breadcrumbs") ||
          el.classList.contains("tag-list"),
      )

      if (titleElements.length > 0) {
        beforeBodyContent = titleElements.map((el) => el.outerHTML).join("\n")
        // 移除这些元素，剩余作为主要内容
        titleElements.forEach((el) => el.remove())
        mainContent = fragmentContainer.innerHTML
      } else {
        // 如果无法分离，将所有内容作为主要内容
        mainContent = fragmentContainer.innerHTML
      }
    }

    // 构建符合页面布局的HTML结构
    const spaHTML = `<!DOCTYPE html>
<!-- SPA_RECONSTRUCTED_CONTENT -->
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="quartz-body">
    <div class="left sidebar">
      <!-- 左侧边栏内容将由现有组件保持 -->
    </div>
    <div class="center">
      <div class="page-header">
        <header>
          <!-- 头部内容将由现有组件保持 -->
        </header>
        <div class="popover-hint">
          ${beforeBodyContent}
        </div>
      </div>
      <article class="popover-hint">
        ${mainContent}
      </article>
      <hr />
      <div class="page-footer">
        <!-- 页脚内容将由现有组件保持 -->
      </div>
    </div>
    <div class="right sidebar">
      <!-- 右侧边栏内容将由现有组件保持 -->
    </div>
  </div>
</body>
</html>`

    console.debug(
      "[HTMLProcessor Debug] Reconstructed HTML for SPA navigation:",
      spaHTML.substring(0, 500) + "...",
    )
    return spaHTML
  }

  /**
   * 检查内容是否为预处理的HTML片段（来自弹窗预加载）
   * @param content HTML内容字符串
   * @returns 是否为预处理内容
   */
  static isPreprocessedContent(content: string): boolean {
    // 预处理内容的特征：
    // 1. 不包含完整的HTML文档结构（没有<!DOCTYPE html>、<html>、<head>、<body>标签）
    // 2. 包含popover-hint类或直接是文章内容
    // 3. 包含popover-internal-前缀的ID
    const hasDoctype = content.includes("<!DOCTYPE")
    const hasHtmlTag = content.includes("<html")
    const hasHeadTag = content.includes("<head")
    const hasBodyTag = content.includes("<body")
    const hasPopoverInternal = content.includes("popover-internal-")
    const hasPopoverHint = content.includes("popover-hint")

    // 如果缺少基本HTML结构但包含popover特征，则认为是预处理内容
    return (
      (!hasDoctype || !hasHtmlTag || !hasHeadTag || !hasBodyTag) &&
      (hasPopoverInternal ||
        hasPopoverHint ||
        content.trim().startsWith("<article") ||
        content.trim().startsWith("<div"))
    )
  }
}
