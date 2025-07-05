import { urlHandler } from "../utils/simplified-url-handler"

/**
 * 缓存监控配置接口
 */
export interface CacheMonitorConfig {
  /** 是否启用监控 */
  enabled: boolean
  /** 监控间隔 (毫秒) */
  interval: number
  /** 报告间隔 (毫秒) */
  reportInterval: number
  /** 是否显示控制台警告 */
  consoleWarnings: boolean
  /** 是否启用键验证 */
  enableKeyValidation: boolean
}

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  /** 缓存容量 (最大项目数) */
  readonly capacity: number
  /** 默认 TTL (毫秒) */
  readonly ttl: number
  /** 最大内存限制 (MB) */
  readonly maxMemoryMB: number
  /** 警告阈值 (项目数) */
  readonly warningThreshold?: number
  /** 描述 */
  readonly description?: string
  /** 缓存键前缀 */
  readonly keyPrefix?: string
  /** 清理间隔 (毫秒) */
  readonly cleanupIntervalMs?: number
  /** 内存使用阈值 (0-1) */
  readonly memoryThreshold?: number
}

/**
 * 缓存键命名规则
 */
export const CacheKeyRules = {
  /** 缓存键前缀定义 */
  PREFIXES: {
    /** 内容相关缓存 */
    CONTENT: "content_",
    /** 链接相关缓存 */
    LINK: "link_",
    /** 搜索相关缓存 */
    SEARCH: "search_",
    /** 弹窗相关缓存 */

    /** 字体相关缓存 */
    FONT: "font_",
    /** 用户相关缓存 */
    USER: "user_",
    /** 系统相关缓存 */
    SYSTEM: "sys_",
  } as const,

  /** 分隔符 */
  SEPARATOR: "_",

  /** 命名约定 */
  CONVENTIONS: {
    /** 使用小写字母和下划线 */
    CASE_STYLE: "snake_case",
    /** 最大长度限制 */
    MAX_LENGTH: 100,
    /** 禁用字符 */
    FORBIDDEN_CHARS: /[^a-z0-9_-]/g,
  } as const,
} as const

/**
 * 统一缓存配置
 * 所有缓存类型的默认配置
 */
export const UNIFIED_CACHE_CONFIG: Record<string, CacheConfig> = {
  /** 内容缓存 - 主要用于页面内容和弹窗 */
  CONTENT: {
    capacity: 200,
    ttl: 15 * 60 * 1000, // 15分钟
    maxMemoryMB: 30,
    warningThreshold: 160,
    description: "统一内容缓存，支持页面和弹窗内容",
    keyPrefix: CacheKeyRules.PREFIXES.CONTENT,
    cleanupIntervalMs: 3 * 60 * 1000,
    memoryThreshold: 0.85,
  },

  /** 链接缓存 - 用于链接有效性和失败链接 */
  LINK: {
    capacity: 1000,
    ttl: 60 * 60 * 1000, // 1小时
    maxMemoryMB: 15,
    warningThreshold: 800,
    description: "链接有效性和失败链接缓存",
    keyPrefix: CacheKeyRules.PREFIXES.LINK,
    cleanupIntervalMs: 10 * 60 * 1000,
    memoryThreshold: 0.8,
  },

  /** 搜索缓存 - 用于搜索结果和内容预览 */
  SEARCH: {
    capacity: 500,
    ttl: 60 * 60 * 1000, // 1小时
    maxMemoryMB: 50,
    warningThreshold: 400,
    description: "搜索结果和内容预览缓存",
    keyPrefix: CacheKeyRules.PREFIXES.SEARCH,
    cleanupIntervalMs: 5 * 60 * 1000,
    memoryThreshold: 0.8,
  },

  /** 用户缓存 - 用于用户偏好和设置 */
  USER: {
    capacity: 100,
    ttl: 24 * 60 * 60 * 1000, // 24小时
    maxMemoryMB: 5,
    warningThreshold: 80,
    description: "用户偏好和设置缓存",
    keyPrefix: CacheKeyRules.PREFIXES.USER,
    cleanupIntervalMs: 30 * 60 * 1000,
    memoryThreshold: 0.9,
  },

  /** 系统缓存 - 用于系统组件和配置 */
  SYSTEM: {
    capacity: 200,
    ttl: 60 * 60 * 1000, // 1小时
    maxMemoryMB: 10,
    warningThreshold: 160,
    description: "系统组件和配置缓存",
    keyPrefix: CacheKeyRules.PREFIXES.SYSTEM,
    cleanupIntervalMs: 15 * 60 * 1000,
    memoryThreshold: 0.8,
  },

  /** 默认配置 */
  DEFAULT: {
    capacity: 100,
    ttl: 10 * 60 * 1000, // 10分钟
    maxMemoryMB: 5,
    warningThreshold: 80,
    description: "默认缓存配置",
    keyPrefix: CacheKeyRules.PREFIXES.SYSTEM,
    cleanupIntervalMs: 5 * 60 * 1000,
    memoryThreshold: 0.8,
  },
} as const

/**
 * 缓存层级配置
 * 定义不同层级的资源分配策略
 */
export const CACHE_LAYER_CONFIG = {
  /** 内存层配置 - 热数据 */
  MEMORY: {
    capacityRatio: 0.6, // 70%的容量用于内存缓存
    maxSizeKB: 500,
    priority: 3,
    description: "内存层 - 最快访问，存储热数据",
  },

  SESSION: {
    capacityRatio: 0.2, // 30%的容量用于会话存储
    maxSizeKB: 1000,
    priority: 2,
    description: "会话层 - 页面刷新保留，存储重要数据",
  },

  LOCAL: {
    capacityRatio: 0.2, // 30%的容量用于会话存储
    maxSizeKB: 1000,
    priority: 2,
    description: "本地层 - 长期存储，存储长期数据",
  },
} as const

/**
 * 缓存阈值配置
 * 定义各种缓存操作的阈值和限制
 */
export const CACHE_THRESHOLDS = {
  /** 大内容阈值 (字节) */
  LARGE_CONTENT_SIZE: 1024 * 1024, // 1MB
  /** 超大内容阈值 (字节) */
  HUGE_CONTENT_SIZE: 5 * 1024 * 1024, // 5MB
  /** 最大内存使用量 (字节) */
  MAX_MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
  /** 内存清理阈值 (比例) */
  MEMORY_CLEANUP_THRESHOLD: 0.8, // 80%
  /** 会话存储清理阈值 (比例) */
  SESSION_CLEANUP_THRESHOLD: 0.9, // 90%
  /** 最大引用计数 */
  MAX_REFERENCE_COUNT: 1000,
  /** 内容哈希冲突检测阈值 */
  HASH_COLLISION_THRESHOLD: 10,
} as const

/**
 * 缓存验证规则配置
 */
export const CACHE_VALIDATION_RULES = {
  /** 最大键长度 */
  MAX_KEY_LENGTH: 256,
  /** 禁用字符正则 */
  FORBIDDEN_CHARS: /[\s<>:"/\\|?*]/,
  /** 是否要求前缀 */
  REQUIRED_PREFIX: true,
  /** 最小内容长度 */
  MIN_CONTENT_LENGTH: 1,
  /** 最大内容长度 */
  MAX_CONTENT_LENGTH: 10 * 1024 * 1024, // 10MB
  /** 键格式验证正则 */
  KEY_FORMAT_REGEX: /^[a-z0-9_-]+$/,
} as const

/**
 * 缓存性能配置
 */
export const CACHE_PERFORMANCE_CONFIG = {
  /** 批量操作大小 */
  BATCH_SIZE: 10,
  /** 预加载并发限制 */
  MAX_CONCURRENT_PRELOADS: 3,
  /** 缓存命中率警告阈值 */
  HIT_RATE_WARNING_THRESHOLD: 0.7, // 70%
  /** 内存使用监控间隔 (毫秒) */
  MEMORY_CHECK_INTERVAL: 30 * 1000, // 30秒
  /** 自动清理触发阈值 */
  AUTO_CLEANUP_THRESHOLD: 0.9, // 90%容量时触发
  /** 缓存预热策略 */
  PRELOAD_STRATEGY: {
    enabled: true,
    count: 5,
    delay: 100,
  },
  /** 监控配置 */
  MONITORING: {
    ENABLE_MONITORING: true,
    MONITOR_INTERVAL: 5 * 60 * 1000, // 5分钟
    REPORT_INTERVAL: 30 * 60 * 1000, // 30分钟
    CONSOLE_WARNINGS: true,
    ENABLE_KEY_VALIDATION: true,
  },
} as const

/**
 * 清理和格式化缓存键
 * @param key 原始键名
 * @returns 清理后的键名
 */
export function sanitizeCacheKey(key: string): string {
  return key
    .toLowerCase()
    .replace(CacheKeyRules.CONVENTIONS.FORBIDDEN_CHARS, "")
    .replace(/\s+/g, CacheKeyRules.SEPARATOR)
    .replace(/_+/g, CacheKeyRules.SEPARATOR)
    .replace(/^_+|_+$/g, "")
    .substring(0, CacheKeyRules.CONVENTIONS.MAX_LENGTH)
}

/**
 * 统一缓存键生成器
 * 提供所有类型缓存键的生成方法
 */
export const UnifiedCacheKeyGenerator = {
  /**
   * 生成内容缓存键
   * @param url 内容URL
   * @param type 内容类型 (可选)
   * @returns 统一格式的缓存键
   */
  // 修改 unified-cache.ts 中的 generateContentKey
  generateContentKey: (url: string, type?: "popover" | "content" | "preview"): string => {
    // 使用 simplified-url-handler 进行标准化
    const result = urlHandler.processURL(url, { cacheType: 'content' })
    if (!result.isValid) {
      console.warn(`Invalid URL for cache key generation: ${url}`)
      return `${CacheKeyRules.PREFIXES.CONTENT}invalid_${sanitizeCacheKey(url)}`
    }

    const baseKey = result.cacheKey
    return type ? `${baseKey}${CacheKeyRules.SEPARATOR}${type}` : baseKey
  },

  /**
   * 生成搜索缓存键
   * @param query 搜索查询
   * @param filters 过滤条件（可选）
   * @returns 格式化的缓存键
   */
  generateSearchKey: (query: string, filters?: string): string => {
    const baseKey = sanitizeCacheKey(query)
    return filters
      ? `${CacheKeyRules.PREFIXES.SEARCH}${baseKey}${CacheKeyRules.SEPARATOR}${sanitizeCacheKey(filters)}`
      : `${CacheKeyRules.PREFIXES.SEARCH}${baseKey}`
  },

  /**
   * 生成用户缓存键
   * @param userId 用户ID
   * @param dataType 数据类型（可选）
   * @returns 格式化的缓存键
   */
  generateUserKey: (userId: string, dataType?: string): string => {
    const baseKey = sanitizeCacheKey(userId)
    return dataType
      ? `${CacheKeyRules.PREFIXES.USER}${dataType}${CacheKeyRules.SEPARATOR}${baseKey}`
      : `${CacheKeyRules.PREFIXES.USER}${baseKey}`
  },

  /**
   * 生成字体缓存键
   * @param fontName 字体名称
   * @param weight 字体粗细（可选）
   * @returns 格式化的缓存键
   */
  generateFontKey: (fontName: string, weight?: string | number): string => {
    const baseKey = sanitizeCacheKey(fontName)
    return weight
      ? `${CacheKeyRules.PREFIXES.FONT}${baseKey}${CacheKeyRules.SEPARATOR}${weight}`
      : `${CacheKeyRules.PREFIXES.FONT}${baseKey}`
  },

  /**
   * 生成系统缓存键
   * @param component 组件名称
   * @param identifier 标识符（可选）
   * @returns 格式化的缓存键
   */
  generateSystemKey: (component: string, identifier?: string): string => {
    const baseKey = sanitizeCacheKey(component)
    return identifier
      ? `${CacheKeyRules.PREFIXES.SYSTEM}${baseKey}${CacheKeyRules.SEPARATOR}${sanitizeCacheKey(identifier)}`
      : `${CacheKeyRules.PREFIXES.SYSTEM}${baseKey}`
  },

  /**
   * 解析缓存键信息
   * @param key 缓存键
   * @returns 解析结果
   */
  parseKey: (
    key: string,
  ): {
    isValid: boolean
    prefix?: string
    baseUrl?: string
    type?: string
    subType?: string
  } => {
    const prefixes = Object.values(CacheKeyRules.PREFIXES)
    const matchedPrefix = prefixes.find((prefix) => key.startsWith(prefix))

    if (!matchedPrefix) {
      return { isValid: false }
    }

    const parts = key.substring(matchedPrefix.length).split(CacheKeyRules.SEPARATOR)

    return {
      isValid: true,
      prefix: matchedPrefix,
      baseUrl: parts[0],
      type: parts[1],
      subType: parts[2],
    }
  },
} as const

/**
 * 获取缓存配置
 * @param type 缓存类型
 * @returns 缓存配置
 */
export function getCacheConfig(type: keyof typeof UNIFIED_CACHE_CONFIG): CacheConfig {
  return UNIFIED_CACHE_CONFIG[type] || UNIFIED_CACHE_CONFIG.DEFAULT
}

/**
 * 获取缓存层级配置
 * @param layer 缓存层级名称
 * @returns 对应层级的配置
 */
export function getCacheLayerConfig(layer: keyof typeof CACHE_LAYER_CONFIG) {
  return CACHE_LAYER_CONFIG[layer]
}

/**
 * 计算缓存层级容量
 * @param layer 缓存层级
 * @param baseCapacity 基础容量（可选，默认使用内容缓存容量）
 * @returns 该层级的实际容量
 */
export function calculateLayerCapacity(
  layer: keyof typeof CACHE_LAYER_CONFIG,
  baseCapacity?: number,
): number {
  const layerConfig = CACHE_LAYER_CONFIG[layer]
  const capacity = baseCapacity || UNIFIED_CACHE_CONFIG.CONTENT.capacity
  return Math.floor(capacity * layerConfig.capacityRatio)
}

/**
 * 验证缓存配置
 * @param config 缓存配置
 * @returns 是否有效
 */
export function validateCacheConfig(config: CacheConfig): boolean {
  return (
    config.capacity > 0 &&
    config.ttl > 0 &&
    config.maxMemoryMB > 0 &&
    (!config.warningThreshold || config.warningThreshold < config.capacity)
  )
}

/**
 * 验证统一缓存配置
 * @returns 配置是否有效
 */
export function validateUnifiedCacheConfig(): boolean {
  const totalRatio = Object.values(CACHE_LAYER_CONFIG).reduce(
    (sum, config) => sum + config.capacityRatio,
    0,
  )

  return (
    Math.abs(totalRatio - 1.0) < 0.01 && // 总比例应该接近100%
    UNIFIED_CACHE_CONFIG.CONTENT.capacity > 0 &&
    UNIFIED_CACHE_CONFIG.CONTENT.ttl > 0 &&
    UNIFIED_CACHE_CONFIG.CONTENT.maxMemoryMB > 0
  )
}

/**
 * 验证缓存键格式
 * @param key 缓存键
 * @returns 是否符合命名规范
 */
export function validateCacheKey(key: string): boolean {
  if (!key || key.length === 0) return false
  if (key.length > CacheKeyRules.CONVENTIONS.MAX_LENGTH) return false
  if (CacheKeyRules.CONVENTIONS.FORBIDDEN_CHARS.test(key)) return false

  // 检查是否有有效的前缀
  const prefixes = Object.values(CacheKeyRules.PREFIXES)
  return prefixes.some((prefix) => key.startsWith(prefix))
}

/**
 * 从缓存键中提取前缀类型
 * @param key 缓存键
 * @returns 前缀类型或null
 */
export function extractCacheKeyPrefix(key: string): string | null {
  const prefixes = Object.entries(CacheKeyRules.PREFIXES)
  for (const [type, prefix] of prefixes) {
    if (key.startsWith(prefix)) {
      return type
    }
  }
  return null
}

/**
 * 缓存配置诊断信息
 * @returns 诊断信息对象
 */
export function getCacheConfigDiagnostics() {
  return {
    config: UNIFIED_CACHE_CONFIG,
    layerConfig: CACHE_LAYER_CONFIG,
    performanceConfig: CACHE_PERFORMANCE_CONFIG,
    validation: {
      isValid: validateUnifiedCacheConfig(),
      totalCapacity: UNIFIED_CACHE_CONFIG.CONTENT.capacity,
      layerCapacities: {
        memory: calculateLayerCapacity("MEMORY"),
        session: calculateLayerCapacity("SESSION"),
      },
    },
  }
}

/**
 * 向后兼容的缓存键生成器
 * @deprecated 建议使用 UnifiedCacheKeyGenerator
 */
export const CacheKeyGeneratorCompat = {
  content: UnifiedCacheKeyGenerator.generateContentKey,
  search: UnifiedCacheKeyGenerator.generateSearchKey,
  font: UnifiedCacheKeyGenerator.generateFontKey,
  user: UnifiedCacheKeyGenerator.generateUserKey,
  system: UnifiedCacheKeyGenerator.generateSystemKey,
} as const

// 导出缓存监控配置
export const CacheMonitorConfig = {
  /** 是否启用监控 */
  ENABLE_MONITORING: true,
  /** 监控间隔 (毫秒) */
  MONITOR_INTERVAL: 5 * 60 * 1000, // 5分钟
  /** 性能报告间隔 (毫秒) */
  REPORT_INTERVAL: 30 * 60 * 1000, // 30分钟
  /** 是否在控制台输出警告 */
  CONSOLE_WARNINGS: true,
  /** 是否启用缓存键验证 */
  ENABLE_KEY_VALIDATION: true,
}

// 默认导出统一缓存配置
export default {
  config: UNIFIED_CACHE_CONFIG,
  keyGenerator: UnifiedCacheKeyGenerator,
  performance: CACHE_PERFORMANCE_CONFIG,
  layers: CACHE_LAYER_CONFIG,
  thresholds: CACHE_THRESHOLDS,
  validation: CACHE_VALIDATION_RULES,
  monitor: CacheMonitorConfig,
  utils: {
    getCacheConfig,
    validateCacheConfig,
    validateUnifiedCacheConfig,
    sanitizeCacheKey,
    getCacheConfigDiagnostics,
    extractCacheKeyPrefix,
  },
}
