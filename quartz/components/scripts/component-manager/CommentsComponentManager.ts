/**
 * Comments 组件管理器
 * 管理 Giscus 评论系统的初始化、主题切换和清理
 */

import { BaseComponentManager, type ComponentConfig } from "./BaseComponentManager"
import { FullSlug, getFullSlug } from "../../../util/path"

interface CommentsConfig extends ComponentConfig {
  /** 是否启用主题跟随 */
  enableThemeSync?: boolean
  /** 是否启用懒加载 */
  enableLazyLoad?: boolean
  /** 懒加载的根边距 */
  lazyLoadRootMargin?: string
}

interface CommentsState {
  initialized: boolean
  eventListenersSetup: boolean
  elements: Set<HTMLElement>
  cleanupTasks: Array<() => void>
  currentSlug: FullSlug | null
  themeChangeHandler: ((e: CustomEventMap["themechange"]) => void) | null
}

type GiscusElement = Omit<HTMLElement, "dataset"> & {
  dataset: DOMStringMap & {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    themeUrl: string
    lightTheme: string
    darkTheme: string
    mapping: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict: string
    reactionsEnabled: string
    inputPosition: "top" | "bottom"
    lang: string
  }
}

/**
 * Comments 组件管理器
 * 统一管理 Giscus 评论系统的所有功能
 */
export class CommentsComponentManager extends BaseComponentManager<CommentsConfig, CommentsState> {
  constructor(config: Partial<CommentsConfig> = {}) {
    super({
      name: "Comments",
      debug: false,
      enableThemeSync: true,
      enableLazyLoad: true,
      lazyLoadRootMargin: "50px",
      cacheConfig: {
        prefix: "comments",
        ttl: 1800000, // 30分钟
      },
      ...config,
    })

    // 初始化状态
    this.state.currentSlug = null
    this.state.themeChangeHandler = null
  }

  /**
   * 查找评论容器元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(".giscus"))
  }

  /**
   * 组件初始化
   */
  protected async onInitialize(): Promise<void> {
    this.currentSlug = getFullSlug(window)
    this.log("Comments component initialized for slug:", this.currentSlug)
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    if (this.config.enableThemeSync) {
      this.setupThemeChangeListener()
    }
  }

  /**
   * 设置页面元素
   */
  protected onSetupPage(elements: HTMLElement[]): void {
    if (elements.length === 0) {
      this.log("No comment containers found")
      return
    }

    elements.forEach((container) => {
      this.setupCommentsContainer(container as GiscusElement)
    })
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    this.state.currentSlug = null
    this.state.themeChangeHandler = null
    this.log("Comments cleanup completed")
  }

  /**
   * 设置评论容器
   */
  private setupCommentsContainer(container: GiscusElement): void {
    try {
      // 清理已存在的 giscus 实例
      this.cleanupExistingGiscus(container)

      // 创建新的 Giscus 脚本
      this.createGiscusScript(container)

      this.log("Comments container setup completed")
    } catch (error) {
      this.error("Failed to setup comments container:", error)
    }
  }

  /**
   * 清理已存在的 Giscus 实例
   */
  private cleanupExistingGiscus(container: GiscusElement): void {
    const existingScript = container.querySelector('script[src="https://giscus.app/client.js"]')
    const existingIframe = container.querySelector("iframe.giscus-frame")

    if (existingScript) {
      existingScript.remove()
    }
    if (existingIframe) {
      existingIframe.remove()
    }
  }

  /**
   * 创建 Giscus 脚本
   */
  private createGiscusScript(container: GiscusElement): void {
    const giscusScript = document.createElement("script")
    giscusScript.src = "https://giscus.app/client.js"
    giscusScript.async = true
    giscusScript.crossOrigin = "anonymous"
    giscusScript.setAttribute("data-loading", "lazy")
    giscusScript.setAttribute("data-emit-metadata", "0")
    giscusScript.setAttribute("data-repo", container.dataset.repo)
    giscusScript.setAttribute("data-repo-id", container.dataset.repoId)
    giscusScript.setAttribute("data-category", container.dataset.category)
    giscusScript.setAttribute("data-category-id", container.dataset.categoryId)
    giscusScript.setAttribute("data-mapping", container.dataset.mapping)
    giscusScript.setAttribute("data-strict", container.dataset.strict)
    giscusScript.setAttribute("data-reactions-enabled", container.dataset.reactionsEnabled)
    giscusScript.setAttribute("data-input-position", container.dataset.inputPosition)
    giscusScript.setAttribute("data-lang", container.dataset.lang)

    // 设置主题
    const theme = document.documentElement.getAttribute("saved-theme")
    if (theme) {
      const giscusThemeName = this.getThemeName(theme, container)
      const giscusThemeUrl = this.getThemeUrl(giscusThemeName, container)
      giscusScript.setAttribute("data-theme", theme)
      giscusScript.setAttribute("data-theme-url", giscusThemeUrl)
    }

    container.appendChild(giscusScript)
  }

  /**
   * 设置主题变更监听器
   */
  private setupThemeChangeListener(): void {
    this.state.themeChangeHandler = (e: CustomEventMap["themechange"]) => {
      this.handleThemeChange(e)
    }

    this.addEventListener(
      document as any,
      "themechange" as any,
      this.state.themeChangeHandler as any,
    )
  }

  /**
   * 处理主题变更
   */
  private handleThemeChange(e: CustomEventMap["themechange"]): void {
    const theme = e.detail.theme
    const iframe = document.querySelector("iframe.giscus-frame") as HTMLIFrameElement

    if (!iframe || !iframe.contentWindow) {
      return
    }

    const giscusContainer = document.querySelector(".giscus") as GiscusElement
    if (!giscusContainer) {
      return
    }

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: theme,
            theme_url: this.getThemeUrl(this.getThemeName(theme, giscusContainer), giscusContainer),
          },
        },
      },
      "https://giscus.app",
    )
  }

  /**
   * 获取 Giscus 主题名称
   */
  private getThemeName(theme: string, container: GiscusElement): string {
    const darkGiscus = container.dataset.darkTheme ?? "dark"
    const lightGiscus = container.dataset.lightTheme ?? "light"
    return theme === "dark" ? darkGiscus : lightGiscus
  }

  /**
   * 获取 Giscus 主题 URL
   */
  private getThemeUrl(themeName: string, container: GiscusElement): string {
    // 如果 themeUrl 存在，则使用 themeUrl + themeName
    if (container.dataset.themeUrl) {
      return `${container.dataset.themeUrl}/${themeName}.css`
    }
    // 否则使用默认的 giscus.app 主题路径
    return `https://giscus.app/themes/${themeName}`
  }

  /**
   * 获取当前页面 slug
   */
  private get currentSlug(): FullSlug | null {
    return this.state.currentSlug
  }

  /**
   * 设置当前页面 slug
   */
  private set currentSlug(slug: FullSlug | null) {
    this.state.currentSlug = slug
  }
}
