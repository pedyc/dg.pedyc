/**
 * Callout 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { CalloutComponentManager } from "./component-manager/CalloutComponentManager"

// 创建并注册 Callout 组件管理器
const calloutManager = new CalloutComponentManager({
  name: "callout",
  debug: false,
  defaultCollapsed: false,
  animationDuration: 300,
  enableKeyboardNav: true,
})

ComponentManagerFactory.register("callout", calloutManager)

// 初始化组件
ComponentManagerFactory.initialize("callout").catch((error) => {
  console.error("Callout component initialization failed:", error)
})
