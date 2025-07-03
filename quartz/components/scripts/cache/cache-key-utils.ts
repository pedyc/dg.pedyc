/**
 * 缓存键操作工具模块
 * 提供统一的缓存键生成、验证、解析等功能
 */

import { CacheKeyRules } from "./unified-cache"
import { CacheLayer } from "../managers/UnifiedContentCacheManager"

/**
 * 缓存键工具类
 * 包含所有与缓存键操作相关的纯函数
 */
export const CacheKeyUtils = {
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
    // 检查键是否已经有前缀，避免重复添加
    const existingPrefix = CacheKeyUtils.identifyType(originalKey)
    if (existingPrefix) {
      return originalKey // 已经有前缀，直接返回
    }

    // 根据存储层映射到正确的前缀
    const prefixMap = {
      [CacheLayer.MEMORY]: CacheKeyRules.PREFIXES.CONTENT,
      [CacheLayer.SESSION]: CacheKeyRules.PREFIXES.CONTENT,
    
    }

    const prefix = prefixMap[layer] || CacheKeyRules.PREFIXES.CONTENT
    return `${prefix}${originalKey}`
  },

  /**
   * 从缓存键中提取前缀类型（纯函数）
   * @param key 缓存键
   * @returns 前缀类型或null
   */
  extractPrefix: (key: string): string | null => {
    const prefixes = Object.entries(CacheKeyRules.PREFIXES)
    for (const [type, prefix] of prefixes) {
      if (key.startsWith(prefix)) {
        return type
      }
    }
    return null
  },

  /**
   * 检查键是否有有效前缀（纯函数）
   * @param key 缓存键
   * @returns 是否有有效前缀
   */
  hasValidPrefix: (key: string): boolean => {
    return CacheKeyUtils.identifyType(key) !== null
  },

  /**
   * 清理和格式化缓存键（纯函数）
   * @param key 原始键
   * @returns 清理后的键
   */
  sanitizeKey: (key: string): string => {
    if (!key) return ""

    // 移除特殊字符，保留字母、数字、下划线、连字符
    return key
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .toLowerCase()
  },

  /**
   * 验证缓存键格式（纯函数）
   * @param key 缓存键
   * @returns 验证结果
   */
  validateKeyFormat: (
    key: string,
  ): {
    isValid: boolean
    issues: string[]
    suggestions: string[]
  } => {
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

    if (!CacheKeyUtils.hasValidPrefix(key)) {
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
  parseKey: (
    key: string,
  ): {
    original: string
    type: string | null
    prefix: string | null
    isValid: boolean
  } => {
    const type = CacheKeyUtils.identifyType(key)
    const prefix = CacheKeyUtils.extractPrefix(key)
    const original = CacheKeyUtils.extractOriginalKey(key)
    const validation = CacheKeyUtils.validateKeyFormat(key)

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

/**
 * 导出常用的验证函数
 */
export const validateCacheKey = CacheKeyUtils.validateKeyFormat
export const parseCacheKey = CacheKeyUtils.parseKey
export const sanitizeCacheKey = CacheKeyUtils.sanitizeKey
export const generateStorageKey = CacheKeyUtils.generateStorageKey
export const extractOriginalKey = CacheKeyUtils.extractOriginalKey
export const identifyCacheType = CacheKeyUtils.identifyType

/**
 * 向后兼容的导出
 * @deprecated 建议直接使用 CacheKeyUtils
 */
export const CacheKeyUtilsCompat = {
  identifyType: CacheKeyUtils.identifyType,
  extractOriginalKey: CacheKeyUtils.extractOriginalKey,
  generateStorageKey: CacheKeyUtils.generateStorageKey,
  validateKey: CacheKeyUtils.validateKeyFormat,
  parseKey: CacheKeyUtils.parseKey,
} as const
