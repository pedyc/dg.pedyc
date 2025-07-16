/**
 * Graph 组件管理器
 * 管理图谱可视化的懒加载、初始化和清理
 */

import { BaseComponentManager, type ComponentConfig } from "./BaseComponentManager"
import { FullSlug, getFullSlug } from "../../../util/path"
import { registerEscapeHandler } from "../utils/util"
import { globalGraphManagerInstance } from "../graph/global-graph-manager"

interface GraphConfig extends ComponentConfig {
  /** 是否启用懒加载 */
  enableLazyLoad?: boolean
  /** 懒加载的根边距 */
  lazyLoadRootMargin?: string
  /** 懒加载的阈值 */
  lazyLoadThreshold?: number
  /** 是否启用预加载 */
  enablePreload?: boolean
  /** 预加载延迟时间（毫秒） */
  preloadDelay?: number
}

interface GraphState {
  initialized: boolean
  eventListenersSetup: boolean
  elements: Set<HTMLElement>
  cleanupTasks: Array<() => void>
  currentSlug: FullSlug | null
  loadingStates: Map<HTMLElement, boolean>
  initializedStates: Map<HTMLElement, boolean>
  currentObserver: IntersectionObserver | null
  graphModulePromise: Promise<typeof import("../lazy/graph")> | null
}

/**
 * Graph 组件管理器
 * 统一管理图谱可视化的所有功能
 */
export class GraphComponentManager extends BaseComponentManager<GraphConfig, GraphState> {
  constructor(config: Partial<GraphConfig> = {}) {
    super({
      name: "Graph",
      debug: false,
      enableLazyLoad: true,
      lazyLoadRootMargin: "50px",
      lazyLoadThreshold: 0.1,
      enablePreload: true,
      preloadDelay: 2000,
      cacheConfig: {
        prefix: "graph",
        ttl: 1800000, // 30分钟
      },
      ...config,
    })

    // 初始化状态
    this.state.currentSlug = null
    this.state.loadingStates = new Map()
    this.state.initializedStates = new Map()
    this.state.currentObserver = null
    this.state.graphModulePromise = null
  }

  /**
   * 查找图谱容器元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(".graph-container, .global-graph-container"),
    )
  }

  /**
   * 组件初始化
   */
  protected async onInitialize(): Promise<void> {
    this.state.currentSlug = getFullSlug(window)

    // 初始化全局图谱管理器
    globalGraphManagerInstance.initialize()

    this.log("Graph component initialized for slug:", this.state.currentSlug)
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // 注册 ESC 键处理
    this.setupEscapeHandler()
  }

  /**
   * 设置页面元素
   */
  protected onSetupPage(elements: HTMLElement[]): void {
    if (elements.length === 0) {
      this.log("No graph containers found")
      return
    }

    // 清理之前的 observer
    this.cleanupObserver()

    // 过滤出未初始化的图谱元素
    const uninitializedElements = elements.filter(
      (element) => !this.state.initializedStates.get(element),
    )

    if (uninitializedElements.length === 0) {
      this.log("All graph elements already initialized, skipping setup")
      return
    }

    if (this.config.enableLazyLoad) {
      this.setupLazyLoading(uninitializedElements)
    } else {
      // 直接初始化所有元素
      uninitializedElements.forEach((element) => {
        this.initializeGraphElement(element)
      })
    }

    // 预加载图谱模块
    if (this.config.enablePreload) {
      this.schedulePreload()
    }

    this.log(`Graph page setup completed: ${uninitializedElements.length} elements to initialize`)
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    // 清理所有图谱状态
    this.state.loadingStates.clear()
    this.state.initializedStates.clear()
    this.state.currentSlug = null
    this.state.graphModulePromise = null

    // 清理 observer
    this.cleanupObserver()

    this.log("Graph cleanup completed")
  }

  /**
   * 设置懒加载
   */
  private setupLazyLoading(elements: HTMLElement[]): void {
    this.state.currentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const graphElement = entry.target as HTMLElement
            this.state.currentObserver?.unobserve(graphElement)
            this.initializeGraphElement(graphElement)
          }
        })
      },
      {
        rootMargin: this.config.lazyLoadRootMargin,
        threshold: this.config.lazyLoadThreshold,
      },
    )

    elements.forEach((element) => {
      this.state.currentObserver?.observe(element)
    })

    // 注册清理任务
    this.addCleanupTask(() => {
      this.cleanupObserver()
    })
  }

  /**
   * 初始化图谱元素
   */
  private async initializeGraphElement(graphElement: HTMLElement): Promise<void> {
    // 防止重复初始化
    if (
      this.state.loadingStates.get(graphElement) ||
      this.state.initializedStates.get(graphElement)
    ) {
      return
    }

    this.state.loadingStates.set(graphElement, true)

    try {
      // 显示加载状态
      this.showLoadingState(graphElement)

      // 动态加载图谱模块
      const graphModule = await this.preloadGraphModule()

      // 初始化图谱
      if (this.state.currentSlug) {
        await graphModule.initializeGraph(graphElement, this.state.currentSlug)
      }

      // 标记为已初始化
      this.state.initializedStates.set(graphElement, true)
      this.log("Graph initialized successfully for element:", graphElement.className)
    } catch (error) {
      this.error("Failed to load graph module:", error)
      this.showErrorState(graphElement)
    } finally {
      this.state.loadingStates.set(graphElement, false)
    }
  }

  /**
   * 预加载图谱模块
   */
  private preloadGraphModule(): Promise<typeof import("../lazy/graph")> {
    if (!this.state.graphModulePromise) {
      this.state.graphModulePromise = import("../lazy/graph")
    }
    return this.state.graphModulePromise
  }

  /**
   * 调度预加载
   */
  private schedulePreload(): void {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        this.preloadGraphModule().catch(() => {
          // 静默处理预加载失败
        })
      })
    } else {
      // 降级方案：延迟预加载
      setTimeout(() => {
        this.preloadGraphModule().catch(() => {
          // 静默处理预加载失败
        })
      }, this.config.preloadDelay)
    }
  }

  /**
   * 显示加载状态
   */
  private showLoadingState(element: HTMLElement): void {
    element.innerHTML = `
      <div class="graph-loading">
        <div class="loading-spinner"></div>
        <p>Loading graph visualization...</p>
      </div>
    `
  }

  /**
   * 显示错误状态
   */
  private showErrorState(element: HTMLElement): void {
    element.innerHTML = `
      <div class="graph-error">
        <p>Failed to load graph visualization</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `
  }

  /**
   * 清理观察器
   */
  private cleanupObserver(): void {
    if (this.state.currentObserver) {
      this.state.currentObserver.disconnect()
      this.state.currentObserver = null
    }
  }

  /**
   * 设置 ESC 键处理
   */
  private setupEscapeHandler(): void {
    registerEscapeHandler(document as unknown as HTMLElement, () => {
      // 图谱相关的 ESC 键处理逻辑
      const activeGraphs = document.querySelectorAll(".graph.active")
      activeGraphs.forEach((graph) => {
        graph.classList.remove("active")
      })
    })
  }
}
