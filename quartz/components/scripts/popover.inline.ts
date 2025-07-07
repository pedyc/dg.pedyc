// 在文件顶部添加类型声明
declare global {
  interface Window {
    cleanup: () => void
  }
}

import {
  FailedLinksManager,
  ViewportPreloadManager,
  LinkEventManager,
  mouseEnterHandler,
  clearActivePopover,
} from "./popover/index"

import { globalResourceManager } from "./managers/index"

function popoverSetup() {
  FailedLinksManager.loadFailedLinks()
  LinkEventManager.setupLinkEventListeners(mouseEnterHandler, clearActivePopover)
  ViewportPreloadManager.initialize()
}

// 使用ResourceManager统一管理事件监听器
globalResourceManager.instance.addEventListener(document as unknown as EventTarget, "nav", () => {
  popoverSetup()
})

// 在 popover.inline.ts 中添加
globalResourceManager.instance.addEventListener(
  document as unknown as EventTarget,
  "DOMContentLoaded",
  () => popoverSetup(),
)

/**
 * 监听缓存清理事件，并在事件触发时重新初始化 popover 相关功能。
 */
globalResourceManager.instance.addEventListener(
  document as unknown as EventTarget,
  "cacheCleared",
  () => {
    popoverSetup()
  },
)
