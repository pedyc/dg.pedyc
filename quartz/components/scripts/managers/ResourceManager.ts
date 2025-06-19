import type { ICleanupManager } from './CleanupManager'

/**
 * 资源管理器
 * 统一管理 DOM 相关资源，包括观察器、定时器和事件监听器
 */
export class ResourceManager implements ICleanupManager {
  private observers: Set<IntersectionObserver | MutationObserver | ResizeObserver> = new Set()
  private timers: Set<number> = new Set()
  private eventListeners: Array<{
    element: EventTarget
    type: string
    listener: EventListener
    options?: boolean | AddEventListenerOptions
  }> = []
  private abortControllers: Set<AbortController> = new Set()
  private cleanupTasks: Array<() => void> = []

  /**
   * 注册 IntersectionObserver
   */
  registerIntersectionObserver(observer: IntersectionObserver): IntersectionObserver {
    this.observers.add(observer)
    return observer
  }

  /**
   * 注册 MutationObserver
   */
  registerMutationObserver(observer: MutationObserver): MutationObserver {
    this.observers.add(observer)
    return observer
  }

  /**
   * 注册 ResizeObserver
   */
  registerResizeObserver(observer: ResizeObserver): ResizeObserver {
    this.observers.add(observer)
    return observer
  }

  /**
   * 注册通用观察器（兼容旧代码）
   */
  registerObserver(observer: IntersectionObserver | MutationObserver | ResizeObserver): typeof observer {
    this.observers.add(observer)
    return observer
  }

  /**
   * 注册定时器
   */
  registerTimer(timerId: number): number {
    this.timers.add(timerId)
    return timerId
  }

  /**
   * 创建并注册 setTimeout
   */
  setTimeout(callback: () => void, delay: number): number {
    const timerId = window.setTimeout(() => {
      this.timers.delete(timerId)
      callback()
    }, delay)
    return this.registerTimer(timerId)
  }

  /**
   * 创建并注册 setInterval
   */
  setInterval(callback: () => void, delay: number): number {
    const timerId = window.setInterval(callback, delay)
    return this.registerTimer(timerId)
  }

  /**
   * 注册事件监听器
   */
  addEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(type, listener, options)
    this.eventListeners.push({ element, type, listener, options })
  }

  /**
   * 创建并注册 AbortController
   */
  createAbortController(): AbortController {
    const controller = new AbortController()
    this.abortControllers.add(controller)
    return controller
  }

  /**
   * 注册现有的 AbortController
   */
  registerAbortController(controller: AbortController): AbortController {
    this.abortControllers.add(controller)
    return controller
  }

  /**
   * 移除特定的观察器
   */
  removeObserver(observer: IntersectionObserver | MutationObserver | ResizeObserver): void {
    if (this.observers.has(observer)) {
      observer.disconnect()
      this.observers.delete(observer)
    }
  }

  /**
   * 移除特定的定时器
   */
  removeTimer(timerId: number): void {
    if (this.timers.has(timerId)) {
      clearTimeout(timerId)
      clearInterval(timerId)
      this.timers.delete(timerId)
    }
  }

  /**
   * 清除超时定时器
   */
  clearTimeout(timerId: number): void {
    if (this.timers.has(timerId)) {
      clearTimeout(timerId)
      this.timers.delete(timerId)
    }
  }

  /**
   * 清除间隔定时器
   */
  clearInterval(timerId: number): void {
    if (this.timers.has(timerId)) {
      clearInterval(timerId)
      this.timers.delete(timerId)
    }
  }

  /**
   * 移除特定的事件监听器
   */
  removeEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.removeEventListener(type, listener, options)
    
    const index = this.eventListeners.findIndex(
      item => item.element === element && 
              item.type === type && 
              item.listener === listener
    )
    
    if (index !== -1) {
      this.eventListeners.splice(index, 1)
    }
  }

  /**
   * 中止特定的 AbortController
   */
  abortController(controller: AbortController): void {
    if (this.abortControllers.has(controller)) {
      controller.abort()
      this.abortControllers.delete(controller)
    }
  }

  /**
   * 获取资源统计信息
   */
  getStats(): {
    observers: number
    timers: number
    eventListeners: number
    abortControllers: number
    details: {
      observerTypes: Record<string, number>
      eventTypes: Record<string, number>
    }
  } {
    // 统计观察器类型
    const observerTypes: Record<string, number> = {}
    this.observers.forEach(observer => {
      const type = observer.constructor.name
      observerTypes[type] = (observerTypes[type] || 0) + 1
    })

    // 统计事件类型
    const eventTypes: Record<string, number> = {}
    this.eventListeners.forEach(({ type }) => {
      eventTypes[type] = (eventTypes[type] || 0) + 1
    })

    return {
      observers: this.observers.size,
      timers: this.timers.size,
      eventListeners: this.eventListeners.length,
      abortControllers: this.abortControllers.size,
      details: {
        observerTypes,
        eventTypes
      }
    }
  }

  /**
   * 清理所有资源
   */
  cleanup(): void {
    // 清理观察器
    this.observers.forEach(observer => {
      try {
        observer.disconnect()
      } catch (error) {
        console.error('清理观察器时出错:', error)
      }
    })
    this.observers.clear()

    // 清理定时器
    this.timers.forEach(timerId => {
      try {
        clearTimeout(timerId)
        clearInterval(timerId)
      } catch (error) {
        console.error('清理定时器时出错:', error)
      }
    })
    this.timers.clear()

    // 清理事件监听器
    this.eventListeners.forEach(({ element, type, listener, options }) => {
      try {
        element.removeEventListener(type, listener, options)
      } catch (error) {
        console.error('清理事件监听器时出错:', error)
      }
    })
    this.eventListeners.length = 0

    // 中止所有 AbortController
    this.abortControllers.forEach(controller => {
      try {
        controller.abort()
      } catch (error) {
        console.error('中止 AbortController 时出错:', error)
      }
    })
    this.abortControllers.clear()

    // 执行清理任务
    this.cleanupTasks.forEach(task => {
      try {
        task()
      } catch (error) {
        console.error('执行清理任务时出错:', error)
      }
    })
    this.cleanupTasks.length = 0
  }

  /**
   * 添加清理任务
   */
  addCleanupTask(task: () => void): void {
    this.cleanupTasks.push(task)
  }

  /**
   * 检查是否有活跃的资源
   */
  hasActiveResources(): boolean {
    return this.observers.size > 0 || 
           this.timers.size > 0 || 
           this.eventListeners.length > 0 || 
           this.abortControllers.size > 0
  }

  /**
   * 获取活跃资源的详细信息
   */
  getActiveResourcesDetails(): {
    observers: string[]
    timers: number[]
    eventListeners: Array<{ element: string, type: string }>
    abortControllers: number
  } {
    return {
      observers: Array.from(this.observers).map(obs => obs.constructor.name),
      timers: Array.from(this.timers),
      eventListeners: this.eventListeners.map(({ element, type }) => ({
        element: element.constructor.name,
        type
      })),
      abortControllers: this.abortControllers.size
    }
  }
}