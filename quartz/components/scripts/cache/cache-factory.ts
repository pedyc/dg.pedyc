/**
 * 缓存工厂模块
 * 统一管理所有缓存实例的创建、配置和生命周期
 */

import { OptimizedCacheManager } from "../managers/OptimizedCacheManager"
import { UnifiedStorageManager } from "../managers/UnifiedStorageManager"
import { UnifiedContentCacheManager } from "../managers/UnifiedContentCacheManager"
import {
  getCacheConfig,
  calculateLayerCapacity,
  CACHE_LAYER_CONFIG,
  type CacheConfig,
} from "./unified-cache"

/**
 * 缓存实例类型枚举
 */
export enum CacheInstanceType {
  /** 内容缓存 - 用于页面内容和弹窗 */
  CONTENT = "CONTENT",
  /** 链接缓存 - 用于链接有效性验证 */
  LINK = "LINK",
  /** 搜索缓存 - 用于搜索结果 */
  SEARCH = "SEARCH",
  /** 用户缓存 - 用于用户偏好设置 */
  USER = "USER",
  /** 系统缓存 - 用于系统配置 */
  SYSTEM = "SYSTEM",
  /** 默认缓存 */
  DEFAULT = "DEFAULT",
}

/**
 * 缓存实例配置接口
 */
export interface CacheInstanceConfig {
  /** 实例类型 */
  type: CacheInstanceType
  /** 是否启用内存层 */
  enableMemoryLayer: boolean
  /** 是否启用会话层 */
  enableSessionLayer: boolean
  /** 自定义配置覆盖 */
  configOverride?: Partial<CacheConfig>
}

/**
 * 缓存工厂类
 * 负责创建和管理所有缓存实例
 */
export class CacheFactory {
  /** 缓存实例注册表 */
  private static readonly instances = new Map<string, OptimizedCacheManager<any>>()
  
  /** 统一内容缓存实例注册表 */
  private static readonly unifiedInstances = new Map<string, UnifiedContentCacheManager>()
  
  /** 存储管理器实例 */
  private static storageManager: UnifiedStorageManager | null = null

  /**
   * 创建优化缓存管理器实例
   * @param config 实例配置
   * @returns 缓存管理器实例
   */
  static createOptimizedCache<T = any>(
    config: CacheInstanceConfig
  ): OptimizedCacheManager<T> {
    const instanceKey = `${config.type}_optimized`
    
    // 检查是否已存在实例
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey) as OptimizedCacheManager<T>
    }

    // 获取基础配置
    const baseConfig = getCacheConfig(config.type)
    
    // 应用内存层配置
    let memoryConfig: Partial<CacheConfig> = {
      ...baseConfig,
      ...config.configOverride,
    }

    if (config.enableMemoryLayer) {
      memoryConfig = {
        ...memoryConfig,
        capacity: calculateLayerCapacity("MEMORY", baseConfig.capacity),
        maxMemoryMB: (baseConfig.maxMemoryMB || 5) * CACHE_LAYER_CONFIG.MEMORY.capacityRatio
      }
    }

    // 创建实例
    const instance = new OptimizedCacheManager<T>(memoryConfig)
    
    // 注册实例
    this.instances.set(instanceKey, instance)
    
    console.log(`[CacheFactory] Created OptimizedCacheManager for ${config.type}`)
    return instance
  }

  /**
   * 创建统一内容缓存管理器实例
   * @param config 实例配置
   * @returns 统一内容缓存管理器实例
   */
  static createUnifiedContentCache(
    config: CacheInstanceConfig
  ): UnifiedContentCacheManager {
    const instanceKey = `${config.type}_unified`
    
    // 检查是否已存在实例
    if (this.unifiedInstances.has(instanceKey)) {
      return this.unifiedInstances.get(instanceKey)!
    }

    // 创建内存缓存实例
    const memoryCache = this.createOptimizedCache<string>({
      ...config,
      enableMemoryLayer: true,
      enableSessionLayer: false,
    })

    // 获取或创建存储管理器
    if (!this.storageManager) {
      this.storageManager = new UnifiedStorageManager()
    }

    // 创建统一内容缓存实例
    const instance = new UnifiedContentCacheManager(memoryCache, this.storageManager)
    
    // 注册实例
    this.unifiedInstances.set(instanceKey, instance)
    
    console.log(`[CacheFactory] Created UnifiedContentCacheManager for ${config.type}`)
    return instance
  }

  /**
   * 获取存储管理器实例（单例）
   * @returns 存储管理器实例
   */
  static getStorageManager(): UnifiedStorageManager {
    if (!this.storageManager) {
      this.storageManager = new UnifiedStorageManager()
      console.log(`[CacheFactory] Created UnifiedStorageManager singleton`)
    }
    return this.storageManager
  }

  /**
   * 获取已注册的缓存实例
   * @param type 缓存类型
   * @param unified 是否获取统一缓存实例
   * @returns 缓存实例或null
   */
  static getInstance(
    type: CacheInstanceType,
    unified: boolean = false
  ): OptimizedCacheManager<any> | UnifiedContentCacheManager | null {
    const instanceKey = `${type}_${unified ? 'unified' : 'optimized'}`
    
    if (unified) {
      return this.unifiedInstances.get(instanceKey) || null
    } else {
      return this.instances.get(instanceKey) || null
    }
  }

  /**
   * 清理所有缓存实例
   */
  static cleanup(): void {
    console.log(`[CacheFactory] Cleaning up all cache instances...`)
    
    // 清理优化缓存实例
    for (const [key, instance] of this.instances.entries()) {
      try {
        instance.cleanup()
        console.log(`[CacheFactory] Cleaned up ${key}`)
      } catch (error) {
        console.error(`[CacheFactory] Error cleaning up ${key}:`, error)
      }
    }
    
    // 清理统一缓存实例
    for (const [key, instance] of this.unifiedInstances.entries()) {
      try {
        instance.cleanup()
        console.log(`[CacheFactory] Cleaned up ${key}`)
      } catch (error) {
        console.error(`[CacheFactory] Error cleaning up ${key}:`, error)
      }
    }
    
    // 清理存储管理器
    if (this.storageManager) {
      try {
        this.storageManager.cleanup()
        console.log(`[CacheFactory] Cleaned up StorageManager`)
      } catch (error) {
        console.error(`[CacheFactory] Error cleaning up StorageManager:`, error)
      }
    }
  }

  /**
   * 销毁所有缓存实例
   */
  static destroy(): void {
    console.log(`[CacheFactory] Destroying all cache instances...`)
    
    this.cleanup()
    
    // 清空注册表
    this.instances.clear()
    this.unifiedInstances.clear()
    this.storageManager = null
    
    console.log(`[CacheFactory] All cache instances destroyed`)
  }

  /**
   * 获取缓存工厂统计信息
   * @returns 统计信息
   */
  static getStats(): {
    optimizedInstances: number
    unifiedInstances: number
    hasStorageManager: boolean
    instanceKeys: string[]
  } {
    return {
      optimizedInstances: this.instances.size,
      unifiedInstances: this.unifiedInstances.size,
      hasStorageManager: this.storageManager !== null,
      instanceKeys: [
        ...Array.from(this.instances.keys()),
        ...Array.from(this.unifiedInstances.keys()),
      ],
    }
  }
}

/**
 * 预定义的缓存实例配置
 */
export const PREDEFINED_CACHE_CONFIGS: Record<CacheInstanceType, CacheInstanceConfig> = {
  [CacheInstanceType.CONTENT]: {
    type: CacheInstanceType.CONTENT,
    enableMemoryLayer: true,
    enableSessionLayer: true,
  },
  [CacheInstanceType.LINK]: {
    type: CacheInstanceType.LINK,
    enableMemoryLayer: true,
    enableSessionLayer: false,
  },
  [CacheInstanceType.SEARCH]: {
    type: CacheInstanceType.SEARCH,
    enableMemoryLayer: true,
    enableSessionLayer: true,
  },
  [CacheInstanceType.USER]: {
    type: CacheInstanceType.USER,
    enableMemoryLayer: true,
    enableSessionLayer: true,
  },
  [CacheInstanceType.SYSTEM]: {
    type: CacheInstanceType.SYSTEM,
    enableMemoryLayer: true,
    enableSessionLayer: false,
  },
  [CacheInstanceType.DEFAULT]: {
    type: CacheInstanceType.DEFAULT,
    enableMemoryLayer: true,
    enableSessionLayer: false,
  },
}