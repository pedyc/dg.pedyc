import { CacheKeyFactory } from "../cache"
import {
  getCacheConfig,
  CACHE_PERFORMANCE_CONFIG,
  validateUnifiedCacheConfig,
  calculateLayerCapacity,
} from "../cache/unified-cache"

/**
 * Popover配置类
 * 提供弹窗相关的配置常量和验证方法
 * 使用统一缓存配置，确保popover和content资源共享
 */
export class PopoverConfig {
  // 使用统一缓存配置
  private static readonly _unifiedCacheConfig = getCacheConfig("DEFAULT")
  private static readonly _failedLinksCacheConfig = getCacheConfig("DEFAULT") // 失败链接也使用统一配置

  // 缓存配置 - 从统一配置获取，popover和content共享资源
  static readonly CACHE_SIZE = calculateLayerCapacity("MEMORY") // 使用content层的计算容量
  static readonly CACHE_TTL = PopoverConfig._unifiedCacheConfig.ttl
  static readonly CACHE_WARNING_THRESHOLD =
    PopoverConfig._unifiedCacheConfig.warningThreshold || 160
  static readonly MAX_MEMORY_USAGE = PopoverConfig._unifiedCacheConfig.maxMemoryMB * 1024 * 1024 // 转换为字节
  static readonly FAILED_LINK_CACHE_TTL = PopoverConfig._failedLinksCacheConfig.ttl

  // 预加载配置 - 使用统一性能配置
  static readonly MAX_CONCURRENT_PRELOADS = CACHE_PERFORMANCE_CONFIG.MAX_CONCURRENT_PRELOADS
  static readonly BATCH_SIZE = CACHE_PERFORMANCE_CONFIG.BATCH_SIZE
  static readonly ADAPTIVE_BATCH_MIN = 2
  static readonly ADAPTIVE_BATCH_MAX = 8
  static readonly LINK_VALIDATION_TIMEOUT = 3000 // 链接验证超时时间（毫秒）

  // 存储配置 - 使用统一键生成器
  static readonly STORAGE_KEY = CacheKeyFactory.generateSystemKey("failed-links")
  static readonly MAX_FAILED_LINKS = PopoverConfig._failedLinksCacheConfig.capacity
  static readonly BATCH_SAVE_DELAY = 1000

  // UI配置
  static readonly POPOVER_ID_PREFIX = "popover-"
  static readonly POPOVER_INTERNAL_PREFIX = "popover-internal-"
  static readonly SCROLL_OFFSET = 10

  // 视口预加载配置
  static readonly VIEWPORT_MARGIN = "200px"
  static readonly INTERSECTION_THRESHOLD = 0.1

  /**
   * 验证配置的有效性
   * 使用统一配置验证器并添加popover特定验证
   */
  static validate(): boolean {
    // 验证统一缓存配置
    const cacheConfigValid = validateUnifiedCacheConfig() // 统一验证，失败链接也使用相同配置

    // 验证popover特定配置
    const popoverChecks = [
      this.MAX_CONCURRENT_PRELOADS > 0,
      this.BATCH_SIZE > 0,
      this.BATCH_SAVE_DELAY >= 0,
      this.LINK_VALIDATION_TIMEOUT > 0,
      this.ADAPTIVE_BATCH_MIN > 0,
      this.ADAPTIVE_BATCH_MAX >= this.ADAPTIVE_BATCH_MIN,
    ]

    return cacheConfigValid && popoverChecks.every((check) => check)
  }

  /**
   * 根据当前性能状况计算自适应批量大小
   * 结合统一配置的内存阈值进行优化
   */
  static getAdaptiveBatchSize(): number {
    const memoryInfo = (performance as any).memory
    if (memoryInfo) {
      const memoryPressure = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit
      const configThreshold = this._unifiedCacheConfig.memoryThreshold || 0.85

      if (memoryPressure > configThreshold) {
        return this.ADAPTIVE_BATCH_MIN
      } else if (memoryPressure < 0.3) {
        return this.ADAPTIVE_BATCH_MAX
      }
    }
    return this.BATCH_SIZE
  }

  /**
   * 获取统一缓存配置
   * @returns 统一缓存配置对象
   */
  static getUnifiedCacheConfig() {
    return this._unifiedCacheConfig
  }

  /**
   * 获取popover缓存配置（兼容性方法）
   * @returns 统一缓存配置对象
   */
  static getPopoverCacheConfig() {
    return this._unifiedCacheConfig
  }

  /**
   * 获取失败链接缓存配置
   * @returns 失败链接缓存配置对象
   */
  static getFailedLinksCacheConfig() {
    return this._failedLinksCacheConfig
  }
}
