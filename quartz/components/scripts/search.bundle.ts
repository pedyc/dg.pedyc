/**
 * 搜索组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { SearchComponentManager } from "./component-manager/SearchComponentManager"

const searchManager = new SearchComponentManager()

export async function initializeSearch(): Promise<void> {
  searchManager.initialize()
}

ComponentManagerFactory.register("search", searchManager)
ComponentManagerFactory.initialize("search").catch((error) => {
  console.error("Search component initialization failed:", error)
})


