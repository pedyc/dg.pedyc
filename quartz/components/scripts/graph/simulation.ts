import { NodeData, LinkData, GraphData, GraphRenderConfig } from "./types"

/**
 * 物理模拟管理器
 * 负责与 Web Worker 进行通信，管理图谱的力导向模拟。
 */
export class SimulationManager {
  private worker: Worker | null = null
  private onTickCallback: ((nodes: NodeData[], links: LinkData[]) => void) | null = null

  constructor(
    private graphData: GraphData,
    private config: GraphRenderConfig,
  ) {}

  /**
   * 初始化并启动 Web Worker 中的力导向图模拟。
   * @param onTickCallback 模拟每次 "tick" 更新时调用的回调函数。
   */
  initialize(onTickCallback: (nodes: NodeData[], links: LinkData[]) => void): void {
    // 如果已经存在 worker，先终止它
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }

    this.onTickCallback = onTickCallback
    this.worker = new Worker("/simulation.worker.js", { type: "module" })

    this.worker.onmessage = (event: MessageEvent<{ nodes: NodeData[]; links: LinkData[] }>) => {
      if (this.onTickCallback) {
        this.onTickCallback(event.data.nodes, event.data.links)
      }
    }

    this.worker.postMessage({
      type: "initialize",
      graphData: this.graphData,
      config: this.config,
    })
  }

  /**
   * 停止模拟。
   */
  stop(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }

  /**
   * 重启模拟。
   */
  restart(): void {
    if (this.worker) {
      this.worker.postMessage({ type: "restart" })
    }
  }

  /**
   * 更新模拟配置。
   * @param newConfig 新的配置。
   */
  updateConfig(newConfig: Partial<GraphRenderConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (this.worker) {
      // 向 worker 发送更新配置的消息
      this.worker.postMessage({
        type: "updateConfig",
        newConfig: newConfig,
      })
    }
  }

  /**
   * 获取当前模拟实例（在 Web Worker 中，此方法不再直接返回 D3 Simulation 实例）。
   * @returns 始终返回 null，因为模拟在 Web Worker 中运行。
   */
  getSimulation(): null {
    return null
  }
}
