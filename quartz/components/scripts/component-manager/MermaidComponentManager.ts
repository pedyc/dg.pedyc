/**
 * Mermaid 组件管理器
 * 管理 Mermaid 图表的懒加载、初始化和清理
 */

import { BaseComponentManager, type ComponentConfig } from "./BaseComponentManager"
import { FullSlug, getFullSlug } from "../../../util/path"

interface MermaidConfig extends ComponentConfig {
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
  /** 是否启用批量处理 */
  enableBatchProcessing?: boolean
}

interface MermaidState {
  initialized: boolean
  eventListenersSetup: boolean
  elements: Set<HTMLElement>
  cleanupTasks: Array<() => void>
  currentSlug: FullSlug | null
  loadingStates: Map<HTMLElement, boolean>
  currentObserver: IntersectionObserver | null
  mermaidModulePromise: Promise<typeof import("../mermaid.bundle")> | null
}

/**
 * Mermaid 组件管理器
 * 统一管理 Mermaid 图表的所有功能
 */
export class MermaidComponentManager extends BaseComponentManager<MermaidConfig, MermaidState> {
  constructor(config: Partial<MermaidConfig> = {}) {
    super({
      name: "Mermaid",
      debug: false,
      enableLazyLoad: true,
      lazyLoadRootMargin: "100px",
      lazyLoadThreshold: 0.1,
      enablePreload: true,
      preloadDelay: 3000,
      enableBatchProcessing: true,
      cacheConfig: {
        prefix: "mermaid",
        ttl: 1800000, // 30分钟
      },
      ...config,
    })

    // 初始化状态
    this.state.currentSlug = null
    this.state.loadingStates = new Map()
    this.state.currentObserver = null
    this.state.mermaidModulePromise = null
  }

  /**
   * 查找 Mermaid 代码块元素
   */
  protected findComponentElements(): HTMLElement[] {
    const center = document.querySelector(".center") as HTMLElement
    if (!center) {
      return []
    }
    return Array.from(center.querySelectorAll<HTMLElement>("code.mermaid"))
  }

  /**
   * 组件初始化
   */
  protected async onInitialize(): Promise<void> {
    this.state.currentSlug = getFullSlug(window)
    this.log("Mermaid component initialized for slug:", this.state.currentSlug)
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // Mermaid 组件暂时不需要额外的事件监听器
    this.log("Mermaid event listeners setup completed")
  }

  /**
   * 设置页面元素
   */
  protected onSetupPage(elements: HTMLElement[]): void {
    if (elements.length === 0) {
      this.log("No Mermaid code blocks found")
      return
    }

    // 清理之前的 observer
    this.cleanupObserver()

    if (this.config.enableLazyLoad) {
      this.setupLazyLoading(elements)
    } else {
      // 直接初始化所有元素
      this.initializeMermaidElements(elements)
    }

    // 预加载 Mermaid 模块
    if (this.config.enablePreload) {
      this.schedulePreload()
    }

    this.log(`Mermaid page setup completed: ${elements.length} elements found`)
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    // 清理所有 Mermaid 状态
    this.state.loadingStates.clear()
    this.state.currentSlug = null
    this.state.mermaidModulePromise = null

    // 清理 observer
    this.cleanupObserver()

    this.log("Mermaid cleanup completed")
  }

  /**
   * 设置懒加载
   */
  private setupLazyLoading(elements: HTMLElement[]): void {
    this.state.currentObserver = new IntersectionObserver(
      (entries) => {
        if (this.config.enableBatchProcessing) {
          // 批量处理可见的节点
          const visibleNodes: HTMLElement[] = []
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const mermaidNode = entry.target as HTMLElement
              this.state.currentObserver?.unobserve(mermaidNode)
              visibleNodes.push(mermaidNode)
            }
          })

          if (visibleNodes.length > 0) {
            this.initializeMermaidElements(visibleNodes)
          }
        } else {
          // 单独处理每个节点
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const mermaidNode = entry.target as HTMLElement
              this.state.currentObserver?.unobserve(mermaidNode)
              this.initializeMermaidElements([mermaidNode])
            }
          })
        }
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
   * 初始化 Mermaid 图表
   */
  private async initializeMermaidElements(nodes: HTMLElement[]): Promise<void> {
    if (nodes.length === 0) {
      return
    }

    // 防止重复初始化
    const firstNode = nodes[0]
    if (this.state.loadingStates.get(firstNode)) {
      return
    }

    this.state.loadingStates.set(firstNode, true)

    try {
      // 动态加载 Mermaid 模块
      const mermaidModule = await this.preloadMermaidModule()

      // 初始化 Mermaid
      await mermaidModule.initializeMermaid()

      this.log(`Mermaid initialized successfully for ${nodes.length} elements`)
    } catch (error) {
      this.error("Failed to load mermaid module:", error)
    } finally {
      this.state.loadingStates.set(firstNode, false)
    }
  }

  /**
   * 预加载 Mermaid 模块
   */
  private preloadMermaidModule(): Promise<typeof import("../mermaid.bundle")> {
    if (!this.state.mermaidModulePromise) {
      this.state.mermaidModulePromise = import("../mermaid.bundle")
    }
    return this.state.mermaidModulePromise
  }

  /**
   * 调度预加载
   */
  private schedulePreload(): void {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        this.preloadMermaidModule().catch(() => {
          // 静默处理预加载失败
        })
      })
    } else {
      // 降级方案：延迟预加载
      setTimeout(() => {
        this.preloadMermaidModule().catch(() => {
          // 静默处理预加载失败
        })
      }, this.config.preloadDelay)
    }
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
}
