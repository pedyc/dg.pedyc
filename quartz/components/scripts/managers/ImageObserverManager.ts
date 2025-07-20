import { ImageLoadManager } from "./ImageLoadManager"
import { ICleanupManager } from "./CleanupManager"

/**
 * 图片观察器配置接口
 */
export interface ImageObserverConfig {
  /** 预加载边距 */
  rootMargin: string
  /** 交叉观察器阈值 */
  threshold: number
  /** 是否启用内存清理 */
  enableMemoryCleanup: boolean
}

/**
 * 图片观察器管理器
 * 负责管理IntersectionObserver和ResizeObserver，监控图片的可见性和元素状态
 */
export class ImageObserverManager implements ICleanupManager {
  private readonly config: ImageObserverConfig
  private readonly imageLoadManager: ImageLoadManager
  private intersectionObserver: IntersectionObserver | null = null
  private resizeObserver: ResizeObserver | null = null
  private observedElements = new WeakSet<HTMLImageElement>()

  constructor(imageLoadManager: ImageLoadManager, config: Partial<ImageObserverConfig> = {}) {
    this.imageLoadManager = imageLoadManager
    this.config = {
      rootMargin: "200px",
      threshold: 0.01,
      enableMemoryCleanup: true,
      ...config,
    }

    this.initializeObservers()
  }

  /**
   * 初始化观察器
   */
  private initializeObservers(): void {
    this.createIntersectionObserver()

    if (this.config.enableMemoryCleanup) {
      this.createResizeObserver()
    }
  }

  /**
   * 创建交叉观察器
   */
  private createIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => this.handleIntersectionEntries(entries),
      {
        rootMargin: this.config.rootMargin,
        threshold: this.config.threshold,
      },
    )
  }

  /**
   * 创建尺寸观察器用于内存清理
   */
  private createResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => this.handleResizeEntries(entries))
  }

  /**
   * 处理交叉观察器条目
   * @param entries 观察器条目
   */
  private handleIntersectionEntries(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const img = entry.target as HTMLImageElement
      const src = img.dataset.src || img.src

      // 检查是否已加载
      if (this.imageLoadManager.isImageLoaded(src)) {
        this.unobserveImage(img)
        return
      }

      if (entry.isIntersecting) {
        // 图片进入视口，开始加载
        this.imageLoadManager.enqueueImage(img)
        this.unobserveImage(img)
      } else {
        // 图片离开视口，取消加载
        this.imageLoadManager.cancelImageLoad(img)
      }
    })
  }

  /**
   * 处理尺寸观察器条目（用于内存清理）
   * @param entries 观察器条目
   */
  private handleResizeEntries(entries: ResizeObserverEntry[]): void {
    entries.forEach((entry) => {
      // 当元素高度为0时，可能已被移除或隐藏
      if (!entry.contentRect.height) {
        const img = entry.target as HTMLImageElement
        this.cleanupImageElement(img)
      }
    })
  }

  /**
   * 观察图片元素
   * @param img 图片元素
   */
  observeImage(img: HTMLImageElement): void {
    if (this.observedElements.has(img)) {
      return // 已经在观察中
    }

    // 检查是否应该跳过观察
    if (this.shouldSkipObservation(img)) {
      console.log(`[ImageObserverManager] 跳过观察图片元素 ${img.src}`)
      return
    }

    // 添加到观察器
    this.intersectionObserver?.observe(img)

    if (this.resizeObserver) {
      this.resizeObserver.observe(img)
    }

    this.observedElements.add(img)
  }

  /**
   * 停止观察图片元素
   * @param img 图片元素
   */
  unobserveImage(img: HTMLImageElement): void {
    if (!this.observedElements.has(img)) {
      return
    }

    this.intersectionObserver?.unobserve(img)
    this.resizeObserver?.unobserve(img)
    this.observedElements.delete(img)
  }

  /**
   * 检查是否应该跳过观察
   * @param img 图片元素
   * @returns 是否跳过
   */
  private shouldSkipObservation(img: HTMLImageElement): boolean {
    // 检查noLazy属性
    if (img.hasAttribute("noLazy")) {
      return true
    }

    // 检查父级article的noLazy属性
    const article = img.closest("article")
    if (article?.hasAttribute("noLazy")) {
      return true
    }

    return false
  }

  /**
   * 清理图片元素相关资源
   * @param img 图片元素
   */
  private cleanupImageElement(img: HTMLImageElement): void {
    // 停止观察
    this.unobserveImage(img)

    // 取消加载
    this.imageLoadManager.cancelImageLoad(img)
  }

  /**
   * 批量观察图片元素
   * @param selector 选择器
   * @param container 容器元素
   */
  observeImages(
    selector: string = '#quartz-body img[loading="lazy"]',
    container: Document | Element = document,
  ): void {
    const lazyImages = container.querySelectorAll(selector)

    lazyImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        this.observeImage(img)
      }
    })
  }

  /**
   * 获取观察器统计信息
   * @returns 统计信息
   */
  getStats() {
    return {
      observedCount: this.observedElements ? "WeakSet (count not available)" : 0,
      intersectionObserverActive: !!this.intersectionObserver,
      resizeObserverActive: !!this.resizeObserver,
      config: this.config,
      imageLoadStats: this.imageLoadManager.getStats(),
    }
  }

  /**
   * 重新配置观察器
   * @param newConfig 新配置
   */
  reconfigure(newConfig: Partial<ImageObserverConfig>): void {
    // 更新配置
    Object.assign(this.config, newConfig)

    // 重新创建观察器
    this.cleanup()
    this.initializeObservers()
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    // 断开观察器
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    // 清理观察元素集合
    this.observedElements = new WeakSet()
  }

  /**
   * 获取清理管理器名称
   */
  getCleanupName(): string {
    return "ImageObserverManager"
  }
}
