/**
 * Checkbox 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { CheckboxComponentManager } from "./component-manager/CheckboxComponentManager"

// 创建并注册 Checkbox 组件管理器
const checkboxManager = new CheckboxComponentManager({
  name: "checkbox",
  debug: false,
  enableStatePersistence: true,
  storageType: "local",
  autoRestoreState: true,
})

ComponentManagerFactory.register("checkbox", checkboxManager)

// 初始化组件
ComponentManagerFactory.initialize("checkbox").catch((error) => {
  console.error("Checkbox component initialization failed:", error)
})
