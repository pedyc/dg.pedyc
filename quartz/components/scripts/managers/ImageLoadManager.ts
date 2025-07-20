import { OptimizedCacheManager } from "./OptimizedCacheManager"
import { CacheKeyFactory } from "../cache"
import { ICleanupManager } from "./CleanupManager"
import { globalCacheManager } from "./global-instances"

/**
 * 图片加载配置接口
 */
export interface ImageLoadConfig {
  /** 预加载边距 */
  preloadMargin: string
  /** 最大并发加载数 */
  maxConcurrent: number
  /** 加载超时时间 (毫秒) */
  loadTimeout: number
  /** 重试次数 */
  retryCount: number
  /** 交叉观察器阈值 */
  threshold: number
}

/**
 * 图片加载状态枚举
 */
export enum ImageLoadState {
  PENDING = "pending",
  LOADING = "loading",
  LOADED = "loaded",
  ERROR = "error",
  RETRYING = "retrying",
}

/**
 * 图片加载任务接口
 */
export interface ImageLoadTask {
  readonly element: HTMLImageElement
  readonly src: string
  readonly cacheKey: string
  state: ImageLoadState
  retryCount: number
  controller?: AbortController
}

/**
 * 图片加载管理器
 * 负责管理图片的延迟加载、缓存、重试等功能
 */
export class ImageLoadManager implements ICleanupManager {
  private readonly config: ImageLoadConfig
  private readonly loadedCache: OptimizedCacheManager<boolean>
  private readonly loadQueue: ImageLoadTask[] = []
  private readonly abortControllers = new WeakMap<HTMLImageElement, AbortController>()
  private activeLoads = 0
  private isProcessing = false

  constructor(config: Partial<ImageLoadConfig> = {}) {
    this.config = {
      preloadMargin: "200px",
      maxConcurrent: 3,
      loadTimeout: 5000,
      retryCount: 2,
      threshold: 0.01,
      ...config,
    }

    this.loadedCache = globalCacheManager.instance
  }

  /**
   * 检查图片是否已加载
   * @param src 图片源地址
   * @returns 是否已加载
   */
  isImageLoaded(src: string): boolean {
    const cacheKey = CacheKeyFactory.generateSystemKey(`${src}_image_loaded`)
    return this.loadedCache.has(cacheKey)
  }

  /**
   * 标记图片为已加载
   * @param src 图片源地址
   */
  markImageLoaded(src: string): void {
    const cacheKey = CacheKeyFactory.generateSystemKey(`${src}_image_loaded`)
    this.loadedCache.set(cacheKey, true)
  }

  /**
   * 创建图片加载任务
   * @param img 图片元素
   * @returns 加载任务
   */
  createLoadTask(img: HTMLImageElement): ImageLoadTask {
    const src = img.dataset.src || img.src
    const cacheKey = CacheKeyFactory.generateSystemKey(`${src}_image_loaded`)

    return {
      element: img,
      src,
      cacheKey,
      state: ImageLoadState.PENDING,
      retryCount: 0,
    }
  }

  /**
   * 添加图片到加载队列
   * @param img 图片元素
   */
  enqueueImage(img: HTMLImageElement): void {
    const src = img.dataset.src || img.src

    // 检查是否已加载
    if (this.isImageLoaded(src)) {
      return
    }

    const task = this.createLoadTask(img)
    img.classList.add("loading")
    task.state = ImageLoadState.LOADING

    this.loadQueue.push(task)
    this.scheduleProcessing()
  }

  /**
   * 取消图片加载
   * @param img 图片元素
   */
  cancelImageLoad(img: HTMLImageElement): void {
    const controller = this.abortControllers.get(img)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(img)
    }

    // 从队列中移除
    const index = this.loadQueue.findIndex((task) => task.element === img)
    if (index !== -1) {
      this.loadQueue.splice(index, 1)
    }
  }

  /**
   * 调度处理队列
   */
  private scheduleProcessing(): void {
    if (this.isProcessing) return

    // 使用空闲回调优化性能
    if ("requestIdleCallback" in window) {
      requestIdleCallback((deadline) => this.processQueue(deadline))
    } else {
      setTimeout(() => this.processQueue(), 50)
    }
  }

  /**
   * 处理加载队列
   * @param deadline 空闲截止时间
   */
  private processQueue(deadline?: IdleDeadline): void {
    this.isProcessing = true

    try {
      while (
        this.activeLoads < this.config.maxConcurrent &&
        this.loadQueue.length > 0 &&
        (deadline?.timeRemaining() ?? 1) > 0
      ) {
        const task = this.loadQueue.shift()
        if (task) {
          this.loadImage(task)
        }
      }
    } finally {
      this.isProcessing = false

      // 如果还有任务，继续调度
      if (this.loadQueue.length > 0 && this.activeLoads < this.config.maxConcurrent) {
        this.scheduleProcessing()
      }
    }
  }

  /**
   * 加载单个图片
   * @param task 加载任务
   */
  private async loadImage(task: ImageLoadTask): Promise<void> {
    const { element: img, src } = task

    // 再次检查缓存
    if (this.isImageLoaded(src)) {
      this.handleLoadSuccess(task)
      return
    }

    const controller = new AbortController()
    task.controller = controller
    this.abortControllers.set(img, controller)

    // 设置图片尺寸避免布局偏移
    this.setImageAspectRatio(img)

    this.activeLoads++

    try {
      await this.attemptLoad(task)
    } catch (error) {
      this.handleLoadError(task, error)
    }
  }

  /**
   * 尝试加载图片
   * @param task 加载任务
   */
  private attemptLoad(task: ImageLoadTask): Promise<void> {
    const { element: img, src, controller } = task

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        controller?.abort()
        reject(new Error("Load timeout"))
      }, this.config.loadTimeout)

      const onLoad = () => {
        clearTimeout(timeout)
        this.handleLoadSuccess(task)
        resolve()
      }

      const onError = () => {
        clearTimeout(timeout)
        reject(new Error("Load failed"))
      }

      // 添加事件监听器
      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      img.addEventListener("load", onLoad, { once: true })
      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      img.addEventListener("error", onError, { once: true })

      // 设置图片源触发加载
      if (img.src !== src) {
        img.src = src
      } else if (img.complete) {
        // 图片已完成加载
        onLoad()
      }
    })
  }

  /**
   * 处理加载成功
   * @param task 加载任务
   */
  private handleLoadSuccess(task: ImageLoadTask): void {
    const { element: img, src } = task

    // 更新缓存
    this.markImageLoaded(src)

    // 更新样式
    img.classList.remove("loading")
    img.classList.add("loaded")

    // 清理资源
    this.cleanupTask(task)
    this.activeLoads--

    // 继续处理队列
    this.scheduleProcessing()
  }

  /**
   * 处理加载错误
   * @param task 加载任务
   * @param error 错误信息
   */
  private handleLoadError(task: ImageLoadTask, error: any): void {
    const { element: img, src } = task

    console.error(`Image load failed: ${src}`, error)

    if (task.retryCount < this.config.retryCount) {
      // 重试加载
      task.retryCount++
      task.state = ImageLoadState.RETRYING

      setTimeout(() => {
        this.loadQueue.unshift(task) // 重新加入队列头部
        this.activeLoads--
        this.scheduleProcessing()
      }, 1000 * task.retryCount)
    } else {
      // 加载失败
      task.state = ImageLoadState.ERROR
      img.classList.remove("loading")
      img.classList.add("error")

      this.cleanupTask(task)
      this.activeLoads--
      this.scheduleProcessing()
    }
  }

  /**
   * 设置图片宽高比避免布局偏移
   * @param img 图片元素
   */
  private setImageAspectRatio(img: HTMLImageElement): void {
    if (img.dataset.width && img.dataset.height) {
      img.style.aspectRatio = `${img.dataset.width}/${img.dataset.height}`
    }
  }

  /**
   * 清理任务资源
   * @param task 加载任务
   */
  private cleanupTask(task: ImageLoadTask): void {
    const { element: img, controller } = task

    if (controller) {
      this.abortControllers.delete(img)
    }
  }

  /**
   * 获取加载统计信息
   * @returns 统计信息
   */
  getStats() {
    return {
      activeLoads: this.activeLoads,
      queueLength: this.loadQueue.length,
      cacheStats: this.loadedCache.getStats(),
      config: this.config,
    }
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    // 取消所有进行中的加载
    this.loadQueue.forEach((task) => {
      if (task.controller) {
        task.controller.abort()
      }
    })

    this.loadQueue.length = 0
    this.activeLoads = 0
    // this.abortControllers = new WeakMap()

    // 清理缓存
    this.loadedCache.cleanup()
  }

  /**
   * 获取清理管理器名称
   */
  getCleanupName(): string {
    return "ImageLoadManager"
  }
}
