/**
 * Popover 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

// 在文件顶部添加类型声明
declare global {
  interface Window {
    cleanup: () => void
  }
}

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { PopoverComponentManager } from "./component-manager/PopoverComponentManager"

// 创建并注册 Popover 组件管理器
const popoverManager = new PopoverComponentManager({
  name: "popover",
  debug: false,
  enablePreload: true,
  preloadDelay: 1000,
  enableViewportPreload: true,
  enableFailedLinksManagement: true,
  showDelay: 300,
  hideDelay: 100,
})

ComponentManagerFactory.register("popover", popoverManager)

// 初始化组件
ComponentManagerFactory.initialize("popover").catch((error) => {
  console.error("Popover component initialization failed:", error)
})
