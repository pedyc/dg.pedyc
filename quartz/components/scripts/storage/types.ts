/**
 * 缓存类型定义
 */

export interface CacheEntry<T> {
  value: T
  timestamp: number
  accessCount: number
}

export interface StorageOptions {
  storageType: "local" | "session"
  prefix: string
  expiresIn?: number // 过期时间（毫秒）
}

export interface CacheOptions {
  maxSize: number
  persistent?: StorageOptions
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  maxSize: number
}

export type CacheEventType = "hit" | "miss" | "evict" | "clear"

export interface CacheEvent<T = unknown> {
  type: CacheEventType
  key: string
  value?: T
  source: "memory" | "persistent" | "network"
}
