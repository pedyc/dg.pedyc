/**
 * 持久化存储实现 - localStorage / sessionStorage
 */

import type { StorageOptions, CacheEvent, CacheEventType } from './types'

interface StoredEntry<T> {
  value: T
  timestamp: number
  expiresAt?: number
}

export class PersistentStorage {
  private storage: Storage
  private prefix: string

  constructor(options: StorageOptions) {
    this.prefix = options.prefix || 'quartz_'
    this.storage = options.storageType === 'local' ? localStorage : sessionStorage
  }

  /**
   * 获取值
   */
  get<T>(key: string): T | null {
    try {
      const fullKey = this.getFullKey(key)
      const item = this.storage.getItem(fullKey)

      if (!item) return null

      const entry: StoredEntry<T> = JSON.parse(item)

      // 检查是否过期
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.remove(key)
        return null
      }

      return entry.value
    } catch {
      return null
    }
  }

  /**
   * 设置值
   */
  set<T>(key: string, value: T, expiresIn?: number): void {
    try {
      const entry: StoredEntry<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: expiresIn ? Date.now() + expiresIn : undefined
      }

      const fullKey = this.getFullKey(key)
      this.storage.setItem(fullKey, JSON.stringify(entry))

      this.dispatchEvent('hit', key, value, 'persistent')
    } catch (error) {
      console.warn('PersistentStorage: Failed to save', key, error)
      // 如果存储满，尝试清理过期数据
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearExpired()
      }
    }
  }

  /**
   * 删除指定值
   */
  remove(key: string): void {
    const fullKey = this.getFullKey(key)
    this.storage.removeItem(fullKey)
    this.dispatchEvent('evict', key, undefined, 'persistent')
  }

  /**
   * 清空所有以 prefix 开头的值
   */
  clear(): void {
    const keys = this.keys()
    for (const key of keys) {
      this.storage.removeItem(this.getFullKey(key))
    }
    this.dispatchEvent('clear', '', undefined, 'persistent')
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        result.push(key.slice(this.prefix.length))
      }
    }
    return result
  }

  /**
   * 检查是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 清理过期数据
   */
  private clearExpired(): void {
    const keys = this.keys()
    for (const key of keys) {
      this.get(key) // 会自动检查过期并删除
    }
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private dispatchEvent(type: CacheEventType, key: string, value: unknown, source: 'memory' | 'persistent' | 'network'): void {
    const event: CacheEvent = { type, key, value, source }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cache:event', { detail: event }))
    }
  }
}
