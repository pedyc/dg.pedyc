/**
 * Popover模块统一导出
 */
export { PopoverConfig } from "./config"
export { PopoverError, PopoverErrorHandler } from "./error-handler"

// URL和链接处理
export { URLProcessor } from "./url-processor"

// 内容处理
export { HTMLContentProcessor } from "./html-processor"

// 预加载和缓存管理
export { PreloadManager, preloadingInProgress } from "./preload-manager"
export type { CachedItem } from "../managers/OptimizedCacheManager"
export { preloadedCache } from "./cache"

// 失败链接管理
export { FailedLinksManager } from "./failed-links-manager"

// 视口预加载
export {
  ViewportPreloadManager,
  initializeViewportPreloading,
  linkCheckInProgress,
  elementMetadata,
} from "./viewport-preload-manager"

// 事件管理
export { LinkEventManager, setupLinkEventListeners } from "./link-event-manager"

// 注册管理器到全局清理系统
import { GlobalCleanupManager } from "../managers/CleanupManager"
import { ViewportPreloadManager } from "./viewport-preload-manager"
import { PreloadManager } from "./preload-manager"
import { preloadedCache } from "./cache"

export { mouseEnterHandler, clearActivePopover } from "./popover-handler"
// 注册实现了ICleanupManager接口的管理器
GlobalCleanupManager.register(ViewportPreloadManager)
GlobalCleanupManager.register(PreloadManager)
GlobalCleanupManager.register(preloadedCache)
