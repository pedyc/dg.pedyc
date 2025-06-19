// 配置和错误处理
export { PopoverConfig } from './config'
export { PopoverError, PopoverErrorHandler } from './error-handler'

// URL和链接处理

export { LinkValidator } from './link-validator'

// 内容处理
export { HTMLContentProcessor } from './html-processor'

// 预加载和缓存管理
export { PreloadManager, preloadingInProgress, failedLinks } from './preload-manager'
export type { CachedItem } from '../managers/OptimizedCacheManager'
export { preloadedCache } from './cache'

// 失败链接管理
export { FailedLinksManager } from './failed-links-manager'

// 视口预加载
export { ViewportPreloadManager, initializeViewportPreloading, linkCheckInProgress, elementMetadata } from './viewport-preload-manager'

// 事件管理
export { LinkEventManager, setupLinkEventListeners } from './link-event-manager'