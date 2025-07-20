import { FileTrieNode } from "../../../util/fileTrie"
import { FullSlug } from "../../../util/path"
import { ContentDetails } from "../../../plugins/emitters/contentIndex"

// 声明全局 fetchData 变量
declare const fetchData: Promise<Record<string, ContentDetails>>
import { ParsedOptions } from "./types"
import { createFileNode, createFolderNode, scrollToActiveElement } from "./dom-utils"
import {
  loadExplorerState,
  setCurrentExplorerState,
  createExplorerState,
  restoreScrollPosition,
} from "./state-manager"
import { toggleExplorer, toggleFolder } from "./event-handlers"
import { globalResourceManager, globalStorageManager } from "../managers"
// import { GlobalManagerController } from "../managers/global-instances" // 暂时注释未使用的导入
import { performanceMonitor } from "./performance-monitor"
import { optimizationConfig } from "./optimization-config"

// 获取优化配置
const getConfig = () => optimizationConfig.getConfig()

// 移除未使用的缓存相关变量
// const pathCache = GlobalManagerController.systemCache
// const PATH_CACHE_PREFIX = "explorer_path_"

// DOM 节点缓存，避免重复创建
const nodeCache = new Map<string, HTMLElement>()
let lastFileData: FileTrieNode | null = null
let lastExplorerElement: Element | null = null

/**
 * 内存清理函数
 */
function cleanupMemory(): void {
  const config = getConfig()

  if (!config.memory.enableAutoCleanup) return

  // 清理节点缓存
  if (nodeCache.size > config.memory.maxNodeCacheSize) {
    const entries = Array.from(nodeCache.entries())
    const toDelete = entries.slice(0, entries.length - config.memory.maxNodeCacheSize)
    toDelete.forEach(([key]) => nodeCache.delete(key))

    // 记录内存使用情况（简化版本）
    // performanceMonitor.recordDOMOperation('memory-check', 1)
  }

  // 触发垃圾回收（如果可用）
  if (typeof window !== "undefined" && "gc" in window) {
    ;(window as any).gc()
  }
}

// 动态设置内存清理间隔
let cleanupInterval: NodeJS.Timeout | null = null

function setupMemoryCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
  }

  const config = getConfig()
  if (config.memory.enableAutoCleanup) {
    cleanupInterval = setInterval(cleanupMemory, config.memory.cleanupInterval)
  }
}

// 初始化内存清理
setupMemoryCleanup()

// 监听配置变更
optimizationConfig.addListener(() => {
  setupMemoryCleanup()
})

/**
 * 解析 Explorer 配置选项
 * @param explorer Explorer DOM 元素
 * @returns 解析后的配置选项
 */
function parseExplorerOptions(explorer: HTMLElement): ParsedOptions {
  const dataFns = JSON.parse(explorer.dataset.dataFns || "{}")

  return {
    folderClickBehavior: (explorer.dataset.behavior || "collapse") as "collapse" | "link",
    folderDefaultState: (explorer.dataset.collapsed || "collapsed") as "collapsed" | "open",
    useSavedState: explorer.dataset.savestate === "true",
    order: dataFns.order || ["filter", "map", "sort"],
    sortFn: new Function("return " + (dataFns.sortFn || "undefined"))(),
    filterFn: new Function("return " + (dataFns.filterFn || "undefined"))(),
    mapFn: new Function("return " + (dataFns.mapFn || "undefined"))(),
  }
}

/**
 * 应用数据处理函数到文件树
 * @param trie 文件树
 * @param opts 配置选项
 */
function applyDataProcessingFunctions(trie: FileTrieNode, opts: ParsedOptions): void {
  for (const fn of opts.order) {
    switch (fn) {
      case "filter":
        if (opts.filterFn) trie.filter(opts.filterFn)
        break
      case "map":
        if (opts.mapFn) trie.map(opts.mapFn)
        break
      case "sort":
        if (opts.sortFn) trie.sort(opts.sortFn)
        break
    }
  }
}

/**
 * 构建 Explorer 树结构
 * @param trie 文件树
 * @param currentSlug 当前页面 slug
 * @param opts 配置选项
 * @returns 文档片段
 */
function buildExplorerTree(
  trie: FileTrieNode,
  currentSlug: FullSlug,
  opts: ParsedOptions,
): DocumentFragment {
  const fragment = document.createDocumentFragment()

  for (const child of trie.children) {
    const node = child.isFolder
      ? createFolderNode(currentSlug, child, opts)
      : createFileNode(currentSlug, child, opts)
    fragment.appendChild(node)
  }

  return fragment
}

/**
 * 设置事件监听器
 * @param explorer Explorer DOM 元素
 * @param opts 配置选项
 */
function setupExplorerEventListeners(explorer: HTMLElement, opts: ParsedOptions): void {
  // 设置 Explorer 切换按钮事件监听器
  const explorerButtons = explorer.getElementsByClassName(
    "explorer-toggle",
  ) as HTMLCollectionOf<HTMLElement>

  for (const button of explorerButtons) {
    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    button.addEventListener("click", toggleExplorer)
    globalResourceManager.instance.addCleanupTask(() =>
      button.removeEventListener("click", toggleExplorer),
    )
  }

  // 设置文件夹点击事件监听器
  if (opts.folderClickBehavior === "collapse") {
    const folderButtons = explorer.getElementsByClassName(
      "folder-button",
    ) as HTMLCollectionOf<HTMLElement>

    for (const button of folderButtons) {
      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
      button.addEventListener("click", toggleFolder)
      globalResourceManager.instance.addCleanupTask(() =>
        button.removeEventListener("click", toggleFolder),
      )
    }
  }

  // 设置文件夹图标点击事件监听器
  const folderIcons = explorer.getElementsByClassName(
    "folder-icon",
  ) as HTMLCollectionOf<HTMLElement>

  for (const icon of folderIcons) {
    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    icon.addEventListener("click", toggleFolder)
    globalResourceManager.instance.addCleanupTask(() =>
      icon.removeEventListener("click", toggleFolder),
    )
  }
}

/**
 * 检查两个文件数据是否相似（用于判断是否可以增量更新）
 */
function isDataSimilar(oldData: FileTrieNode, newData: FileTrieNode): boolean {
  const config = getConfig()

  if (!config.data.enableDataSimilarityCheck) {
    return false // 禁用相似性检查时总是进行完全重建
  }

  // 简单的相似性检查：比较根节点的子节点数量
  const oldEntries = Array.from(oldData.entries())
  const newEntries = Array.from(newData.entries())

  // 如果数量差异超过20%，认为需要完全重建
  const sizeDiff = Math.abs(oldEntries.length - newEntries.length)
  return sizeDiff / Math.max(oldEntries.length, 1) < 0.2
}

/**
 * 执行增量更新
 */
function performIncrementalUpdate(
  // explorer: HTMLElement,
  explorerUl: HTMLElement,
  trie: FileTrieNode,
  currentSlug: FullSlug,
  opts: ParsedOptions,
): void {
  performanceMonitor.startTimer("incremental-update")
  console.log("[Explorer] Using incremental update")

  // 只更新变化的部分
  updateChangedNodes(explorerUl, trie, currentSlug, opts)

  // 滚动到活动元素
  scrollToActiveElement(explorerUl)

  const duration = performanceMonitor.endTimer("incremental-update")
  performanceMonitor.recordRendering("incremental", duration)
}

/**
 * 执行完全重建
 */
function performFullRebuild(
  explorer: HTMLElement,
  explorerUl: HTMLElement,
  trie: FileTrieNode,
  currentSlug: FullSlug,
  opts: ParsedOptions,
): void {
  performanceMonitor.startTimer("full-rebuild")
  console.log("[Explorer] Performing full rebuild")

  // 清除节点缓存
  nodeCache.clear()

  // 构建并插入新内容
  const fragment = buildExplorerTree(trie, currentSlug, opts)

  // 仅更新变化的部分
  const existingNodes = Array.from(explorerUl.children)
  const newNodes = Array.from(fragment.children)

  // 比较新旧节点，只更新差异部分
  for (let i = 0; i < Math.max(existingNodes.length, newNodes.length); i++) {
    const existing = existingNodes[i]
    const newNode = newNodes[i]

    if (!existing && newNode) {
      explorerUl.appendChild(newNode)
      performanceMonitor.recordDOMOperation("create", 0)
    } else if (existing && !newNode) {
      existing.remove()
      performanceMonitor.recordDOMOperation("remove", 0)
    } else if (existing && newNode && !existing.isEqualNode(newNode)) {
      existing.replaceWith(newNode)
      performanceMonitor.recordDOMOperation("update", 0)
    }
  }

  // 恢复滚动位置
  restoreScrollPosition(explorerUl)

  // 设置事件监听器
  setupExplorerEventListeners(explorer, opts)

  // 更新缓存
  lastFileData = trie
  lastExplorerElement = explorer

  // 滚动到活动元素
  scrollToActiveElement(explorerUl)

  const duration = performanceMonitor.endTimer("full-rebuild")
  performanceMonitor.recordRendering("full", duration)
}

/**
 * 更新变化的节点
 */
function updateChangedNodes(
  explorerUl: HTMLElement,
  trie: FileTrieNode,
  currentSlug: FullSlug,
  opts: ParsedOptions,
): void {
  // 这里可以实现更精细的增量更新逻辑
  // 目前先使用简化版本：只重建树结构
  const fragment = buildExplorerTree(trie, currentSlug, opts)

  // 仅更新变化的部分
  const existingNodes = Array.from(explorerUl.children)
  const newNodes = Array.from(fragment.children)

  // 比较新旧节点，只更新差异部分
  for (let i = 0; i < Math.max(existingNodes.length, newNodes.length); i++) {
    const existing = existingNodes[i]
    const newNode = newNodes[i]

    if (!existing && newNode) {
      explorerUl.appendChild(newNode)
    } else if (existing && !newNode) {
      existing.remove()
    } else if (existing && newNode && !existing.isEqualNode(newNode)) {
      existing.replaceWith(newNode)
    }
  }
}

/**
 * 初始化并设置文件浏览器。此函数处理：
 * 1. 解析数据属性中的 explorer 选项
 * 2. 从本地存储加载并应用保存的文件夹状态
 * 3. 使用过滤、映射和排序函数处理文件数据
 * 4. 构建 explorer 树结构
 * 5. 恢复 explorer 的滚动位置
 * 6. 设置 explorer 切换和文件夹交互的事件监听器
 * 7. 将活动文件/文件夹滚动到视图中
 *
 * @param currentSlug 当前活动页面的 slug，用于在 explorer 中高亮显示活动项
 * @description 初始化文件浏览器。此函数会为每个具有 `data-data-fns` 属性的 explorer 元素设置事件监听器、构建文件树并恢复滚动位置。
 */
export async function setupExplorer(currentSlug: FullSlug): Promise<void> {
  const allExplorers = document.querySelectorAll("div.explorer") as NodeListOf<HTMLElement>

  for (const explorer of allExplorers) {
    // 解析配置选项
    const opts = parseExplorerOptions(explorer)

    // 加载保存的状态
    const serializedExplorerState = loadExplorerState(opts.useSavedState)
    setCurrentExplorerState(serializedExplorerState)

    // 创建旧状态索引
    const oldIndex = new Map<string, boolean>()
    for (const folder of serializedExplorerState) {
      oldIndex.set(folder.path, folder.collapsed)
    }

    // 获取并处理数据（带缓存）
    const cachedData = globalStorageManager.instance.getItem("session", "explorerData")

    let data

    if (cachedData) {
      data = JSON.parse(cachedData)
    } else {
      // 直接使用全局 fetchData，这是最可靠的方式
      data = await fetchData
      if (!data) {
        throw new Error("fetchData resolved to null or undefined")
      }
      globalStorageManager.instance.setItem("session", "explorerData", JSON.stringify(data))
    }

    const entries = [...Object.entries(data)] as [FullSlug, ContentDetails][]
    const trie = FileTrieNode.fromEntries(entries)

    // 应用数据处理函数
    applyDataProcessingFunctions(trie, opts)

    // 创建新的状态
    const folderPaths = trie.getFolderPaths()
    const newExplorerState = createExplorerState(
      folderPaths,
      oldIndex,
      opts.folderDefaultState === "collapsed",
    )
    setCurrentExplorerState(newExplorerState)

    // 获取 Explorer 容器
    const explorerUl: HTMLElement | null = explorer.querySelector(".explorer-ul")
    if (!explorerUl) continue

    // 检查是否需要增量更新
    const config = getConfig()
    const canUseIncrementalUpdate = lastFileData && lastExplorerElement === explorer

    if (
      config.dom.enableIncrementalUpdate &&
      canUseIncrementalUpdate &&
      isDataSimilar(lastFileData!, trie)
    ) {
      performIncrementalUpdate(explorerUl, trie, currentSlug, opts)
    } else {
      performFullRebuild(explorer, explorerUl, trie, currentSlug, opts)
    }
  }
}
