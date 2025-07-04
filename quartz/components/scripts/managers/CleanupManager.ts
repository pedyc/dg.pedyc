/**
/**
 * 清理管理器接口
 * 提供统一的清理接口，所有管理器都应实现此接口
 */
export interface ICleanupManager {
  /**
   * 清理资源
   */
  cleanup(): void

  /**
   * 获取统计信息（可选）
   */
  getStats?(): any
}

/**
 * 清理管理器
 * 管理单个实例的清理任务
 */
export class CleanupManager {
  private managers = new Map<string, ICleanupManager>()

  /**
   * 注册清理管理器
   * @param key 管理器键
   * @param manager 实现了ICleanupManager接口的管理器
   */
  register(key: string, manager: ICleanupManager): void {
    this.managers.set(key, manager)
  }

  /**
   * 注销清理管理器
   * @param key 管理器键
   */
  unregister(key: string): void {
    this.managers.delete(key)
  }

  /**
   * 清理所有注册的管理器
   */
  cleanup(): void {
    this.managers.forEach((manager, key) => {
      try {
        manager.cleanup()
      } catch (error) {
        console.error(`Error during cleanup of ${key}:`, error)
      }
    })
  }

  /**
   * 获取所有管理器的统计信息
   */
  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    this.managers.forEach((manager, key) => {
      if (manager.getStats) {
        stats[key] = manager.getStats()
      }
    })
    return stats
  }

  /**
   * 移除所有注册的管理器
   */
  clear(): void {
    this.managers.clear()
  }
}

/**
 * 全局清理管理器
 * 统一管理所有需要清理的资源
 */
export class GlobalCleanupManager {
  private static managers: ICleanupManager[] = []

  /**
   * 注册清理管理器
   * @param manager 实现了ICleanupManager接口的管理器
   */
  static register(manager: ICleanupManager): void {
    this.managers.push(manager)
  }

  /**
   * 清理所有注册的管理器
   */
  static cleanupAll(): void {
    this.managers.forEach((manager) => {
      try {
        manager.cleanup()
      } catch (error) {
        console.error("Error during cleanup:", error)
      }
    })
  }

  /**
   * 获取所有管理器的统计信息
   */
  static getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    this.managers.forEach((manager, index) => {
      if (manager.getStats) {
        stats[`manager_${index}`] = manager.getStats()
      }
    })
    return stats
  }

  /**
   * 移除所有注册的管理器
   */
  static clear(): void {
    this.managers.length = 0
  }
}
