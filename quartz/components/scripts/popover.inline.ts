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

// 在初始化时加载失败链接
FailedLinksManager.loadFailedLinks()

// 使用ResourceManager统一管理事件监听器
globalResourceManager.addEventListener(document as unknown as EventTarget, "nav", () => {
  // 使用 LinkEventManager 设置事件监听器
  LinkEventManager.setupLinkEventListeners(mouseEnterHandler, clearActivePopover)

  // 初始化视口预加载逻辑
  ViewportPreloadManager.initialize()
})

// 在 popover.inline.ts 中添加
globalResourceManager.addEventListener(
  document as unknown as EventTarget,
  "DOMContentLoaded",
  () => {
    LinkEventManager.setupLinkEventListeners(mouseEnterHandler, clearActivePopover)
    ViewportPreloadManager.initialize()
  },
)
