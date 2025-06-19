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
    this.managers.forEach(manager => {
      try {
        manager.cleanup()
      } catch (error) {
        console.error('Error during cleanup:', error)
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