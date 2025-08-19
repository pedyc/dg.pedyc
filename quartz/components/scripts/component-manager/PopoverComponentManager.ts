/**
 * Popover 组件管理器
 * 管理页面链接的悬浮预览功能
 */

import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"
import {
  FailedLinksManager,
  ViewportPreloadManager,
  LinkEventManager,
  mouseEnterHandler,
  clearActivePopover,
} from "../popover/index"

/**
 * Popover 组件配置接口
 */
export interface PopoverConfig extends ComponentConfig {
  /** 是否启用预加载 */
  enablePreload?: boolean
  /** 预加载延迟时间 */
  preloadDelay?: number
  /** 是否启用视口预加载 */
  enableViewportPreload?: boolean
  /** 是否启用失败链接管理 */
  enableFailedLinksManagement?: boolean
  /** 悬浮框显示延迟 */
  showDelay?: number
  /** 悬浮框隐藏延迟 */
  hideDelay?: number
}

/**
 * Popover 组件状态接口
 */
export interface PopoverState extends ComponentState {
  /** 是否已初始化 */
  isInitialized: boolean
  /** 当前活跃的悬浮框 */
  activePopover?: HTMLElement
  /** 预加载管理器状态 */
  preloadManagerInitialized: boolean
}

/**
 * Popover 组件管理器
 * 负责管理页面中所有链接的悬浮预览功能
 */
export class PopoverComponentManager extends BaseComponentManager<PopoverConfig, PopoverState> {
  private static readonly SELECTORS = {
    LINKS: "a[href]",
    POPOVER: ".popover",
  } as const

  constructor(config: Partial<PopoverConfig> = {}) {
    super({
      name: "popover",
      debug: false,
      enablePreload: true,
      preloadDelay: 1000,
      enableViewportPreload: true,
      enableFailedLinksManagement: true,
      showDelay: 300,
      hideDelay: 100,
      ...config,
    })
  }

  /**
   * 查找页面中的链接元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(PopoverComponentManager.SELECTORS.LINKS),
    )
  }

  /**
   * 初始化组件状态
   */
  protected async onInitialize(): Promise<void> {
    this.state.isInitialized = false
    this.state.preloadManagerInitialized = false
    this.state.activePopover = undefined

    this.log("Popover component initialized")
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
    try {
      // 清理之前的状态
      this.clearActivePopover()

      // 初始化 Popover 功能
      await this.initializePopoverFeatures()

      this.state.isInitialized = true
      this.log("Popover page setup completed")
    } catch (error) {
      this.error("Failed to setup popover page", error)
    }
  }

  /**
   * 清理资源
   */
  protected async onCleanup(): Promise<void> {
    // 清理活跃的悬浮框
    this.clearActivePopover()

    // 重置状态
    this.state.isInitialized = false
    this.state.preloadManagerInitialized = false
    this.state.activePopover = undefined

    this.log("Popover resources cleaned up")
  }

  /**
   * 初始化 Popover 功能
   */
  private async initializePopoverFeatures(): Promise<void> {
    try {
      // 加载失败链接管理
      if (this.config.enableFailedLinksManagement) {
        await this.initializeFailedLinksManager()
      }

      // 设置链接事件监听器
      this.setupLinkEventListeners()

      // 初始化视口预加载
      if (this.config.enableViewportPreload) {
        await this.initializeViewportPreload()
      }

      this.log("All popover features initialized")
    } catch (error) {
      this.error("Failed to initialize popover features", error)
      throw error
    }
  }

  /**
   * 初始化失败链接管理器
   */
  private async initializeFailedLinksManager(): Promise<void> {
    try {
      FailedLinksManager.loadFailedLinks()
      this.log("Failed links manager initialized")
    } catch (error) {
      this.error("Failed to initialize failed links manager", error)
    }
  }

  /**
   * 设置链接事件监听器
   */
  private setupLinkEventListeners(): void {
    try {
      LinkEventManager.setupLinkEventListeners(mouseEnterHandler, () => this.clearActivePopover())
      this.log("Link event listeners setup completed")
    } catch (error) {
      this.error("Failed to setup link event listeners", error)
    }
  }

  /**
   * 初始化视口预加载
   */
  private async initializeViewportPreload(): Promise<void> {
    try {
      if (!this.state.preloadManagerInitialized) {
        ViewportPreloadManager.initialize()
        this.state.preloadManagerInitialized = true
        this.log("Viewport preload manager initialized")
      }
    } catch (error) {
      this.error("Failed to initialize viewport preload", error)
    }
  }

  /**
   * 清理活跃的悬浮框
   */
  private clearActivePopover(): void {
    try {
      clearActivePopover()
      this.state.activePopover = undefined
      this.log("Active popover cleared")
    } catch (error) {
      this.error("Failed to clear active popover", error)
    }
  }

  /**
   * 获取当前活跃的悬浮框
   */
  public getActivePopover(): HTMLElement | undefined {
    return this.state.activePopover
  }

  /**
   * 设置活跃的悬浮框
   */
  public setActivePopover(popover: HTMLElement | undefined): void {
    this.state.activePopover = popover
    this.log("Active popover updated", { popover })
  }

  /**
   * 检查 Popover 是否已初始化
   */
  public isInitialized(): boolean {
    return this.state.isInitialized
  }

  /**
   * 手动触发 Popover 设置
   */
  public async reinitialize(): Promise<void> {
    this.log("Manual reinitialize triggered")
    await this.setupPage()
  }

  /**
   * 获取失败链接管理器
   */
  public getFailedLinksManager(): typeof FailedLinksManager {
    return FailedLinksManager
  }

  /**
   * 获取视口预加载管理器
   */
  public getViewportPreloadManager(): typeof ViewportPreloadManager {
    return ViewportPreloadManager
  }
}
