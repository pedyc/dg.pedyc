// Barrel file for manager-related modules

// Export individual manager classes
export { OptimizedCacheManager } from "./OptimizedCacheManager"
export { ResourceManager } from "./ResourceManager"
export { UnifiedStorageManager } from "./UnifiedStorageManager"
export { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"
export { CleanupManager } from "./CleanupManager"

// Export manager factory and related types
export { ManagerFactory, ManagerType } from "./manager-factory"
export type { ManagerInstanceConfig } from "./manager-factory"

// Export the global manager controller and all global instances
export {
  GlobalManagerController,
  globalUnifiedContentCache,
  globalLinkCache,
  globalSearchCache,
  globalUserCache,
  globalSystemCache,
  globalDefaultCache,
  globalStorageManager,
  globalResourceManager,
  globalCleanupManager,
  urlCacheManager,
  failedLinksManager,
  globalCacheManager, // For backward compatibility
} from "./global-instances"
