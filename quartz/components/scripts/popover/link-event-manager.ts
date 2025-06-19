import { initializeViewportPreloading } from './viewport-preload-manager'
import { clearUrlCache } from '../../../util/path'

// 清理URL处理器缓存以确保修复后的逻辑生效
clearUrlCache()

// 外部依赖（需要从主文件导入）
declare function mouseEnterHandler(this: HTMLAnchorElement, event: { clientX: number; clientY: number }): Promise<void>
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
    // 移除 isInitialized 检查，允许在SPA导航后重新绑定事件
    console.log('[LinkEventManager] Setting up link event listeners')

    // 保存 clearPopover 函数的引用
    if (clearPopoverFn) {
      this.clearPopoverFunction = clearPopoverFn
    }

    const links = [...document.querySelectorAll("a.internal, a[data-wikilink]")] as HTMLAnchorElement[]
    console.log(`[LinkEventManager] Found ${links.length} links to bind events`)

    for (const link of links) {
      // 检查是否已经绑定过事件，避免重复绑定
      if (link.dataset.popoverBound === 'true') {
        continue
      }

      // 使用传入的函数或声明的全局函数
      if (mouseEnterFn) {
        link.addEventListener("mouseenter", mouseEnterFn as EventListener)
      } else if (typeof mouseEnterHandler !== 'undefined') {
        link.addEventListener("mouseenter", mouseEnterHandler as unknown as EventListener)
      }

      if (clearPopoverFn) {
        link.addEventListener("mouseleave", clearPopoverFn as EventListener)
      } else if (typeof clearActivePopover !== 'undefined') {
        link.addEventListener("mouseleave", clearActivePopover as EventListener)
      }

      link.addEventListener("click", this.wikilinkClickHandler as unknown as EventListener)

      // 标记已绑定事件，避免重复绑定
      link.dataset.popoverBound = 'true'
    }

    // 只在首次初始化时设置视口预加载
    if (!this.isInitialized) {
      initializeViewportPreloading()
      this.isInitialized = true
    }
  }

  /**
   * 处理内部链接点击事件，使用SPA导航系统避免重复历史记录
   * @param event 点击事件对象
   */
  private static async wikilinkClickHandler(event: MouseEvent): Promise<void> {
    event.preventDefault() // 阻止默认跳转

    const anchorElement = event.currentTarget as HTMLAnchorElement
    const targetUrl = new URL(anchorElement.href)

    console.log('[LinkEvent Debug] Clicked link:', anchorElement.href)
    console.log('[LinkEvent Debug] Target URL:', targetUrl.toString())

    // 调用传入的 clearPopover 函数
    if (this.clearPopoverFunction) {
      this.clearPopoverFunction()
    }

    // 使用SPA导航系统，避免重复的历史记录条目
    // 检查是否存在全局的SPA导航函数
    if (typeof (window as any).spaNavigate === 'function') {
      console.log('[LinkEvent Debug] Using SPA navigation')
      await (window as any).spaNavigate(targetUrl, false)
    } else {
      // 如果SPA导航不可用，回退到传统导航
      console.log('[LinkEvent Debug] SPA navigation not available, using traditional navigation')
      window.location.assign(targetUrl.toString())
    }
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