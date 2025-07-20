import { ExplorerComponentManager } from "./component-manager/ExplorerComponentManager"
import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"

// 注册并初始化文件浏览器管理器
const explorerManager = new ExplorerComponentManager({
  name: "explorer",
  folderClickBehavior: "collapse",
  folderDefaultState: "collapsed",
  useSavedState: true,
  enableIncrementalUpdate: true,
  enablePerformanceMonitoring: false,
})
ComponentManagerFactory.register("explorer", explorerManager)

// 初始化组件
ComponentManagerFactory.initialize("explorer")

console.log("Explorer 组件管理器初始化完成")
