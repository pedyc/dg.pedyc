/**
 * 图谱组件 - 简化版本
 *
 * 直接使用全局 fetchData，避免复杂的模块化架构导致的时序问题
 */

import type { FullSlug } from "../../../util/path"
import { globalGraphManager } from "../graph/graph-manager"

/**
 * 图谱初始化函数
 * 使用简化的初始化逻辑，直接调用全局图谱管理器
 */
export async function initializeGraph(graph: HTMLElement, fullSlug: FullSlug): Promise<void> {
  try {
    console.log("Initializing graph with simplified logic for:", fullSlug)

    // 使用正确的参数格式调用全局图谱管理器
    await globalGraphManager.initialize({
      container: graph,
      fullSlug: fullSlug,
    })

    console.log("Graph initialized successfully")
  } catch (error) {
    console.error("Failed to initialize graph:", error)
    // 提供降级的错误显示
    graph.innerHTML = '<div class="graph-error">Failed to load graph visualization</div>'
    throw error
  }
}
