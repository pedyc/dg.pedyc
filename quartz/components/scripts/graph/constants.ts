import type { CSSVariables } from "./types"

/**
 * 图谱渲染常量配置
 */
export const GRAPH_CONSTANTS = {
  // 画布配置
  MIN_HEIGHT: 250,
  DEVICE_PIXEL_RATIO_MULTIPLIER: 4,

  // 节点配置
  BASE_NODE_RADIUS: 2,
  NODE_RADIUS_SCALE_FACTOR: 1, // Math.sqrt multiplier
  NODE_HOVER_SCALE: 1.2,
  NODE_NORMAL_ALPHA: 0.8,
  NODE_HOVER_ALPHA: 1,
  NODE_STROKE_WIDTH: 2,

  // 力导向图配置
  REPULSIVE_FORCE: -100,
  LINK_DISTANCE: 30,
  COLLISION_ITERATIONS: 3,
  RADIAL_RADIUS: 50,
  RADIAL_STRENGTH: 0.3,

  // 链接配置
  LINK_WIDTH_DIVISOR: 25,
  LINK_ALPHA: 0.5,

  // 缩放配置
  ZOOM_SCALE_EXTENT: [0.25, 4] as [number, number],

  // 文本配置
  FONT_SIZE_MULTIPLIER: 15,
  LABEL_ANCHOR: { x: 0.5, y: 1.2 },

  // 标签前缀
  TAG_PREFIX: "tags/",
  TAG_DISPLAY_PREFIX: "#",

  // 默认颜色（十六进制）
  FALLBACK_COLOR: 0x666666,
} as const

/**
 * CSS变量名称列表
 */
export const CSS_VARIABLES: readonly (keyof CSSVariables)[] = [
  "--secondary",
  "--tertiary",
  "--gray",
  "--light",
  "--lightgray",
  "--dark",
  "--darkgray",
  "--bodyFont",
] as const

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  GRAPH_VISITED: "graph-visited",
  NAVIGATION_HISTORY: "navigation-history",
} as const
