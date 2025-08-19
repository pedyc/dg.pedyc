/**
 * 基础组件管理器
 * 提供统一的事件管理、缓存管理和清理机制
 */

import { globalResourceManager, globalStorageManager, globalCacheManager } from "../managers"
import { CacheKeyFactory } from "../cache"
import type { FullSlug } from "../../../util/path"

export interface ComponentConfig {
  /** 组件名称 */
  name: string
  /** 是否启用调试日志 */
  debug?: boolean
  /** 自定义缓存配置 */
  cacheConfig?: {
    prefix?: string
    ttl?: number
  }
  /** 是否启用懒加载 */
  enableLazyLoad?: boolean
  /** 懒加载的根边距 */
  lazyLoadRootMargin?: string
  /** 是否启用预加载 */
  enablePreload?: boolean
  /** 预加载延迟 */
  preloadDelay?: number
}

export interface ComponentState {
  initialized: boolean
  eventListenersSetup: boolean
  elements: Set<HTMLElement>
  cleanupTasks: Array<() => void>
}

/**
 * 基础组件管理器抽象类
 * 所有组件管理器都应继承此类以确保统一的事件管理模式
 */
export abstract class BaseComponentManager<
  TConfig extends ComponentConfig = ComponentConfig,
  TState extends ComponentState = ComponentState,
> {
  protected readonly config: Required<TConfig>
  protected readonly state: TState
  protected readonly resourceManager = globalResourceManager.instance
  protected readonly storageManager = globalStorageManager.instance
  protected readonly cacheManager = globalCacheManager.instance

  constructor(config: TConfig) {
    this.config = {
      debug: false,
      cacheConfig: {
        prefix: config.name.toLowerCase(),
        ttl: 3600000, // 1小时默认TTL
      },
      ...config,
    } as Required<TConfig>

    this.state = {
      initialized: false,
      eventListenersSetup: false,
      elements: new Set(),
      cleanupTasks: [],
    } as unknown as TState

    this.log("BaseComponentManager created")
  }

  /**
   * 初始化组件
   * 这是组件的主要入口点
   */
  public async initialize(): Promise<void> {
    if (this.state.initialized) {
      this.log("Component already initialized, skipping")
      return
    }

    try {
      this.log("Initializing component...")

      // 检查全局实例可用性
      this.validateGlobalInstances()

      // 设置事件监听器
      this.setupEventListeners()

      // 执行组件特定的初始化
      await this.onInitialize()

      // 设置页面
      this.setupPage()

      this.state.initialized = true
      this.log("Component initialized successfully")
    } catch (error) {
      console.error(`[${this.config.name}] Initialization failed:`, error)
      throw error
    }
  }

  /**
   * 设置事件监听器
   */
  protected setupEventListeners(): void {
    if (!this.resourceManager) {
      throw new Error(`[${this.config.name}] ResourceManager not available`)
    }

    if (this.state.eventListenersSetup) {
      this.log("Event listeners already setup, skipping")
      return
    }

    this.log("Setting up event listeners...")

    // 注册页面导航事件
    this.resourceManager.addEventListener(document as any as EventTarget, "nav", () =>
      this.setupPage(),
    )

    // 注册 DOM 加载事件
    this.resourceManager.addEventListener(document as any as EventTarget, "DOMContentLoaded", () =>
      this.setupPage(),
    )

    // 注册全局清理任务
    this.resourceManager.addCleanupTask(() => {
      this.cleanup()
    })

    // 执行组件特定的事件监听器设置
    this.onSetupEventListeners()

    this.state.eventListenersSetup = true
    this.log("Event listeners setup completed")
  }

  /**
   * 设置页面
   */
  protected setupPage(): void {
    try {
      this.log("Setting up page...")

      // 查找组件元素
      const elements = this.findComponentElements()

      // 更新元素集合
      this.state.elements.clear()
      elements.forEach((el) => this.state.elements.add(el))

      // 执行组件特定的页面设置
      this.onSetupPage(elements)

      this.log(`Page setup completed, found ${elements.length} elements`)
    } catch (error) {
      console.error(`[${this.config.name}] Page setup failed:`, error)
    }
  }

  /**
   * 清理组件状态和事件监听器
   */
  protected cleanup(): void {
    this.log("Cleaning up component...")

    try {
      // 执行组件特定的清理
      this.onCleanup()

      // 执行注册的清理任务
      this.state.cleanupTasks.forEach((task) => {
        try {
          task()
        } catch (error) {
          console.error(`[${this.config.name}] Cleanup task failed:`, error)
        }
      })

      // 清理状态
      this.state.elements.clear()
      this.state.cleanupTasks.length = 0

      this.log("Component cleanup completed")
    } catch (error) {
      console.error(`[${this.config.name}] Cleanup failed:`, error)
    }
  }

  /**
   * 生成缓存键
   */
  protected generateCacheKey(...parts: string[]): string {
    return CacheKeyFactory.generateSystemKey((this.config as any).cacheConfig.prefix, ...parts)
  }

  /**
   * 生成用户相关的缓存键
   */
  protected generateUserCacheKey(userId: string): string {
    return CacheKeyFactory.generateUserKey((this.config as any).cacheConfig.prefix, userId)
  }

  /**
   * 生成内容相关的缓存键
   */
  protected generateContentCacheKey(slug: FullSlug): string {
    return CacheKeyFactory.generateContentKey(slug)
  }

  /**
   * 存储数据到本地存储
   */
  protected setStorageItem(key: string, value: any): void {
    if (!this.storageManager) {
      throw new Error(`[${this.config.name}] StorageManager not available`)
    }
    this.storageManager.setItem("local", key, value)
  }

  /**
   * 从本地存储获取数据
   */
  protected getStorageItem<T = any>(key: string, defaultValue?: T): T | null {
    if (!this.storageManager) {
      throw new Error(`[${this.config.name}] StorageManager not available`)
    }
    const value = this.storageManager.getItem("local", key)
    return value !== null ? (value as T) : (defaultValue ?? null)
  }

  /**
   * 缓存数据
   */
  protected setCacheItem<T>(key: string, value: T, ttl?: number): void {
    if (!this.cacheManager) {
      throw new Error(`[${this.config.name}] CacheManager not available`)
    }
    this.cacheManager.set(key, value, ttl ?? (this.config as any).cacheConfig.ttl)
  }

  /**
   * 获取缓存数据
   */
  protected getCacheItem<T>(key: string): T | null {
    if (!this.cacheManager) {
      throw new Error(`[${this.config.name}] CacheManager not available`)
    }
    return this.cacheManager.get(key)
  }

  /**
   * 添加清理任务
   */
  protected addCleanupTask(task: () => void): void {
    this.state.cleanupTasks.push(task)
  }

  /**
   * 添加事件监听器（自动清理）
   */
  protected addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (this.resourceManager) {
      this.resourceManager.addEventListener(element, type, listener as EventListener, options)
    } else {
      // 降级方案：手动管理
      element.addEventListener(type, listener as EventListener, options)
      this.addCleanupTask(() => {
        element.removeEventListener(type, listener as EventListener, options)
      })
    }
  }

  /**
   * 日志输出
   */
  protected log(message: string, ...args: any[]): void {
    if (this.config.debug) {
      console.log(`[${this.config.name}] ${message}`, ...args)
    }
  }

  /**
   * 错误日志输出
   */
  protected error(message: string, ...args: any[]): void {
    console.error(`[${this.config.name}] ${message}`, ...args)
  }

  /**
   * 验证全局实例可用性
   */
  private validateGlobalInstances(): void {
    if (!this.resourceManager) {
      throw new Error(`[${this.config.name}] ResourceManager not available`)
    }
    if (!this.storageManager) {
      throw new Error(`[${this.config.name}] StorageManager not available`)
    }
    if (!this.cacheManager) {
      throw new Error(`[${this.config.name}] CacheManager not available`)
    }
  }

  // 抽象方法 - 子类必须实现

  /**
   * 查找组件相关的 DOM 元素
   */
  protected abstract findComponentElements(): HTMLElement[]

  /**
   * 组件特定的初始化逻辑
   */
  protected abstract onInitialize(): Promise<void>

  /**
   * 组件特定的事件监听器设置
   */
  protected abstract onSetupEventListeners(): void

  /**
   * 组件特定的页面设置逻辑
   */
  protected abstract onSetupPage(elements: HTMLElement[]): void

  /**
   * 组件特定的清理逻辑
   */
  protected abstract onCleanup(): void
}

export class ComponentManagerFactory {
  private static instances = new Map<string, BaseComponentManager<any, any>>()

  static register(name: string, manager: BaseComponentManager<any, any>): void {
    if (this.instances.has(name)) {
      console.warn(`Component manager '${name}' already registered. Overwriting.`)
    }
    this.instances.set(name, manager)
  }

  static get(name: string): BaseComponentManager<any, any> | undefined {
    return this.instances.get(name)
  }

  static async initialize(name: string): Promise<void> {
    const manager = this.get(name)
    if (!manager) {
      throw new Error(`Component manager '${name}' not registered`)
    }
    await manager.initialize()
  }

  /**
   * 初始化所有注册的组件管理器
   */
  static async initializeAll(): Promise<void> {
    const promises = Array.from(this.instances.values()).map((manager) =>
      manager.initialize().catch((error) => {
        console.error("Component manager initialization failed:", error)
      }),
    )
    await Promise.all(promises)
  }

  /**
   * 获取所有注册的组件名称
   */
  static getRegisteredComponents(): string[] {
    return Array.from(this.instances.keys())
  }
}
