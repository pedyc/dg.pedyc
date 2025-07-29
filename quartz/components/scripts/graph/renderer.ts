import { Application, Graphics, Text, Container, Circle } from "pixi.js"
import { select, zoom, drag } from "d3"
import type {
  GraphData,
  GraphRenderConfig,
  CSSVariables,
  NodeData,
  SimpleSlug,
  LinkData,
} from "./types"
import { GRAPH_CONSTANTS } from "./constants"
import {
  determineGraphicsAPI,
  getComputedCSSVariables,
  cssColorToHex,
  calculateNodeRadius,
  calculateNodeColor,
  isTagNode,
} from "./utils"
import { SimulationManager } from "./simulation"
import { globalResourceManager } from "../managers"

/**
 * 图谱渲染器类
 */
export class GraphRenderer {
  private app: Application
  private cssVars: CSSVariables
  private nodeGraphics = new Map<SimpleSlug, Graphics>()
  private nodeLabels = new Map<SimpleSlug, Text>()
  private linkGraphics: Graphics[] = []
  private linkRenderData: Array<{
    gfx: Graphics
    simulationData: LinkData
    color: number
    alpha: number
    active: boolean
  }> = []
  private simulationManager: SimulationManager
  private cleanupCallbacks: (() => void)[] = []
  private currentTransform = { k: 1, x: 0, y: 0 }
  private dragStartTime = 0
  private hoveredNodeId: string | null = null

  constructor(
    private container: HTMLElement,
    private graphData: GraphData,
    private config: GraphRenderConfig,
  ) {
    this.app = new Application()
    this.cssVars = getComputedCSSVariables()
    this.simulationManager = new SimulationManager(this.graphData, this.config)
  }

  /**
   * 初始化渲染器
   */
  async initialize(): Promise<void> {
    const width = this.container.offsetWidth
    const height = Math.max(this.container.offsetHeight, GRAPH_CONSTANTS.MIN_HEIGHT)

    try {
      await this.app.init({
        width,
        height,
        antialias: true,
        autoStart: false,
        autoDensity: true,
        backgroundAlpha: 0,
        preference: await determineGraphicsAPI(),
        resolution: window.devicePixelRatio,
        eventMode: "static",
      })
      console.log("PIXI Application initialized successfully")
    } catch (error) {
      console.error("Failed to initialize PIXI Application:", error)
      throw error
    }

    this.container.appendChild(this.app.canvas)
    console.log("Canvas appended to container")

    this.setupContainers()
    this.renderElements()
    this.setupSimulation()
    this.setupInteractions()
    this.registerCleanup()

    // 启动渲染循环
    this.app.start()
    console.log("Render loop started")
  }

  /**
   * 设置容器层级
   */
  private setupContainers(): void {
    const labelsContainer = new Container({ zIndex: 3, isRenderGroup: true })
    const nodeContainer = new Container({ zIndex: 2, isRenderGroup: true })
    const linkContainer = new Container({ zIndex: 1, isRenderGroup: true })

    this.app.stage.addChild(nodeContainer, labelsContainer, linkContainer)

    // 存储容器引用
    // 使用类型断言来添加自定义属性
    ;(this.app.stage as any).userData = {
      nodeContainer,
      labelsContainer,
      linkContainer,
    }
  }

  /**
   * 渲染图形元素
   */
  private renderElements(): void {
    this.renderLinks()
    this.renderNodes()
  }

  /**
   * 渲染链接
   */
  private renderLinks(): void {
    const linkContainer = (this.app.stage as any).userData.linkContainer

    this.graphData.links.forEach((link) => {
      const linkGfx = new Graphics({ interactive: false, eventMode: "none" })
      linkContainer.addChild(linkGfx)
      this.linkGraphics.push(linkGfx)

      // 创建连线渲染数据
      const linkRenderDatum = {
        gfx: linkGfx,
        simulationData: link,
        color: cssColorToHex(this.cssVars["--lightgray"]),
        alpha: 1,
        active: false,
      }

      this.linkRenderData.push(linkRenderDatum)
    })
  }

  /**
   * 渲染节点
   */
  private renderNodes(): void {
    const { nodeContainer, labelsContainer } = (this.app.stage as any).userData

    this.graphData.nodes.forEach((node) => {
      const { nodeGfx, label } = this.createNodeElements(node)

      nodeContainer.addChild(nodeGfx)
      labelsContainer.addChild(label)

      this.nodeGraphics.set(node.id, nodeGfx)
      this.nodeLabels.set(node.id, label)

      this.setupNodeInteractions(nodeGfx, label, node)
    })
  }

  /**
   * 创建节点图形元素
   */
  private createNodeElements(node: NodeData): { nodeGfx: Graphics; label: Text } {
    const nodeId = node.id
    const radius = calculateNodeRadius(node, this.graphData)
    const isTag = isTagNode(nodeId)
    const nodeColor = calculateNodeColor(
      node,
      this.config.currentSlug,
      this.config.visited,
      this.cssVars,
    )

    // 创建文本标签
    const label = new Text({
      interactive: false,
      eventMode: "none",
      text: node.text,
      alpha: 0,
      anchor: GRAPH_CONSTANTS.LABEL_ANCHOR,
      style: {
        fontSize: this.config.fontSize * GRAPH_CONSTANTS.FONT_SIZE_MULTIPLIER,
        fill: cssColorToHex(this.cssVars["--dark"]),
        fontFamily: this.cssVars["--bodyFont"],
      },
      resolution: window.devicePixelRatio * GRAPH_CONSTANTS.DEVICE_PIXEL_RATIO_MULTIPLIER,
    })
    label.scale.set(1 / this.config.scale)

    // 创建节点图形
    const nodeGfx = new Graphics({
      interactive: true,
      label: nodeId,
      eventMode: "static",
      hitArea: new Circle(0, 0, radius),
      cursor: "pointer",
    })
      .circle(0, 0, radius)
      .fill({ color: isTag ? cssColorToHex(this.cssVars["--light"]) : nodeColor })

    if (isTag) {
      nodeGfx.stroke({
        width: GRAPH_CONSTANTS.NODE_STROKE_WIDTH,
        color: cssColorToHex(this.cssVars["--tertiary"]),
      })
    }

    // 设置初始透明度
    nodeGfx.alpha = GRAPH_CONSTANTS.NODE_NORMAL_ALPHA

    return { nodeGfx, label }
  }

  /**
   * 设置节点交互
   */
  private setupNodeInteractions(nodeGfx: Graphics, label: Text, node: NodeData): void {
    // 悬停效果
    nodeGfx.on("pointerover", () => {
      if (this.hoveredNodeId !== node.id) {
        this.hoveredNodeId = node.id
        this.simulationManager.updateConfig({ alphaTarget: 1 })
      }
      nodeGfx.alpha = GRAPH_CONSTANTS.NODE_HOVER_ALPHA
      label.alpha = GRAPH_CONSTANTS.NODE_HOVER_ALPHA
      if (this.config.focusOnHover) {
        nodeGfx.scale.set(GRAPH_CONSTANTS.NODE_HOVER_SCALE)
      }
    })

    nodeGfx.on("pointerout", () => {
      if (this.hoveredNodeId === node.id) {
        this.hoveredNodeId = null
        this.simulationManager.updateConfig({ alphaTarget: 0 })
      }
      nodeGfx.alpha = GRAPH_CONSTANTS.NODE_NORMAL_ALPHA
      label.alpha = 0
      if (this.config.focusOnHover) {
        nodeGfx.scale.set(1)
      }
    })

    // 如果没有启用拖拽，则直接处理点击
    if (!this.config.enableDrag) {
      nodeGfx.on("pointerdown", () => {
        this.navigateToNode(node)
      })
    }
  }

  /**
   * 导航到节点
   */
  private navigateToNode(node: NodeData): void {
    if (node.id.startsWith(GRAPH_CONSTANTS.TAG_PREFIX)) {
      const tagName = node.id.substring(GRAPH_CONSTANTS.TAG_PREFIX.length)
      window.spaNavigate(new URL(`/tags/${tagName}`, window.location.href).pathname as any)
    } else {
      window.spaNavigate(new URL(`/${node.id}`, window.location.href).pathname as any)
    }
  }

  /**
   * 设置力导向图模拟
   */
  private setupSimulation(): void {
    this.simulationManager.initialize((nodes, links) => {
      // 更新节点位置数据，保持原有的节点对象引用
      nodes.forEach((updatedNode) => {
        const existingNode = this.graphData.nodes.find((n) => n.id === updatedNode.id)
        if (existingNode) {
          existingNode.x = updatedNode.x
          existingNode.y = updatedNode.y
          existingNode.vx = updatedNode.vx
          existingNode.vy = updatedNode.vy
          existingNode.fx = updatedNode.fx
          existingNode.fy = updatedNode.fy
        }
      })

      // 更新链接位置数据，保持原有的链接对象引用
      links.forEach((updatedLink, index) => {
        const existingLink = this.graphData.links[index]
        if (existingLink && updatedLink.source && updatedLink.target) {
          existingLink.source = updatedLink.source
          existingLink.target = updatedLink.target
        }
      })

      // 更新渲染位置
      this.updateLinkPositions()
      this.updateNodePositions()
    })

    this.cleanupCallbacks.push(() => {
      this.simulationManager.stop()
    })
  }

  /**
   * 更新链接位置
   */
  private updateLinkPositions(): void {
    const width = this.container.offsetWidth
    const height = Math.max(this.container.offsetHeight, 250)

    this.linkRenderData.forEach((linkRenderDatum, index) => {
      const { gfx, color, alpha } = linkRenderDatum
      // 使用更新后的链接数据而不是初始的 simulationData
      const link = this.graphData.links[index]

      if (
        gfx &&
        link &&
        link.source &&
        link.target &&
        typeof link.source === "object" &&
        typeof link.target === "object" &&
        link.source.x !== undefined &&
        link.source.y !== undefined &&
        link.target.x !== undefined &&
        link.target.y !== undefined
      ) {
        gfx.clear()
        gfx.moveTo(link.source.x + width / 2, link.source.y + height / 2)
        gfx.lineTo(link.target.x + width / 2, link.target.y + height / 2)
        gfx.stroke({
          color: color,
          width: 1,
          alpha: alpha,
        })
      } else {
        console.warn("Link data missing coordinates for rendering:", { link, index })
      }
    })
  }

  /**
   * 更新节点位置
   */
  private updateNodePositions(): void {
    const width = this.container.offsetWidth
    const height = Math.max(this.container.offsetHeight, 250)

    this.graphData.nodes.forEach((node) => {
      const nodeGfx = this.nodeGraphics.get(node.id)
      const label = this.nodeLabels.get(node.id)
      if (nodeGfx && node.x !== undefined && node.y !== undefined) {
        const x = node.x + width / 2
        const y = node.y + height / 2
        nodeGfx.position.set(x, y)
        if (label) {
          label.position.set(x, y)
        }
      } else {
        console.warn("Node data missing coordinates for rendering:", node)
      }
    })
  }

  /**
   * 设置交互功能
   */
  private setupInteractions(): void {
    const d3Container = select(this.app.canvas)

    // 设置拖拽行为
    if (this.config.enableDrag) {
      const dragBehavior = drag<HTMLCanvasElement, unknown>()
        .container(() => this.app.canvas)
        .subject(() => this.graphData.nodes.find((n) => n.id === this.hoveredNodeId))
        .on("start", (event) => {
          this.dragStartTime = Date.now()
          if (!event.active) {
            this.simulationManager.updateConfig({ alphaTarget: 1 })
          }
          if (event.subject) {
            // 存储初始位置，用于计算拖拽偏移
            ;(event.subject as any).__initialDragPos = { x: event.x, y: event.y }
          }
        })
        .on("drag", (event) => {
          if (event.subject) {
            const initPos = (event.subject as any).__initialDragPos
            event.subject.fx = initPos.x + (event.x - initPos.x) / this.currentTransform.k
            event.subject.fy = initPos.y + (event.y - initPos.y) / this.currentTransform.k
          }
        })
        .on("end", (event) => {
          if (!event.active) {
            this.simulationManager.updateConfig({ alphaTarget: 0 })
          }
          if (event.subject) {
            event.subject.fx = null
            event.subject.fy = null
          }
          // Drag ended

          // 如果拖拽时间很短，视为点击
          if (Date.now() - this.dragStartTime < 500 && event.subject) {
            this.navigateToNode(event.subject)
          }
        })

      d3Container.call(dragBehavior)
    }

    // 设置缩放行为
    if (this.config.enableZoom) {
      const width = this.container.offsetWidth
      const height = Math.max(this.container.offsetHeight, 250)

      const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent(GRAPH_CONSTANTS.ZOOM_SCALE_EXTENT)
        .on("zoom", (event) => {
          const { transform } = event
          this.currentTransform = transform
          this.app.stage.scale.set(transform.k)
          this.app.stage.position.set(transform.x, transform.y)

          // 根据缩放调整标签透明度
          const scale = transform.k * this.config.opacityScale
          const scaleOpacity = Math.max((scale - 1) / 3.75, 0)

          this.nodeLabels.forEach((label, nodeId) => {
            const nodeGfx = this.nodeGraphics.get(nodeId)
            if (nodeGfx && nodeGfx.alpha < GRAPH_CONSTANTS.NODE_HOVER_ALPHA) {
              label.alpha = scaleOpacity
            }
          })
        })

      d3Container.call(zoomBehavior)
    }
  }

  /**
   * 注册清理函数
   */
  private registerCleanup(): void {
    const cleanup = () => {
      this.simulationManager.stop()
      if (this.app && this.app.canvas) {
        // 移除 D3 缩放和拖拽行为的事件监听器
        select(this.app.canvas).on(".zoom", null)
        select(this.app.canvas).on(".drag", null)
        this.app.destroy(true, { children: true, texture: true })
      }
    }

    globalResourceManager.instance.addCleanupTask(cleanup)

    // 存储清理函数引用
    this.cleanupCallbacks.push(cleanup)
  }

  /**
   * 手动清理资源
   */
  destroy(): void {
    if (this.cleanupCallbacks.length > 0) {
      // 创建清理函数的副本，避免在清理过程中修改原数组
      const callbacks = [...this.cleanupCallbacks]
      this.cleanupCallbacks = [] // 清空数组，防止重复调用
      callbacks.forEach((cb) => {
        try {
          cb()
        } catch (error) {
          console.error("Error during cleanup:", error)
        }
      })
    }
  }
}
