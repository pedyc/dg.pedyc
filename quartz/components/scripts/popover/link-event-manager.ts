import { initializeViewportPreloading } from "./viewport-preload-manager"
import { clearUrlCache } from "../../../util/path"
import { globalResourceManager } from "../managers/index"

// 清理URL处理器缓存以确保修复后的逻辑生效
clearUrlCache()

// 外部依赖（需要从主文件导入）
declare function mouseEnterHandler(
  this: HTMLAnchorElement,
  event: { clientX: number; clientY: number },
): Promise<void>
declare function clearActivePopover(): void

/**
 * 优化的链接事件管理器
 */
export class LinkEventManager {
  private static isInitialized = false
  private static clearPopoverFunction: Function | null = null

  /**
   * 设置链接事件监听器
   * @param mouseEnterFn 鼠标进入处理函数
   * @param clearPopoverFn 清除弹窗函数
   */
  static setupLinkEventListeners(mouseEnterFn?: Function, clearPopoverFn?: Function): void {
    // 保存 clearPopover 函数的引用
    if (clearPopoverFn) {
      this.clearPopoverFunction = clearPopoverFn
    }

    const links = [
      ...document.querySelectorAll("a.internal, a[data-wikilink]"),
    ] as HTMLAnchorElement[]
    console.log(`[LinkEventManager] Found ${links.length} links to bind events`)

    for (const link of links) {
      // 检查是否已经绑定过事件，避免重复绑定
      if (link.dataset.popoverBound === "true") {
        continue
      }

      // 使用ResourceManager统一管理事件监听器
      if (mouseEnterFn) {
        globalResourceManager.addEventListener(link, "mouseenter", mouseEnterFn as EventListener)
      } else if (typeof mouseEnterHandler !== "undefined") {
        globalResourceManager.addEventListener(
          link,
          "mouseenter",
          mouseEnterHandler as unknown as EventListener,
        )
      }

      if (clearPopoverFn) {
        globalResourceManager.addEventListener(link, "mouseleave", clearPopoverFn as EventListener)
      } else if (typeof clearActivePopover !== "undefined") {
        globalResourceManager.addEventListener(
          link,
          "mouseleave",
          clearActivePopover as EventListener,
        )
      }

      globalResourceManager.addEventListener(
        link,
        "click",
        this.wikilinkClickHandler as unknown as EventListener,
      )

      // 标记已绑定事件，避免重复绑定
      link.dataset.popoverBound = "true"
    }

    // 只在首次初始化时设置视口预加载
    if (!this.isInitialized) {
      initializeViewportPreloading()
      this.isInitialized = true
    }
  }

  /**
   * 处理内部链接点击事件，只清理弹窗，让SPA系统处理导航
   * @param event 点击事件对象
   */
  private static async wikilinkClickHandler(event: MouseEvent): Promise<void> {
    // 不阻止默认行为，让spa.inline.ts中的handleClick处理导航
    // event.preventDefault() // 移除这行，避免与SPA系统冲突

    const anchorElement = event.currentTarget as HTMLAnchorElement
    console.log("[LinkEvent Debug] Clicked link:", anchorElement.href)

    // 只负责清理弹窗，导航由SPA系统统一处理
    if (this.clearPopoverFunction) {
      this.clearPopoverFunction()
    }

    // 不再手动处理导航，让spa.inline.ts的handleClick函数处理
    // 这样可以确保导航逻辑的一致性，避免重复的历史记录问题
  }

  /**
   * 获取初始化状态
   */
  static getInitializationStatus(): boolean {
    return this.isInitialized
  }

  /**
   * 重置初始化状态（用于测试或特殊情况）
   */
  static resetInitialization(): void {
    this.isInitialized = false
  }
}

/**
 * 优化的事件监听器管理
 */
export function setupLinkEventListeners(): void {
  LinkEventManager.setupLinkEventListeners()
}
