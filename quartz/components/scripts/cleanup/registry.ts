/**
 * 清理注册表 - 集中管理所有需要清理的资源
 * 采用发布-订阅模式，解耦清理逻辑与具体组件
 */
class CleanupRegistry {
  private static instance: CleanupRegistry
  private cleanupHandlers: Set<() => void> = new Set()

  private constructor() {}

  static getInstance(): CleanupRegistry {
    if (!CleanupRegistry.instance) {
      CleanupRegistry.instance = new CleanupRegistry()
    }
    return CleanupRegistry.instance
  }

  /**
   * 注册清理函数
   * @param handler 清理函数
   * @returns 取消注册的函数
   */
  register(handler: () => void): () => void {
    this.cleanupHandlers.add(handler)
    return () => this.cleanupHandlers.delete(handler)
  }

  /**
   * 执行所有注册的清理函数
   */
  cleanupAll(): void {
    this.cleanupHandlers.forEach((handler) => handler())
    this.cleanupHandlers.clear()
  }
}

export const cleanupRegistry = CleanupRegistry.getInstance()
