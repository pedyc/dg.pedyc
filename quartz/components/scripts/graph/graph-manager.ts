import { simplifySlug } from "../../../util/path"
import { removeAllChildren } from "../utils/util"
import type { D3Config } from "../../Graph"
import type { GraphInitParams, GraphRenderConfig } from "./types"
import { GraphDataService } from "./data-service"
import { GraphRenderer } from "./renderer"

/**
 * 图谱管理器 - 整个图谱系统的入口点和协调器
 */
export class GraphManager {
  private renderer: GraphRenderer | null = null
  private isInitialized = false

  /**
   * 初始化图谱
   * @param params 初始化参数
   */
  async initialize(params: GraphInitParams): Promise<void> {
    const { container, fullSlug, config: userConfig } = params
    const slug = simplifySlug(fullSlug)
    const visited = GraphDataService.getVisited()

    // 清理容器
    removeAllChildren(container)

    try {
      // 解析配置
      const graphConfig = this.parseGraphConfig(container, userConfig)
      const renderConfig: GraphRenderConfig = {
        ...graphConfig,
        visited,
        currentSlug: slug,
        enableDrag: graphConfig.enableDrag ?? true,
        enableZoom: graphConfig.enableZoom ?? true,
      }

      // 获取和处理数据
      const rawData = await GraphDataService.fetchGraphData()
      const graphData = GraphDataService.processGraphData(rawData, {
        showTags: graphConfig.showTags,
        removeTags: graphConfig.removeTags,
        depth: graphConfig.depth,
        currentSlug: slug,
      })

      if (graphData.nodes.length === 0) {
        console.warn("No nodes found in graph data")
        this.showErrorMessage(container, "No graph data available")
        return
      }

      // 创建渲染器并初始化
      this.renderer = new GraphRenderer(container, graphData, renderConfig)
      await this.renderer.initialize()

      this.isInitialized = true
      console.log(`Graph initialized successfully: ${slug}`)
    } catch (error) {
      console.error("Failed to initialize graph:", error)
      this.showErrorMessage(container, "Failed to load graph visualization")
      throw error
    }
  }

  /**
   * 解析图谱配置
   * @param container 容器元素
   * @param userConfig 用户配置
   * @returns 完整的图谱配置
   */
  private parseGraphConfig(
    container: HTMLElement,
    userConfig?: Partial<GraphRenderConfig>,
  ): GraphRenderConfig {
    // 从容器的 data-cfg 属性解析配置
    const datasetConfig = JSON.parse(container.dataset["cfg"] || "{}") as D3Config

    // 默认配置
    const defaultConfig = {
      drag: true,
      zoom: true,
      depth: 1,
      scale: 1.1,
      repelForce: 0.5,
      centerForce: 0.3,
      linkDistance: 30,
      fontSize: 0.6,
      opacityScale: 1,
      removeTags: [],
      showTags: true,
      focusOnHover: true,
      enableRadial: false,
    }

    // 合并配置
    const mergedConfig = {
      ...defaultConfig,
      ...datasetConfig,
      ...userConfig,
    }

    // 确保 enableDrag 和 enableZoom 正确设置
    return {
      ...mergedConfig,
      enableDrag: mergedConfig.drag ?? mergedConfig.enableDrag ?? true,
      enableZoom: mergedConfig.zoom ?? mergedConfig.enableZoom ?? true,
    } as GraphRenderConfig
  }

  /**
   * 显示错误消息
   * @param container 容器元素
   * @param message 错误消息
   */
  private showErrorMessage(container: HTMLElement, message: string): void {
    container.innerHTML = `<div class="graph-error">${message}</div>`
  }

  /**
   * 销毁图谱实例
   */
  destroy(): void {
    if (this.renderer) {
      this.renderer.destroy()
      this.renderer = null
    }
    this.isInitialized = false
  }

  /**
   * 检查是否已初始化
   */
  get initialized(): boolean {
    return this.isInitialized
  }

  /**
   * 获取渲染器实例
   */
  getRenderer(): GraphRenderer | null {
    return this.renderer
  }
}

/**
 * 全局图谱管理器实例
 */
export const globalGraphManager = new GraphManager()
