/**
 * Mermaid 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { MermaidComponentManager } from "./component-manager/MermaidComponentManager"

// 创建并注册 Mermaid 组件管理器
const mermaidManager = new MermaidComponentManager({
  name: "mermaid",
  debug: false,
  enableLazyLoad: true,
  lazyLoadRootMargin: "50px",
  enablePreload: true,
  preloadDelay: 2000,
})

ComponentManagerFactory.register("mermaid", mermaidManager)

// 初始化组件
ComponentManagerFactory.initialize("mermaid").catch((error) => {
  console.error("Mermaid component initialization failed:", error)
})
