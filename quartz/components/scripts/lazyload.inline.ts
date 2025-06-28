import { LazyloadManager } from "./managers/LazyloadManager"
import { globalResourceManager } from "./managers/index"

// 创建本地LazyloadManager实例以避免循环依赖
const globalLazyloadManager = LazyloadManager.createDefault()

/**
 * 图片懒加载初始化函数
 * 使用统一的懒加载管理器，简化业务逻辑
 */
function initializeLazyLoading(): void {
  try {
    // 使用全局懒加载管理器初始化
    globalLazyloadManager.initialize()

    // 在开发环境下输出统计信息
    if (process.env.NODE_ENV === "development") {
      console.log("[Lazyload] Initialized with stats:", globalLazyloadManager.getStats())
    }
  } catch (error) {
    console.error("[Lazyload] Initialization failed:", error)

    // 降级处理：如果管理器初始化失败，使用基础的原生懒加载
    fallbackToNativeLazyLoading()
  }
}

/**
 * 降级到原生懒加载
 * 当管理器不可用时的备用方案
 */
function fallbackToNativeLazyLoading(): void {
  console.warn("[Lazyload] Falling back to native lazy loading")

  const lazyImages = document.querySelectorAll('#quartz-body img[loading="lazy"]')
  lazyImages.forEach((img) => {
    if (img instanceof HTMLImageElement) {
      // 确保原生懒加载属性正确设置
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy")
      }

      // 如果有data-src，设置为src
      const dataSrc = img.dataset.src
      if (dataSrc && !img.src) {
        img.src = dataSrc
      }
    }
  })
}

/**
 * 清理懒加载资源
 * 在页面卸载时调用
 */
function cleanupLazyLoading(): void {
  try {
    globalLazyloadManager.cleanup()
  } catch (error) {
    console.error("[Lazyload] Cleanup failed:", error)
  }
}

// 页面加载时初始化
initializeLazyLoading()

// SPA导航时重新初始化
globalResourceManager.addEventListener(document as any, "nav", initializeLazyLoading)

// 页面卸载时清理资源
globalResourceManager.addEventListener(window, "beforeunload", cleanupLazyLoading)
globalResourceManager.addEventListener(window, "pagehide", cleanupLazyLoading)

// 导出给其他模块使用
if (typeof window !== "undefined") {
  // @ts-ignore
  window.lazyloadManager = globalLazyloadManager
}
