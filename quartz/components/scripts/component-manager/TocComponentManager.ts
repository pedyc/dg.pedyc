import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"

/**
 * 目录组件配置接口
 */
interface TocConfig extends ComponentConfig {
  /** 是否自动高亮当前章节 */
  enableHighlight?: boolean
  /** 交集观察器选项 */
  observerOptions?: IntersectionObserverInit
}

/**
 * 目录组件状态接口
 */
interface TocState extends ComponentState {
  /** 目录元素列表 */
  tocElements: HTMLElement[]
  /** 目录按钮元素列表 */
  tocButtons: HTMLElement[]
  /** 交集观察器 */
  intersectionObserver: IntersectionObserver | null
  /** 观察的标题元素 */
  observedHeaders: NodeListOf<HTMLElement> | null
}

/**
 * 目录组件管理器
 * 负责管理文章目录的展开/折叠和当前章节高亮功能
 */
export class TocComponentManager extends BaseComponentManager<TocConfig, TocState> {
  constructor(config: Partial<TocConfig> = {}) {
    super({
      name: "toc",
      enableHighlight: true,
      observerOptions: {
        rootMargin: "0px",
        threshold: 0.1,
      },
      ...config,
    })
  }

  /**
   * 创建交集观察器
   */
  private createIntersectionObserver(): IntersectionObserver {
    const defaultOptions: IntersectionObserverInit = {
      rootMargin: "0px",
      threshold: 0.1,
      ...(this.config as any).observerOptions,
    }

    return new IntersectionObserver((entries) => {
      try {
        for (const entry of entries) {
          const slug = entry.target.id
          const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
          const windowHeight = entry.rootBounds?.height

          if (windowHeight && tocEntryElements.length > 0) {
            if (entry.boundingClientRect.y < windowHeight) {
              tocEntryElements.forEach((tocEntryElement) =>
                tocEntryElement.classList.add("in-view"),
              )
            } else {
              tocEntryElements.forEach((tocEntryElement) =>
                tocEntryElement.classList.remove("in-view"),
              )
            }
          }
        }
      } catch (error) {
        this.error("Error in intersection observer:", error)
      }
    }, defaultOptions)
  }

  /**
   * 切换目录展开/折叠状态
   */
  private toggleToc = (event: Event): void => {
    try {
      const button = event.currentTarget as HTMLElement
      if (!button) return

      button.classList.toggle("collapsed")
      button.setAttribute(
        "aria-expanded",
        button.getAttribute("aria-expanded") === "true" ? "false" : "true",
      )

      const content = button.nextElementSibling as HTMLElement | undefined
      if (content) {
        content.classList.toggle("collapsed")
      }

      this.log("TOC toggled:", button.classList.contains("collapsed") ? "collapsed" : "expanded")
    } catch (error) {
      this.error("Failed to toggle TOC:", error)
    }
  }

  /**
   * 设置目录按钮事件监听器
   */
  private setupTocButtons(): void {
    ;(this.state as any).tocButtons = []

    ;(this.state as any).tocElements.forEach((toc: HTMLElement) => {
      const button = toc.querySelector(".toc-header") as HTMLElement
      const content = toc.querySelector(".toc-content") as HTMLElement

      if (button && content) {
        ;(this.state as any).tocButtons.push(button)
        this.addEventListener(button, "click", this.toggleToc)
      }
    })

    this.log(`Setup ${(this.state as any).tocButtons.length} TOC buttons`)
  }

  /**
   * 设置标题观察器
   */
  private setupHeaderObserver(): void {
    if (!(this.config as any).enableHighlight) {
      return
    }

    // 断开之前的观察器
    if ((this.state as any).intersectionObserver) {
      ;(this.state as any).intersectionObserver.disconnect()
    }

    // 创建新的观察器
    ;(this.state as any).intersectionObserver = this.createIntersectionObserver()

    // 查找并观察标题元素
    ;(this.state as any).observedHeaders = document.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
    )

    ;(this.state as any).observedHeaders.forEach((header: HTMLElement) => {
      if ((this.state as any).intersectionObserver) {
        ;(this.state as any).intersectionObserver.observe(header)
      }
    })

    this.log(`Observing ${(this.state as any).observedHeaders.length} headers for TOC highlighting`)
  }

  /**
   * 查找组件元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.getElementsByClassName("toc")) as HTMLElement[]
  }

  /**
   * 初始化组件
   */
  protected async onInitialize(): Promise<void> {
    // 初始化状态
    ;(this.state as any).tocElements = []
    ;(this.state as any).tocButtons = []
    ;(this.state as any).intersectionObserver = null
    ;(this.state as any).observedHeaders = null

    this.log("TOC component initialized")
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // 查找目录元素
    ;(this.state as any).tocElements = this.findComponentElements()

    // 设置目录按钮
    this.setupTocButtons()

    // 设置标题观察器
    this.setupHeaderObserver()

    this.log(`Setup TOC component with ${(this.state as any).tocElements.length} TOC elements`)
  }

  /**
   * 页面设置（在导航事件后执行）
   */
  protected onSetupPage(_elements: HTMLElement[]): void {
    // 重新查找目录元素
    ;(this.state as any).tocElements = this.findComponentElements()

    // 重新设置按钮事件监听器
    this.setupTocButtons()

    // 重新设置标题观察器
    this.setupHeaderObserver()

    this.log(`Page setup completed, found ${(this.state as any).tocElements.length} TOC elements`)
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    // 断开观察器
    if ((this.state as any).intersectionObserver) {
      ;(this.state as any).intersectionObserver.disconnect()(
        this.state as any,
      ).intersectionObserver = null
    }

    // 清理状态
    ;(this.state as any).tocElements = []
    ;(this.state as any).tocButtons = []
    ;(this.state as any).observedHeaders = null

    this.log("TOC component cleaned up")
  }

  /**
   * 手动切换指定目录的展开状态
   */
  public toggleTocByIndex(index: number): void {
    if (index >= 0 && index < (this.state as any).tocButtons.length) {
      const button = (this.state as any).tocButtons[index]
      button.click()
    }
  }

  /**
   * 展开所有目录
   */
  public expandAllTocs(): void {
    ;(this.state as any).tocButtons.forEach((button: HTMLElement) => {
      if (button.classList.contains("collapsed")) {
        button.click()
      }
    })
  }

  /**
   * 折叠所有目录
   */
  public collapseAllTocs(): void {
    ;(this.state as any).tocButtons.forEach((button: HTMLElement) => {
      if (!button.classList.contains("collapsed")) {
        button.click()
      }
    })
  }

  /**
   * 获取目录统计信息
   */
  public getTocStats(): {
    tocCount: number
    buttonCount: number
    observedHeaderCount: number
    highlightEnabled: boolean
  } {
    return {
      tocCount: (this.state as any).tocElements.length,
      buttonCount: (this.state as any).tocButtons.length,
      observedHeaderCount: (this.state as any).observedHeaders?.length ?? 0,
      highlightEnabled: (this.config as any).enableHighlight ?? false,
    }
  }
}
