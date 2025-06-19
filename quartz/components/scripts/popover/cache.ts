// 从 managers 导入 OptimizedCacheManager，提供更完善的缓存功能
import { OptimizedCacheManager } from "../managers/OptimizedCacheManager"
// 从 ./config 导入 PopoverConfig，因为 cache.ts 和 config.ts 在同一目录下
import { getCacheConfig } from '../config/cache-config'

/**
 * 全局预加载缓存实例
 * 用于存储预加载的弹窗内容
 */
const popoverCacheConfig = getCacheConfig('POPOVER_PRELOAD_CACHE')
export const preloadedCache = new OptimizedCacheManager<any>({
  maxSize: popoverCacheConfig.capacity,
  maxMemoryMB: 50,
  defaultTTL: popoverCacheConfig.ttl,
  cleanupIntervalMs: 300000
})

