import { getFullSlug, RelativeURL } from "../../util/path"
import { globalResourceManager } from "./managers/index"
import { createRouter, initializeRouteAnnouncer } from "./spa/spa-core"
import { notifyNav } from "./spa/spa-utils"


/**
 * 全局清理函数实现
 * 将清理任务注册到 globalResourceManager 中
 * @param fn 清理函数
 */
window.addCleanup = (fn: (...args: any[]) => void) => {
  globalResourceManager.instance.addCleanupTask(fn)
}

// 创建路由器实例
const router = createRouter()

// 将导航函数暴露到全局
window.spaNavigate = async (pathname: RelativeURL) => router.go(pathname)

// 初始化路由公告器
initializeRouteAnnouncer()
notifyNav(getFullSlug(window))
