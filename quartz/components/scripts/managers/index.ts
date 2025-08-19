// Barrel file for manager-related modules

import { globalResourceManager } from "./global-instances"

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

if (typeof window !== "undefined") {
  // @ts-ignore
  window.__quartz = window.__quartz || {}
  // @ts-ignore
  window.__quartz.managers = window.__quartz.managers || {}
  // 强制访问 globalResourceManager.instance 以确保其初始化
  globalResourceManager.instance
  // @ts-ignore
  window.__quartz.managers.resourceManager = globalResourceManager.instance
}
