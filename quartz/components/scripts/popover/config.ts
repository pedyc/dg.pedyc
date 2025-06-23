/**
 * Popover配置类
 * 提供弹窗相关的配置常量和验证方法
 */
export class PopoverConfig {
  // 缓存配置
  static readonly CACHE_SIZE = 30
  static readonly CACHE_TTL = 30 * 60 * 1000 // 30分钟
  static readonly CACHE_WARNING_THRESHOLD = 25
  static readonly MAX_MEMORY_USAGE = 50 * 1024 * 1024 // 50MB

  // 预加载配置
  static readonly MAX_CONCURRENT_PRELOADS = 3
  static readonly BATCH_SIZE = 5
  static readonly ADAPTIVE_BATCH_MIN = 2
  static readonly ADAPTIVE_BATCH_MAX = 8

  // 存储配置
  static readonly STORAGE_KEY = "popover-failed-links"
  static readonly MAX_FAILED_LINKS = 100
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
   */
  static validate(): boolean {
    const checks = [
      this.CACHE_SIZE > 0,
      this.CACHE_TTL > 0,
      this.MAX_CONCURRENT_PRELOADS > 0,
      this.BATCH_SIZE > 0,
      this.MAX_FAILED_LINKS > 0,
      this.BATCH_SAVE_DELAY >= 0,
    ]

    return checks.every((check) => check)
  }

  /**
   * 根据当前性能状况计算自适应批量大小
   */
  static getAdaptiveBatchSize(): number {
    const memoryInfo = (performance as any).memory
    if (memoryInfo) {
      const memoryPressure = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit
      if (memoryPressure > 0.8) {
        return this.ADAPTIVE_BATCH_MIN
      } else if (memoryPressure < 0.3) {
        return this.ADAPTIVE_BATCH_MAX
      }
    }
    return this.BATCH_SIZE
  }
}
