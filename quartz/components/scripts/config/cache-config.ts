/**
 * 统一缓存配置管理
 * 集中管理项目中所有缓存的配置参数和命名规则
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
    POPOVER: "popover_",
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
 * 缓存键生成器类型定义
 */
export type CacheKeyGenerator = {
  /** 生成内容缓存键 */
  content: (identifier: string) => string
  /** 生成链接缓存键 */
  link: (url: string, type?: string) => string
  /** 生成搜索缓存键 */
  search: (query: string, filters?: string) => string
  /** 生成弹窗缓存键 */
  popover: (target: string, type?: string) => string
  /** 生成字体缓存键 */
  font: (fontName: string, weight?: string | number) => string
  /** 生成用户缓存键 */
  user: (userId: string, dataType?: string) => string
  /** 生成系统缓存键 */
  system: (component: string, identifier?: string) => string
}

/**
 * 全局缓存配置
 */
export const GlobalCacheConfig: Record<string, CacheConfig> = {
  /** URL缓存配置 */
  URL_CACHE: {
    capacity: 1000,
    ttl: 30 * 60 * 1000, // 30分钟
    maxMemoryMB: 20,
    warningThreshold: 800,
    description: "URL对象缓存，用于路径处理优化",
    keyPrefix: CacheKeyRules.PREFIXES.CONTENT,
    cleanupIntervalMs: 5 * 60 * 1000,
    memoryThreshold: 0.8,
  } as CacheConfig,

  /** 搜索内容缓存配置 */
  SEARCH_CONTENT_CACHE: {
    capacity: 500,
    ttl: 60 * 60 * 1000, // 1小时
    maxMemoryMB: 50,
    warningThreshold: 400,
    description: "搜索页面内容缓存，用于预览功能",
    keyPrefix: CacheKeyRules.PREFIXES.SEARCH,
    cleanupIntervalMs: 5 * 60 * 1000,
    memoryThreshold: 0.8,
  } as CacheConfig,

  /** 弹窗预加载缓存配置 */
  POPOVER_PRELOAD_CACHE: {
    capacity: 30,
    ttl: 5 * 60 * 1000, // 5分钟
    maxMemoryMB: 10,
    warningThreshold: 25,
    description: "弹窗内容预加载缓存",
    keyPrefix: CacheKeyRules.PREFIXES.POPOVER,
    cleanupIntervalMs: 2 * 60 * 1000,
    memoryThreshold: 0.9,
  } as CacheConfig,

  /** 链接有效性缓存配置 */
  LINK_VALIDITY_CACHE: {
    capacity: 1000,
    ttl: 60 * 60 * 1000, // 1小时
    maxMemoryMB: 10,
    warningThreshold: 800,
    description: "链接有效性检查缓存",
    keyPrefix: CacheKeyRules.PREFIXES.LINK,
    cleanupIntervalMs: 10 * 60 * 1000,
    memoryThreshold: 0.8,
  } as CacheConfig,

  /** 失败链接缓存配置 */
  FAILED_LINKS_CACHE: {
    capacity: 500,
    ttl: 30 * 60 * 1000, // 30分钟
    maxMemoryMB: 5,
    warningThreshold: 400,
    description: "失败链接缓存，避免重复检查",
    keyPrefix: CacheKeyRules.PREFIXES.LINK,
    cleanupIntervalMs: 10 * 60 * 1000,
    memoryThreshold: 0.8,
  } as CacheConfig,

  /** 默认缓存配置 */
  DEFAULT: {
    capacity: 100,
    ttl: 10 * 60 * 1000, // 10分钟
    maxMemoryMB: 5,
    warningThreshold: 80,
    description: "默认缓存配置",
    keyPrefix: CacheKeyRules.PREFIXES.SYSTEM,
    cleanupIntervalMs: 5 * 60 * 1000,
    memoryThreshold: 0.8,
  } as CacheConfig,
}

/**
 * 获取缓存配置
 * @param type 缓存类型
 * @returns 缓存配置
 */
export function getCacheConfig(type: keyof typeof GlobalCacheConfig): CacheConfig {
  return GlobalCacheConfig[type] || GlobalCacheConfig.DEFAULT
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
 * 缓存键生成器实现
 */
export const CacheKeyGenerator: CacheKeyGenerator = {
  /**
   * 生成内容缓存键
   * @param identifier 内容标识符
   * @returns 格式化的缓存键
   */
  content: (identifier: string): string => {
    return `${CacheKeyRules.PREFIXES.CONTENT}${sanitizeCacheKey(identifier)}`
  },

  /**
   * 生成链接缓存键
   * @param url 链接地址
   * @param type 链接类型（可选）
   * @returns 格式化的缓存键
   */
  link: (url: string, type?: string): string => {
    const baseKey = sanitizeCacheKey(url)
    return type
      ? `${CacheKeyRules.PREFIXES.LINK}${type}${CacheKeyRules.SEPARATOR}${baseKey}`
      : `${CacheKeyRules.PREFIXES.LINK}${baseKey}`
  },

  /**
   * 生成搜索缓存键
   * @param query 搜索查询
   * @param filters 过滤条件（可选）
   * @returns 格式化的缓存键
   */
  search: (query: string, filters?: string): string => {
    const baseKey = sanitizeCacheKey(query)
    return filters
      ? `${CacheKeyRules.PREFIXES.SEARCH}${baseKey}${CacheKeyRules.SEPARATOR}${sanitizeCacheKey(filters)}`
      : `${CacheKeyRules.PREFIXES.SEARCH}${baseKey}`
  },

  /**
   * 生成弹窗缓存键
   * @param target 目标元素或标识
   * @param type 弹窗类型（可选）
   * @returns 格式化的缓存键
   */
  popover: (target: string, type?: string): string => {
    const baseKey = sanitizeCacheKey(target)
    return type
      ? `${CacheKeyRules.PREFIXES.POPOVER}${type}${CacheKeyRules.SEPARATOR}${baseKey}`
      : `${CacheKeyRules.PREFIXES.POPOVER}${baseKey}`
  },

  /**
   * 生成字体缓存键
   * @param fontName 字体名称
   * @param weight 字体粗细（可选）
   * @returns 格式化的缓存键
   */
  font: (fontName: string, weight?: string | number): string => {
    const baseKey = sanitizeCacheKey(fontName)
    return weight
      ? `${CacheKeyRules.PREFIXES.FONT}${baseKey}${CacheKeyRules.SEPARATOR}${weight}`
      : `${CacheKeyRules.PREFIXES.FONT}${baseKey}`
  },

  /**
   * 生成用户缓存键
   * @param userId 用户ID
   * @param dataType 数据类型（可选）
   * @returns 格式化的缓存键
   */
  user: (userId: string, dataType?: string): string => {
    const baseKey = sanitizeCacheKey(userId)
    return dataType
      ? `${CacheKeyRules.PREFIXES.USER}${dataType}${CacheKeyRules.SEPARATOR}${baseKey}`
      : `${CacheKeyRules.PREFIXES.USER}${baseKey}`
  },

  /**
   * 生成系统缓存键
   * @param component 组件名称
   * @param identifier 标识符（可选）
   * @returns 格式化的缓存键
   */
  system: (component: string, identifier?: string): string => {
    const baseKey = sanitizeCacheKey(component)
    return identifier
      ? `${CacheKeyRules.PREFIXES.SYSTEM}${baseKey}${CacheKeyRules.SEPARATOR}${sanitizeCacheKey(identifier)}`
      : `${CacheKeyRules.PREFIXES.SYSTEM}${baseKey}`
  },
}

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
 * 缓存性能监控配置
 */
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
