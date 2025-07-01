import { ImageLoadManager, ImageLoadConfig } from "./ImageLoadManager"
import { ImageObserverManager, ImageObserverConfig } from "./ImageObserverManager"
import { ICleanupManager } from "./CleanupManager"

/**
 * 懒加载管理器配置接口
 */
export interface LazyloadManagerConfig {
  /** 图片加载配置 */
  imageLoad: Partial<ImageLoadConfig>
  /** 图片观察器配置 */
  imageObserver: Partial<ImageObserverConfig>
  /** 是否启用调试模式 */
  debug: boolean
  /** 自动初始化选择器 */
  autoInitSelector: string
}

/**
 * 懒加载统计信息接口
 */
export interface LazyloadStats {
  /** 图片加载统计 */
  imageLoad: ReturnType<ImageLoadManager["getStats"]>
  /** 观察器统计 */
  observer: ReturnType<ImageObserverManager["getStats"]>
  /** 总体统计 */
  overall: {
    totalProcessed: number
    successRate: number
    averageLoadTime: number
  }
}

/**
 * 统一的懒加载管理器
 * 整合图片加载和观察器功能，提供完整的懒加载解决方案
 */
export class LazyloadManager implements ICleanupManager {
  private readonly config: LazyloadManagerConfig
  private readonly imageLoadManager: ImageLoadManager
  private readonly imageObserverManager: ImageObserverManager
  private isInitialized = false
  private performanceMetrics = {
    totalProcessed: 0,
    successCount: 0,
    totalLoadTime: 0,
  }

  constructor(config: Partial<LazyloadManagerConfig> = {}) {
    this.config = {
      imageLoad: {
        preloadMargin: "200px",
        maxConcurrent: 3,
        loadTimeout: 5000,
        retryCount: 2,
        threshold: 0.01,
      },
      imageObserver: {
        rootMargin: "200px",
        threshold: 0.01,
        enableMemoryCleanup: true,
      },
      debug: false,
      autoInitSelector: '#quartz-body img[loading="lazy"]',
      ...config,
    }

    // 创建管理器实例
    this.imageLoadManager = new ImageLoadManager(this.config.imageLoad)
    this.imageObserverManager = new ImageObserverManager(
      this.imageLoadManager,
      this.config.imageObserver,
    )

    this.setupEventListeners()
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 监听导航事件，重新初始化懒加载
    document.addEventListener("nav", () => {
      this.reinitialize()
    })

    // 监听页面可见性变化
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pause()
      } else {
        this.resume()
      }
    })
  }

  /**
   * 初始化懒加载
   * @param selector 图片选择器
   * @param container 容器元素
   */
  initialize(selector?: string, container?: Document | Element): void {
    if (this.isInitialized) {
      this.log("LazyloadManager already initialized")
      return
    }

    const targetSelector = selector || this.config.autoInitSelector
    const targetContainer = container || document

    this.log("Initializing LazyloadManager with selector:", targetSelector)

    // 开始观察图片
    this.imageObserverManager.observeImages(targetSelector, targetContainer)

    this.isInitialized = true
    this.log("LazyloadManager initialized successfully")
  }

  /**
   * 重新初始化（用于SPA导航）
   */
  reinitialize(): void {
    this.log("Reinitializing LazyloadManager for navigation")

    // 不需要完全清理，只需要观察新的图片
    this.imageObserverManager.observeImages(this.config.autoInitSelector)
  }

  /**
   * 暂停懒加载
   */
  pause(): void {
    this.log("Pausing LazyloadManager")
    // 这里可以添加暂停逻辑，比如停止处理队列
  }

  /**
   * 恢复懒加载
   */
  resume(): void {
    this.log("Resuming LazyloadManager")
    // 这里可以添加恢复逻辑
  }

  /**
   * 手动观察单个图片
   * @param img 图片元素
   */
  observeImage(img: HTMLImageElement): void {
    this.imageObserverManager.observeImage(img)
  }

  /**
   * 停止观察单个图片
   * @param img 图片元素
   */
  unobserveImage(img: HTMLImageElement): void {
    this.imageObserverManager.unobserveImage(img)
  }

  /**
   * 手动加载图片
   * @param img 图片元素
   */
  loadImage(img: HTMLImageElement): void {
    this.imageLoadManager.enqueueImage(img)
  }

  /**
   * 取消图片加载
   * @param img 图片元素
   */
  cancelImageLoad(img: HTMLImageElement): void {
    this.imageLoadManager.cancelImageLoad(img)
  }

  /**
   * 检查图片是否已加载
   * @param src 图片源地址
   * @returns 是否已加载
   */
  isImageLoaded(src: string): boolean {
    return this.imageLoadManager.isImageLoaded(src)
  }

  /**
   * 预加载指定图片
   * @param urls 图片URL数组
   */
  preloadImages(urls: string[]): void {
    urls.forEach((url) => {
      if (!this.isImageLoaded(url)) {
        // 创建临时图片元素进行预加载
        const tempImg = document.createElement("img")
        tempImg.dataset.src = url
        this.loadImage(tempImg)
      }
    })
  }

  /**
   * 获取懒加载统计信息
   * @returns 统计信息
   */
  getStats(): LazyloadStats {
    const imageLoadStats = this.imageLoadManager.getStats()
    const observerStats = this.imageObserverManager.getStats()

    return {
      imageLoad: imageLoadStats,
      observer: observerStats,
      overall: {
        totalProcessed: this.performanceMetrics.totalProcessed,
        successRate:
          this.performanceMetrics.totalProcessed > 0
            ? this.performanceMetrics.successCount / this.performanceMetrics.totalProcessed
            : 0,
        averageLoadTime:
          this.performanceMetrics.successCount > 0
            ? this.performanceMetrics.totalLoadTime / this.performanceMetrics.successCount
            : 0,
      },
    }
  }

  /**
   * 更新配置
   * @param newConfig 新配置
   */
  updateConfig(newConfig: Partial<LazyloadManagerConfig>): void {
    Object.assign(this.config, newConfig)

    // 重新配置观察器
    if (newConfig.imageObserver) {
      this.imageObserverManager.reconfigure(newConfig.imageObserver)
    }

    this.log("Configuration updated:", this.config)
  }

  /**
   * 启用/禁用调试模式
   * @param enabled 是否启用
   */
  setDebugMode(enabled: boolean): void {
    this.config.debug = enabled
    this.log("Debug mode", enabled ? "enabled" : "disabled")
  }

  /**
   * 调试日志输出
   * @param args 日志参数
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log("[LazyloadManager]", ...args)
    }
  }

  /**
   * 获取当前配置
   * @returns 当前配置
   */
  getConfig(): LazyloadManagerConfig {
    return { ...this.config }
  }

  /**
   * 检查是否已初始化
   * @returns 是否已初始化
   */
  isReady(): boolean {
    return this.isInitialized
  }

  /**
   * 强制清理所有缓存
   */
  clearCache(): void {
    this.imageLoadManager.cleanup()
    this.log("Cache cleared")
  }

  /**
   * 重置性能指标
   */
  resetMetrics(): void {
    this.performanceMetrics = {
      totalProcessed: 0,
      successCount: 0,
      totalLoadTime: 0,
    }
    this.log("Performance metrics reset")
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.log("Cleaning up LazyloadManager")

    // 清理子管理器
    this.imageLoadManager.cleanup()
    this.imageObserverManager.cleanup()

    // 重置状态
    this.isInitialized = false
    this.resetMetrics()
  }

  /**
   * 获取清理管理器名称
   */
  getCleanupName(): string {
    return "LazyloadManager"
  }

  /**
   * 创建默认实例
   * @param config 配置
   * @returns 懒加载管理器实例
   */
  static createDefault(config: Partial<LazyloadManagerConfig> = {}): LazyloadManager {
    return new LazyloadManager({
      debug: false,
      ...config,
    })
  }

  /**
   * 创建调试实例
   * @param config 配置
   * @returns 懒加载管理器实例
   */
  static createDebug(config: Partial<LazyloadManagerConfig> = {}): LazyloadManager {
    return new LazyloadManager({
      debug: true,
      ...config,
    })
  }
}
