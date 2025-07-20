/**
 * 缓存键操作工具模块 (统一)
 * 提供统一的缓存键生成、验证、解析等功能，是所有缓存键逻辑的唯一来源。
 */

import { urlHandler } from "../utils/simplified-url-handler"
import { CacheKeyRules, CacheLayer } from "./unified-cache"

/**
 * 清理和格式化缓存键的基础部分（纯函数）
 * @param key 原始键
 * @returns 清理后的键
 */
const sanitizePart = (key: string): string => {
  if (!key) return ""
  return key
    .toLowerCase()
    .replace(CacheKeyRules.CONVENTIONS.FORBIDDEN_CHARS, "")
    .replace(/\s+/g, CacheKeyRules.SEPARATOR)
    .replace(/_+/g, CacheKeyRules.SEPARATOR)
    .replace(/^_|_$/g, "")
    .substring(0, CacheKeyRules.CONVENTIONS.MAX_LENGTH)
}

/**
 * 统一缓存键工厂
 * 包含所有与缓存键操作相关的生成、解析和验证方法
 */
export const CacheKeyFactory = {
  /**
   * 生成内容缓存键
   * @param url 内容URL
   * @param type 内容类型 (可选)
   * @returns 统一格式的缓存键
   */
  generateContentKey: (url: string, type?: "popover" | "content" | "preview"): string => {
    const result = urlHandler.processURL(url, { cacheType: "content" })
    if (!result.isValid) {
      console.warn(`Invalid URL for cache key generation: ${url}`)
      return `${CacheKeyRules.PREFIXES.CONTENT}invalid_${sanitizePart(url)}`
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
    const baseKey = sanitizePart(query)
    return filters
      ? `${CacheKeyRules.PREFIXES.SEARCH}${baseKey}${CacheKeyRules.SEPARATOR}${sanitizePart(filters)}`
      : `${CacheKeyRules.PREFIXES.SEARCH}${baseKey}`
  },

  /**
   * 生成用户缓存键
   * @param userId 用户ID
   * @param dataType 数据类型（可选）
   * @returns 格式化的缓存键
   */
  generateUserKey: (userId: string, dataType?: string): string => {
    const baseKey = sanitizePart(userId)
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
    const baseKey = sanitizePart(fontName)
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
    const baseKey = sanitizePart(component)
    return identifier
      ? `${CacheKeyRules.PREFIXES.SYSTEM}${baseKey}${CacheKeyRules.SEPARATOR}${sanitizePart(identifier)}`
      : `${CacheKeyRules.PREFIXES.SYSTEM}${baseKey}`
  },

  /**
   * 识别缓存键的类型（纯函数）
   * @param key 缓存键
   * @returns 缓存类型或null
   */
  identifyType: (key: string): string | null => {
    const prefixes = Object.entries(CacheKeyRules.PREFIXES)
    for (const [type, prefix] of prefixes) {
      if (key.startsWith(prefix)) {
        return type
      }
    }
    return null
  },

  /**
   * 从存储键中提取原始键（纯函数）
   * @param storageKey 带前缀的存储键
   * @returns 原始键
   */
  extractOriginalKey: (storageKey: string): string => {
    const prefixes = Object.values(CacheKeyRules.PREFIXES)
    for (const prefix of prefixes) {
      if (storageKey.startsWith(prefix)) {
        return storageKey.substring(prefix.length)
      }
    }
    return storageKey
  },

  /**
   * 生成存储键（纯函数）
   * @param originalKey 原始键
   * @param layer 存储层
   * @returns 带前缀的存储键
   */
  generateStorageKey: (originalKey: string, layer: CacheLayer): string => {
    const existingPrefix = CacheKeyFactory.identifyType(originalKey)
    if (existingPrefix) {
      return originalKey
    }

    const prefixMap: { [key in CacheLayer]?: string } = {
      [CacheLayer.MEMORY]: CacheKeyRules.PREFIXES.CONTENT,
      [CacheLayer.SESSION]: CacheKeyRules.PREFIXES.CONTENT,
    }

    const prefix = prefixMap[layer] || CacheKeyRules.PREFIXES.CONTENT
    return `${prefix}${originalKey}`
  },

  /**
   * 验证缓存键格式（纯函数）
   * @param key 缓存键
   * @returns 验证结果
   */
  validateKeyFormat: (key: string): CacheKeyValidationResult => {
    const issues: string[] = []
    const suggestions: string[] = []

    if (!key || key.length === 0) {
      issues.push("键不能为空")
      suggestions.push("提供一个非空的键")
    }

    if (key.length > CacheKeyRules.CONVENTIONS.MAX_LENGTH) {
      issues.push(`键过长: ${key.length} > ${CacheKeyRules.CONVENTIONS.MAX_LENGTH}`)
      suggestions.push("缩短键名或使用哈希值")
    }

    if (CacheKeyRules.CONVENTIONS.FORBIDDEN_CHARS.test(key)) {
      issues.push("键包含禁用字符")
      suggestions.push("移除键中的特殊字符")
    }

    if (!CacheKeyFactory.identifyType(key)) {
      issues.push("键缺少必需的前缀")
      suggestions.push("为键添加适当的前缀")
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    }
  },

  /**
   * 解析缓存键信息（纯函数）
   * @param key 缓存键
   * @returns 解析结果
   */
  parseKey: (key: string): CacheKeyParseResult => {
    const type = CacheKeyFactory.identifyType(key)
    const prefix = Object.values(CacheKeyRules.PREFIXES).find((p) => key.startsWith(p)) || null
    const original = CacheKeyFactory.extractOriginalKey(key)
    const validation = CacheKeyFactory.validateKeyFormat(key)

    return {
      original,
      type,
      prefix,
      isValid: validation.isValid,
    }
  },
} as const

/**
 * 缓存键验证结果接口
 */
export interface CacheKeyValidationResult {
  isValid: boolean
  issues: string[]
  suggestions: string[]
}

/**
 * 缓存键解析结果接口
 */
export interface CacheKeyParseResult {
  original: string
  type: string | null
  prefix: string | null
  isValid: boolean
}

// 导出别名以方便使用
export const {
  generateContentKey,
  generateSearchKey,
  generateUserKey,
  generateFontKey,
  generateSystemKey,
  identifyType: identifyCacheType,
  extractOriginalKey,
  generateStorageKey,
  validateKeyFormat: validateCacheKey,
  parseKey: parseCacheKey,
} = CacheKeyFactory
/**
 * 向后兼容的导出
 * @deprecated 建议直接使用 CacheKeyFactory 中的方法
 */
export const CacheKeyUtilsCompat = {
  identifyType: CacheKeyFactory.identifyType,
  extractOriginalKey: CacheKeyFactory.extractOriginalKey,
  generateStorageKey: CacheKeyFactory.generateStorageKey,
  validateKey: CacheKeyFactory.validateKeyFormat,
  parseKey: CacheKeyFactory.parseKey,
} as const
