/**
 * Graph 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { GraphComponentManager } from "./component-manager/GraphComponentManager"

const graphManager = new GraphComponentManager({
  name: "graph",
  debug: false,
  enableLazyLoad: true,
  lazyLoadRootMargin: "50px",
  enablePreload: true,
  preloadDelay: 2000,
})
ComponentManagerFactory.register("graph", graphManager)
console.log("graphManager", graphManager)
ComponentManagerFactory.initialize("graph").catch((error) => {
  console.error("Graph component initialization failed:", error)
})


