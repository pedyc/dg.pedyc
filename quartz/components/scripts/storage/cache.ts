/**
 * LRU (Least Recently Used) 内存缓存实现
 */

import type { CacheEntry, CacheStats, CacheEvent, CacheEventType } from './types'

export class LRUCache<T> {
  private maxSize: number
  private cache: Map<string, CacheEntry<T>>
  private accessOrder: string[] = []
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, maxSize: 0 }

  constructor(maxSize: number) {
    this.maxSize = maxSize
    this.cache = new Map()
    this.stats.maxSize = maxSize
  }

  /**
   * 获取缓存值
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (entry === undefined) {
      this.stats.misses++
      this.dispatchEvent('miss', key, undefined, 'memory')
      return undefined
    }

    // 检查是否过期
    if (entry.timestamp && this.isExpired(entry.timestamp)) {
      this.delete(key)
      this.stats.misses++
      this.dispatchEvent('miss', key, undefined, 'memory')
      return undefined
    }

    // 更新访问顺序
    this.updateAccessOrder(key)

    // 更新访问计数
    entry.accessCount++

    this.stats.hits++
    this.dispatchEvent('hit', key, entry.value, 'memory')

    return entry.value
  }

  /**
   * 设置缓存值
   */
  set(key: string, value: T, expiresIn?: number): void {
    // 如果 key 已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key)
      this.removeFromAccessOrder(key)
    }

    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize && this.cache.size > 0) {
      this.evictOldest()
    }

    // 添加新条目
    const entry: CacheEntry<T> = {
      value,
      timestamp: expiresIn ? Date.now() + expiresIn : 0,
      accessCount: 0
    }

    this.cache.set(key, entry)
    this.accessOrder.push(key)
    this.stats.size = this.cache.size

    this.dispatchEvent('hit', key, value, 'memory')
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    if (!this.cache.has(key)) return false

    const entry = this.cache.get(key)!
    if (entry.timestamp && this.isExpired(entry.timestamp)) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * 删除指定缓存
   */
  delete(key: string): boolean {
    const existed = this.cache.delete(key)
    if (existed) {
      this.removeFromAccessOrder(key)
      this.stats.size = this.cache.size
      this.dispatchEvent('evict', key, undefined, 'memory')
    }
    return existed
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
    this.stats.size = 0
    this.dispatchEvent('clear', '', undefined, 'memory')
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * 获取命中率
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses
    return total === 0 ? 0 : this.stats.hits / total
  }

  /**
   * 获取所有缓存键
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取缓存值（不更新访问顺序）
   */
  peek(key: string): T | undefined {
    return this.cache.get(key)?.value
  }

  // 私有方法

  private isExpired(timestamp: number): boolean {
    return timestamp > 0 && Date.now() > timestamp
  }

  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
    this.accessOrder.push(key)
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }

  private evictOldest(): void {
    if (this.accessOrder.length === 0) return

    const oldestKey = this.accessOrder.shift()!
    const entry = this.cache.get(oldestKey)

    this.cache.delete(oldestKey)
    this.stats.size = this.cache.size

    if (entry) {
      this.dispatchEvent('evict', oldestKey, entry.value, 'memory')
    }
  }

  private dispatchEvent(type: CacheEventType, key: string, value: T | undefined, source: 'memory' | 'persistent' | 'network'): void {
    const event: CacheEvent<T> = { type, key, value, source }

    // 使用 CustomEvent 触发事件，供其他组件监听
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cache:event', { detail: event }))
    }
  }
}
