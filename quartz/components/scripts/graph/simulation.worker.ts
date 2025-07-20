// simulation.worker.ts
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceRadial } from "d3"
import type { GraphData, GraphRenderConfig, NodeData, LinkData } from "./types"

let simulation: d3.Simulation<NodeData, LinkData> | null = null

/**
 * 初始化并运行 D3 力导向图模拟。
 * @param graphData 图谱数据，包含节点和链接。
 * @param config 渲染配置，包含模拟参数。


 */
let graphNodes: NodeData[] = []
let graphLinks: LinkData[] = []
let currentConfig: GraphRenderConfig | null = null

/**
 * 初始化并运行 D3 力导向图模拟。
 * @param nodes 节点数据。
 * @param links 链接数据。
 * @param config 渲染配置，包含模拟参数。
 */
function initializeSimulation(nodes: NodeData[], links: LinkData[], config: GraphRenderConfig) {
  let initialAlphaTarget = 0.001 // 默认值
  if (simulation) {
    initialAlphaTarget = simulation.alphaTarget() // 保存当前的 alphaTarget
    simulation.stop()
  }

  graphNodes = nodes
  graphLinks = links
  currentConfig = config

  simulation = forceSimulation(graphNodes)
    .force(
      "link",
      forceLink(graphLinks)
        .id((d: any) => d.id)
        .distance(config.linkDistance),
    )
    .force("charge", forceManyBody().strength(config.repelForce))
    .force("center", forceCenter(0, 0))

  if (config.enableRadial) {
    simulation.force("radial", forceRadial(config.linkDistance * 2))
  }

  simulation.on("tick", () => {
    // 直接发送节点数据，D3已经更新了位置信息
    const nodesToSend = graphNodes.map((node) => ({
      id: node.id,
      text: node.text,
      tags: node.tags,
      x: node.x || 0,
      y: node.y || 0,
      vx: node.vx || 0,
      vy: node.vy || 0,
      fx: node.fx,
      fy: node.fy,
    }))

    // 发送链接数据，确保 source 和 target 包含位置信息
    const linksToSend = graphLinks.map((link) => {
      // D3 模拟后，source 和 target 已经是节点对象引用
      const sourceNode = link.source as NodeData
      const targetNode = link.target as NodeData

      return {
        source: {
          id: sourceNode.id,
          text: sourceNode.text,
          tags: sourceNode.tags,
          x: sourceNode.x || 0,
          y: sourceNode.y || 0,
          vx: sourceNode.vx || 0,
          vy: sourceNode.vy || 0,
          fx: sourceNode.fx,
          fy: sourceNode.fy,
        },
        target: {
          id: targetNode.id,
          text: targetNode.text,
          tags: targetNode.tags,
          x: targetNode.x || 0,
          y: targetNode.y || 0,
          vx: targetNode.vx || 0,
          vy: targetNode.vy || 0,
          fx: targetNode.fx,
          fy: targetNode.fy,
        },
      }
    })

    self.postMessage({
      nodes: nodesToSend,
      links: linksToSend,
    })
  })

  simulation.alphaTarget(initialAlphaTarget).restart()
}

/**
 * 更新模拟配置。
 * @param newConfig 新的配置。
 */
function updateSimulationConfig(newConfig: Partial<GraphRenderConfig>) {
  if (!simulation || !currentConfig) return

  currentConfig = { ...currentConfig, ...newConfig }

  // 更新力参数
  if (newConfig.repelForce !== undefined) {
    ;(simulation.force("charge") as d3.ForceManyBody<NodeData>).strength(newConfig.repelForce)
  }
  if (newConfig.linkDistance !== undefined) {
    ;(simulation.force("link") as d3.ForceLink<NodeData, LinkData>).distance(newConfig.linkDistance)
  }
  if (newConfig.enableRadial !== undefined) {
    if (newConfig.enableRadial) {
      simulation.force("radial", forceRadial(currentConfig.linkDistance * 2))
    } else {
      simulation.force("radial", null)
    }
  }

  // 更新 alphaTarget 并重启模拟
  if (newConfig.alphaTarget !== undefined) {
    simulation.alphaTarget(newConfig.alphaTarget).restart()
  }
}

/**
 * 停止模拟。
 */
function stopSimulation() {
  if (simulation) {
    simulation.stop()
    simulation = null
  }
}

/**
 * Web Worker 消息处理器。
 */
self.onmessage = (
  event: MessageEvent<{
    type: "initialize" | "updateConfig" | "stop" | "restart"
    graphData?: GraphData
    config?: GraphRenderConfig
    newConfig?: Partial<GraphRenderConfig>
  }>,
) => {
  const { type, graphData, config, newConfig } = event.data

  switch (type) {
    case "initialize":
      if (graphData && config) {
        initializeSimulation(graphData.nodes, graphData.links, config)
      }
      break
    case "updateConfig":
      if (newConfig) {
        updateSimulationConfig(newConfig)
      }
      break
    case "stop":
      stopSimulation()
      break
    case "restart":
      if (graphNodes.length > 0 && graphLinks.length > 0 && currentConfig) {
        initializeSimulation(graphNodes, graphLinks, currentConfig)
      }
      break
    default:
      console.warn("Unknown message type:", type)
  }
}
