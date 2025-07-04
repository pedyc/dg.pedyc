/**
 * 管理器工厂模块
 * 统一管理所有管理器实例的创建、配置和生命周期
 */

import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { ResourceManager } from "./ResourceManager"
import { UnifiedStorageManager } from "./UnifiedStorageManager"
import { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"
import { CleanupManager } from "./CleanupManager"

import { CacheFactory, CacheInstanceType } from "../cache/cache-factory"

/**
 * 管理器类型枚举
 */
export enum ManagerType {
  /** 缓存管理器 */
  CACHE = "CACHE",
  /** 资源管理器 */
  RESOURCE = "RESOURCE",
  /** 存储管理器 */
  STORAGE = "STORAGE",
  /** 统一内容缓存管理器 */
  UNIFIED_CONTENT_CACHE = "UNIFIED_CONTENT_CACHE",
  /** 清理管理器 */
  CLEANUP = "CLEANUP",

}

/**
 * 管理器实例配置接口
 */
export interface ManagerInstanceConfig {
  /** 管理器类型 */
  type: ManagerType
  /** 实例标识符 */
  identifier?: string
  /** 自定义配置 */
  config?: Record<string, any>
}

/**
 * 管理器工厂类
 * 负责创建和管理所有管理器实例
 */
export class ManagerFactory {
  /** 管理器实例注册表 */
  private static readonly instances = new Map<string, any>()
  
  /** 清理管理器实例（全局唯一） */
  private static cleanupManager: CleanupManager | null = null

  /**
   * 创建缓存管理器实例
   * @param config 实例配置
   * @returns 缓存管理器实例
   */
  static createCacheManager<T = any>(
    config: ManagerInstanceConfig
  ): OptimizedCacheManager<T> {
    const instanceKey = `${config.type}_${config.identifier || 'default'}`
    
    // 检查是否已存在实例
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey) as OptimizedCacheManager<T>
    }

    // 使用缓存工厂创建实例
    const cacheType = config.config?.cacheType || CacheInstanceType.DEFAULT
    const instance = CacheFactory.createOptimizedCache<T>({
      type: cacheType,
      enableMemoryLayer: config.config?.enableMemoryLayer ?? true,
      enableSessionLayer: config.config?.enableSessionLayer ?? false,
      configOverride: config.config?.configOverride,
    })
    
    // 注册实例
    this.instances.set(instanceKey, instance)
    
    // 注册到清理管理器
    this.getCleanupManager().register(instanceKey, instance)
    
    console.log(`[ManagerFactory] Created CacheManager: ${instanceKey}`)
    return instance
  }

  /**
   * 创建资源管理器实例
   * @param config 实例配置
   * @returns 资源管理器实例
   */
  static createResourceManager(
    config: ManagerInstanceConfig
  ): ResourceManager {
    const instanceKey = `${config.type}_${config.identifier || 'default'}`
    
    // 检查是否已存在实例
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey) as ResourceManager
    }

    // 创建实例
    const instance = new ResourceManager()
    
    // 注册实例
    this.instances.set(instanceKey, instance)
    
    // 注册到清理管理器
    this.getCleanupManager().register(instanceKey, instance)
    
    console.log(`[ManagerFactory] Created ResourceManager: ${instanceKey}`)
    return instance
  }

  /**
   * 创建存储管理器实例
   * @param config 实例配置
   * @returns 存储管理器实例
   */
  static createStorageManager(
    config: ManagerInstanceConfig
  ): UnifiedStorageManager {
    const instanceKey = `${config.type}_${config.identifier || 'default'}`
    
    // 检查是否已存在实例
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey) as UnifiedStorageManager
    }

    // 创建实例
    const instance = new UnifiedStorageManager()
    
    // 注册实例
    this.instances.set(instanceKey, instance)
    
    // 注册到清理管理器
    this.getCleanupManager().register(instanceKey, instance)
    
    console.log(`[ManagerFactory] Created StorageManager: ${instanceKey}`)
    return instance
  }

  /**
   * 创建统一内容缓存管理器实例
   * @param config 实例配置
   * @returns 统一内容缓存管理器实例
   */
  static createUnifiedContentCacheManager(
    config: ManagerInstanceConfig
  ): UnifiedContentCacheManager {
    const instanceKey = `${config.type}_${config.identifier || 'default'}`
    
    // 检查是否已存在实例
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey) as UnifiedContentCacheManager
    }

    // 使用缓存工厂创建实例
    const cacheType = config.config?.cacheType || CacheInstanceType.CONTENT
    const instance = CacheFactory.createUnifiedContentCache({
      type: cacheType,
      enableMemoryLayer: config.config?.enableMemoryLayer ?? true,
      enableSessionLayer: config.config?.enableSessionLayer ?? true,
      configOverride: config.config?.configOverride,
    })
    
    // 注册实例
    this.instances.set(instanceKey, instance)
    
    // 注册到清理管理器
    this.getCleanupManager().register(instanceKey, instance)
    
    console.log(`[ManagerFactory] Created UnifiedContentCacheManager: ${instanceKey}`)
    return instance
  }



  /**
   * 获取清理管理器实例（全局单例）
   * @returns 清理管理器实例
   */
  static getCleanupManager(): CleanupManager {
    if (!this.cleanupManager) {
      this.cleanupManager = new CleanupManager()
      console.log(`[ManagerFactory] Created CleanupManager singleton`)
    }
    return this.cleanupManager
  }

  /**
   * 获取已注册的管理器实例
   * @param type 管理器类型
   * @param identifier 实例标识符
   * @returns 管理器实例或null
   */
  static getInstance(
    type: ManagerType,
    identifier: string = 'default'
  ): any | null {
    const instanceKey = `${type}_${identifier}`
    return this.instances.get(instanceKey) || null
  }

  /**
   * 检查实例是否存在
   * @param type 管理器类型
   * @param identifier 实例标识符
   * @returns 是否存在
   */
  static hasInstance(
    type: ManagerType,
    identifier: string = 'default'
  ): boolean {
    const instanceKey = `${type}_${identifier}`
    return this.instances.has(instanceKey)
  }

  /**
   * 移除管理器实例
   * @param type 管理器类型
   * @param identifier 实例标识符
   * @returns 是否成功移除
   */
  static removeInstance(
    type: ManagerType,
    identifier: string = 'default'
  ): boolean {
    const instanceKey = `${type}_${identifier}`
    
    if (this.instances.has(instanceKey)) {
      const instance = this.instances.get(instanceKey)
      
      // 从清理管理器中注销
      if (this.cleanupManager) {
        this.cleanupManager.unregister(instanceKey)
      }
      
      // 清理实例
      if (instance && typeof instance.cleanup === 'function') {
        try {
          instance.cleanup()
        } catch (error) {
          console.error(`[ManagerFactory] Error cleaning up ${instanceKey}:`, error)
        }
      }
      
      // 移除实例
      this.instances.delete(instanceKey)
      
      console.log(`[ManagerFactory] Removed instance: ${instanceKey}`)
      return true
    }
    
    return false
  }

  /**
   * 清理所有管理器实例
   */
  static cleanup(): void {
    console.log(`[ManagerFactory] Cleaning up all manager instances...`)
    
    // 使用清理管理器进行统一清理
    if (this.cleanupManager) {
      this.cleanupManager.cleanup()
    }
    
    // 手动清理未注册的实例
    for (const [key, instance] of this.instances.entries()) {
      if (instance && typeof instance.cleanup === 'function') {
        try {
          instance.cleanup()
          console.log(`[ManagerFactory] Cleaned up ${key}`)
        } catch (error) {
          console.error(`[ManagerFactory] Error cleaning up ${key}:`, error)
        }
      }
    }
  }

  /**
   * 销毁所有管理器实例
   */
  static destroy(): void {
    console.log(`[ManagerFactory] Destroying all manager instances...`)
    
    this.cleanup()
    
    // 清空注册表
    this.instances.clear()
    
    // 销毁清理管理器
    if (this.cleanupManager) {
      this.cleanupManager.cleanup()
      this.cleanupManager = null
    }
    
    console.log(`[ManagerFactory] All manager instances destroyed`)
  }

  /**
   * 获取管理器工厂统计信息
   * @returns 统计信息
   */
  static getStats(): {
    totalInstances: number
    hasCleanupManager: boolean
    instanceKeys: string[]
    instancesByType: Record<string, number>
  } {
    const instancesByType: Record<string, number> = {}
    
    for (const key of this.instances.keys()) {
      const type = key.split('_')[0]
      instancesByType[type] = (instancesByType[type] || 0) + 1
    }
    
    return {
      totalInstances: this.instances.size,
      hasCleanupManager: this.cleanupManager !== null,
      instanceKeys: Array.from(this.instances.keys()),
      instancesByType,
    }
  }
}

/**
 * 预定义的管理器实例配置
 */
export const PREDEFINED_MANAGER_CONFIGS: Record<string, ManagerInstanceConfig> = {
  // 缓存管理器配置
  globalCacheManager: {
    type: ManagerType.CACHE,
    identifier: 'global',
    config: {
      cacheType: CacheInstanceType.DEFAULT,
      enableMemoryLayer: true,
      enableSessionLayer: false,
    },
  },
  urlCacheManager: {
    type: ManagerType.CACHE,
    identifier: 'url',
    config: {
      cacheType: CacheInstanceType.LINK,
      enableMemoryLayer: true,
      enableSessionLayer: false,
    },
  },
  
  // 资源管理器配置
  globalResourceManager: {
    type: ManagerType.RESOURCE,
    identifier: 'global',
  },
  
  // 存储管理器配置
  globalStorageManager: {
    type: ManagerType.STORAGE,
    identifier: 'global',
  },
  
  // 统一内容缓存管理器配置
  globalUnifiedContentCache: {
    type: ManagerType.UNIFIED_CONTENT_CACHE,
    identifier: 'global',
    config: {
      cacheType: CacheInstanceType.CONTENT,
      enableMemoryLayer: true,
      enableSessionLayer: true,
    },
  }
  
  // 预加载管理器配置
  // globalPreloadManager: {
  //   type: ManagerType.PRELOAD,
  //   identifier: 'global',
  // },
}