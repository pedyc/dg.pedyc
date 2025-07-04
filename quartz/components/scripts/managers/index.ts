/**
 * 管理器模块统一导出
 * 提供所有管理器类和全局实例
 */

// 导出管理器类
export { OptimizedCacheManager } from "./OptimizedCacheManager"
export { ResourceManager } from "./ResourceManager"
export { UnifiedStorageManager } from "./UnifiedStorageManager"
export { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"
export { ICleanupManager, CleanupManager, GlobalCleanupManager } from "./CleanupManager"
export { ImageLoadManager } from "./ImageLoadManager"
export { ImageObserverManager } from "./ImageObserverManager"
export { CacheLayer } from "./UnifiedContentCacheManager"

// 导出管理器类型
export type { CachedItem, CacheStats } from "./OptimizedCacheManager"
export type { ResourceType, ResourceInfo } from "./ResourceManager"
export type { StorageConfig } from "./UnifiedStorageManager"

// 导出工厂和管理器
export {
  ManagerFactory,
  ManagerType,
  PREDEFINED_MANAGER_CONFIGS,
} from "./manager-factory"

export type {
  ManagerInstanceConfig,
} from "./manager-factory"

// 导出全局实例
export {
  globalCacheManager,
  urlCacheManager,
  globalResourceManager,
  globalStorageManager,
  globalUnifiedContentCache,
  globalCleanupManager,

  GlobalManagerController,
} from "./global-instances"

// 向后兼容的便捷函数
import { globalUnifiedContentCache } from "./global-instances"
import type { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"

/**
 * 获取全局统一内容缓存实例的便捷函数
 * @returns 全局统一内容缓存管理器实例
 */
export function getGlobalUnifiedContentCache(): UnifiedContentCacheManager {
  return globalUnifiedContentCache.instance
}
