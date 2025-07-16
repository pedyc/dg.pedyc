/**
 * 搜索组件入口文件
 * 使用 BaseComponentManager 统一管理模式
 */

import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { SearchComponentManager } from "./component-manager/SearchComponentManager"

const searchManager = new SearchComponentManager()

ComponentManagerFactory.register("search", searchManager)

// 初始化组件
ComponentManagerFactory.initialize("search")


