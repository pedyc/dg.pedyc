// Barrel file for cache-related modules

// Export cache configuration and utilities
export { CacheKeyRules, CacheLayer } from './unified-cache';
export type { CacheConfig } from './unified-cache';
export { CacheKeyUtils } from './cache-key-utils';
export { CacheFactory, CacheInstanceType } from './cache-factory';

// Export global cache instances from the centralized manager module
export {
  globalUnifiedContentCache,
  globalLinkCache,
  globalSearchCache,
  globalUserCache,
  globalSystemCache,
  globalDefaultCache,
  globalCacheManager, // For backward compatibility
} from '../managers';