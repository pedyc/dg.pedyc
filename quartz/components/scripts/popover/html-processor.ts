import { PopoverConfig } from './config';
import { PopoverError } from './error-handler';
import { normalizeRelativeURLs, removeDuplicatePathSegments } from '../../../util/path';
import { updatePageHead } from '../utils/html-utils';

// 全局解析器实例
const p = new DOMParser();

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
  static async processContent(contents: string, normalizeUrl: URL, cacheKey: string): Promise<DocumentFragment> {
    if (!contents || typeof contents !== 'string') {
      throw new PopoverError('Invalid HTML contents provided', cacheKey)
    }

    const html = p.parseFromString(contents, "text/html")

    // 将原始 HTML 文本存入 sessionStorage，用于页面跳转时复用
    try {
      sessionStorage.setItem(cacheKey, contents)
    } catch (error) {
      console.warn('Failed to cache processed content:', error)
    }

    // 直接使用传入的normalizeUrl，避免重复处理
    normalizeRelativeURLs(html, normalizeUrl);

    // 额外检查和清理可能的重复路径
    this.cleanupDuplicatePaths(html);
    html.querySelectorAll("[id]").forEach((el) => {
      el.id = `${PopoverConfig.POPOVER_INTERNAL_PREFIX}${el.id}`
    })

    const popoverHintElements = [...html.getElementsByClassName("popover-hint")]
    const fragment = document.createDocumentFragment()

    if (popoverHintElements.length > 0) {
      popoverHintElements.forEach((el) => fragment.appendChild(el.cloneNode(true)))
    } else if (html.body) {
      Array.from(html.body.children).forEach((child) =>
        fragment.appendChild(child.cloneNode(true))
      )
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
    if (!contents || typeof contents !== 'string') {
      throw new PopoverError('Invalid HTML contents provided for parsing')
    }

    const html = p.parseFromString(contents, "text/html")

    // 注意：这里不再调用sessionStorage.setItem，因为内容已经存储过了

    // 直接使用传入的normalizeUrl，避免重复的URL处理
    // 这样可以保留原始URL的hash等信息，确保相对链接正确解析
    normalizeRelativeURLs(html, normalizeUrl);

    // 额外检查和清理可能的重复路径
    this.cleanupDuplicatePaths(html);
    html.querySelectorAll("[id]").forEach((el) => {
      el.id = `${PopoverConfig.POPOVER_INTERNAL_PREFIX}${el.id}`
    })

    const popoverHintElements = [...html.getElementsByClassName("popover-hint")]
    const fragment = document.createDocumentFragment()

    if (popoverHintElements.length > 0) {
      popoverHintElements.forEach((el) => fragment.appendChild(el.cloneNode(true)))
    } else if (html.body) {
      Array.from(html.body.children).forEach((child) =>
        fragment.appendChild(child.cloneNode(true))
      )
    }

    return fragment
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
    html.querySelectorAll('[href]').forEach((element) => {
      const href = element.getAttribute('href')
      if (href && href.startsWith('/')) {
        const cleanedHref = removeDuplicatePathSegments(href)
        if (cleanedHref !== href) {
          element.setAttribute('href', cleanedHref)
          console.log(`[HTMLProcessor] Cleaned duplicate path: ${href} -> ${cleanedHref}`)
        }
      }
    })

    // 处理所有src属性
    html.querySelectorAll('[src]').forEach((element) => {
      const src = element.getAttribute('src')
      if (src && src.startsWith('/')) {
        const cleanedSrc = removeDuplicatePathSegments(src)
        if (cleanedSrc !== src) {
          element.setAttribute('src', cleanedSrc)
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
    updatePageHead(newDoc); // Call imported function
  }



  /**
   * 渲染弹窗内容
   * @param container 容器元素
   * @param cachedItem 缓存的内容项
   */
  static renderPopoverContent(container: HTMLElement, cachedItem: any): void {
    if (!cachedItem || !cachedItem.data) {
      this.renderNotFoundContent(container, 'Unknown')
      return
    }

    container.dataset.contentType = cachedItem.type

    switch (cachedItem.type) {
      case 'image':
        const img = document.createElement('img')
        img.src = cachedItem.data as string
        img.alt = new URL(cachedItem.data as string).pathname
        container.appendChild(img)
        break
      case 'pdf':
        const pdf = document.createElement('iframe')
        pdf.src = cachedItem.data as string
        container.appendChild(pdf)
        break
      case 'html':
        // 检查 cachedItem.data 的类型并相应处理
        if (cachedItem.data && typeof cachedItem.data.cloneNode === 'function') {
          // 如果是 DocumentFragment，直接克隆
          container.appendChild((cachedItem.data as DocumentFragment).cloneNode(true))
        } else if (typeof cachedItem.data === 'string') {
          // 如果是 HTML 字符串，使用与 parseStoredContent 相同的逻辑处理
          try {
            const html = p.parseFromString(cachedItem.data as string, "text/html")
            
            // 查找 popover-hint 元素，如果没有则使用 body 内容
            const popoverHintElements = [...html.getElementsByClassName("popover-hint")]
            
            if (popoverHintElements.length > 0) {
              // 如果有 popover-hint 元素，只使用这些元素
              popoverHintElements.forEach((el) => {
                container.appendChild(el.cloneNode(true))
              })
            } else if (html.body) {
              // 如果没有 popover-hint 元素，使用 body 的所有子元素
              Array.from(html.body.children).forEach((child) => {
                container.appendChild(child.cloneNode(true))
              })
            }
          } catch (error) {
            console.warn('Failed to parse HTML string:', error)
            this.renderNotFoundContent(container, 'Failed to parse content')
          }
        } else {
          console.warn('Invalid content data type:', typeof cachedItem.data, cachedItem.data)
          this.renderNotFoundContent(container, 'Invalid content format')
        }
        break
      default:
        this.renderNotFoundContent(container, 'Unknown content type')
        break
    }
  }

  /**
   * 渲染404内容
   * @param container 容器元素
   * @param url 失败的URL
   */
  static renderNotFoundContent(container: HTMLElement, url: string): void {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'popover-error'
    errorDiv.innerHTML = `
      <p>无法加载内容</p>
      <p class="popover-error-url">${url}</p>
    `
    container.appendChild(errorDiv)
  }


}