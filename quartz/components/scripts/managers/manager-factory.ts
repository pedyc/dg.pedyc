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
   * 通用管理器创建和注册方法
   * 负责检查现有实例、创建新实例、注册到清理管理器并记录日志
   * @param config 实例配置
   * @param creator 创建实例的函数
   * @param managerName 管理器名称，用于日志
   * @returns 管理器实例
   */
  private static _createAndRegisterManager<T>(
    config: ManagerInstanceConfig,
    creator: () => T,
    managerName: string
  ): T {
    const instanceKey = `${config.type}_${config.identifier || 'default'}`

    // 检查是否已存在实例
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey) as T
    }

    // 创建实例
    const instance = creator()

    // 注册实例
    this.instances.set(instanceKey, instance)

    // 注册到清理管理器
    this.getCleanupManager().register(instanceKey, instance as any)

    console.log(`[ManagerFactory] Created ${managerName}: ${instanceKey}`)
    return instance
  }

  /**
   * 创建缓存管理器实例
   * @param config 实例配置
   * @returns 缓存管理器实例
   */
  static createCacheManager<T = any>(
    config: ManagerInstanceConfig
  ): OptimizedCacheManager<T> {
    return this._createAndRegisterManager(
      config,
      () => {
        const cacheType = config.config?.cacheType || CacheInstanceType.DEFAULT
        return CacheFactory.createOptimizedCache<T>({
          type: cacheType,
          enableMemoryLayer: config.config?.enableMemoryLayer ?? true,
          enableSessionLayer: config.config?.enableSessionLayer ?? false,
          configOverride: config.config?.configOverride,
        })
      },
      "CacheManager"
    )
  }

  /**
   * 创建资源管理器实例
   * @param config 实例配置
   * @returns 资源管理器实例
   */
  static createResourceManager(
    config: ManagerInstanceConfig
  ): ResourceManager {
    return this._createAndRegisterManager(
      config,
      () => new ResourceManager(),
      "ResourceManager"
    )
  }

  /**
   * 创建存储管理器实例
   * @param config 实例配置
   * @returns 存储管理器实例
   */
  static createStorageManager(
    config: ManagerInstanceConfig
  ): UnifiedStorageManager {
    return this._createAndRegisterManager(
      config,
      () => new UnifiedStorageManager(),
      "StorageManager"
    )
  }

  /**
   * 创建统一内容缓存管理器实例
   * @param config 实例配置
   * @returns 统一内容缓存管理器实例
   */
  static createUnifiedContentCacheManager(
    config: ManagerInstanceConfig
  ): UnifiedContentCacheManager {
    return this._createAndRegisterManager(
      config,
      () => {
        const cacheType = config.config?.cacheType || CacheInstanceType.CONTENT
        return CacheFactory.createUnifiedContentCache({
          type: cacheType,
          enableMemoryLayer: config.config?.enableMemoryLayer ?? true,
          enableSessionLayer: config.config?.enableSessionLayer ?? true,
          configOverride: config.config?.configOverride,
        })
      },
      "UnifiedContentCacheManager"
    )
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
  /**
   * 清理所有已注册的管理器实例
   */
  static cleanup(): void {
    console.log(`[ManagerFactory] Cleaning up all registered manager instances...`)
    this.instances.forEach((instance, key) => {
      if (instance && typeof instance.cleanup === 'function') {
        try {
          instance.cleanup()
          console.log(`[ManagerFactory] Cleaned up instance: ${key}`)
        } catch (error) {
          console.error(`[ManagerFactory] Error cleaning up instance ${key}:`, error)
        }
      }
    })
    console.log(`[ManagerFactory] All registered manager instances cleaned up.`)
  }

  /**
   * 销毁所有已注册的管理器实例并清空注册表
   */
  static destroy(): void {
    console.log(`[ManagerFactory] Destroying all registered manager instances...`)
    this.instances.forEach((instance, key) => {
      if (instance && typeof instance.destroy === 'function') {
        try {
          instance.destroy()
          console.log(`[ManagerFactory] Destroyed instance: ${key}`)
        } catch (error) {
          console.error(`[ManagerFactory] Error destroying instance ${key}:`, error)
        }
      } else if (instance && typeof instance.cleanup === 'function') {
        // 如果没有destroy方法，尝试调用cleanup
        try {
          instance.cleanup()
          console.log(`[ManagerFactory] Cleaned up (as destroy) instance: ${key}`)
        } catch (error) {
          console.error(`[ManagerFactory] Error cleaning up (as destroy) instance ${key}:`, error)
        }
      }
    })
    this.instances.clear()
    this.cleanupManager = null // 清空清理管理器实例
    console.log(`[ManagerFactory] All registered manager instances destroyed and registry cleared.`)
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
  failedLinksManager: {
    type: ManagerType.CACHE,
    identifier: 'failedLinks',
    config: {
      cacheType: CacheInstanceType.LINK,
      enableMemoryLayer: false,
      enableSessionLayer: true,
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