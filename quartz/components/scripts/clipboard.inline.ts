/**
 * Clipboard 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { ClipboardComponentManager } from "./component-manager/ClipboardComponentManager"

// 创建并注册 Clipboard 组件管理器
const clipboardManager = new ClipboardComponentManager({
  name: "clipboard",
  debug: false,
  feedbackDuration: 2000,
  showLabel: true,
  buttonClassName: "clipboard-button",
  enableKeyboardShortcut: false,
})

ComponentManagerFactory.register("clipboard", clipboardManager)

// 初始化组件
ComponentManagerFactory.initialize("clipboard").catch((error) => {
  console.error("Clipboard component initialization failed:", error)
})
