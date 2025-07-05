/**
 * Popover模块统一导出
 */
export { PopoverConfig } from "./popover-config"
export { PopoverError, PopoverErrorHandler } from "./error-handler"

// URL和链接处理
// URLProcessor已移除，直接使用path.ts中的函数

// 内容处理
export { HTMLContentProcessor } from "./html-processor"

// 预加载和缓存管理
export { PreloadManager, preloadingInProgress } from "./preload-manager"
export type { CachedItem } from "../managers/OptimizedCacheManager"

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
import { FailedLinksManager } from "./failed-links-manager"

export { mouseEnterHandler, clearActivePopover, clearAllPopovers } from "./popover-handler"
// 注册实现了ICleanupManager接口的管理器
// 注意：preloadedCache已被统一缓存管理器替代，无需单独注册
GlobalCleanupManager.register(ViewportPreloadManager)
GlobalCleanupManager.register(PreloadManager)
GlobalCleanupManager.register(FailedLinksManager)
