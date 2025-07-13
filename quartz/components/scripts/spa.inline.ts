import { RelativeURL } from "../../util/path"
import { globalResourceManager } from "./managers/index"
import { createRouter, initializeRouteAnnouncer } from "./spa/spa-core"

/**
 * 全局清理函数实现
 * 将清理任务注册到 globalResourceManager 中
 * @param fn 清理函数
 */
window.addCleanup = (fn: (...args: any[]) => void) => {
  globalResourceManager.instance.addCleanupTask(fn)
}

// 初始化路由公告器并获取 announcer 实例
/**
 * 初始化路由公告器
 * 创建并挂载一个 aria-live 区域到 DOM 中，用于屏幕阅读器宣布路由变化。
 * @returns {HTMLElement} 创建的 route-announcer 元素。
 */
const routeAnnouncer = initializeRouteAnnouncer()

// 创建路由器实例，并将 announcer 实例传递给它
/**
 * 创建路由器实例
 * 设置事件监听器和导航处理逻辑。
 * @param {HTMLElement} announcer 用于路由公告的 HTMLElement。
 * @returns {Router} 路由器实例。
 */
const router = createRouter(routeAnnouncer)

// 将导航函数暴露到全局
/**
 * 全局导航函数
 * 允许在应用程序中进行 SPA 导航，并触发相关事件。
 * @param {RelativeURL} pathname 目标路径。
 * @returns {Promise<void>} 导航完成的 Promise。
 */
window.spaNavigate = async (pathname: RelativeURL) => {
  // 只调用router.go，让spa-core.ts统一处理事件触发
  await router.go(pathname)
  // 移除重复的事件触发逻辑，避免导航两次
  // 事件触发已在spa-core.ts的导航完成后统一处理
}
