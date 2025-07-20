/**
 * 阅读模式组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { ReadermodeComponentManager } from "./component-manager/ReadermodeComponentManager"

// 注册并初始化阅读模式管理器
const readermodeManager = new ReadermodeComponentManager({
  name: "readermode",
  defaultMode: "off",
})

ComponentManagerFactory.register("readermode", readermodeManager)

// 初始化组件
ComponentManagerFactory.initialize("readermode")
