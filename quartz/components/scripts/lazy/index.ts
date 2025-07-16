/**
 * 懒加载模块统一导出
 * 这个文件提供了所有懒加载模块的统一入口
 */

// Graph 模块
export * from "./graph"

// Search 模块
export * from "./search"

// Comments 模块
export * from "./comments"

// Mermaid 模块
export * from "./mermaid"

/**
 * 懒加载模块类型定义
 */
export interface LazyModule {
  cleanup?: () => void
}

/**
 * 懒加载模块管理器
 */
export class LazyModuleManager {
  private static instance: LazyModuleManager
  private loadedModules = new Map<string, LazyModule>()

  static getInstance(): LazyModuleManager {
    if (!LazyModuleManager.instance) {
      LazyModuleManager.instance = new LazyModuleManager()
    }
    return LazyModuleManager.instance
  }

  /**
   * 注册懒加载模块
   * @param name 模块名称
   * @param module 模块实例
   */
  registerModule(name: string, module: LazyModule) {
    this.loadedModules.set(name, module)
  }

  /**
   * 清理所有懒加载模块
   */
  cleanupAll() {
    this.loadedModules.forEach((module, name) => {
      try {
        module.cleanup?.()
      } catch (error) {
        console.error(`Error cleaning up module ${name}:`, error)
      }
    })
    this.loadedModules.clear()
  }

  /**
   * 清理指定模块
   * @param name 模块名称
   */
  cleanupModule(name: string) {
    const module = this.loadedModules.get(name)
    if (module) {
      try {
        module.cleanup?.()
      } catch (error) {
        console.error(`Error cleaning up module ${name}:`, error)
      }
      this.loadedModules.delete(name)
    }
  }
}
