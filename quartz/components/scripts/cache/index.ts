/**
 * 缓存系统统一导出模块
 * 提供所有缓存相关的配置、工具和实例
 */

// 导出核心配置和常量
export {
  CacheKeyRules,
  UNIFIED_CACHE_CONFIG,
  CACHE_LAYER_CONFIG,
  CACHE_THRESHOLDS,
  CACHE_PERFORMANCE_CONFIG,
  CacheMonitorConfig,
} from "./unified-cache"

// 导出接口和类型
export type {
  CacheConfig,
  CacheMonitorConfig as CacheMonitorConfigType,
} from "./unified-cache"

// 导出缓存键工具
export {
  CacheKeyUtils,
  validateCacheKey,
  parseCacheKey,
  sanitizeCacheKey,
  generateStorageKey,
  extractOriginalKey,
  identifyCacheType,
} from "./cache-key-utils"

// 导出缓存键相关类型
export type {
  CacheKeyValidationResult,
  CacheKeyParseResult,
} from "./cache-key-utils"

// 导出工具函数
export {
  getCacheConfig,
  getCacheLayerConfig,
  calculateLayerCapacity,
  validateCacheConfig,
  validateUnifiedCacheConfig,
  validateCacheKey as validateCacheKeyFormat,
  extractCacheKeyPrefix,
  getCacheConfigDiagnostics,
  UnifiedCacheKeyGenerator,
  CacheKeyGeneratorCompat,
} from "./unified-cache"

// 导出缓存工厂
export {
  CacheFactory,
  CacheInstanceType,
  PREDEFINED_CACHE_CONFIGS,
} from "./cache-factory"

export type {
  CacheInstanceConfig,
} from "./cache-factory"

// 导出全局缓存实例
export {
  globalUnifiedContentCache,
  globalLinkCache,
  globalSearchCache,
  globalUserCache,
  globalSystemCache,
  globalDefaultCache,
  globalStorageManager,
  GlobalCacheManager,
} from "./global-instances"

// 导出缓存验证工具
// export * from "./cache-validation" // 文件不存在，已注释