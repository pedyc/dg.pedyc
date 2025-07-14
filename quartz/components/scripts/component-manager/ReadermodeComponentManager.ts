import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"

// 定义阅读模式变更事件类型
declare global {
  interface CustomEventMap {
    readermodechange: CustomEvent<{ mode: "on" | "off" }>
  }
}

/**
 * 阅读模式管理器配置接口
 */
interface ReadermodeConfig extends ComponentConfig {
  /** 默认阅读模式状态 */
  defaultMode?: "on" | "off"
}

/**
 * 阅读模式管理器状态接口
 */
interface ReadermodeState extends ComponentState {
  /** 当前阅读模式状态 */
  isReaderMode: boolean
  /** 阅读模式按钮元素 */
  readerModeButtons: HTMLElement[]
}

/**
 * 阅读模式管理器
 * 负责管理网站的阅读模式功能
 */
export class ReadermodeComponentManager extends BaseComponentManager<
  ReadermodeConfig,
  ReadermodeState
> {
  constructor(config: ReadermodeConfig = {} as ReadermodeConfig) {
    super({
      debug: false,
      defaultMode: "off",
      ...config,
    } as ReadermodeConfig)
  }

  /**
   * 触发自定义阅读模式变更事件
   */
  private emitReaderModeChangeEvent(mode: "on" | "off"): void {
    const event = new CustomEvent("readermodechange", {
      detail: { mode },
    })
    document.dispatchEvent(event)
  }

  /**
   * 切换阅读模式
   */
  private switchReaderMode = (): void => {
    try {
      const currentMode = (this.state as any).isReaderMode
      const newMode = !currentMode
      this.setReaderMode(newMode)
    } catch (error) {
      this.error("Failed to switch reader mode:", error)
    }
  }

  /**
   * 设置阅读模式
   */
  public setReaderMode(isOn: boolean): void {
    try {
      ;(this.state as any).isReaderMode = isOn
      const mode = isOn ? "on" : "off"
      document.documentElement.setAttribute("reader-mode", mode)
      this.emitReaderModeChangeEvent(mode)
      this.log(`Reader mode switched to: ${mode}`)
    } catch (error) {
      this.error("Failed to set reader mode:", error)
    }
  }

  /**
   * 查找组件元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.getElementsByClassName("readermode")) as HTMLElement[]
  }

  /**
   * 初始化组件
   */
  protected async onInitialize(): Promise<void> {
    // 初始化状态
    const defaultMode = (this.config as any).defaultMode === "on"
    ;(this.state as any).isReaderMode = defaultMode
    ;(this.state as any).readerModeButtons = []

    // 设置初始阅读模式状态
    const mode = defaultMode ? "on" : "off"
    document.documentElement.setAttribute("reader-mode", mode)

    this.log("Reader mode component initialized with mode:", mode)
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // 查找阅读模式按钮
    ;(this.state as any).readerModeButtons = this.findComponentElements()

    // 为每个阅读模式按钮添加点击事件
    ;(this.state as any).readerModeButtons.forEach((button: HTMLElement) => {
      this.addEventListener(button, "click", this.switchReaderMode)
    })

    this.log(
      `Setup event listeners for ${(this.state as any).readerModeButtons.length} reader mode buttons`,
    )
  }

  /**
   * 页面设置（在导航事件后执行）
   */
  protected onSetupPage(_elements: HTMLElement[]): void {
    // 重新查找按钮元素（可能在导航后发生变化）
    ;(this.state as any).readerModeButtons = this.findComponentElements()

    // 重新设置按钮事件监听器
    ;(this.state as any).readerModeButtons.forEach((button: HTMLElement) => {
      this.addEventListener(button, "click", this.switchReaderMode)
    })

    // 保持当前阅读模式状态
    const mode = (this.state as any).isReaderMode ? "on" : "off"
    document.documentElement.setAttribute("reader-mode", mode)

    this.log(
      `Page setup completed, found ${(this.state as any).readerModeButtons.length} reader mode buttons`,
    )
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    ;(this.state as any).readerModeButtons = []
    this.log("Reader mode component cleaned up")
  }

  /**
   * 获取当前阅读模式状态
   */
  public getCurrentMode(): "on" | "off" {
    return (this.state as any).isReaderMode ? "on" : "off"
  }

  /**
   * 获取阅读模式统计信息
   */
  public getReaderModeStats(): {
    currentMode: string
    buttonCount: number
  } {
    return {
      currentMode: this.getCurrentMode(),
      buttonCount: (this.state as any).readerModeButtons?.length || 0,
    }
  }
}

// 创建并导出单例实例
export const readermodeComponentManager = new ReadermodeComponentManager()
