import { registerEscapeHandler } from "../utils/util"
import { GraphRenderer } from "./renderer"
import { getFullSlug, simplifySlug } from "../../../util/path"
import { GraphData } from "./types"
import { globalResourceManager } from "../managers"

/**
 * 全局图谱管理器
 * 负责处理全局图谱的显示、隐藏和交互逻辑
 */
export class GlobalGraphManager {
  private globalGraphCleanups: (() => void)[] = []
  private isInitialized = false
  private currentRenderer: GraphRenderer | null = null

  /**
   * 初始化全局图谱功能
   */
  initialize(): void {
    if (this.isInitialized) {
      return
    }

    this.setupGlobalGraphHandlers()
    this.setupKeyboardShortcuts()
    this.setupIconClickHandlers()
    this.isInitialized = true

    console.log("Global graph manager initialized")
  }

  /**
   * 设置全局图谱处理器
   */
  private setupGlobalGraphHandlers(): void {
    const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]

    if (containers.length === 0) {
      console.warn("No global graph containers found")
      return
    }

    // 渲染全局图谱
    const renderGlobalGraph = async (): Promise<void> => {
      const slug = getFullSlug(window)

      for (const container of containers) {
        container.classList.add("active")
        const sidebar = container.closest(".sidebar") as HTMLElement
        if (sidebar) {
          sidebar.style.zIndex = "1"
        }

        const graphContainer = container.querySelector(".global-graph-container") as HTMLElement
        if (graphContainer) {
          registerEscapeHandler(container, this.hideGlobalGraph.bind(this))

          try {
            // 全局图谱不需要传入实际的 graphData，因为 GraphRenderer 内部会根据 fullSlug 获取数据
            // 这里传入一个空的 GraphData 对象，以满足类型要求
            // 清理现有资源
            this.cleanupGlobalGraphs()

            const emptyGraphData: GraphData = { nodes: [], links: [] }
            this.currentRenderer = new GraphRenderer(graphContainer, emptyGraphData, {
              depth: -1,
              showTags: true,
              enableDrag: true,
              enableZoom: true,
              // 补充 GraphRenderConfig 中缺少的属性，使用默认值或根据需要调整
              scale: 1,
              repelForce: 1,
              centerForce: 1,
              linkDistance: 30,
              fontSize: 16,
              opacityScale: 1,
              removeTags: [],
              focusOnHover: true,
              enableRadial: false,
              currentSlug: simplifySlug(slug),
              visited: new Set(),
            })
            await this.currentRenderer.initialize()

            // 注册清理函数
            this.globalGraphCleanups.push(() => {
              if (this.currentRenderer) {
                this.currentRenderer.destroy()
                this.currentRenderer = null
              }
            })

            console.log("Global graph rendered successfully")
          } catch (error) {
            console.error("Failed to render global graph:", error)
            graphContainer.innerHTML = '<div class="graph-error">Failed to load global graph</div>'
          }
        }
      }
    }

    // 存储渲染函数供外部调用
    this.renderGlobalGraph = renderGlobalGraph
  }

  /**
   * 隐藏全局图谱
   */
  private hideGlobalGraph(): void {
    this.cleanupGlobalGraphs()
    const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]

    for (const container of containers) {
      container.classList.remove("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = ""
      }
    }

    console.log("Global graph hidden")
  }

  /**
   * 清理全局图谱资源
   */
  private cleanupGlobalGraphs(): void {
    if (this.globalGraphCleanups.length > 0) {
      // 创建清理函数的副本，避免在清理过程中修改原数组
      const cleanups = [...this.globalGraphCleanups]
      this.globalGraphCleanups = [] // 清空数组，防止重复调用

      cleanups.forEach((cleanup) => {
        try {
          cleanup()
        } catch (error) {
          console.error("Error during global graph cleanup:", error)
        }
      })
    }

    // 确保当前渲染器被清理
    if (this.currentRenderer) {
      try {
        this.currentRenderer.destroy()
      } catch (error) {
        console.error("Error destroying current renderer:", error)
      }
      this.currentRenderer = null
    }
  }

  /**
   * 设置键盘快捷键
   */
  private setupKeyboardShortcuts(): void {
    const shortcutHandler = (e: KeyboardEvent): void => {
      if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        const containers = [
          ...document.getElementsByClassName("global-graph-outer"),
        ] as HTMLElement[]
        const anyGlobalGraphOpen = containers.some((container) =>
          container.classList.contains("active"),
        )

        if (anyGlobalGraphOpen) {
          this.hideGlobalGraph()
        } else {
          this.renderGlobalGraph?.()
        }
      }
    }

    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    document.addEventListener("keydown", shortcutHandler)

    // 注册清理函数
    globalResourceManager.instance.addCleanupTask(() => {
      document.removeEventListener("keydown", shortcutHandler)
      this.cleanupGlobalGraphs()
    })
  }

  /**
   * 设置图标点击处理器
   */
  private setupIconClickHandlers(): void {
    const containerIcons = document.getElementsByClassName("global-graph-icon")

    Array.from(containerIcons).forEach((icon) => {
      const clickHandler = () => {
        this.renderGlobalGraph?.()
      }

      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      icon.addEventListener("click", clickHandler)

      globalResourceManager.instance.addCleanupTask(() => {
        icon.removeEventListener("click", clickHandler)
      })
    })

    console.log(`Setup ${containerIcons.length} global graph icon handlers`)
  }

  /**
   * 渲染全局图谱（由setupGlobalGraphHandlers设置）
   */
  private renderGlobalGraph?: () => Promise<void>

  /**
   * 销毁全局图谱管理器
   */
  destroy(): void {
    this.cleanupGlobalGraphs()
    if (this.currentRenderer) {
      this.currentRenderer.destroy()
      this.currentRenderer = null
    }
    this.isInitialized = false
  }
}

/**
 * 全局图谱管理器实例
 */
export const globalGraphManagerInstance = new GlobalGraphManager()
