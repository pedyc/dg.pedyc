import type { ICleanupManager } from './CleanupManager'

/**
 * 缓存项接口
 */
export interface CachedItem<T> {
  readonly data: T
  readonly timestamp: number
  readonly ttl: number
  readonly size: number
  readonly accessCount: number
  readonly type?: string
}

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  readonly maxSize: number
  readonly maxMemoryMB: number
  readonly defaultTTL?: number
  readonly cleanupIntervalMs?: number
  readonly memoryThreshold?: number
}

/**
 * 缓存统计信息接口
 */
export interface CacheStats {
  readonly size: number
  readonly memoryUsage: number
  readonly maxMemoryUsage: number
  readonly memoryUsagePercentage: number
  readonly hitRate: number
  readonly keys: readonly string[]
}

/**
 * LRU 缓存节点
 */
class LRUNode<T> {
  constructor(
    public key: string,
    public value: CachedItem<T>,
    public prev: LRUNode<T> | null = null,
    public next: LRUNode<T> | null = null
  ) {}
}

/**
 * 优化的 LRU 缓存实现
 */
class LRUCache<T> {
  private readonly cache = new Map<string, LRUNode<T>>()
  private readonly head: LRUNode<T>
  private readonly tail: LRUNode<T>

  constructor(private readonly capacity: number) {
    // 创建虚拟头尾节点
    this.head = new LRUNode('__head__', {} as CachedItem<T>)
    this.tail = new LRUNode('__tail__', {} as CachedItem<T>)
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  /**
   * 将节点添加到头部
   */
  private addToHead(node: LRUNode<T>): void {
    node.prev = this.head
    node.next = this.head.next!
    this.head.next!.prev = node
    this.head.next = node
  }

  /**
   * 移除指定节点
   */
  private removeNode(node: LRUNode<T>): void {
    node.prev!.next = node.next
    node.next!.prev = node.prev
  }

  /**
   * 将节点移动到头部
   */
  private moveToHead(node: LRUNode<T>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  /**
   * 移除尾部节点
   */
  private removeTail(): LRUNode<T> | null {
    const lastNode = this.tail.prev!
    if (lastNode === this.head) return null
    
    this.removeNode(lastNode)
    return lastNode
  }

  /**
   * 获取缓存项并更新访问顺序
   */
  get(key: string): CachedItem<T> | null {
    const node = this.cache.get(key)
    if (!node) return null
    
    // 移动到头部表示最近访问
    this.moveToHead(node)
    return node.value
  }

  /**
   * 设置缓存项
   */
  set(key: string, value: CachedItem<T>): LRUNode<T> | null {
    const existingNode = this.cache.get(key)
    
    if (existingNode) {
      // 更新现有节点
      existingNode.value = value
      this.moveToHead(existingNode)
      return null
    }
    
    const newNode = new LRUNode(key, value)
    let evictedNode: LRUNode<T> | null = null
    
    // 检查容量限制
    if (this.cache.size >= this.capacity) {
      evictedNode = this.removeTail()
      if (evictedNode) {
        this.cache.delete(evictedNode.key)
      }
    }
    
    this.cache.set(key, newNode)
    this.addToHead(newNode)
    
    return evictedNode
  }

  /**
   * 删除缓存项
   */
  delete(key: string): CachedItem<T> | null {
    const node = this.cache.get(key)
    if (!node) return null
    
    this.removeNode(node)
    this.cache.delete(key)
    return node.value
  }

  /**
   * 检查是否存在指定键
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  /**
   * 获取缓存大小
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * 获取所有键
   */
  keys(): readonly string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取所有值
   */
  values(): readonly CachedItem<T>[] {
    return Array.from(this.cache.values()).map(node => node.value)
  }
}

/**
 * 优化缓存管理器
 * 基于 LRU 算法的内存缓存，支持 TTL、内存监控和自动清理
 */
export class OptimizedCacheManager<T = any> implements ICleanupManager {
  private readonly cache: LRUCache<T>
  private readonly config: Required<CacheConfig>
  private currentMemoryUsage = 0
  private totalHits = 0
  private totalRequests = 0
  private cleanupInterval: number | null = null

  constructor(config: CacheConfig) {
    this.config = {
      maxSize: config.maxSize,
      maxMemoryMB: config.maxMemoryMB,
      cleanupIntervalMs: config.cleanupIntervalMs ?? 5 * 60 * 1000, // 5分钟
      memoryThreshold: config.memoryThreshold ?? 0.8, // 80%
      defaultTTL: config.defaultTTL ?? 30 * 60 * 1000 // 30分钟
    }
    
    this.cache = new LRUCache<T>(this.config.maxSize)
    this.startPeriodicCleanup()
  }

  /**
   * 创建默认配置的缓存管理器
   */
  static createDefault<T = any>(maxSize = 100, maxMemoryMB = 50): OptimizedCacheManager<T> {
    return new OptimizedCacheManager<T>({
      maxSize,
      maxMemoryMB,
      defaultTTL: 30 * 60 * 1000 // 30分钟
    })
  }

  /**
   * 估算对象内存大小（字节）
   */
  private estimateSize(obj: unknown): number {
    if (obj === null || obj === undefined) return 8 // 指针大小
    
    switch (typeof obj) {
      case 'string':
        return obj.length * 2 + 24 // UTF-16 + 对象开销
      case 'number':
        return 8
      case 'boolean':
        return 4
      case 'bigint':
        return obj.toString().length + 16
      case 'symbol':
        return 8
      case 'function':
        return obj.toString().length * 2 + 32
      case 'object':
        if (obj instanceof Date) return 24
        if (obj instanceof RegExp) return obj.source.length * 2 + 32
        if (Array.isArray(obj)) {
          return obj.reduce((sum, item) => sum + this.estimateSize(item), 24)
        }
        
        // 对于普通对象，使用 JSON 序列化估算
        try {
          return JSON.stringify(obj).length * 2 + 32
        } catch {
          return 1024 // 循环引用或不可序列化对象的默认估算
        }
      default:
        return 8
    }
  }

  /**
   * 开始定期清理
   */
  private startPeriodicCleanup(): void {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') return
    
    this.stopPeriodicCleanup()
    
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup()
    }, this.config.cleanupIntervalMs)
  }

  /**
   * 停止定期清理
   */
  private stopPeriodicCleanup(): void {
    if (this.cleanupInterval && typeof window !== 'undefined') {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * 设置缓存项
   */
  set(key: string, data: T, ttl = 30 * 60 * 1000): boolean {
    try {
      const size = this.estimateSize(data)
      const maxMemoryBytes = this.config.maxMemoryMB * 1024 * 1024
      
      // 检查内存使用情况
      if (this.currentMemoryUsage + size > maxMemoryBytes) {
        this.cleanup()
        
        // 如果清理后仍然超限，拒绝添加
        if (this.currentMemoryUsage + size > maxMemoryBytes) {
          console.warn(`缓存内存不足，无法添加键: ${key}，需要 ${size} 字节`)
          return false
        }
      }

      const item: CachedItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        size,
        accessCount: 0
      }

      // 处理可能被驱逐的节点
      const evictedNode = this.cache.set(key, item)
      if (evictedNode) {
        this.currentMemoryUsage -= evictedNode.value.size
      }

      // 如果是更新操作，LRU 会返回 null
      if (!evictedNode) {
        const existingItem = this.cache.get(key)
        if (existingItem && existingItem !== item) {
          this.currentMemoryUsage -= existingItem.size
        }
      }

      this.currentMemoryUsage += size
      return true
      
    } catch (error) {
      console.error(`设置缓存项失败，键: ${key}`, error)
      return false
    }
  }

  /**
   * 获取缓存项
   */
  get(key: string): T | null {
    this.totalRequests++
    
    try {
      const item = this.cache.get(key)
      
      if (!item) {
        return null
      }

      // 检查是否过期
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key)
        return null
      }

      // 更新访问计数
      const updatedItem: CachedItem<T> = {
        ...item,
        accessCount: item.accessCount + 1
      }
      
      // 更新缓存中的项目（这会触发 LRU 重新排序）
      this.cache.set(key, updatedItem)
      
      this.totalHits++
      return item.data
      
    } catch (error) {
      console.error(`获取缓存项失败，键: ${key}`, error)
      return null
    }
  }

  /**
   * 检查缓存项是否存在且未过期
   */
  has(key: string): boolean {
    try {
      const item = this.cache.get(key)
      
      if (!item) {
        return false
      }

      // 检查是否过期
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(key)
        return false
      }

      return true
    } catch (error) {
      console.error(`检查缓存项失败，键: ${key}`, error)
      return false
    }
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    try {
      const deletedItem = this.cache.delete(key)
      if (deletedItem) {
        this.currentMemoryUsage -= deletedItem.size
        return true
      }
      return false
    } catch (error) {
      console.error(`删除缓存项失败，键: ${key}`, error)
      return false
    }
  }

  /**
   * 智能清理过期和低效缓存项
   */
  cleanup(): void {
    try {
      const now = Date.now()
      const maxMemoryBytes = this.config.maxMemoryMB * 1024 * 1024
      const memoryThreshold = maxMemoryBytes * this.config.memoryThreshold
      
      let cleanedCount = 0
      let freedMemory = 0
      const expiredKeys: string[] = []

      // 第一阶段：收集过期项
      for (const key of this.cache.keys()) {
        const item = this.cache.get(key)
        if (item && (now - item.timestamp > item.ttl)) {
          expiredKeys.push(key)
        }
      }

      // 删除过期项
      for (const key of expiredKeys) {
        const deletedItem = this.cache.delete(key)
        if (deletedItem) {
          freedMemory += deletedItem.size
          this.currentMemoryUsage -= deletedItem.size
          cleanedCount++
        }
      }

      // 第二阶段：如果内存使用仍然过高，基于访问频率和大小进行清理
      if (this.currentMemoryUsage > memoryThreshold) {
        const items = this.cache.values()
          .map((item, index) => ({
            key: this.cache.keys()[index],
            item,
            // 计算清理优先级：大小/访问次数，值越大优先级越高
            priority: item.size / Math.max(item.accessCount, 1)
          }))
          .sort((a, b) => b.priority - a.priority)

        // 移除低效项目直到内存使用降到阈值以下
        for (const { key } of items) {
          if (this.currentMemoryUsage <= memoryThreshold) {
            break
          }
          
          const deletedItem = this.cache.delete(key)
          if (deletedItem) {
            freedMemory += deletedItem.size
            this.currentMemoryUsage -= deletedItem.size
            cleanedCount++
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(
          `缓存清理完成：移除 ${cleanedCount} 项，` +
          `释放 ${(freedMemory / 1024).toFixed(2)} KB 内存，` +
          `当前使用率: ${(this.currentMemoryUsage / maxMemoryBytes * 100).toFixed(1)}%`
        )
      }
    } catch (error) {
      console.error('缓存清理失败:', error)
    }
  }

  /**
   * 获取详细的缓存统计信息
   */
  getStats(): CacheStats {
    const maxMemoryBytes = this.config.maxMemoryMB * 1024 * 1024
    const hitRate = this.totalRequests > 0 ? this.totalHits / this.totalRequests : 0
    
    return {
      size: this.cache.size,
      memoryUsage: this.currentMemoryUsage,
      maxMemoryUsage: maxMemoryBytes,
      memoryUsagePercentage: this.currentMemoryUsage / maxMemoryBytes,
      hitRate,
      keys: this.cache.keys()
    }
  }

  /**
   * 获取配置信息
   */
  getConfig(): Readonly<Required<CacheConfig>> {
    return { ...this.config }
  }

  /**
   * 获取指定键的详细信息
   */
  getItemInfo(key: string): (CachedItem<T> & { isExpired: boolean }) | null {
    try {
      const item = this.cache.get(key)
      if (!item) return null
      
      const isExpired = Date.now() - item.timestamp > item.ttl
      return { ...item, isExpired }
    } catch (error) {
      console.error(`获取缓存项信息失败，键: ${key}`, error)
      return null
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    try {
      this.cache.clear()
      this.currentMemoryUsage = 0
      this.totalHits = 0
      this.totalRequests = 0
      console.log('缓存已清空')
    } catch (error) {
      console.error('清空缓存失败:', error)
    }
  }

  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    try {
      this.stopPeriodicCleanup()
      this.clear()
      console.log('缓存管理器已销毁')
    } catch (error) {
      console.error('销毁缓存管理器失败:', error)
    }
  }

  /**
   * 手动触发清理
   */
  forceCleanup(): void {
    this.cleanup()
  }

  /**
    * 重置统计信息
    */
   resetStats(): void {
     this.totalHits = 0
     this.totalRequests = 0
   }
}