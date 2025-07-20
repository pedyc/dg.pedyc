/**
 * Explorer 性能监控工具
 * 用于跟踪和分析 Explorer 组件的性能指标
 */

// import { GlobalManagerController } from "../managers/global-instances" // 暂时注释未使用的导入

// 性能指标缓存
// 使用Map作为性能缓存，替代不存在的systemCache
const performanceCache = new Map<string, any>()
const PERF_CACHE_PREFIX = "explorer_perf_"
// const PERF_CACHE_TTL = 60 * 60 * 1000 // 1小时 // 暂时注释未使用的常量

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  domOperations: {
    nodeCreations: number
    nodeUpdates: number
    nodeRemovals: number
    totalTime: number
  }
  pathCalculations: {
    cacheHits: number
    cacheMisses: number
    totalCalculations: number
    averageTime: number
  }
  dataProcessing: {
    filterTime: number
    mapTime: number
    sortTime: number
    totalNodes: number
  }
  rendering: {
    fullRebuilds: number
    incrementalUpdates: number
    averageRenderTime: number
  }
}

/**
 * 性能监控器类
 */
class ExplorerPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    domOperations: {
      nodeCreations: 0,
      nodeUpdates: 0,
      nodeRemovals: 0,
      totalTime: 0,
    },
    pathCalculations: {
      cacheHits: 0,
      cacheMisses: 0,
      totalCalculations: 0,
      averageTime: 0,
    },
    dataProcessing: {
      filterTime: 0,
      mapTime: 0,
      sortTime: 0,
      totalNodes: 0,
    },
    rendering: {
      fullRebuilds: 0,
      incrementalUpdates: 0,
      averageRenderTime: 0,
    },
  }

  private timers = new Map<string, number>()

  /**
   * 开始计时
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now())
  }

  /**
   * 结束计时并返回耗时
   */
  endTimer(name: string): number {
    const startTime = this.timers.get(name)
    if (!startTime) {
      console.warn(`Timer '${name}' not found`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(name)
    return duration
  }

  /**
   * 记录 DOM 操作
   */
  recordDOMOperation(type: "create" | "update" | "remove", duration: number): void {
    switch (type) {
      case "create":
        this.metrics.domOperations.nodeCreations++
        break
      case "update":
        this.metrics.domOperations.nodeUpdates++
        break
      case "remove":
        this.metrics.domOperations.nodeRemovals++
        break
    }
    this.metrics.domOperations.totalTime += duration
  }

  /**
   * 记录路径计算
   */
  recordPathCalculation(isCache: boolean, duration: number): void {
    if (isCache) {
      this.metrics.pathCalculations.cacheHits++
    } else {
      this.metrics.pathCalculations.cacheMisses++
    }

    this.metrics.pathCalculations.totalCalculations++
    const total =
      this.metrics.pathCalculations.averageTime *
      (this.metrics.pathCalculations.totalCalculations - 1)
    this.metrics.pathCalculations.averageTime =
      (total + duration) / this.metrics.pathCalculations.totalCalculations
  }

  /**
   * 记录数据处理
   */
  recordDataProcessing(type: "filter" | "map" | "sort", duration: number, nodeCount: number): void {
    switch (type) {
      case "filter":
        this.metrics.dataProcessing.filterTime += duration
        break
      case "map":
        this.metrics.dataProcessing.mapTime += duration
        break
      case "sort":
        this.metrics.dataProcessing.sortTime += duration
        break
    }
    this.metrics.dataProcessing.totalNodes = Math.max(
      this.metrics.dataProcessing.totalNodes,
      nodeCount,
    )
  }

  /**
   * 记录渲染操作
   */
  recordRendering(type: "full" | "incremental", duration: number): void {
    if (type === "full") {
      this.metrics.rendering.fullRebuilds++
    } else {
      this.metrics.rendering.incrementalUpdates++
    }

    const totalRenders =
      this.metrics.rendering.fullRebuilds + this.metrics.rendering.incrementalUpdates
    const total = this.metrics.rendering.averageRenderTime * (totalRenders - 1)
    this.metrics.rendering.averageRenderTime = (total + duration) / totalRenders
  }

  /**
   * 获取性能指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * 重置性能指标
   */
  reset(): void {
    this.metrics = {
      domOperations: {
        nodeCreations: 0,
        nodeUpdates: 0,
        nodeRemovals: 0,
        totalTime: 0,
      },
      pathCalculations: {
        cacheHits: 0,
        cacheMisses: 0,
        totalCalculations: 0,
        averageTime: 0,
      },
      dataProcessing: {
        filterTime: 0,
        mapTime: 0,
        sortTime: 0,
        totalNodes: 0,
      },
      rendering: {
        fullRebuilds: 0,
        incrementalUpdates: 0,
        averageRenderTime: 0,
      },
    }
    this.timers.clear()
  }

  /**
   * 保存性能指标到缓存
   */
  saveMetrics(): void {
    const cacheKey = `${PERF_CACHE_PREFIX}${Date.now()}`
    performanceCache.set(cacheKey, this.metrics)
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const metrics = this.getMetrics()
    const cacheHitRate =
      metrics.pathCalculations.totalCalculations > 0
        ? (
            (metrics.pathCalculations.cacheHits / metrics.pathCalculations.totalCalculations) *
            100
          ).toFixed(1)
        : "0"

    const incrementalRate =
      metrics.rendering.fullRebuilds + metrics.rendering.incrementalUpdates > 0
        ? (
            (metrics.rendering.incrementalUpdates /
              (metrics.rendering.fullRebuilds + metrics.rendering.incrementalUpdates)) *
            100
          ).toFixed(1)
        : "0"

    return `
🚀 Explorer 性能报告

📊 DOM 操作:
  • 节点创建: ${metrics.domOperations.nodeCreations}
  • 节点更新: ${metrics.domOperations.nodeUpdates}
  • 节点删除: ${metrics.domOperations.nodeRemovals}
  • 总耗时: ${metrics.domOperations.totalTime.toFixed(2)}ms

🎯 路径计算:
  • 缓存命中率: ${cacheHitRate}%
  • 总计算次数: ${metrics.pathCalculations.totalCalculations}
  • 平均耗时: ${metrics.pathCalculations.averageTime.toFixed(2)}ms

⚡ 数据处理:
  • 过滤耗时: ${metrics.dataProcessing.filterTime.toFixed(2)}ms
  • 映射耗时: ${metrics.dataProcessing.mapTime.toFixed(2)}ms
  • 排序耗时: ${metrics.dataProcessing.sortTime.toFixed(2)}ms
  • 处理节点数: ${metrics.dataProcessing.totalNodes}

🎨 渲染性能:
  • 完全重建: ${metrics.rendering.fullRebuilds}
  • 增量更新: ${metrics.rendering.incrementalUpdates}
  • 增量更新率: ${incrementalRate}%
  • 平均渲染时间: ${metrics.rendering.averageRenderTime.toFixed(2)}ms
    `
  }
}

// 导出单例实例
export const performanceMonitor = new ExplorerPerformanceMonitor()

/**
 * 性能装饰器，用于自动计时函数执行
 */
export function measurePerformance(name: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      performanceMonitor.startTimer(name)
      const result = originalMethod.apply(this, args)
      const duration = performanceMonitor.endTimer(name)

      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return result
    }

    return descriptor
  }
}

/**
 * 异步性能装饰器
 */
export function measureAsyncPerformance(name: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startTimer(name)
      const result = await originalMethod.apply(this, args)
      const duration = performanceMonitor.endTimer(name)

      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return result
    }

    return descriptor
  }
}
