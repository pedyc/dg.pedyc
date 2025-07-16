/**
 * 搜索组件管理器
 * 基于 BaseComponentManager 的统一事件管理实现
 */

import { BaseComponentManager, ComponentState, type ComponentConfig } from "./BaseComponentManager"
import { FullSlug, getFullSlug } from "../../../util/path"
import { registerEscapeHandler } from "../utils/util"

// 搜索懒加载状态管理
const searchLoadingStates = new Map<HTMLElement, boolean>()
let searchModulePromise: Promise<typeof import("../lazy/search")> | null = null

// 搜索组件配置接口
interface SearchConfig extends ComponentConfig {
  name: string
  debug?: boolean
  cacheConfig?: {
    prefix: string
    ttl: number
  }
}

// 搜索组件状态接口
interface SearchState {
  elements: Set<HTMLElement>
  currentSlug: FullSlug | null
}

/**
 * 搜索组件管理器
 */
export class SearchComponentManager extends BaseComponentManager<
  SearchConfig,
  SearchState & ComponentState
> {
  private currentSlug: FullSlug | null = null
  private static readonly SELECTORS = {
    SEARCH_ROOT: ".search",
    SEARCH_INPUT: ".search-bar",
    SEARCH_BUTTON: ".search-button",
    SEARCH_CONTAINER_ACTIVE: ".search-container.active",
  }

  constructor() {
    super({
      name: "Search",
      debug: true, // 开发环境下启用调试
      cacheConfig: {
        prefix: "search",
        ttl: 1800000, // 30分钟
      },
    })
  }

  /**
   * 查找搜索组件元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(SearchComponentManager.SELECTORS.SEARCH_ROOT),
    )
  }

  /**
   * 组件特定的初始化逻辑
   */
  protected async onInitialize(): Promise<void> {
    // 初始化状态
    ;(this.state as any).elements = new Set<HTMLElement>()
    ;(this.state as any).currentSlug = getFullSlug(window)

    this.currentSlug = (this.state as any).currentSlug
    this.log("Current slug:", this.currentSlug)

    // 预加载搜索模块（在空闲时间）
    this.schedulePreload()
  }

  /**
   * 组件特定的事件监听器设置
   */
  protected onSetupEventListeners(): void {
    // 注册 ESC 键处理
    registerEscapeHandler(document.documentElement, () => {
      this.handleEscapeKey()
    })

    // 键盘快捷键支持 (Ctrl/Cmd + K)
    this.addEventListener(document as any, "keydown", (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        this.activateFirstSearchElement()
      }
    })
  }

  /**
   * 组件特定的页面设置逻辑
   */
  protected onSetupPage(elements: HTMLElement[]): void {
    this.currentSlug = getFullSlug(window)

    if (elements.length === 0) {
      this.log("No search elements found on this page")
      return
    }

    elements.forEach((element) => {
      this.setupSearchElement(element)
    })

    this.log(`Setup completed for ${elements.length} search elements`)
  }

  /**
   * 组件特定的清理逻辑
   */
  protected onCleanup(): void {
    // 清理搜索加载状态
    searchLoadingStates.clear()

    // 重置模块 Promise
    searchModulePromise = null

    this.log("Search component cleanup completed")
  }

  /**
   * 设置单个搜索元素
   */
  private setupSearchElement(element: HTMLElement): void {
    // 检查是否已经初始化
    if (searchLoadingStates.has(element)) {
      this.log("Search element already setup, skipping")
      return
    }

    // 查找搜索输入框和图标
    const searchInput = element.querySelector<HTMLInputElement>(
      SearchComponentManager.SELECTORS.SEARCH_INPUT,
    )
    const searchIcon = element.querySelector(SearchComponentManager.SELECTORS.SEARCH_BUTTON)

    // 设置懒加载触发器
    if (searchInput) {
      this.setupInputTriggers(element, searchInput)
    }

    if (searchIcon) {
      this.setupIconTrigger(element, searchIcon)
    }

    // 标记为已设置
    searchLoadingStates.set(element, false)
    this.log("Search element setup completed")
  }

  /**
   * 设置输入框触发器
   */
  private setupInputTriggers(element: HTMLElement, input: HTMLInputElement): void {
    const initOnFirstInteraction = () => {
      this.initializeSearchElement(element)
      this.removeInputTriggers(input, initOnFirstInteraction)
    }

    this.addEventListener(input, "focus", initOnFirstInteraction)
    this.addEventListener(input, "input", initOnFirstInteraction)

    // 保存清理函数
    this.addCleanupTask(() => {
      this.removeInputTriggers(input, initOnFirstInteraction)
    })
  }

  /**
   * 移除输入框触发器
   */
  private removeInputTriggers(input: HTMLInputElement, handler: () => void): void {
    input.removeEventListener("focus", handler)
    input.removeEventListener("input", handler)
  }

  /**
   * 设置图标触发器
   */
  private setupIconTrigger(element: HTMLElement, icon: Element): void {
    const initOnIconClick = () => {
      this.initializeSearchElement(element)
      icon.removeEventListener("click", initOnIconClick)
    }

    this.addEventListener(icon as HTMLElement, "click", initOnIconClick)

    // 保存清理函数
    this.addCleanupTask(() => {
      icon.removeEventListener("click", initOnIconClick)
    })
  }

  /**
   * 初始化搜索元素的懒加载
   */
  private async initializeSearchElement(element: HTMLElement): Promise<void> {
    // 防止重复初始化
    if (searchLoadingStates.get(element)) {
      this.log("Search element already loading, skipping")
      return
    }

    searchLoadingStates.set(element, true)

    try {
      this.log("Initializing search element...")

      // 显示加载状态
      this.showLoadingState(element)

      // 动态加载搜索模块
      const searchModule = await this.loadSearchModule()

      // 初始化搜索
      await searchModule.initializeSearch(element, this.currentSlug!)

      // 恢复搜索输入
      this.restoreSearchInput(element)

      // 激活搜索容器
      const container = element.querySelector(
        SearchComponentManager.SELECTORS.SEARCH_ROOT,
      ) as HTMLElement
      if (container) {
        container.classList.add("active")
      }

      this.log("Search element initialized successfully")
    } catch (error) {
      this.error("Failed to load search module:", error)
      this.showErrorState(element)
    } finally {
      searchLoadingStates.set(element, false)
    }
  }

  /**
   * 显示加载状态
   */
  private showLoadingState(element: HTMLElement): void {
    const searchInput = element.querySelector<HTMLInputElement>(
      SearchComponentManager.SELECTORS.SEARCH_INPUT,
    )
    if (searchInput) {
      searchInput.setAttribute("placeholder", "Loading search...")
      searchInput.setAttribute("disabled", "true")
    }
  }

  /**
   * 恢复搜索输入状态
   */
  private restoreSearchInput(element: HTMLElement): void {
    const searchInput = element.querySelector<HTMLInputElement>(
      SearchComponentManager.SELECTORS.SEARCH_INPUT,
    )
    if (searchInput) {
      searchInput.removeAttribute("disabled")
      searchInput.setAttribute("placeholder", "Search...")
    }
  }

  /**
   * 显示错误状态
   */
  private showErrorState(element: HTMLElement): void {
    const searchInput = element.querySelector<HTMLInputElement>(
      SearchComponentManager.SELECTORS.SEARCH_INPUT,
    )
    if (searchInput) {
      searchInput.setAttribute("placeholder", "Search failed to load")
      searchInput.removeAttribute("disabled")
    }
  }

  /**
   * 加载搜索模块
   */
  private async loadSearchModule(): Promise<typeof import("../lazy/search")> {
    if (!searchModulePromise) {
      searchModulePromise = import("../lazy/search")
    }
    return searchModulePromise
  }

  /**
   * 调度预加载
   */
  private schedulePreload(): void {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        this.loadSearchModule().catch(() => {
          // 静默处理预加载失败
          this.log("Search module preload failed (silent)")
        })
      })
    } else {
      // 降级方案：延迟预加载
      setTimeout(() => {
        this.loadSearchModule().catch(() => {
          // 静默处理预加载失败
          this.log("Search module preload failed (silent)")
        })
      }, 3000)
    }
  }

  /**
   * 处理 ESC 键
   */
  private handleEscapeKey(): void {
    const activeSearches = document.querySelectorAll(SearchComponentManager.SELECTORS.SEARCH_ROOT)

    activeSearches.forEach((search) => {
      search.classList.remove("active")
      const searchInput = search.querySelector<HTMLInputElement>(
        SearchComponentManager.SELECTORS.SEARCH_INPUT,
      )
      if (searchInput) {
        searchInput.value = ""
        searchInput.blur()
      }
    })

    this.log("ESC key handled, closed active searches")
  }

  /**
   * 激活第一个搜索元素（用于快捷键）
   */
  private activateFirstSearchElement(): void {
    const elements = this.findComponentElements()
    if (elements.length > 0) {
      this.initializeSearchElement(elements[0])

      // 激活搜索容器
      const container = elements[0].querySelector(
        SearchComponentManager.SELECTORS.SEARCH_ROOT,
      ) as HTMLElement
      if (container) {
        container.classList.add("active")
      }

      // 聚焦到搜索输入框
      const searchInput = elements[0].querySelector<HTMLInputElement>(
        SearchComponentManager.SELECTORS.SEARCH_INPUT,
      )
      if (searchInput) {
        searchInput.focus()
      }

      this.log("Activated first search element via shortcut")
    }
  }

  /**
   * 获取搜索相关的缓存统计
   */
  public getSearchStats(): {
    loadingElements: number
    totalElements: number
    cacheHits: number
  } {
    const loadingElements = Array.from(searchLoadingStates.values()).filter(
      (loading) => loading,
    ).length

    return {
      loadingElements,
      totalElements: (this.state as any).elements?.size || 0,
      cacheHits: 0, // TODO: 实现缓存命中统计
    }
  }
}

// 创建并导出单例实例
export const searchComponentManager = new SearchComponentManager()
