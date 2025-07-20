import { TocComponentManager } from "./component-manager/TocComponentManager"
import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"

// 注册并初始化目录管理器
const tocManager = new TocComponentManager({
  name: "toc",
  enableHighlight: true,
})

ComponentManagerFactory.register("toc", tocManager)

// 初始化组件
ComponentManagerFactory.initialize("toc")
