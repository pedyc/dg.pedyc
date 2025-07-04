/**
 * 全局缓存实例管理模块
 * 统一创建、管理和导出所有全局缓存实例
 */

import { CacheFactory, CacheInstanceType, PREDEFINED_CACHE_CONFIGS } from "./cache-factory"
import { UnifiedContentCacheManager } from "../managers/UnifiedContentCacheManager"
import { OptimizedCacheManager } from "../managers/OptimizedCacheManager"
import { UnifiedStorageManager } from "../managers/UnifiedStorageManager"

/**
 * 全局缓存实例容器
 */
class GlobalCacheInstances {
  /** 主要内容缓存实例 - 用于SPA和Popover */
  private _unifiedContentCache: UnifiedContentCacheManager | null = null
  
  /** 链接缓存实例 - 用于链接有效性验证 */
  private _linkCache: OptimizedCacheManager<boolean> | null = null
  
  /** 搜索缓存实例 - 用于搜索结果 */
  private _searchCache: OptimizedCacheManager<any> | null = null
  
  /** 用户偏好缓存实例 */
  private _userCache: OptimizedCacheManager<any> | null = null
  
  /** 系统配置缓存实例 */
  private _systemCache: OptimizedCacheManager<any> | null = null
  
  /** 默认缓存实例 */
  private _defaultCache: OptimizedCacheManager<any> | null = null
  
  /** 存储管理器实例 */
  private _storageManager: UnifiedStorageManager | null = null
  
  /** 初始化状态 */
  private _initialized = false

  /**
   * 获取统一内容缓存实例（单例）
   * 这是主要的内容缓存，用于SPA导航和Popover预加载
   */
  get unifiedContentCache(): UnifiedContentCacheManager {
    if (!this._unifiedContentCache) {
      this._unifiedContentCache = CacheFactory.createUnifiedContentCache(
        PREDEFINED_CACHE_CONFIGS[CacheInstanceType.CONTENT]
      )
      console.log(`[GlobalCache] Initialized unifiedContentCache`)
    }
    return this._unifiedContentCache
  }

  /**
   * 获取链接缓存实例（单例）
   * 用于缓存链接有效性验证结果
   */
  get linkCache(): OptimizedCacheManager<boolean> {
    if (!this._linkCache) {
      this._linkCache = CacheFactory.createOptimizedCache<boolean>(
        PREDEFINED_CACHE_CONFIGS[CacheInstanceType.LINK]
      )
      console.log(`[GlobalCache] Initialized linkCache`)
    }
    return this._linkCache
  }

  /**
   * 获取搜索缓存实例（单例）
   * 用于缓存搜索结果
   */
  get searchCache(): OptimizedCacheManager<any> {
    if (!this._searchCache) {
      this._searchCache = CacheFactory.createOptimizedCache(
        PREDEFINED_CACHE_CONFIGS[CacheInstanceType.SEARCH]
      )
      console.log(`[GlobalCache] Initialized searchCache`)
    }
    return this._searchCache
  }

  /**
   * 获取用户偏好缓存实例（单例）
   * 用于缓存用户偏好设置
   */
  get userCache(): OptimizedCacheManager<any> {
    if (!this._userCache) {
      this._userCache = CacheFactory.createOptimizedCache(
        PREDEFINED_CACHE_CONFIGS[CacheInstanceType.USER]
      )
      console.log(`[GlobalCache] Initialized userCache`)
    }
    return this._userCache
  }

  /**
   * 获取系统配置缓存实例（单例）
   * 用于缓存系统配置
   */
  get systemCache(): OptimizedCacheManager<any> {
    if (!this._systemCache) {
      this._systemCache = CacheFactory.createOptimizedCache(
        PREDEFINED_CACHE_CONFIGS[CacheInstanceType.SYSTEM]
      )
      console.log(`[GlobalCache] Initialized systemCache`)
    }
    return this._systemCache
  }

  /**
   * 获取默认缓存实例（单例）
   * 用于通用缓存需求
   */
  get defaultCache(): OptimizedCacheManager<any> {
    if (!this._defaultCache) {
      this._defaultCache = CacheFactory.createOptimizedCache(
        PREDEFINED_CACHE_CONFIGS[CacheInstanceType.DEFAULT]
      )
      console.log(`[GlobalCache] Initialized defaultCache`)
    }
    return this._defaultCache
  }

  /**
   * 获取存储管理器实例（单例）
   */
  get storageManager(): UnifiedStorageManager {
    if (!this._storageManager) {
      this._storageManager = CacheFactory.getStorageManager()
      console.log(`[GlobalCache] Initialized storageManager`)
    }
    return this._storageManager
  }

  /**
   * 初始化所有缓存实例
   * 可选择性地预初始化所有实例
   */
  initialize(preloadAll: boolean = false): void {
    if (this._initialized) {
      console.log(`[GlobalCache] Already initialized, skipping...`)
      return
    }

    console.log(`[GlobalCache] Initializing global cache instances...`)
    
    // 总是初始化主要的内容缓存
    this.unifiedContentCache
    
    if (preloadAll) {
      // 预加载所有缓存实例
      this.linkCache
      this.searchCache
      this.userCache
      this.systemCache
      this.defaultCache
      this.storageManager
      console.log(`[GlobalCache] All cache instances preloaded`)
    }
    
    this._initialized = true
    console.log(`[GlobalCache] Global cache instances initialized`)
  }

  /**
   * 清理所有缓存实例
   */
  cleanup(): void {
    console.log(`[GlobalCache] Cleaning up all global cache instances...`)
    
    const instances = [
      { name: 'unifiedContentCache', instance: this._unifiedContentCache },
      { name: 'linkCache', instance: this._linkCache },
      { name: 'searchCache', instance: this._searchCache },
      { name: 'userCache', instance: this._userCache },
      { name: 'systemCache', instance: this._systemCache },
      { name: 'defaultCache', instance: this._defaultCache },
      { name: 'storageManager', instance: this._storageManager },
    ]
    
    for (const { name, instance } of instances) {
      if (instance) {
        try {
          instance.cleanup()
          console.log(`[GlobalCache] Cleaned up ${name}`)
        } catch (error) {
          console.error(`[GlobalCache] Error cleaning up ${name}:`, error)
        }
      }
    }
  }

  /**
   * 销毁所有缓存实例
   */
  destroy(): void {
    console.log(`[GlobalCache] Destroying all global cache instances...`)
    
    this.cleanup()
    
    // 重置所有实例
    this._unifiedContentCache = null
    this._linkCache = null
    this._searchCache = null
    this._userCache = null
    this._systemCache = null
    this._defaultCache = null
    this._storageManager = null
    this._initialized = false
    
    // 销毁工厂中的所有实例
    CacheFactory.destroy()
    
    console.log(`[GlobalCache] All global cache instances destroyed`)
  }

  /**
   * 获取全局缓存统计信息
   */
  getStats(): {
    initialized: boolean
    activeInstances: string[]
    factoryStats: ReturnType<typeof CacheFactory.getStats>
  } {
    const activeInstances: string[] = []
    
    if (this._unifiedContentCache) activeInstances.push('unifiedContentCache')
    if (this._linkCache) activeInstances.push('linkCache')
    if (this._searchCache) activeInstances.push('searchCache')
    if (this._userCache) activeInstances.push('userCache')
    if (this._systemCache) activeInstances.push('systemCache')
    if (this._defaultCache) activeInstances.push('defaultCache')
    if (this._storageManager) activeInstances.push('storageManager')
    
    return {
      initialized: this._initialized,
      activeInstances,
      factoryStats: CacheFactory.getStats(),
    }
  }
}

// 创建全局实例容器
const globalCacheInstances = new GlobalCacheInstances()

// 导出全局缓存实例（向后兼容）
export const globalUnifiedContentCache = {
  get instance(): UnifiedContentCacheManager {
    return globalCacheInstances.unifiedContentCache
  }
}

// 导出其他全局缓存实例
export const globalLinkCache = {
  get instance(): OptimizedCacheManager<boolean> {
    return globalCacheInstances.linkCache
  }
}

export const globalSearchCache = {
  get instance(): OptimizedCacheManager<any> {
    return globalCacheInstances.searchCache
  }
}

export const globalUserCache = {
  get instance(): OptimizedCacheManager<any> {
    return globalCacheInstances.userCache
  }
}

export const globalSystemCache = {
  get instance(): OptimizedCacheManager<any> {
    return globalCacheInstances.systemCache
  }
}

export const globalDefaultCache = {
  get instance(): OptimizedCacheManager<any> {
    return globalCacheInstances.defaultCache
  }
}

export const globalStorageManager = {
  get instance(): UnifiedStorageManager {
    return globalCacheInstances.storageManager
  }
}

// 导出管理接口
export const GlobalCacheManager = {
  /**
   * 初始化全局缓存系统
   * @param preloadAll 是否预加载所有缓存实例
   */
  initialize: (preloadAll: boolean = false) => {
    globalCacheInstances.initialize(preloadAll)
  },
  
  /**
   * 清理全局缓存系统
   */
  cleanup: () => {
    globalCacheInstances.cleanup()
  },
  
  /**
   * 销毁全局缓存系统
   */
  destroy: () => {
    globalCacheInstances.destroy()
  },
  
  /**
   * 获取全局缓存统计信息
   */
  getStats: () => {
    return globalCacheInstances.getStats()
  },
  
  /**
   * 获取指定类型的缓存实例
   */
  getInstance: (type: CacheInstanceType, unified: boolean = false) => {
    return CacheFactory.getInstance(type, unified)
  },
}

// 导出类型
export { CacheInstanceType } from "./cache-factory"
export type { CacheInstanceConfig } from "./cache-factory"