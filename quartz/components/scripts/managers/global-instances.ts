/**
 * 全局管理器实例管理模块
 * 统一创建、管理和导出所有全局管理器实例
 */

import { ManagerFactory, ManagerType, PREDEFINED_MANAGER_CONFIGS } from "./manager-factory"
import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { ResourceManager } from "./ResourceManager"
import { UnifiedStorageManager } from "./UnifiedStorageManager"
import { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"
import { CleanupManager } from "./CleanupManager"


/**
 * 全局管理器实例容器
 */
class GlobalManagerInstances {
  /** 全局缓存管理器实例 */
  private _globalCacheManager: OptimizedCacheManager<any> | null = null
  
  /** URL缓存管理器实例 */
  private _urlCacheManager: OptimizedCacheManager<boolean> | null = null
  
  /** 全局资源管理器实例 */
  private _globalResourceManager: ResourceManager | null = null
  
  /** 全局存储管理器实例 */
  private _globalStorageManager: UnifiedStorageManager | null = null
  
  /** 全局统一内容缓存管理器实例 */
  private _globalUnifiedContentCache: UnifiedContentCacheManager | null = null
  
  /** 全局清理管理器实例 */
  private _globalCleanupManager: CleanupManager | null = null
  

  
  /** 初始化状态 */
  private _initialized = false

  /**
   * 获取全局缓存管理器实例（单例）
   */
  get globalCacheManager(): OptimizedCacheManager<any> {
    if (!this._globalCacheManager) {
      this._globalCacheManager = ManagerFactory.createCacheManager(
        PREDEFINED_MANAGER_CONFIGS.globalCacheManager
      )
      console.log(`[GlobalManagers] Initialized globalCacheManager`)
    }
    return this._globalCacheManager
  }

  /**
   * 获取URL缓存管理器实例（单例）
   */
  get urlCacheManager(): OptimizedCacheManager<boolean> {
    if (!this._urlCacheManager) {
      this._urlCacheManager = ManagerFactory.createCacheManager<boolean>(
        PREDEFINED_MANAGER_CONFIGS.urlCacheManager
      )
      console.log(`[GlobalManagers] Initialized urlCacheManager`)
    }
    return this._urlCacheManager
  }

  /**
   * 获取全局资源管理器实例（单例）
   */
  get globalResourceManager(): ResourceManager {
    if (!this._globalResourceManager) {
      this._globalResourceManager = ManagerFactory.createResourceManager(
        PREDEFINED_MANAGER_CONFIGS.globalResourceManager
      )
      console.log(`[GlobalManagers] Initialized globalResourceManager`)
    }
    return this._globalResourceManager
  }

  /**
   * 获取全局存储管理器实例（单例）
   */
  get globalStorageManager(): UnifiedStorageManager {
    if (!this._globalStorageManager) {
      this._globalStorageManager = ManagerFactory.createStorageManager(
        PREDEFINED_MANAGER_CONFIGS.globalStorageManager
      )
      console.log(`[GlobalManagers] Initialized globalStorageManager`)
    }
    return this._globalStorageManager
  }

  /**
   * 获取全局统一内容缓存管理器实例（单例）
   * 这是主要的内容缓存，用于SPA导航和Popover预加载
   */
  get globalUnifiedContentCache(): UnifiedContentCacheManager {
    if (!this._globalUnifiedContentCache) {
      this._globalUnifiedContentCache = ManagerFactory.createUnifiedContentCacheManager(
        PREDEFINED_MANAGER_CONFIGS.globalUnifiedContentCache
      )
      console.log(`[GlobalManagers] Initialized globalUnifiedContentCache`)
    }
    return this._globalUnifiedContentCache
  }

  /**
   * 获取全局清理管理器实例（单例）
   */
  get globalCleanupManager(): CleanupManager {
    if (!this._globalCleanupManager) {
      this._globalCleanupManager = ManagerFactory.getCleanupManager()
      console.log(`[GlobalManagers] Initialized globalCleanupManager`)
    }
    return this._globalCleanupManager
  }



  /**
   * 初始化所有管理器实例
   * @param preloadAll 是否预加载所有管理器实例
   */
  initialize(preloadAll: boolean = false): void {
    if (this._initialized) {
      console.log(`[GlobalManagers] Already initialized, skipping...`)
      return
    }

    console.log(`[GlobalManagers] Initializing global manager instances...`)
    
    // 总是初始化清理管理器和主要的内容缓存
    this.globalCleanupManager
    this.globalUnifiedContentCache
    
    if (preloadAll) {
      // 预加载所有管理器实例
      this.globalCacheManager
      this.urlCacheManager
      this.globalResourceManager
      this.globalStorageManager

      console.log(`[GlobalManagers] All manager instances preloaded`)
    }
    
    this._initialized = true
    console.log(`[GlobalManagers] Global manager instances initialized`)
  }

  /**
   * 清理所有管理器实例
   */
  cleanup(): void {
    console.log(`[GlobalManagers] Cleaning up all global manager instances...`)
    
    // 使用工厂进行统一清理
    ManagerFactory.cleanup()
    
    console.log(`[GlobalManagers] All global manager instances cleaned up`)
  }

  /**
   * 销毁所有管理器实例
   */
  destroy(): void {
    console.log(`[GlobalManagers] Destroying all global manager instances...`)
    
    this.cleanup()
    
    // 重置所有实例
    this._globalCacheManager = null
    this._urlCacheManager = null
    this._globalResourceManager = null
    this._globalStorageManager = null
    this._globalUnifiedContentCache = null
    this._globalCleanupManager = null

    this._initialized = false
    
    // 销毁工厂中的所有实例
    ManagerFactory.destroy()
    
    console.log(`[GlobalManagers] All global manager instances destroyed`)
  }

  /**
   * 获取全局管理器统计信息
   */
  getStats(): {
    initialized: boolean
    activeInstances: string[]
    factoryStats: ReturnType<typeof ManagerFactory.getStats>
  } {
    const activeInstances: string[] = []
    
    if (this._globalCacheManager) activeInstances.push('globalCacheManager')
    if (this._urlCacheManager) activeInstances.push('urlCacheManager')
    if (this._globalResourceManager) activeInstances.push('globalResourceManager')
    if (this._globalStorageManager) activeInstances.push('globalStorageManager')
    if (this._globalUnifiedContentCache) activeInstances.push('globalUnifiedContentCache')
    if (this._globalCleanupManager) activeInstances.push('globalCleanupManager')
    // if (this._globalPreloadManager) activeInstances.push('globalPreloadManager')
    
    return {
      initialized: this._initialized,
      activeInstances,
      factoryStats: ManagerFactory.getStats(),
    }
  }
}

// 创建全局实例容器
const globalManagerInstances = new GlobalManagerInstances()

// 导出全局管理器实例（向后兼容）
export const globalCacheManager = {
  get instance(): OptimizedCacheManager<any> {
    return globalManagerInstances.globalCacheManager
  }
}

export const urlCacheManager = {
  get instance(): OptimizedCacheManager<boolean> {
    return globalManagerInstances.urlCacheManager
  }
}

export const globalResourceManager = {
  get instance(): ResourceManager {
    return globalManagerInstances.globalResourceManager
  }
}

export const globalStorageManager = {
  get instance(): UnifiedStorageManager {
    return globalManagerInstances.globalStorageManager
  }
}

export const globalUnifiedContentCache = {
  get instance(): UnifiedContentCacheManager {
    return globalManagerInstances.globalUnifiedContentCache
  }
}

export const globalCleanupManager = {
  get instance(): CleanupManager {
    return globalManagerInstances.globalCleanupManager
  }
}

// export const globalPreloadManager = {
//   get instance(): PreloadManager {
//     return globalManagerInstances.globalPreloadManager
//   }
// }

// 导出管理接口
export const GlobalManagerController = {
  /**
   * 初始化全局管理器系统
   * @param preloadAll 是否预加载所有管理器实例
   */
  initialize: (preloadAll: boolean = false) => {
    globalManagerInstances.initialize(preloadAll)
  },
  
  /**
   * 清理全局管理器系统
   */
  cleanup: () => {
    globalManagerInstances.cleanup()
  },
  
  /**
   * 销毁全局管理器系统
   */
  destroy: () => {
    globalManagerInstances.destroy()
  },
  
  /**
   * 获取全局管理器统计信息
   */
  getStats: () => {
    return globalManagerInstances.getStats()
  },
  
  /**
   * 获取指定类型的管理器实例
   */
  getInstance: (type: ManagerType, identifier: string = 'default') => {
    return ManagerFactory.getInstance(type, identifier)
  },
  
  /**
   * 检查管理器实例是否存在
   */
  hasInstance: (type: ManagerType, identifier: string = 'default') => {
    return ManagerFactory.hasInstance(type, identifier)
  },
}

// 导出类型
export { ManagerType } from "./manager-factory"
export type { ManagerInstanceConfig } from "./manager-factory"