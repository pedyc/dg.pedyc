/**
 * 统一内容缓存管理器
 * 解决相同内容在多个缓存层重复存储的问题
 * 采用单一存储源 + 引用映射的架构
 */

import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { UnifiedStorageManager } from "./UnifiedStorageManager"
import { CacheKeyRules, extractCacheKeyPrefix } from '../config/cache-config'
import { ICleanupManager } from "./CleanupManager"

/**
 * 缓存层级枚举
 */
export enum CacheLayer {
  /** 内存缓存 - 最快访问 */
  MEMORY = "memory",
  /** SessionStorage - 会话持久化 */
  SESSION = "session",
  /** 弹窗缓存 - 预加载优化 */
  POPOVER = "popover"
}

/**
 * 缓存键验证结果
 */
export interface CacheKeyValidationResult {
  isValid: boolean
  issues: string[]
  suggestions: string[]
}

/**
 * 缓存诊断信息
 */
export interface CacheDiagnostics {
  key: string
  reference: CacheReference | null
  validation: CacheKeyValidationResult
  storageLayerInfo: {
    memory: boolean
    session: boolean
    popover: boolean
  }
  availableKeys: string[]
}

/**
 * 缓存引用接口
 */
interface CacheReference {
  /** 实际存储的缓存层 */
  readonly storageLayer: CacheLayer
  /** 存储键 */
  readonly storageKey: string
  /** 引用计数 */
  refCount: number
  /** 最后访问时间 */
  lastAccessed: number
  /** 数据大小 */
  readonly size: number
}

/**
 * 统一内容缓存管理器
 * 实现单一存储源策略，避免重复存储相同内容
 */
export class UnifiedContentCacheManager implements ICleanupManager {
  private readonly memoryCache: OptimizedCacheManager<string>
  private readonly storageManager: UnifiedStorageManager
  private readonly popoverCache: OptimizedCacheManager<string>

  /** 缓存引用映射表 - 记录每个键对应的实际存储位置 */
  private readonly referenceMap = new Map<string, CacheReference>()

  /** 内容哈希映射 - 避免重复存储相同内容 */
  private readonly contentHashMap = new Map<string, string>()

  /** 统计信息 */
  private stats = {
    totalRequests: 0,
    memoryHits: 0,
    sessionHits: 0,
    popoverHits: 0,
    duplicatesAvoided: 0
  }

  constructor(
    memoryCache: OptimizedCacheManager<string>,
    storageManager: UnifiedStorageManager,
    popoverCache: OptimizedCacheManager<string>
  ) {
    this.memoryCache = memoryCache
    this.storageManager = storageManager
    this.popoverCache = popoverCache
  }

  /**
   * 获取内容
   * @param key 缓存键
   * @returns 内容或null
   */
  get(key: string): string | null {
    this.stats.totalRequests++


    const reference = this.referenceMap.get(key)
    if (!reference) {
      return null
    }

    // 更新访问时间和引用计数
    reference.lastAccessed = Date.now()
    reference.refCount++

    // 根据存储层获取内容
    let content: string | null = null

    switch (reference.storageLayer) {
      case CacheLayer.MEMORY:
        content = this.memoryCache.get(reference.storageKey) || null
        if (content) this.stats.memoryHits++
        break

      case CacheLayer.SESSION:
        content = this.storageManager.getSessionItem(reference.storageKey)
        if (content) this.stats.sessionHits++
        break

      case CacheLayer.POPOVER:
        content = this.popoverCache.get(reference.storageKey) || null
        if (content) this.stats.popoverHits++
        break
    }

    if (!content) {
      // 尝试清理损坏的引用
      this.referenceMap.delete(key)
    }

    return content
  }

  /**
   * 设置内容
   * @param key 缓存键
   * @param content 内容
   * @param preferredLayer 首选存储层
   */
  set(key: string, content: string, preferredLayer: CacheLayer = CacheLayer.MEMORY): void {
    // 计算内容哈希
    const contentHash = this.calculateHash(content)

    // 检查是否已存储相同内容
    const existingKey = this.contentHashMap.get(contentHash)
    if (existingKey && this.referenceMap.has(existingKey)) {
      // 相同内容已存在，创建引用
      const existingRef = this.referenceMap.get(existingKey)!
      this.referenceMap.set(key, {
        storageLayer: existingRef.storageLayer,
        storageKey: existingRef.storageKey,
        refCount: 1,
        lastAccessed: Date.now(),
        size: existingRef.size
      })
      this.stats.duplicatesAvoided++
      console.log(`[UnifiedCache] Avoided duplicate storage for ${key}, referencing ${existingKey}`)
      return
    }

    // 选择最佳存储层
    const optimalLayer = this.selectOptimalLayer(content, preferredLayer)
    const storageKey = this.generateStorageKey(key, optimalLayer)

    // 存储内容
    const success = this.storeContent(storageKey, content, optimalLayer)

    if (success) {
      // 创建引用记录
      const reference: CacheReference = {
        storageLayer: optimalLayer,
        storageKey,
        refCount: 1,
        lastAccessed: Date.now(),
        size: this.calculateSize(content)
      }

      this.referenceMap.set(key, reference)
      this.contentHashMap.set(contentHash, key)

      console.log(`[UnifiedCache] Stored ${key} in ${optimalLayer} layer (${reference.size} bytes)`)
    }
  }

  /**
   * 删除内容
   * @param key 缓存键
   */
  delete(key: string): boolean {
    const reference = this.referenceMap.get(key)
    if (!reference) {
      return false
    }

    // 减少引用计数
    reference.refCount--

    // 如果引用计数为0，删除实际存储的内容
    if (reference.refCount <= 0) {
      this.deleteFromStorage(reference.storageKey, reference.storageLayer)

      // 清理哈希映射
      for (const [hash, mappedKey] of this.contentHashMap.entries()) {
        if (mappedKey === key) {
          this.contentHashMap.delete(hash)
          break
        }
      }
    }

    this.referenceMap.delete(key)
    return true
  }

  /**
   * 检查是否存在
   * @param key 缓存键
   */
  has(key: string): boolean {
    return this.referenceMap.has(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.referenceMap.clear()
    this.contentHashMap.clear()
    this.memoryCache.clear()
    this.popoverCache.clear()
    // 注意：不清空sessionStorage，因为可能有其他数据
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const hitRate = ((this.stats.memoryHits + this.stats.sessionHits + this.stats.popoverHits) / this.stats.totalRequests * 100)


    return {
      ...this.stats,
      hitRate: hitRate,
      totalCacheEntries: this.referenceMap.size,
      uniqueContentCount: this.contentHashMap.size,
      memoryUsage: this.calculateTotalMemoryUsage()
    }
  }

  /**
   * 清理过期和低频访问的缓存
   */
  cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [key, reference] of this.referenceMap.entries()) {
      // 清理超过1小时未访问的缓存
      if (now - reference.lastAccessed > 60 * 60 * 1000) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach(key => this.delete(key))

    if (expiredKeys.length > 0) {
      console.log(`[UnifiedCache] Cleaned up ${expiredKeys.length} expired cache entries`)
    }
  }

  /**
   * 选择最佳存储层
   * @param content 内容
   * @param preferred 首选层
   */
  private selectOptimalLayer(content: string, preferred: CacheLayer): CacheLayer {
    const size = this.calculateSize(content)

    // 大内容优先存储在SessionStorage
    if (size > 100 * 1024) { // 100KB
      return CacheLayer.SESSION
    }

    // 小内容优先存储在内存
    if (size < 10 * 1024) { // 10KB
      return CacheLayer.MEMORY
    }

    // 中等大小内容根据首选层决定
    return preferred
  }

  /**
   * 存储内容到指定层
   * @param key 存储键
   * @param content 内容
   * @param layer 存储层
   */
  private storeContent(key: string, content: string, layer: CacheLayer): boolean {
    try {
      switch (layer) {
        case CacheLayer.MEMORY:
          this.memoryCache.set(key, content)
          return true

        case CacheLayer.SESSION:
          this.storageManager.setSessionItem(key, content)
          return true

        case CacheLayer.POPOVER:
          this.popoverCache.set(key, content)
          return true

        default:
          return false
      }
    } catch (error) {
      console.warn(`[UnifiedCache] Failed to store content in ${layer}:`, error)
      return false
    }
  }

  /**
   * 从存储层删除内容
   * @param key 存储键
   * @param layer 存储层
   */
  private deleteFromStorage(key: string, layer: CacheLayer): void {
    try {
      switch (layer) {
        case CacheLayer.MEMORY:
          this.memoryCache.delete(key)
          break

        case CacheLayer.SESSION:
          this.storageManager.removeSessionItem(key)
          break

        case CacheLayer.POPOVER:
          this.popoverCache.delete(key)
          break
      }
    } catch (error) {
      console.warn(`[UnifiedCache] Failed to delete from ${layer}:`, error)
    }
  }

  /**
   * 生成存储键
   * @param originalKey 原始键
   * @param layer 存储层
   */
  private generateStorageKey(originalKey: string, layer: CacheLayer): string {
    // 检查键是否已经有前缀，避免重复添加
    const existingPrefix = extractCacheKeyPrefix(originalKey)
    if (existingPrefix) {
      return originalKey // 已经有前缀，直接返回
    }

    // 根据存储层映射到正确的前缀
    const prefixMap = {
      [CacheLayer.MEMORY]: CacheKeyRules.PREFIXES.CONTENT,
      [CacheLayer.SESSION]: CacheKeyRules.PREFIXES.CONTENT,
      [CacheLayer.POPOVER]: CacheKeyRules.PREFIXES.POPOVER,
    }

    const prefix = prefixMap[layer] || CacheKeyRules.PREFIXES.CONTENT
    return `${prefix}${originalKey}`
  }

  /**
   * 计算内容哈希
   * @param content 内容
   */
  private calculateHash(content: string): string {
    // 简单哈希算法，实际项目中可以使用更复杂的算法
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return hash.toString(36)
  }

  /**
   * 计算内容大小
   * @param content 内容
   */
  private calculateSize(content: string): number {
    return new Blob([content]).size
  }

  /**
   * 计算总内存使用量
   */
  private calculateTotalMemoryUsage(): number {
    let totalSize = 0
    for (const reference of this.referenceMap.values()) {
      totalSize += reference.size
    }
    return totalSize
  }

  /**
   * 验证缓存键的一致性
   * @param key 缓存键
   * @returns 验证结果
   */
  validateCacheKey(key: string): CacheKeyValidationResult {
    const issues: string[] = []
    const suggestions: string[] = []

    // 检查引用映射
    const reference = this.referenceMap.get(key)
    if (!reference) {
      issues.push(`No reference found for key: ${key}`)
      suggestions.push("Check if the key was properly stored")
      return { isValid: false, issues, suggestions }
    }

    // 检查存储层内容
    let contentExists = false
    switch (reference.storageLayer) {
      case CacheLayer.MEMORY:
        contentExists = this.memoryCache.has(reference.storageKey)
        break
      case CacheLayer.SESSION:
        contentExists = this.storageManager.getSessionItem(reference.storageKey) !== null
        break
      case CacheLayer.POPOVER:
        contentExists = this.popoverCache.has(reference.storageKey)
        break
    }

    if (!contentExists) {
      issues.push(`Content not found in ${reference.storageLayer} layer with key: ${reference.storageKey}`)
      suggestions.push("The reference exists but the actual content is missing")
    }

    return {
      isValid: contentExists,
      issues,
      suggestions
    }
  }

  /**
   * 修复损坏的缓存引用
   * @param key 缓存键
   * @returns 是否修复成功
   */
  repairCacheReference(key: string): boolean {
    const validation = this.validateCacheKey(key)
    if (validation.isValid) {
      return true
    }

    // 删除损坏的引用
    this.referenceMap.delete(key)
    
    // 清理哈希映射
    for (const [hash, mappedKey] of this.contentHashMap.entries()) {
      if (mappedKey === key) {
        this.contentHashMap.delete(hash)
        break
      }
    }

    return false
  }

  /**
   * 获取缓存诊断信息
   * @param key 缓存键
   * @returns 诊断信息
   */
  getCacheDiagnostics(key: string): CacheDiagnostics {
    const reference = this.referenceMap.get(key)
    const validation = this.validateCacheKey(key)
    
    // 检查各存储层
    const storageLayerInfo = {
      memory: this.memoryCache.has(key),
      session: this.storageManager.getSessionItem(key) !== null,
      popover: this.popoverCache.has(key)
    }

    return {
      key,
      reference,
      validation,
      storageLayerInfo,
      availableKeys: Array.from(this.referenceMap.keys())
    }
  }

  /**
   * 创建默认实例
   */
  static createDefault(
    memoryCache: OptimizedCacheManager<string>,
    storageManager: UnifiedStorageManager,
    popoverCache: OptimizedCacheManager<string>
  ): UnifiedContentCacheManager {
    return new UnifiedContentCacheManager(memoryCache, storageManager, popoverCache)
  }
}