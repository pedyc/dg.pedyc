/**
 * Callout 组件管理器
 * 管理可折叠标注框的交互行为
 */

import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"

/**
 * Callout 组件配置接口
 */
export interface CalloutConfig extends ComponentConfig {
  /** 默认折叠状态 */
  defaultCollapsed?: boolean
  /** 动画持续时间 */
  animationDuration?: number
  /** 是否启用键盘导航 */
  enableKeyboardNav?: boolean
}

/**
 * Callout 组件状态接口
 */
export interface CalloutState extends ComponentState {
  /** 可折叠的标注框元素 */
  calloutElements: HTMLElement[]
  /** 折叠状态映射 */
  collapsedStates: Map<HTMLElement, boolean>
}

/**
 * Callout 组件管理器
 * 负责管理页面中所有可折叠标注框的交互行为
 */
export class CalloutComponentManager extends BaseComponentManager<CalloutConfig, CalloutState> {
  private static readonly SELECTORS = {
    COLLAPSIBLE: ".callout.is-collapsible",
    TITLE: ".callout-title",
    CONTENT: ".callout-content",
  } as const

  private static readonly CLASSES = {
    COLLAPSED: "is-collapsed",
  } as const

  constructor(config: Partial<CalloutConfig> = {}) {
    super({
      name: "callout",
      debug: false,
      defaultCollapsed: false,
      animationDuration: 300,
      enableKeyboardNav: true,
      ...config,
    })
  }

  /**
   * 查找页面中的 Callout 元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(CalloutComponentManager.SELECTORS.COLLAPSIBLE),
    )
  }

  /**
   * 初始化组件状态
   */
  protected async onInitialize(): Promise<void> {
    this.state.calloutElements = this.findComponentElements()
    this.state.collapsedStates = new Map()

    this.log(`Found ${this.state.calloutElements.length} collapsible callouts`)
  }

  /**
   * 设置事件监听器
   */
  protected async onSetupEventListeners(): Promise<void> {
    // 页面导航时重新设置
    // 事件监听已在 BaseComponentManager 中统一处理
  
  }

  /**
   * 设置页面元素
   */
  protected async onSetupPage(): Promise<void> {
    // 重新查找元素
    this.state.calloutElements = this.findComponentElements()
    this.state.collapsedStates.clear()

    // 为每个可折叠标注框设置交互
    for (const callout of this.state.calloutElements) {
      this.setupCalloutElement(callout)
    }

    this.log(`Setup ${this.state.calloutElements.length} callout elements`)
  }

  /**
   * 清理资源
   */
  protected async onCleanup(): Promise<void> {
    this.state.collapsedStates.clear()
    this.state.calloutElements = []
    this.log("Callout resources cleaned up")
  }

  /**
   * 设置单个标注框元素
   */
  private setupCalloutElement(callout: HTMLElement): void {
    const title = callout.querySelector(CalloutComponentManager.SELECTORS.TITLE) as HTMLElement
    const content = callout.querySelector(CalloutComponentManager.SELECTORS.CONTENT) as HTMLElement

    if (!title || !content) {
      this.error("Callout element missing title or content", { callout })
      return
    }

    // 设置初始状态
    const isCollapsed = callout.classList.contains(CalloutComponentManager.CLASSES.COLLAPSED)
    this.state.collapsedStates.set(callout, isCollapsed)
    this.updateContentDisplay(content, isCollapsed)

    // 添加点击事件监听器
    const toggleHandler = () => this.toggleCallout(callout)
    this.addEventListener(title, "click", toggleHandler)

    // 添加键盘导航支持
    if (this.config.enableKeyboardNav) {
      title.setAttribute("tabindex", "0")
      title.setAttribute("role", "button")
      title.setAttribute("aria-expanded", (!isCollapsed).toString())

      const keyHandler = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          this.toggleCallout(callout)
        }
      }
      this.addEventListener(title, "keydown", keyHandler)
    }
  }

  /**
   * 切换标注框的折叠状态
   */
  private toggleCallout(callout: HTMLElement): void {
    const content = callout.querySelector(CalloutComponentManager.SELECTORS.CONTENT) as HTMLElement
    const title = callout.querySelector(CalloutComponentManager.SELECTORS.TITLE) as HTMLElement

    if (!content) {
      this.error("Content element not found for callout", { callout })
      return
    }

    // 切换折叠状态
    const wasCollapsed = this.state.collapsedStates.get(callout) ?? false
    const newCollapsed = !wasCollapsed

    // 更新状态
    this.state.collapsedStates.set(callout, newCollapsed)
    callout.classList.toggle(CalloutComponentManager.CLASSES.COLLAPSED, newCollapsed)

    // 更新内容显示
    this.updateContentDisplay(content, newCollapsed)

    // 更新 ARIA 属性
    if (title && this.config.enableKeyboardNav) {
      title.setAttribute("aria-expanded", (!newCollapsed).toString())
    }

    this.log(`Callout ${newCollapsed ? "collapsed" : "expanded"}`, { callout })
  }

  /**
   * 更新内容显示状态
   */
  private updateContentDisplay(content: HTMLElement, collapsed: boolean): void {
    content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"

    // 添加过渡动画
    if (this.config.animationDuration && this.config.animationDuration > 0) {
      content.style.transition = `grid-template-rows ${this.config.animationDuration}ms ease-in-out`
    }
  }

  /**
   * 获取指定标注框的折叠状态
   */
  public isCalloutCollapsed(callout: HTMLElement): boolean {
    return this.state.collapsedStates.get(callout) ?? false
  }

  /**
   * 设置指定标注框的折叠状态
   */
  public setCalloutCollapsed(callout: HTMLElement, collapsed: boolean): void {
    const currentState = this.state.collapsedStates.get(callout)
    if (currentState !== collapsed) {
      this.toggleCallout(callout)
    }
  }

  /**
   * 折叠所有标注框
   */
  public collapseAll(): void {
    for (const callout of this.state.calloutElements) {
      this.setCalloutCollapsed(callout, true)
    }
  }

  /**
   * 展开所有标注框
   */
  public expandAll(): void {
    for (const callout of this.state.calloutElements) {
      this.setCalloutCollapsed(callout, false)
    }
  }
}
