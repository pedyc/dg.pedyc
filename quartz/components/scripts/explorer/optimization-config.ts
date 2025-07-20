/**
 * Explorer 优化配置
 * 集中管理所有优化相关的配置参数
 */

import { globalStorageManager } from "../managers"

export interface OptimizationConfig {
  // 缓存配置
  cache: {
    pathCacheTTL: number // 路径缓存TTL（毫秒）
    nodeCacheMaxSize: number // 节点缓存最大数量
    enablePathCache: boolean // 是否启用路径缓存
    enableNodeCache: boolean // 是否启用节点缓存
  }

  // 性能监控配置
  performance: {
    enableMonitoring: boolean // 是否启用性能监控
    enableBenchmark: boolean // 是否启用基准测试
    reportInterval: number // 报告生成间隔（毫秒）
    maxMetricsHistory: number // 最大指标历史记录数
  }

  // 内存管理配置
  memory: {
    cleanupInterval: number // 内存清理间隔（毫秒）
    maxNodeCacheSize: number // 最大节点缓存大小
    enableAutoCleanup: boolean // 是否启用自动清理
    gcThreshold: number // 垃圾回收阈值
  }

  // DOM 优化配置
  dom: {
    enableEventDelegation: boolean // 是否启用事件委托
    enableIncrementalUpdate: boolean // 是否启用增量更新
    debounceDelay: number // 防抖延迟（毫秒）
    batchUpdateSize: number // 批量更新大小
  }

  // 数据处理配置
  data: {
    enableIterativeProcessing: boolean // 是否启用迭代处理
    maxProcessingBatchSize: number // 最大处理批次大小
    enableDataSimilarityCheck: boolean // 是否启用数据相似性检查
  }
}

/**
 * 默认优化配置
 */
export const DEFAULT_OPTIMIZATION_CONFIG: OptimizationConfig = {
  cache: {
    pathCacheTTL: 30 * 60 * 1000, // 30分钟
    nodeCacheMaxSize: 1000,
    enablePathCache: true,
    enableNodeCache: true,
  },

  performance: {
    enableMonitoring: true,
    enableBenchmark: process.env.NODE_ENV === "development",
    reportInterval: 5 * 60 * 1000, // 5分钟
    maxMetricsHistory: 100,
  },

  memory: {
    cleanupInterval: 5 * 60 * 1000, // 5分钟
    maxNodeCacheSize: 500,
    enableAutoCleanup: true,
    gcThreshold: 0.8, // 80%
  },

  dom: {
    enableEventDelegation: true,
    enableIncrementalUpdate: true,
    debounceDelay: 250, // 250ms
    batchUpdateSize: 50,
  },

  data: {
    enableIterativeProcessing: true,
    maxProcessingBatchSize: 100,
    enableDataSimilarityCheck: true,
  },
}

/**
 * 生产环境优化配置
 */
export const PRODUCTION_OPTIMIZATION_CONFIG: OptimizationConfig = {
  ...DEFAULT_OPTIMIZATION_CONFIG,
  performance: {
    ...DEFAULT_OPTIMIZATION_CONFIG.performance,
    enableMonitoring: false, // 生产环境关闭详细监控
    enableBenchmark: false,
    reportInterval: 30 * 60 * 1000, // 30分钟
  },
  memory: {
    ...DEFAULT_OPTIMIZATION_CONFIG.memory,
    cleanupInterval: 10 * 60 * 1000, // 10分钟
    maxNodeCacheSize: 200, // 减少内存占用
  },
}

/**
 * 开发环境优化配置
 */
export const DEVELOPMENT_OPTIMIZATION_CONFIG: OptimizationConfig = {
  ...DEFAULT_OPTIMIZATION_CONFIG,
  performance: {
    ...DEFAULT_OPTIMIZATION_CONFIG.performance,
    enableMonitoring: true,
    enableBenchmark: true,
    reportInterval: 2 * 60 * 1000, // 2分钟
  },
  memory: {
    ...DEFAULT_OPTIMIZATION_CONFIG.memory,
    cleanupInterval: 2 * 60 * 1000, // 2分钟
    maxNodeCacheSize: 1000, // 更大的缓存用于开发调试
  },
}

/**
 * 配置管理器
 */
class OptimizationConfigManager {
  private config: OptimizationConfig
  private listeners: Array<(config: OptimizationConfig) => void> = []

  constructor() {
    // 根据环境选择配置
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      this.config = DEVELOPMENT_OPTIMIZATION_CONFIG
    } else {
      this.config = PRODUCTION_OPTIMIZATION_CONFIG
    }

    // 尝试从本地存储加载用户配置
    this.loadUserConfig()
  }

  /**
   * 获取当前配置
   */
  getConfig(): OptimizationConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(updates: Partial<OptimizationConfig>): void {
    this.config = this.mergeConfig(this.config, updates)
    this.saveUserConfig()
    this.notifyListeners()
  }

  /**
   * 重置为默认配置
   */
  resetToDefault(): void {
    this.config = { ...DEFAULT_OPTIMIZATION_CONFIG }
    this.saveUserConfig()
    this.notifyListeners()
  }

  /**
   * 添加配置变更监听器
   */
  addListener(listener: (config: OptimizationConfig) => void): void {
    this.listeners.push(listener)
  }

  /**
   * 移除配置变更监听器
   */
  removeListener(listener: (config: OptimizationConfig) => void): void {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * 从本地存储加载用户配置
   */
  private loadUserConfig(): void {
    if (typeof localStorage === "undefined") return

    try {
      const saved = globalStorageManager.instance.getItem("local", "explorer-optimization-config")
      if (saved) {
        const userConfig = JSON.parse(saved)
        this.config = this.mergeConfig(this.config, userConfig)
      }
    } catch (error) {
      console.warn("Failed to load user optimization config:", error)
    }
  }

  /**
   * 保存用户配置到本地存储
   */
  private saveUserConfig(): void {
    if (typeof localStorage === "undefined") return

    try {
      globalStorageManager.instance.setItem(
        "local",
        "explorer-optimization-config",
        JSON.stringify(this.config),
      )
    } catch (error) {
      console.warn("Failed to save user optimization config:", error)
    }
  }

  /**
   * 深度合并配置对象
   */
  private mergeConfig(
    base: OptimizationConfig,
    updates: Partial<OptimizationConfig>,
  ): OptimizationConfig {
    const result = { ...base }

    for (const [key, value] of Object.entries(updates)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key as keyof OptimizationConfig] = {
          ...result[key as keyof OptimizationConfig],
          ...value,
        } as any
      } else {
        result[key as keyof OptimizationConfig] = value as any
      }
    }

    return result
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getConfig())
      } catch (error) {
        console.error("Error in optimization config listener:", error)
      }
    })
  }

  /**
   * 获取配置的可读描述
   */
  getConfigDescription(): string {
    const config = this.getConfig()
    return `
🔧 Explorer 优化配置
${"=".repeat(30)}

📦 缓存配置:
  • 路径缓存TTL: ${config.cache.pathCacheTTL / 1000}秒
  • 节点缓存最大数量: ${config.cache.nodeCacheMaxSize}
  • 启用路径缓存: ${config.cache.enablePathCache ? "✅" : "❌"}
  • 启用节点缓存: ${config.cache.enableNodeCache ? "✅" : "❌"}

📊 性能监控:
  • 启用监控: ${config.performance.enableMonitoring ? "✅" : "❌"}
  • 启用基准测试: ${config.performance.enableBenchmark ? "✅" : "❌"}
  • 报告间隔: ${config.performance.reportInterval / 1000}秒

💾 内存管理:
  • 清理间隔: ${config.memory.cleanupInterval / 1000}秒
  • 最大节点缓存: ${config.memory.maxNodeCacheSize}
  • 自动清理: ${config.memory.enableAutoCleanup ? "✅" : "❌"}

🎨 DOM优化:
  • 事件委托: ${config.dom.enableEventDelegation ? "✅" : "❌"}
  • 增量更新: ${config.dom.enableIncrementalUpdate ? "✅" : "❌"}
  • 防抖延迟: ${config.dom.debounceDelay}ms

📈 数据处理:
  • 迭代处理: ${config.data.enableIterativeProcessing ? "✅" : "❌"}
  • 相似性检查: ${config.data.enableDataSimilarityCheck ? "✅" : "❌"}
    `
  }
}

// 导出单例实例
export const optimizationConfig = new OptimizationConfigManager()

// 在开发环境下添加全局访问
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  ;(window as any).explorerOptimizationConfig = optimizationConfig

  console.log("⚙️ 优化配置管理器已加载，可通过以下方式访问:")
  console.log("  • window.explorerOptimizationConfig.getConfig() - 获取当前配置")
  console.log("  • window.explorerOptimizationConfig.getConfigDescription() - 查看配置描述")
  console.log("  • window.explorerOptimizationConfig.updateConfig({...}) - 更新配置")
}
