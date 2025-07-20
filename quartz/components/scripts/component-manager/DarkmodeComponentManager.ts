import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"
import { globalStorageManager } from "../managers"
import { CacheKeyFactory } from "../cache"

// 定义主题变更事件类型
declare global {
  interface CustomEventMap {
    themechange: CustomEvent<{ theme: "light" | "dark" }>
  }
}

/**
 * 主题管理器配置接口
 */
interface DarkmodeConfig extends ComponentConfig {
  /** 默认主题 */
  defaultTheme?: "light" | "dark"
  /** 是否跟随系统主题 */
  followSystemTheme?: boolean
}

/**
 * 主题管理器状态接口
 */
interface DarkmodeState extends ComponentState {
  /** 当前主题 */
  currentTheme: "light" | "dark"
  /** 主题按钮元素 */
  darkmodeButtons: HTMLElement[]
  /** 系统主题媒体查询 */
  colorSchemeMediaQuery: MediaQueryList | null
}

/**
 * 主题管理器
 * 负责管理网站的亮/暗主题切换功能
 */
export class DarkmodeComponentManager extends BaseComponentManager<DarkmodeConfig, DarkmodeState> {
  private readonly themeKey: string

  constructor(config: DarkmodeConfig = {} as DarkmodeConfig) {
    super({
      debug: false,
      defaultTheme: "light",
      followSystemTheme: true,
      ...config,
    } as DarkmodeConfig)

    this.themeKey = CacheKeyFactory.generateSystemKey("theme", "preference")
  }

  /**
   * 获取用户偏好主题
   */
  private getUserPreferredTheme(): "light" | "dark" {
    const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    return (
      globalStorageManager.instance.getItem("local", this.themeKey) ??
      (this.config as any).defaultTheme ??
      userPref
    )
  }

  /**
   * 触发自定义主题变更事件
   */
  private emitThemeChangeEvent(theme: "light" | "dark"): void {
    const event = new CustomEvent("themechange", {
      detail: { theme },
    })
    document.dispatchEvent(event)
  }

  /**
   * 切换主题
   */
  private switchTheme = (): void => {
    try {
      const currentTheme = (this.state as any).currentTheme
      const newTheme = currentTheme === "dark" ? "light" : "dark"
      this.setTheme(newTheme)
    } catch (error) {
      this.error("Failed to switch theme:", error)
    }
  }

  /**
   * 设置主题
   */
  public setTheme(theme: "light" | "dark"): void {
    try {
      ;(this.state as any).currentTheme = theme
      document.documentElement.setAttribute("saved-theme", theme)
      globalStorageManager.instance.setItem("local", this.themeKey, theme)
      this.emitThemeChangeEvent(theme)
      this.log(`Theme switched to: ${theme}`)
    } catch (error) {
      this.error("Failed to set theme:", error)
    }
  }

  /**
   * 处理系统主题偏好设置变化
   */
  private handleSystemThemeChange = (e: MediaQueryListEvent): void => {
    try {
      if ((this.state as any).currentTheme === "auto") {
        const systemTheme = e.matches ? "dark" : "light"
        document.documentElement.setAttribute("saved-theme", systemTheme)
        this.emitThemeChangeEvent(systemTheme)
        this.log(`System theme changed to: ${systemTheme}`)
      }
    } catch (error) {
      this.error("Failed to handle system theme change:", error)
    }
  }

  /**
   * 查找组件元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.getElementsByClassName("darkmode")) as HTMLElement[]
  }

  /**
   * 初始化组件
   */
  protected async onInitialize(): Promise<void> {
    // 初始化状态
    ;(this.state as any).currentTheme = this.getUserPreferredTheme()
    ;(this.state as any).darkmodeButtons = []
    ;(this.state as any).colorSchemeMediaQuery = null

    // 设置初始主题
    const theme = (this.state as any).currentTheme
    document.documentElement.setAttribute("saved-theme", theme)

    // 初始化媒体查询
    ;(this.state as any).colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    this.log("Darkmode component initialized with theme:", (this.state as any).currentTheme)
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // 查找主题切换按钮
    ;(this.state as any).darkmodeButtons = this.findComponentElements()

    // 为每个主题按钮添加点击事件
    ;(this.state as any).darkmodeButtons.forEach((button: HTMLElement) => {
      this.addEventListener(button, "click", this.switchTheme)
    })

    // 监听系统主题变化
    if ((this.state as any).colorSchemeMediaQuery) {
      this.addEventListener(
        (this.state as any).colorSchemeMediaQuery,
        "change",
        this.handleSystemThemeChange as any,
      )
    }

    this.log(
      `Setup event listeners for ${(this.state as any).darkmodeButtons.length} darkmode buttons`,
    )
  }

  /**
   * 页面设置（在导航事件后执行）
   */
  protected onSetupPage(_elements: HTMLElement[]): void {
    // 重新查找按钮元素（可能在导航后发生变化）
    ;(this.state as any).darkmodeButtons = this.findComponentElements()

    // 重新设置按钮事件监听器
    ;(this.state as any).darkmodeButtons.forEach((button: HTMLElement) => {
      this.addEventListener(button, "click", this.switchTheme)
    })

    this.log(
      `Page setup completed, found ${(this.state as any).darkmodeButtons.length} darkmode buttons`,
    )
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    ;(this.state as any).darkmodeButtons = []
    ;(this.state as any).colorSchemeMediaQuery = null
    this.log("Darkmode component cleaned up")
  }

  /**
   * 获取当前主题
   */
  public getCurrentTheme(): "light" | "dark" {
    return (this.state as any).currentTheme
  }

  /**
   * 获取主题统计信息
   */
  public getThemeStats(): {
    currentTheme: string
    buttonCount: number
    hasSystemListener: boolean
  } {
    return {
      currentTheme: (this.state as any).currentTheme,
      buttonCount: (this.state as any).darkmodeButtons.length,
      hasSystemListener: (this.state as any).colorSchemeMediaQuery !== null,
    }
  }
}
