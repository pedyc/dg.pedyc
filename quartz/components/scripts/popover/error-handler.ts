import { UnifiedStorageManager } from '../managers/UnifiedStorageManager'

/**
 * 自定义弹窗错误类
 */
export class PopoverError extends Error {
  constructor(message: string, public context?: string) {
    super(message)
    this.name = 'PopoverError'
  }
}

/**
 * Popover错误处理器
 * 统一处理Popover相关的错误，提供日志记录和错误恢复机制
 * 使用UnifiedStorageManager统一管理存储
 */
export class PopoverErrorHandler {
  private static readonly MAX_LOG_ENTRIES = 50
  private static readonly LOG_STORAGE_KEY = "popover_error_logs"

  /**
   * 处理错误并记录日志
   * @param error 错误对象
   * @param context 错误上下文
   * @param details 额外详情
   */
  static handleError(error: Error, context: string, details?: string): void {
    const errorInfo = {
      message: error.message,
      context,
      details,
      timestamp: Date.now(),
      stack: error.stack
    }

    console.error(`[Popover Error] ${context}:`, error)
    if (details) {
      console.error(`[Popover Error] Details: ${details}`)
    }

    this.logError(errorInfo)
  }



  /**
   * 记录错误到存储
   * @param errorInfo 错误信息
   */
  private static async logError(errorInfo: any): Promise<void> {
    try {
      const existingLogs = JSON.parse(UnifiedStorageManager.safeGetItem(localStorage, this.LOG_STORAGE_KEY) || '[]')
      existingLogs.push(errorInfo)

      // 限制日志数量
      if (existingLogs.length > this.MAX_LOG_ENTRIES) {
        existingLogs.splice(0, existingLogs.length - this.MAX_LOG_ENTRIES)
      }

      UnifiedStorageManager.safeSetItem(localStorage, this.LOG_STORAGE_KEY, JSON.stringify(existingLogs))
    } catch (error) {
      console.warn('Failed to save error logs:', error)
    }
  }

  /**
   * 获取错误日志
   */
  static async getErrorLogs(): Promise<any[]> {
    try {
      return JSON.parse(UnifiedStorageManager.safeGetItem(localStorage, this.LOG_STORAGE_KEY) || '[]')
    } catch (error) {
      console.warn('Failed to retrieve error logs:', error)
      return []
    }
  }

  /**
   * 清空所有错误日志
   */
  static clearLogs(): void {
    try {
      UnifiedStorageManager.safeRemoveItem(localStorage, this.LOG_STORAGE_KEY)
    } catch (error) {
      console.warn('清空错误日志失败:', error)
    }
  }


}