/**
 * 管理器模块统一导出
 */

// 导入类
import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { ResourceManager } from "./ResourceManager"
// import { LazyloadManager } from "./LazyloadManager" // 暂时注释以避免循环依赖
import { UnifiedStorageManager } from "./UnifiedStorageManager"
import { UnifiedContentCacheManager } from "./UnifiedContentCacheManager"
import { getCacheConfig, calculateLayerCapacity, CACHE_LAYER_CONFIG } from "../cache/unified-cache"

// 导出所有管理器类
import { GlobalCleanupManager } from "./CleanupManager"
export { UnifiedStorageManager } from "./UnifiedStorageManager"
export { OptimizedCacheManager } from "./OptimizedCacheManager"
export { ResourceManager } from "./ResourceManager"
// export { LazyloadManager } from "./LazyloadManager" // 暂时注释以避免循环依赖
export { ImageLoadManager } from "./ImageLoadManager"
export { ImageObserverManager } from "./ImageObserverManager"
export { UnifiedContentCacheManager, CacheLayer } from "./UnifiedContentCacheManager"

// 获取统一缓存配置
const unifiedConfig = getCacheConfig("DEFAULT")

// 创建全局实例
export const globalCleanupManager = new GlobalCleanupManager()
export const globalResourceManager = new ResourceManager()

// 使用统一配置创建缓存管理器实例
// 内存层缓存配置
const memoryCacheConfig = {
  capacity: calculateLayerCapacity("MEMORY"),
  ttl: unifiedConfig.ttl,
  maxMemoryMB: unifiedConfig.maxMemoryMB * CACHE_LAYER_CONFIG.MEMORY.capacityRatio,
}
export const globalCacheManager = new OptimizedCacheManager<string>(memoryCacheConfig)

// 统一存储管理器
export const globalStorageManager = new UnifiedStorageManager()

// 弹窗层缓存配置 - 使用统一配置
const popoverCacheConfig = {
  capacity: calculateLayerCapacity("POPOVER"),
  ttl: unifiedConfig.ttl,
  maxMemoryMB: unifiedConfig.maxMemoryMB * CACHE_LAYER_CONFIG.POPOVER.capacityRatio,
}
export const globalPopoverCache = new OptimizedCacheManager<string>(popoverCacheConfig)

// 创建统一内容缓存管理器实例
export const globalUnifiedContentCache = UnifiedContentCacheManager.createDefault(
  globalCacheManager,
  globalStorageManager,
  globalPopoverCache,
)

// 注册到全局清理管理器
GlobalCleanupManager.register(globalResourceManager)
GlobalCleanupManager.register(globalCacheManager)
GlobalCleanupManager.register(globalStorageManager)
// GlobalCleanupManager.register(globalLazyloadManager) // 暂时注释以避免循环依赖
GlobalCleanupManager.register(globalPopoverCache)
GlobalCleanupManager.register(globalUnifiedContentCache)

// 设置全局清理事件
if (typeof window !== "undefined") {
  // 页面卸载时清理
  window.addEventListener("beforeunload", () => {
    GlobalCleanupManager.cleanupAll()
  })

  // 页面隐藏时清理（移动端兼容）
  window.addEventListener("pagehide", () => {
    GlobalCleanupManager.cleanupAll()
  })

  // 设置定期清理
  globalResourceManager.setInterval(
    () => {
      GlobalCleanupManager.cleanupAll()
    },
    10 * 60 * 1000,
  ) // 每10分钟清理一次

  // 添加到全局清理函数
  if (window.addCleanup) {
    window.addCleanup(() => {
      GlobalCleanupManager.cleanupAll()
    })
  }
}
