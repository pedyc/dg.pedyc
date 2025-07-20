/**
 * 图谱模块入口文件
 *
 * 重构后的图谱模块采用模块化架构，将原本的单一文件拆分为多个职责清晰的模块：
 *
 * - types.ts: 类型定义
 * - constants.ts: 常量配置
 * - utils.ts: 工具函数
 * - data-service.ts: 数据服务
 * - simulation.ts: 物理模拟管理
 * - renderer.ts: 图形渲染
 * - graph-manager.ts: 主管理器
 *
 * 这种架构提供了更好的：
 * - 代码可读性和可维护性
 * - 模块间的职责分离
 * - 单元测试支持
 * - 代码复用性
 */

// 导出核心类型
export type {
  NodeData,
  SimpleLinkData,
  LinkData,
  GraphData,
  GraphRenderConfig,
  GraphInitParams,
  CSSVariables,
} from "./types"

// 导出常量
export { GRAPH_CONSTANTS, CSS_VARIABLES, STORAGE_KEYS } from "./constants"

// 导出工具函数
export {
  cssColorToHex,
  getComputedCSSVariables,
  calculateNodeRadius,
  calculateNodeColor,
  isTagNode,
  getTagDisplayText,
  determineGraphicsAPI,
} from "./utils"

// 导出服务类
export { GraphDataService } from "./data-service"
export { SimulationManager } from "./simulation"
export { GraphRenderer } from "./renderer"
export { GraphManager, globalGraphManager } from "./graph-manager"

// 导出主要的初始化函数（向后兼容）
import type { FullSlug } from "../../../util/path"
import { globalGraphManager } from "./graph-manager"

/**
 * 初始化图谱渲染（向后兼容的API）
 * @param graph 图谱容器元素
 * @param fullSlug 当前页面的完整 slug
 */
export async function initializeGraph(graph: HTMLElement, fullSlug: FullSlug): Promise<void> {
  return globalGraphManager.initialize({
    container: graph,
    fullSlug,
  })
}

/**
 * 销毁图谱实例
 */
export function destroyGraph(): void {
  globalGraphManager.destroy()
}

/**
 * 检查图谱是否已初始化
 */
export function isGraphInitialized(): boolean {
  return globalGraphManager.initialized
}
