import type { NodeData, CSSVariables, GraphData, SimpleSlug } from "./types"
import { GRAPH_CONSTANTS, CSS_VARIABLES } from "./constants"

/**
 * 将CSS颜色转换为PIXI十六进制颜色
 * @param cssColor CSS颜色值
 * @returns PIXI十六进制颜色
 */
export function cssColorToHex(cssColor: string): number {
  if (!cssColor || cssColor.trim() === "") {
    console.warn("Empty CSS color provided, using fallback")
    return GRAPH_CONSTANTS.FALLBACK_COLOR
  }

  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = cssColor.trim()
    const computedColor = ctx.fillStyle

    // 处理rgb格式
    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      return (r << 16) | (g << 8) | b
    }

    // 处理十六进制格式
    if (computedColor.startsWith("#")) {
      const hex = computedColor.substring(1)
      const parsed = parseInt(hex, 16)
      if (!isNaN(parsed)) {
        return parsed
      }
    }

    console.warn(`Failed to parse color: ${cssColor}, using fallback`)
    return GRAPH_CONSTANTS.FALLBACK_COLOR
  } catch (error) {
    console.error(`Error converting CSS color ${cssColor}:`, error)
    return GRAPH_CONSTANTS.FALLBACK_COLOR
  }
}

/**
 * 获取计算后的CSS变量样式映射
 * @returns CSS变量样式映射
 */
export function getComputedCSSVariables(): CSSVariables {
  const computedStyleMap = CSS_VARIABLES.reduce((acc, key) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(key).trim()
    acc[key] = value
    if (!value) {
      console.warn(`CSS variable ${key} is empty or not found`)
    }
    return acc
  }, {} as CSSVariables)
  console.log("CSS variables loaded:", computedStyleMap)
  return computedStyleMap
}

/**
 * 计算节点半径
 * @param node 节点数据
 * @param graphData 图谱数据
 * @returns 节点半径
 */
export function calculateNodeRadius(node: NodeData, graphData: GraphData): number {
  const numLinks = graphData.links.filter(
    (l) => l.source.id === node.id || l.target.id === node.id,
  ).length
  return (
    GRAPH_CONSTANTS.BASE_NODE_RADIUS +
    Math.sqrt(numLinks) * GRAPH_CONSTANTS.NODE_RADIUS_SCALE_FACTOR
  )
}

/**
 * 计算节点颜色
 * @param node 节点数据
 * @param currentSlug 当前页面slug
 * @param visited 已访问页面集合
 * @param cssVars CSS变量映射
 * @returns 节点颜色（十六进制）
 */
export function calculateNodeColor(
  node: NodeData,
  currentSlug: SimpleSlug,
  visited: Set<SimpleSlug>,
  cssVars: CSSVariables,
): number {
  const isCurrent = node.id === currentSlug
  if (isCurrent) {
    return cssColorToHex(cssVars["--secondary"])
  } else if (visited.has(node.id) || node.id.startsWith(GRAPH_CONSTANTS.TAG_PREFIX)) {
    return cssColorToHex(cssVars["--tertiary"])
  } else {
    return cssColorToHex(cssVars["--gray"])
  }
}

/**
 * 检查是否为标签节点
 * @param nodeId 节点ID
 * @returns 是否为标签节点
 */
export function isTagNode(nodeId: SimpleSlug): boolean {
  return nodeId.startsWith(GRAPH_CONSTANTS.TAG_PREFIX)
}

/**
 * 获取标签显示文本
 * @param nodeId 节点ID
 * @returns 标签显示文本
 */
export function getTagDisplayText(nodeId: SimpleSlug): string {
  return GRAPH_CONSTANTS.TAG_DISPLAY_PREFIX + nodeId.substring(GRAPH_CONSTANTS.TAG_PREFIX.length)
}

/**
 * 确定图形API类型
 * @returns Promise<"webgpu" | "webgl">
 */
export async function determineGraphicsAPI(): Promise<"webgpu" | "webgl"> {
  const adapter = await navigator.gpu?.requestAdapter().catch(() => null)
  if (!adapter) {
    return "webgl"
  }
  // Devices with WebGPU but no float32-blendable feature fail to render the graph
  return adapter.features.has("float32-blendable") ? "webgpu" : "webgl"
}
