/**
 * 缓存监控工具
 * 提供统一缓存管理器的性能监控和统计信息
 */

import { globalUnifiedContentCache } from "../managers/index"

/**
 * 缓存监控器
 * 提供缓存性能分析和优化建议
 */
export class CacheMonitor {
  private static instance: CacheMonitor | null = null
  private monitoringInterval: number | null = null
  private readonly monitoringIntervalMs = 30000 // 30秒
  
  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): CacheMonitor {
    if (!this.instance) {
      this.instance = new CacheMonitor()
    }
    return this.instance
  }

  /**
   * 开始监控
   */
  startMonitoring(): void {
    if (this.monitoringInterval) {
      return // 已经在监控中
    }

    console.log("[CacheMonitor] Starting cache monitoring...")
    
    // 立即执行一次
    this.logCacheStats()
    
    // 设置定期监控
    this.monitoringInterval = window.setInterval(() => {
      this.logCacheStats()
    }, this.monitoringIntervalMs)
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
      console.log("[CacheMonitor] Cache monitoring stopped")
    }
  }

  /**
   * 获取详细的缓存统计信息
   */
  getCacheStats() {
    return globalUnifiedContentCache.getStats()
  }

  /**
   * 记录缓存统计信息
   */
  private logCacheStats(): void {
    const stats = this.getCacheStats()
    
    console.group("[CacheMonitor] Cache Statistics")
    console.log(`📊 Total Requests: ${stats.totalRequests}`)
    console.log(`🎯 Hit Rate: ${stats.hitRate}`)
    console.log(`💾 Memory Hits: ${stats.memoryHits}`)
    console.log(`💿 Session Hits: ${stats.sessionHits}`)
    console.log(`🎪 Popover Hits: ${stats.popoverHits}`)
    console.log(`🔄 Duplicates Avoided: ${stats.duplicatesAvoided}`)
    console.log(`📁 Total Cache Entries: ${stats.totalCacheEntries}`)
    console.log(`🎨 Unique Content Count: ${stats.uniqueContentCount}`)
    console.log(`💽 Memory Usage: ${this.formatBytes(stats.memoryUsage)}`)
    
    // 计算重复率
    const duplicationRate = stats.totalCacheEntries > 0 
      ? ((stats.totalCacheEntries - stats.uniqueContentCount) / stats.totalCacheEntries * 100).toFixed(2)
      : '0.00'
    console.log(`🔍 Deduplication Rate: ${duplicationRate}%`)
    
    // 提供优化建议
    this.logOptimizationSuggestions(stats)
    
    console.groupEnd()
  }

  /**
   * 记录优化建议
   */
  private logOptimizationSuggestions(stats: any): void {
    const suggestions: string[] = []
    
    // 命中率建议
    const hitRateNum = parseFloat(stats.hitRate.replace('%', ''))
    if (hitRateNum < 70) {
      suggestions.push("💡 Hit rate is low (<70%). Consider increasing cache capacity or TTL.")
    }
    
    // 重复率建议
    const duplicationRate = stats.totalCacheEntries > 0 
      ? (stats.totalCacheEntries - stats.uniqueContentCount) / stats.totalCacheEntries * 100
      : 0
    
    if (duplicationRate > 20) {
      suggestions.push("⚠️ High duplication rate detected. Unified cache is working well!")
    }
    
    // 内存使用建议
    if (stats.memoryUsage > 50 * 1024 * 1024) { // 50MB
      suggestions.push("🚨 High memory usage (>50MB). Consider implementing more aggressive cleanup.")
    }
    
    // 避免重复存储的效果
    if (stats.duplicatesAvoided > 0) {
      const savedMemory = this.estimateSavedMemory(stats)
      suggestions.push(`✅ Saved approximately ${this.formatBytes(savedMemory)} by avoiding duplicates!`)
    }
    
    if (suggestions.length > 0) {
      console.group("💡 Optimization Suggestions")
      suggestions.forEach(suggestion => console.log(suggestion))
      console.groupEnd()
    }
  }

  /**
   * 估算节省的内存
   */
  private estimateSavedMemory(stats: any): number {
    // 假设平均每个重复内容大小为当前总内存使用量除以唯一内容数量
    const avgContentSize = stats.uniqueContentCount > 0 
      ? stats.memoryUsage / stats.uniqueContentCount 
      : 0
    
    return stats.duplicatesAvoided * avgContentSize
  }

  /**
   * 格式化字节数
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * 生成缓存报告
   */
  generateReport(): string {
    const stats = this.getCacheStats()
    const duplicationRate = stats.totalCacheEntries > 0 
      ? ((stats.totalCacheEntries - stats.uniqueContentCount) / stats.totalCacheEntries * 100).toFixed(2)
      : '0.00'
    const savedMemory = this.estimateSavedMemory(stats)
    
    return `
# 缓存性能报告

## 基本统计
- 总请求数: ${stats.totalRequests}
- 命中率: ${stats.hitRate}
- 缓存条目数: ${stats.totalCacheEntries}
- 唯一内容数: ${stats.uniqueContentCount}
- 内存使用: ${this.formatBytes(stats.memoryUsage)}

## 缓存层分布
- 内存缓存命中: ${stats.memoryHits}
- 会话存储命中: ${stats.sessionHits}
- 弹窗缓存命中: ${stats.popoverHits}

## 优化效果
- 避免重复存储: ${stats.duplicatesAvoided} 次
- 去重率: ${duplicationRate}%
- 估算节省内存: ${this.formatBytes(savedMemory)}

## 性能评估
${this.getPerformanceAssessment(stats)}
    `.trim()
  }

  /**
   * 获取性能评估
   */
  private getPerformanceAssessment(stats: any): string {
    const hitRateNum = parseFloat(stats.hitRate.replace('%', ''))
    const duplicationRate = stats.totalCacheEntries > 0 
      ? (stats.totalCacheEntries - stats.uniqueContentCount) / stats.totalCacheEntries * 100
      : 0
    
    let assessment = ""
    
    if (hitRateNum >= 80) {
      assessment += "✅ 缓存命中率优秀\n"
    } else if (hitRateNum >= 60) {
      assessment += "⚠️ 缓存命中率良好，有优化空间\n"
    } else {
      assessment += "❌ 缓存命中率较低，需要优化\n"
    }
    
    if (stats.duplicatesAvoided > 0) {
      assessment += "✅ 统一缓存管理器有效避免了重复存储\n"
    }
    
    if (duplicationRate < 10) {
      assessment += "✅ 内容去重效果显著\n"
    }
    
    return assessment
  }

  /**
   * 清理缓存并重置统计
   */
  clearCacheAndStats(): void {
    globalUnifiedContentCache.clear()
    console.log("[CacheMonitor] Cache cleared and stats reset")
  }
}

/**
 * 全局缓存监控器实例
 */
export const globalCacheMonitor = CacheMonitor.getInstance()

/**
 * 在开发环境下自动启动监控
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  // 延迟启动，避免影响页面加载
  setTimeout(() => {
    globalCacheMonitor.startMonitoring()
    
    // 添加全局方法供调试使用
    if (typeof window !== "undefined") {
      (window as any).cacheMonitor = {
        getStats: () => globalCacheMonitor.getCacheStats(),
        generateReport: () => {
          const report = globalCacheMonitor.generateReport()
          console.log(report)
          return report
        },
        clear: () => globalCacheMonitor.clearCacheAndStats(),
        start: () => globalCacheMonitor.startMonitoring(),
        stop: () => globalCacheMonitor.stopMonitoring()
      }
      
      console.log("[CacheMonitor] Debug methods available: window.cacheMonitor")
    }
  }, 2000)
}