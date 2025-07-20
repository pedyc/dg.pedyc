/**
 * Comments 组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { CommentsComponentManager } from "./component-manager/CommentsComponentManager"

// 创建并注册 Comments 组件管理器
const commentsManager = new CommentsComponentManager({
  name: "comments",
  debug: false,
  enableThemeSync: true,
  enableLazyLoad: true,
  lazyLoadRootMargin: "50px",
})

ComponentManagerFactory.register("comments", commentsManager)

// 初始化组件
ComponentManagerFactory.initialize("comments").catch((error) => {
  console.error("Comments component initialization failed:", error)
})
