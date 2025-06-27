import { getFullSlug, clearUrlCache } from "../../util/path"
import { globalResourceManager } from "./managers/index"
import { navigate, createRouter, initializeRouteAnnouncer } from "./spa/spa-core"
import { notifyNav } from "./spa/spa-utils"

// 清理URL处理器缓存以确保修复后的逻辑生效
clearUrlCache()

/**
 * 全局清理函数实现
 * 将清理任务注册到 globalResourceManager 中
 * @param fn 清理函数
 */
window.addCleanup = (fn: (...args: any[]) => void) => {
  globalResourceManager.addCleanupTask(fn)
}

// 将导航函数暴露到全局
window.spaNavigate = navigate

// 初始化SPA系统
createRouter()
initializeRouteAnnouncer()
notifyNav(getFullSlug(window))
