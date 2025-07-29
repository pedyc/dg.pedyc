/**
 * 搜索组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { SearchComponentManager } from "./component-manager/SearchComponentManager"

// SearchComponentManager now directly manages search initialization.

const searchManager = new SearchComponentManager()
ComponentManagerFactory.register("search", searchManager)
searchManager.initialize().catch((error) => {
  console.error("Search component initialization failed:", error)
})


