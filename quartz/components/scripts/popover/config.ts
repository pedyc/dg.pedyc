import { getCacheConfig, validateCacheConfig } from "../config/cache-config"

/**
 * Popover配置类
 * 提供弹窗相关的配置常量和验证方法
 * 缓存配置统一从cache-config.ts获取
 */
export class PopoverConfig {
  // 从统一配置获取缓存设置
  private static readonly _popoverCacheConfig = getCacheConfig("POPOVER_PRELOAD_CACHE")
  private static readonly _failedLinksCacheConfig = getCacheConfig("FAILED_LINKS_CACHE")
  
  // 缓存配置 - 从统一配置获取
  static readonly CACHE_SIZE = PopoverConfig._popoverCacheConfig.capacity
  static readonly CACHE_TTL = PopoverConfig._popoverCacheConfig.ttl
  static readonly CACHE_WARNING_THRESHOLD = PopoverConfig._popoverCacheConfig.warningThreshold || 25
  static readonly MAX_MEMORY_USAGE = PopoverConfig._popoverCacheConfig.maxMemoryMB * 1024 * 1024 // 转换为字节
  static readonly FAILED_LINK_CACHE_TTL = PopoverConfig._failedLinksCacheConfig.ttl

  // 预加载配置
  static readonly MAX_CONCURRENT_PRELOADS = 3
  static readonly BATCH_SIZE = 5
  static readonly ADAPTIVE_BATCH_MIN = 2
  static readonly ADAPTIVE_BATCH_MAX = 8
  static readonly LINK_VALIDATION_TIMEOUT = 3000 // 链接验证超时时间（毫秒）

  // 存储配置
  static readonly STORAGE_KEY = "popover-failed-links"
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
    const cacheConfigValid = validateCacheConfig(this._popoverCacheConfig) && 
                            validateCacheConfig(this._failedLinksCacheConfig)
    
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
      const configThreshold = this._popoverCacheConfig.memoryThreshold || 0.8
      
      if (memoryPressure > configThreshold) {
        return this.ADAPTIVE_BATCH_MIN
      } else if (memoryPressure < 0.3) {
        return this.ADAPTIVE_BATCH_MAX
      }
    }
    return this.BATCH_SIZE
  }
  
  /**
   * 获取popover缓存配置
   * @returns 弹窗缓存配置对象
   */
  static getPopoverCacheConfig() {
    return this._popoverCacheConfig
  }
  
  /**
   * 获取失败链接缓存配置
   * @returns 失败链接缓存配置对象
   */
  static getFailedLinksCacheConfig() {
    return this._failedLinksCacheConfig
  }
}
