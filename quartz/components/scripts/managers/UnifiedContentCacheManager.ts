/**
 * 统一内容缓存管理器
 * 解决相同内容在多个缓存层重复存储的问题
 * 采用单一存储源 + 引用映射的架构
 */

import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { UnifiedStorageManager } from "./UnifiedStorageManager"
import { CACHE_LAYER_CONFIG, CACHE_PERFORMANCE_CONFIG } from "../cache/unified-cache"
import {
  CacheKeyValidationResult,
  generateStorageKey,
  extractOriginalKey,
  identifyCacheType,
} from "../cache/cache-key-utils"
import { ICleanupManager } from "./CleanupManager"

/**
 * 缓存层级枚举
 */
export enum CacheLayer {
  /** 内存缓存 - 最快访问，存储热数据 */
  MEMORY = "memory",
  /** SessionStorage - 会话持久化，页面刷新保留 */
  SESSION = "session",
}

// CacheKeyValidationResult 已从 cache-key-utils 导入

/**
 * 缓存诊断信息
 */
export interface CacheDiagnostics {
  key: string
  reference: CacheReference | null | undefined
  validation: CacheKeyValidationResult
  storageLayerInfo: {
    memory: boolean
    session: boolean
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

  /** 缓存引用映射表 - 记录每个键对应的实际存储位置 */
  private readonly referenceMap = new Map<string, CacheReference>()

  /** 内容哈希映射 - 避免重复存储相同内容 */
  private readonly contentHashMap = new Map<string, string>()

  /** 统计信息 */
  private stats = {
    totalRequests: 0,
    memoryHits: 0,
    sessionHits: 0,
    duplicatesAvoided: 0,
  }

  /** 单例实例 */
  private static _instance: UnifiedContentCacheManager | null = null

  /** 初始化标志 */
  private static _initialized = false

  constructor(
    memoryCache: OptimizedCacheManager<string>,
    storageManager: UnifiedStorageManager,
  ) {
    this.memoryCache = memoryCache
    this.storageManager = storageManager

    // 只在首次初始化时同步sessionStorage中的缓存引用
    if (!UnifiedContentCacheManager._initialized) {
      this.initializeFromSessionStorage()
      UnifiedContentCacheManager._initialized = true
    }
  }

  /**
   * 从sessionStorage初始化referenceMap
   * 解决页面刷新后referenceMap丢失但sessionStorage数据仍存在的问题
   */
  private initializeFromSessionStorage(): void {
    /**
     * 从sessionStorage初始化referenceMap
     * 解决页面刷新后referenceMap丢失但sessionStorage数据仍存在的问题
     */
    try {
      // 检查window和sessionStorage是否可用，以避免在非浏览器环境下报错
      if (typeof window === "undefined" || !window.sessionStorage) {
        console.warn("[UnifiedCache] window.sessionStorage 不可用，跳过初始化。")
        return
      }
      const sessionStorage = window.sessionStorage
      const restoredCount: { [key: string]: number } = { content: 0 }

      // 遍历sessionStorage中的所有键
      for (let i = 0; i < sessionStorage.length; i++) {
        const storageKey = sessionStorage.key(i)
        if (!storageKey) continue

        // 检查是否是缓存相关的键
        const cacheType = this.identifyCacheType(storageKey)
        if (!cacheType) continue

        const content = sessionStorage.getItem(storageKey)
        if (!content) continue

        // 从存储键推导出原始缓存键
        const originalKey = this.extractOriginalKey(storageKey)
        if (!originalKey) continue

        // 检查referenceMap中是否已存在该键
        if (this.referenceMap.has(originalKey)) continue

        // 创建缓存引用 - 统一使用SESSION层
        const reference: CacheReference = {
          storageLayer: CacheLayer.SESSION,
          storageKey: storageKey,
          refCount: 0, // 初始化时设为0，首次访问时会增加
          lastAccessed: Date.now(),
          size: this.calculateSize(content),
        }

        this.referenceMap.set(originalKey, reference)

        // 更新内容哈希映射
        const contentHash = this.calculateHash(content)
        if (!this.contentHashMap.has(contentHash)) {
          this.contentHashMap.set(contentHash, originalKey)
        }

        restoredCount.content++
      }

      if (restoredCount.content > 0) {
        // console.log(
        //   `[UnifiedCache] 初始化完成: 恢复了 ${restoredCount.content} 个内容缓存引用`,
        //   restoredCount,
        // )
      } else {
        // console.log(`[UnifiedCache] 初始化完成: 未发现需要恢复的缓存引用`)
      }
      // console.log(`[UnifiedCache] Final referenceMap size: ${this.referenceMap.size}`)
      // console.log(`[UnifiedCache] Final referenceMap keys:`, Array.from(this.referenceMap.keys()).slice(0, 10))
    } catch (error) {
      console.warn("[UnifiedCache] 初始化sessionStorage引用时出错:", error)
    }
  }

  /**
   * 识别缓存类型（使用统一工具函数）
   * @param storageKey 存储键
   * @returns 缓存类型或null
   */
  private identifyCacheType(storageKey: string): string | null {
    return identifyCacheType(storageKey)
  }

  /**
   * 从存储键提取原始缓存键（使用统一工具函数）
   * @param storageKey 存储键
   * @returns 原始键
   */
  private extractOriginalKey(storageKey: string): string {
    return extractOriginalKey(storageKey)
  }

  /**
   * 获取内容
   * @param key 缓存键
   * @returns 内容或null
   */
  get(key: string): string | null {
    this.stats.totalRequests++

    // 提取原始键用于查找referenceMap（因为referenceMap存储的是原始键）
    const originalKey = this.extractOriginalKey(key)
    console.log(`[UnifiedCache] Looking for key: ${key}, originalKey: ${originalKey}`)

    const reference = this.referenceMap.get(originalKey)
    if (!reference) {
      console.log(`[UnifiedCache] No reference found for originalKey: ${originalKey}`)
      console.log(`[UnifiedCache] ReferenceMap size: ${this.referenceMap.size}`)
      console.log(`[UnifiedCache] ReferenceMap keys:`, Array.from(this.referenceMap.keys()).slice(0, 5))
      
      // 如果referenceMap为空但sessionStorage中可能有数据，尝试重新初始化
      if (this.referenceMap.size === 0 && typeof window !== "undefined" && window.sessionStorage && window.sessionStorage.length > 0) {
        console.log(`[UnifiedCache] ReferenceMap is empty but sessionStorage has data, attempting re-initialization`)
        this.forceReinitializeFromSessionStorage()
        // 重新尝试获取引用
        const retryReference = this.referenceMap.get(originalKey)
        if (retryReference) {
          console.log(`[UnifiedCache] Found reference after re-initialization for ${originalKey}:`, retryReference)
          return this.getContentFromReference(originalKey, retryReference)
        }
      }
      
      return null
    }
    console.log(`[UnifiedCache] Found reference for ${originalKey}:`, reference)
    
    return this.getContentFromReference(originalKey, reference)
  }
  
  /**
    * 从引用获取内容的辅助方法
    */
   private getContentFromReference(key: string, reference: CacheReference): string | null {
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
        console.log(`[UnifiedCache] Trying to get from SESSION with storageKey: ${reference.storageKey}`)
        content = this.storageManager.getSessionItem(reference.storageKey)
        console.log(`[UnifiedCache] SESSION content found: ${content ? 'YES' : 'NO'}, length: ${content?.length || 0}`)
        if (content) this.stats.sessionHits++
        break
    }

    if (!content) {
      // 尝试清理损坏的引用
      this.referenceMap.delete(key)
    }

    return content
  }
  
  /**
   * 强制重新从sessionStorage初始化referenceMap
   * 用于解决SPA导航时referenceMap丢失的问题
   */
  private forceReinitializeFromSessionStorage(): void {
    console.log(`[UnifiedCache] Force re-initializing from sessionStorage`)
    
    // 清空当前的referenceMap和contentHashMap
    this.referenceMap.clear()
    this.contentHashMap.clear()
    
    // 重新初始化
    this.initializeFromSessionStorage()
    
    console.log(`[UnifiedCache] Force re-initialization completed, referenceMap size: ${this.referenceMap.size}`)
  }

  /**
   * 设置内容
   * @param key 缓存键
   * @param content 内容
   * @param preferredLayer 首选存储层
   */
  set(key: string, content: string, preferredLayer: CacheLayer = CacheLayer.MEMORY): void {
    // 提取原始键用于存储到referenceMap（保持一致性）
    const originalKey = this.extractOriginalKey(key)
    console.log(`[UnifiedCache] Setting cache for key: ${key}, originalKey: ${originalKey}`)
    
    // 计算内容哈希
    const contentHash = this.calculateHash(content)

    // 检查是否已存储相同内容
    const existingKey = this.contentHashMap.get(contentHash)
    if (existingKey && this.referenceMap.has(existingKey)) {
      // 相同内容已存在，创建引用
      const existingRef = this.referenceMap.get(existingKey)!
      this.referenceMap.set(originalKey, {
        storageLayer: existingRef.storageLayer,
        storageKey: existingRef.storageKey,
        refCount: 1,
        lastAccessed: Date.now(),
        size: existingRef.size,
      })
      this.stats.duplicatesAvoided++
      console.log(`[UnifiedCache] Avoided duplicate storage for ${originalKey}, referencing ${existingKey}`)
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
        size: this.calculateSize(content),
      }

      this.referenceMap.set(originalKey, reference)
      this.contentHashMap.set(contentHash, originalKey)

      console.log(`[UnifiedCache] Stored ${originalKey} in ${optimalLayer} layer (${reference.size} bytes)`)
    }
  }

  /**
   * 删除内容
   * @param key 缓存键
   */
  delete(key: string): boolean {
    // 提取原始键用于查找referenceMap（因为referenceMap存储的是原始键）
    const originalKey = this.extractOriginalKey(key)
    const reference = this.referenceMap.get(originalKey)
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
        if (mappedKey === originalKey) {
          this.contentHashMap.delete(hash)
          break
        }
      }
    }

    this.referenceMap.delete(originalKey)
    return true
  }

  /**
   * 检查是否存在
   * @param key 缓存键
   */
  has(key: string): boolean {
    // 提取原始键用于查找referenceMap（因为referenceMap存储的是原始键）
    const originalKey = this.extractOriginalKey(key)
    return this.referenceMap.has(originalKey)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.referenceMap.clear()
    this.contentHashMap.clear()
    this.memoryCache.clear()
    // 注意：不清空sessionStorage，因为可能有其他数据
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const hitRate =
      ((this.stats.memoryHits + this.stats.sessionHits) /
        this.stats.totalRequests) *
      100

    return {
      ...this.stats,
      hitRate: hitRate,
      totalCacheEntries: this.referenceMap.size,
      uniqueContentCount: this.contentHashMap.size,
      memoryUsage: this.calculateTotalMemoryUsage(),
    }
  }

  /**
   * 清理过期和低频访问的缓存
   */
  cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    const cleanupThreshold = CACHE_PERFORMANCE_CONFIG.MEMORY_CHECK_INTERVAL

    for (const [key, reference] of this.referenceMap.entries()) {
      // 使用配置的清理阈值
      if (now - reference.lastAccessed > cleanupThreshold) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach((key) => this.delete(key))

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
    const contentSize = this.calculateSize(content)

    // 使用统一配置的层级策略
    const memoryConfig = CACHE_LAYER_CONFIG.MEMORY
    const sessionConfig = CACHE_LAYER_CONFIG.SESSION

    // 根据统一配置的大小限制选择存储层
    if (contentSize < memoryConfig.maxSizeKB * 1024 && preferred === CacheLayer.MEMORY) {
      return CacheLayer.MEMORY
    }

    if (contentSize < sessionConfig.maxSizeKB * 1024) {
      return CacheLayer.SESSION
    }

    // 如果内容过大，降级到内存缓存（会被LRU自动清理）
    return CacheLayer.MEMORY
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
      }
    } catch (error) {
      console.warn(`[UnifiedCache] Failed to delete from ${layer}:`, error)
    }
  }

  /**
   * 生成存储键（使用统一工具函数）
   * @param originalKey 原始键
   * @param layer 存储层
   */
  private generateStorageKey(originalKey: string, layer: CacheLayer): string {
    return generateStorageKey(originalKey, layer)
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
      hash = (hash << 5) - hash + char
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
      
    }

    if (!contentExists) {
      issues.push(
        `Content not found in ${reference.storageLayer} layer with key: ${reference.storageKey}`,
      )
      suggestions.push("The reference exists but the actual content is missing")
    }

    return {
      isValid: contentExists,
      issues,
      suggestions,
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

    }

    return {
      key,
      reference,
      validation,
      storageLayerInfo,
      availableKeys: Array.from(this.referenceMap.keys()),
    }
  }

  /**
   * 创建默认实例（单例模式）
   * 确保只创建一个实例，避免重复初始化
   */
  static createDefault(
    memoryCache: OptimizedCacheManager<string>,
    storageManager: UnifiedStorageManager,
  ): UnifiedContentCacheManager {
    if (!UnifiedContentCacheManager._instance) {
      console.log(`[UnifiedCache] Creating new singleton instance`)
      UnifiedContentCacheManager._instance = new UnifiedContentCacheManager(memoryCache, storageManager)
      console.log(`[UnifiedCache] Singleton created, initialized: ${UnifiedContentCacheManager._initialized}`)
    } else {
      console.log(`[UnifiedCache] Returning existing singleton instance`)
    }
    return UnifiedContentCacheManager._instance
  }

  /**
   * 重置单例状态（仅用于测试或特殊情况）
   * @internal
   */
  static resetSingleton(): void {
    UnifiedContentCacheManager._instance = null
    UnifiedContentCacheManager._initialized = false
  }
}
