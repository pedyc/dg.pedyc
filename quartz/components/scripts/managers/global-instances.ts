/**
 * 统一全局管理器实例模块
 * 集中创建、管理并导出所有全局管理器实例，作为唯一的真实来源。
 */

import { ManagerFactory, ManagerType, PREDEFINED_MANAGER_CONFIGS } from "./manager-factory"
import { CacheInstanceType } from '../cache/cache-factory';
import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { ResourceManager } from "./ResourceManager"
import { UnifiedStorageManager } from "./UnifiedStorageManager"
import { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"
import { CleanupManager } from "./CleanupManager"
import { FailedLinksManager } from "../popover/failed-links-manager"

/**
 * 全局管理器实例的内部容器类
 * @internal
 */
class GlobalManagerInstances {
  private _initialized = false

  // 缓存实例
  private _unifiedContentCache: UnifiedContentCacheManager | null = null
  private _linkCache: OptimizedCacheManager<boolean> | null = null
  private _searchCache: OptimizedCacheManager<any> | null = null
  private _userCache: OptimizedCacheManager<any> | null = null
  private _systemCache: OptimizedCacheManager<any> | null = null
  private _defaultCache: OptimizedCacheManager<any> | null = null
  private _urlCacheManager: OptimizedCacheManager<boolean> | null = null
  private _failedLinksManager: FailedLinksManager | null = null

  // 其他管理器实例
  private _storageManager: UnifiedStorageManager | null = null
  private _resourceManager: ResourceManager | null = null
  private _cleanupManager: CleanupManager | null = null

  // --- Getters for all managers ---

  get unifiedContentCache(): UnifiedContentCacheManager {
    if (!this._unifiedContentCache) {
      this._unifiedContentCache = ManagerFactory.createUnifiedContentCacheManager(PREDEFINED_MANAGER_CONFIGS.globalUnifiedContentCache)
      console.log(`[GlobalManagers] Initialized UnifiedContentCacheManager`)
    }
    return this._unifiedContentCache
  }

  get linkCache(): OptimizedCacheManager<boolean> {
    if (!this._linkCache) {
      this._linkCache = this.createCache(CacheInstanceType.LINK)
      console.log(`[GlobalManagers] Initialized LinkCache`)
    }
    return this._linkCache
  }

  get searchCache(): OptimizedCacheManager<any> {
    if (!this._searchCache) {
      this._searchCache = this.createCache(CacheInstanceType.SEARCH)
      console.log(`[GlobalManagers] Initialized SearchCache`)
    }
    return this._searchCache
  }

  get userCache(): OptimizedCacheManager<any> {
    if (!this._userCache) {
      this._userCache = this.createCache(CacheInstanceType.USER)
      console.log(`[GlobalManagers] Initialized UserCache`)
    }
    return this._userCache
  }

  get systemCache(): OptimizedCacheManager<any> {
    if (!this._systemCache) {
      this._systemCache = this.createCache(CacheInstanceType.SYSTEM)
      console.log(`[GlobalManagers] Initialized SystemCache`)
    }
    return this._systemCache
  }

  get defaultCache(): OptimizedCacheManager<any> {
    if (!this._defaultCache) {
      this._defaultCache = this.createCache(CacheInstanceType.DEFAULT)
      console.log(`[GlobalManagers] Initialized DefaultCache`)
    }
    return this._defaultCache
  }

  get urlCacheManager(): OptimizedCacheManager<boolean> {
    if (!this._urlCacheManager) {
      this._urlCacheManager = ManagerFactory.createCacheManager<boolean>(PREDEFINED_MANAGER_CONFIGS.urlCacheManager)
      console.log(`[GlobalManagers] Initialized UrlCacheManager`)
    }
    return this._urlCacheManager
  }

  get failedLinksManager(): FailedLinksManager {
    if (!this._failedLinksManager) {
      this._failedLinksManager = ManagerFactory.createCacheManager(PREDEFINED_MANAGER_CONFIGS.failedLinksManager)
      console.log(`[GlobalManagers] Initialized FailedLinksManager`)
    }
    return this._failedLinksManager
  }

  get storageManager(): UnifiedStorageManager {
    if (!this._storageManager) {
      this._storageManager = ManagerFactory.createStorageManager(PREDEFINED_MANAGER_CONFIGS.globalStorageManager)
      console.log(`[GlobalManagers] Initialized StorageManager`)
    }
    return this._storageManager
  }

  get resourceManager(): ResourceManager {
    if (!this._resourceManager) {
      this._resourceManager = ManagerFactory.createResourceManager(PREDEFINED_MANAGER_CONFIGS.globalResourceManager)
      console.log(`[GlobalManagers] Initialized ResourceManager`)
    }
    return this._resourceManager
  }

  get cleanupManager(): CleanupManager {
    if (!this._cleanupManager) {
      this._cleanupManager = ManagerFactory.getCleanupManager()
      console.log(`[GlobalManagers] Initialized CleanupManager`)
    }
    return this._cleanupManager
  }

  private createCache<T>(type: CacheInstanceType): OptimizedCacheManager<T> {
    return ManagerFactory.createCacheManager<T>({ type: ManagerType.CACHE, identifier: type, config: { cacheType: type } });
  }

  initialize(preloadAll: boolean = false): void {
    if (this._initialized) {
      console.log(`[GlobalManagers] Already initialized, skipping...`)
      return
    }
    console.log(`[GlobalManagers] Initializing global manager instances...`)

    this.cleanupManager
    this.unifiedContentCache

    if (preloadAll) {
      this.linkCache
      this.searchCache
      this.userCache
      this.systemCache
      this.defaultCache
      this.storageManager
      this.resourceManager
      this.failedLinksManager
      this.urlCacheManager
      console.log(`[GlobalManagers] All manager instances preloaded`)
    }

    this._initialized = true
    console.log(`[GlobalManagers] Global manager instances initialized`)
  }

  cleanup(): void {
    console.log(`[GlobalManagers] Cleaning up all global manager instances...`)
    ManagerFactory.cleanup()
    console.log(`[GlobalManagers] All global manager instances cleaned up`)
  }

  destroy(): void {
    console.log(`[GlobalManagers] Destroying all global manager instances...`)
    ManagerFactory.destroy()
    
    this._initialized = false
    // Reset all private properties
    Object.keys(this).forEach(key => {
      if (key.startsWith('_')) {
        (this as any)[key] = null;
      }
    });
    this._initialized = false; // Ensure it's reset after nulling
    console.log(`[GlobalManagers] All global manager instances destroyed`)
  }
}

/**
 * 全局管理器控制器
 * 提供对全局实例的单例访问和生命周期管理
 */
export class GlobalManagerController {
  private static readonly _instance = new GlobalManagerInstances()

  static get instance(): GlobalManagerInstances {
    return this._instance
  }

  static initialize(preloadAll: boolean = false): void {
    this._instance.initialize(preloadAll)
  }

  static cleanup(): void {
    this._instance.cleanup()
  }

  static destroy(): void {
    this._instance.destroy()
  }

  static getInstance(type: ManagerType, _identifier?: string): any {
    switch (type) {
      case ManagerType.CACHE:
        // This is ambiguous, return default cache for now.
        return this.instance.defaultCache;
      case ManagerType.RESOURCE:
        return this.instance.resourceManager;
      case ManagerType.STORAGE:
        return this.instance.storageManager;
      case ManagerType.UNIFIED_CONTENT_CACHE:
        return this.instance.unifiedContentCache;
      case ManagerType.CLEANUP:
        return this.instance.cleanupManager;
      default:
        throw new Error(`[GlobalManagerController] Unknown manager type: ${type}`);
    }
  }
}

// --- Convenience accessors for all global instances ---

export const globalUnifiedContentCache = {
  get instance() { return GlobalManagerController.instance.unifiedContentCache },
}

export const globalLinkCache = {
  get instance() { return GlobalManagerController.instance.linkCache },
}

export const globalSearchCache = {
  get instance() { return GlobalManagerController.instance.searchCache },
}

export const globalUserCache = {
  get instance() { return GlobalManagerController.instance.userCache },
}

export const globalSystemCache = {
  get instance() { return GlobalManagerController.instance.systemCache },
}

export const globalDefaultCache = {
  get instance() { return GlobalManagerController.instance.defaultCache },
}

export const globalStorageManager = {
  get instance() { return GlobalManagerController.instance.storageManager },
}

export const globalResourceManager = {
  get instance() { return GlobalManagerController.instance.resourceManager },
}

export const globalCleanupManager = {
  get instance() { return GlobalManagerController.instance.cleanupManager },
}

export const urlCacheManager = {
  get instance() { return GlobalManagerController.instance.urlCacheManager },
}

export const failedLinksManager = {
  get instance() { return GlobalManagerController.instance.failedLinksManager },
}

// Backward compatibility
export const globalCacheManager = {
  get instance() { return GlobalManagerController.instance.defaultCache },
}