// import type { ContentDetails } from "../../../plugins/emitters/contentIndex"
import type { SimulationNodeDatum, SimulationLinkDatum } from "d3"
import type { FullSlug, SimpleSlug } from "../../../util/path"

// 导出 SimpleSlug 类型
export type { SimpleSlug }

/**
 * 图谱节点数据结构
 */
export type NodeData = {
  id: SimpleSlug
  text: string
  tags: string[]
} & SimulationNodeDatum

/**
 * 简单链接数据结构
 */
export type SimpleLinkData = {
  source: SimpleSlug
  target: SimpleSlug
}

/**
 * 图谱链接数据结构
 */
export type LinkData = {
  source: NodeData
  target: NodeData
} & SimulationLinkDatum<NodeData>

/**
 * 图谱数据结构
 */
export type GraphData = {
  nodes: NodeData[]
  links: LinkData[]
}

/**
 * 图谱渲染配置
 */
export type GraphRenderConfig = {
  enableDrag: boolean
  enableZoom: boolean
  scale: number
  repelForce: number
  centerForce: number
  linkDistance: number
  fontSize: number
  opacityScale: number
  focusOnHover: boolean
  enableRadial: boolean
  showTags: boolean
  removeTags: string[]
  depth: number
  visited: Set<SimpleSlug>
  currentSlug: SimpleSlug
  alphaTarget?: number // 新增属性，用于控制模拟的 alphaTarget
}

/**
 * CSS变量映射类型
 */
export type CSSVariables = {
  "--secondary": string
  "--tertiary": string
  "--gray": string
  "--light": string
  "--lightgray": string
  "--dark": string
  "--darkgray": string
  "--bodyFont": string
}

/**
 * 图谱初始化参数
 */
export type GraphInitParams = {
  container: HTMLElement
  fullSlug: FullSlug
  config?: Partial<GraphRenderConfig & { depth?: number }>
}
