/**
 * Graph 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */
import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { GraphComponentManager } from "./component-manager/GraphComponentManager"

const graphManager = new GraphComponentManager({
  name: "graph",
  debug: true,
  enableLazyLoad: true,
  lazyLoadRootMargin: "50px",
  enablePreload: true,
  preloadDelay: 2000,
})

// 注册并初始化图谱组件
ComponentManagerFactory.register("graph", graphManager)
ComponentManagerFactory.initialize("graph").catch((error) => {
  console.error("Graph component initialization failed:", error)
})
