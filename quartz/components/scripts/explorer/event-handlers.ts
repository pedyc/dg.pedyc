import { FullSlug } from "../../../util/path"
import { MaybeHTMLElement } from "./types"
import { setFolderState } from "./dom-utils"
import { updateFolderState, saveScrollPosition } from "./state-manager"
import { setupExplorer } from "./explorer-core"
import { globalResourceManager } from "../managers"
import { optimizationConfig } from "./optimization-config"

// 事件委托优化：使用单个监听器处理所有点击事件
let explorerClickHandler: ((event: Event) => void) | null = null
let explorerResizeHandler: (() => void) | null = null

// 防抖函数
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: number | null = null
  return ((...args: any[]) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => func(...args), wait)
  }) as T
}

/**
 * 切换 Explorer 的展开/折叠状态
 */
export function toggleExplorer(this: HTMLElement): void {
  const nearestExplorer = this.closest(".explorer") as HTMLElement
  if (!nearestExplorer) return

  const explorerCollapsed = nearestExplorer.classList.toggle("collapsed")
  nearestExplorer.setAttribute(
    "aria-expanded",
    nearestExplorer.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )

  if (!explorerCollapsed) {
    // 当移动端 explorer 打开时，阻止 <html> 滚动
    document.documentElement.classList.add("mobile-no-scroll")
  } else {
    document.documentElement.classList.remove("mobile-no-scroll")
  }
}

/**
 * 切换文件夹的展开/折叠状态
 * @param evt 鼠标事件
 */
export function toggleFolder(evt: MouseEvent): void {
  evt.stopPropagation()
  const target = evt.target as MaybeHTMLElement
  if (!target) return

  // 检查目标是否为 svg 图标或按钮
  const isSvg = target.nodeName === "svg"

  // 获取相对于点击按钮/文件夹的对应 <ul> 元素
  const folderContainer = (
    isSvg
      ? // svg -> div.folder-container
        target.parentElement
      : // button.folder-button -> div -> div.folder-container
        target.parentElement?.parentElement
  ) as MaybeHTMLElement

  if (!folderContainer) return

  const childFolderContainer = folderContainer.nextElementSibling as MaybeHTMLElement
  if (!childFolderContainer) return

  childFolderContainer.classList.toggle("open")

  // 折叠文件夹容器
  const isCollapsed = !childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, isCollapsed)

  // 更新状态
  const folderPath = folderContainer.dataset.folderpath
  if (folderPath) {
    updateFolderState(folderPath, isCollapsed)
  }
}

/**
 * 处理页面导航前事件
 */
export function handlePreNavigation(): void {
  console.log("Explorer: 监听到 SPA prenav 事件")

  // 保存 explorer 滚动位置
  const explorer = document.querySelector(".explorer-ul") as HTMLElement
  if (!explorer) {
    console.log("Explorer: 未找到 .explorer-ul 元素")
    return
  }

  console.log("Explorer: 保存滚动位置", {
    scrollTop: explorer.scrollTop,
    scrollHeight: explorer.scrollHeight,
    clientHeight: explorer.clientHeight,
  })

  saveScrollPosition(explorer.scrollTop)
}

/**
 * 处理页面导航事件
 * @param evt 导航事件
 */
export async function handleNavigation(evt: Event): Promise<void> {
  console.log("Explorer: 监听到 SPA nav 事件")

  // 获取当前页面的 slug 并重新初始化 explorer
  const navEvent = evt as CustomEvent<{ url: FullSlug }>
  const currentSlug = navEvent.detail.url

  console.log("Explorer: SPA 导航到新页面", {
    newSlug: currentSlug,
    timestamp: new Date().toISOString(),
  })

  // 重新初始化 explorer，这会自动处理活动元素高亮和滚动
  await setupExplorer(currentSlug)

  console.log("Explorer: SPA 导航后 setupExplorer 完成")

  // 如果移动端汉堡菜单可见，默认折叠
  for (const explorer of document.getElementsByClassName("explorer")) {
    const mobileExplorer = explorer.querySelector(".mobile-explorer")
    if (!mobileExplorer) continue

    // 确保 mobileExplorer 是 HTMLElement 类型，以便调用 checkVisibility()
    if (mobileExplorer instanceof HTMLElement && mobileExplorer.checkVisibility()) {
      explorer.classList.add("collapsed")
      explorer.setAttribute("aria-expanded", "false")

      // 当移动端 explorer 折叠时，允许 <html> 滚动
      document.documentElement.classList.remove("mobile-no-scroll")

      console.log("Explorer: 移动端 explorer 已折叠")
    }

    mobileExplorer.classList.remove("hide-until-loaded")
  }
}

/**
 * 处理缓存清理事件
 */
export async function handleCacheCleared(): Promise<void> {
  // 获取当前页面的 slug，以便重新初始化 explorer
  const currentSlug = window.location.pathname.replace(/\/index\.html$/, "") as FullSlug
  await setupExplorer(currentSlug)
  console.log("Explorer reinitialized after cache clear.")
}

/**
 * 处理 Explorer 重新初始化事件
 * @param e 重新初始化事件
 */
export async function handleExplorerReinit(e: CustomEvent<{ url: FullSlug }>): Promise<void> {
  console.log("reinit-explorer", e)
  const currentSlug = e.detail.url
  await setupExplorer(currentSlug)
}

/**
 * 处理窗口大小调整事件
 */
export function handleWindowResize(): void {
  // 桌面端 explorer 默认打开，当窗口调整为移动端屏幕大小时保持打开状态
  // 在这种边缘情况下对 <html> 应用 `no-scroll`
  const explorer = document.querySelector(".explorer")
  if (explorer && !explorer.classList.contains("collapsed")) {
    document.documentElement.classList.add("mobile-no-scroll")
    return
  }
}

// 防止重复注册事件监听器的标志
let eventListenersSetup = false

/**
 * 设置 Explorer 事件监听器
 * 使用标志位防止重复注册，并实现事件委托优化
 */
export function setupExplorerEventListeners(): void {
  setupEventListeners()
}

/**
 * 设置Explorer组件的事件监听器
 * 包括点击、调整大小等事件的处理
 */
export function setupEventListeners(): void {
  if (eventListenersSetup) {
    console.log("[Explorer] Event listeners already set up, skipping...")
    return
  }

  console.log("[Explorer] Setting up event listeners...")

  // SPA 导航前事件：保存滚动位置
  globalResourceManager.instance.addEventListener(
    document as any as HTMLElement,
    "prenav",
    handlePreNavigation,
  )

  // SPA 导航事件：重新初始化 Explorer
  globalResourceManager.instance.addEventListener(
    document as any as HTMLElement,
    "nav",
    handleNavigation,
  )

  // 缓存清理事件
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  document.addEventListener("cacheCleared", handleCacheCleared)

  // Explorer 重新初始化事件
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  document.addEventListener("reinit-explorer", handleExplorerReinit)

  // 优化的窗口大小调整事件（防抖）
  if (!explorerResizeHandler) {
    const config = optimizationConfig.getConfig()
    explorerResizeHandler = debounce(handleWindowResize, config.dom.debounceDelay)
  }
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  window.addEventListener("resize", explorerResizeHandler)

  // 设置事件委托处理器
  setupEventDelegation()

  eventListenersSetup = true
  console.log("[Explorer] Event listeners set up successfully")
}

/**
 * 设置事件委托处理器
 */
function setupEventDelegation(): void {
  if (explorerClickHandler) {
    return // 已经设置过了
  }

  explorerClickHandler = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target) return

    // 处理文件夹切换
    const folderButton = target.closest(".folder-button")
    if (folderButton) {
      event.preventDefault()
      toggleFolder(event as MouseEvent)
      return
    }

    // 处理 Explorer 切换
    const explorerButton = target.closest("#explorer-button")
    if (explorerButton) {
      event.preventDefault()
      toggleExplorer.call(explorerButton as HTMLElement)
      return
    }
  }

  // 使用事件委托，在 document 上监听点击事件
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  document.addEventListener("click", explorerClickHandler)
}

/**
 * 清理事件委托处理器
 */
export function cleanupEventDelegation(): void {
  if (explorerClickHandler) {
    document.removeEventListener("click", explorerClickHandler)
    explorerClickHandler = null
  }
}

/**
 * 重置事件监听器设置标志（用于测试或特殊情况）
 */
export function resetEventListenersFlag(): void {
  eventListenersSetup = false
  console.log("Explorer: 事件监听器标志已重置")
}
