import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"
import { FileTrieNode } from "../../../util/fileTrie"
import { FullSlug } from "../../../util/path"
import { ContentDetails } from "../../../plugins/emitters/contentIndex"
import { ParsedOptions } from "../explorer/types"
import { createFileNode, createFolderNode, scrollToActiveElement } from "../explorer/dom-utils"
import {
  loadExplorerState,
  setCurrentExplorerState,
  createExplorerState,
  restoreScrollPosition,
} from "../explorer/state-manager"
import { toggleExplorer, toggleFolder } from "../explorer/event-handlers"
import { performanceMonitor } from "../explorer/performance-monitor"
import { optimizationConfig } from "../explorer/optimization-config"
import { OptimizedCacheManager } from "../managers/OptimizedCacheManager"

/**
 * 文件浏览器组件配置接口
 */
interface ExplorerConfig extends ComponentConfig {
  /** 文件夹点击行为 */
  folderClickBehavior?: "collapse" | "link"
  /** 文件夹默认状态 */
  folderDefaultState?: "collapsed" | "open"
  /** 是否使用保存的状态 */
  useSavedState?: boolean
  /** 是否启用增量更新 */
  enableIncrementalUpdate?: boolean
  /** 是否启用性能监控 */
  enablePerformanceMonitoring?: boolean
}

/**
 * 文件浏览器组件状态接口
 */
interface ExplorerState extends ComponentState {
  /** 浏览器元素列表 */
  explorerElements: HTMLElement[]
  /** 当前文件数据 */
  currentFileData: FileTrieNode | null
  /** 当前页面 slug */
  currentSlug: FullSlug | null
  /** DOM 节点缓存 */
  nodeCache: Map<string, HTMLElement>
  /** 内存清理定时器 */
  cleanupInterval: NodeJS.Timeout | null
}

/**
 * 文件浏览器组件管理器
 * 负责管理文件浏览器的初始化、事件监听、状态管理和性能优化
 */
export class ExplorerComponentManager extends BaseComponentManager<ExplorerConfig, ExplorerState> {
  private cache: OptimizedCacheManager<any>

  constructor(config: Partial<ExplorerConfig> = {}) {
    super({
      name: "explorer",
      folderClickBehavior: "collapse",
      folderDefaultState: "collapsed",
      useSavedState: false,
      enableIncrementalUpdate: true,
      enablePerformanceMonitoring: false,
      ...config,
    })
    this.cache = new OptimizedCacheManager<any>({})
  }

  /**
   * 从缓存中获取数据
   * @param key 缓存键
   * @returns 缓存数据或 null
   */
  protected getFromCache<T>(key: string): T | null {
    return this.cache.get(key)
  }

  /**
   * 将数据设置到缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 存活时间 (秒)
   */
  protected setToCache<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, ttl)
  }

  /**
   * 从缓存中移除数据
   * @param key 缓存键
   */
  protected removeFromCache(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 获取优化配置
   */
  private getOptimizationConfig() {
    return optimizationConfig.getConfig()
  }

  /**
   * 解析 Explorer 配置选项
   */
  private parseExplorerOptions(explorer: HTMLElement): ParsedOptions {
    const dataFns = JSON.parse(explorer.dataset.dataFns || "{}")

    return {
      folderClickBehavior: (explorer.dataset.behavior ||
        (this.config as any).folderClickBehavior ||
        "collapse") as "collapse" | "link",
      folderDefaultState: (explorer.dataset.collapsed ||
        (this.config as any).folderDefaultState ||
        "collapsed") as "collapsed" | "open",
      useSavedState:
        explorer.dataset.savestate === "true" || (this.config as any).useSavedState || false,
      order: dataFns.order || ["filter", "map", "sort"],
      sortFn: new Function("return " + (dataFns.sortFn || "undefined"))(),
      filterFn: new Function("return " + (dataFns.filterFn || "undefined"))(),
      mapFn: new Function("return " + (dataFns.mapFn || "undefined"))(),
    }
  }

  /**
   * 应用数据处理函数到文件树
   */
  private applyDataProcessingFunctions(trie: FileTrieNode, opts: ParsedOptions): void {
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
   */
  private buildExplorerTree(
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
   * 设置浏览器事件监听器
   */
  private setupExplorerEventListeners(explorer: HTMLElement, opts: ParsedOptions): void {
    // 设置 Explorer 切换按钮事件监听器
    const explorerButtons = explorer.getElementsByClassName(
      "explorer-toggle",
    ) as HTMLCollectionOf<HTMLElement>

    for (const button of explorerButtons) {
      this.addEventListener(button, "click", toggleExplorer)
    }

    // 设置文件夹点击事件监听器
    if (opts.folderClickBehavior === "collapse") {
      const folderButtons = explorer.getElementsByClassName(
        "folder-button",
      ) as HTMLCollectionOf<HTMLElement>

      for (const button of folderButtons) {
        this.addEventListener(button, "click", toggleFolder)
      }
    }

    // 设置文件夹图标点击事件监听器
    const folderIcons = explorer.getElementsByClassName(
      "folder-icon",
    ) as HTMLCollectionOf<HTMLElement>

    for (const icon of folderIcons) {
      this.addEventListener(icon, "click", toggleFolder)
    }
  }

  /**
   * 内存清理函数
   */
  private cleanupMemory(): void {
    const config = this.getOptimizationConfig()

    if (!config.memory.enableAutoCleanup) return

    // 清理节点缓存
    if ((this.state as any).nodeCache.size > config.memory.maxNodeCacheSize) {
      const entries = Array.from((this.state as any).nodeCache.entries())
      const toDelete = entries.slice(0, entries.length - config.memory.maxNodeCacheSize) as Array<
        [string, any]
      >
      toDelete.forEach(([key, _value]) => (this.state as any).nodeCache.delete(key))

      if ((this.config as any).enablePerformanceMonitoring) {
        performanceMonitor.recordDOMOperation("update", 1)
      }
    }

    // 触发垃圾回收（如果可用）
    if (typeof window !== "undefined" && "gc" in window) {
      ;(window as any).gc()
    }
  }

  /**
   * 设置内存清理
   */
  private setupMemoryCleanup(): void {
    if ((this.state as any).cleanupInterval) {
      clearInterval((this.state as any).cleanupInterval)
    }

    const config = this.getOptimizationConfig()
    if (config.memory.enableAutoCleanup) {
      ;(this.state as any).cleanupInterval = setInterval(
        () => this.cleanupMemory(),
        config.memory.cleanupInterval,
      )
    }
  }

  /**
   * 检查两个文件数据是否相似
   */
  private isDataSimilar(oldData: FileTrieNode, newData: FileTrieNode): boolean {
    const config = this.getOptimizationConfig()

    if (!config.data.enableDataSimilarityCheck) {
      return false
    }

    const oldEntries = Array.from(oldData.entries())
    const newEntries = Array.from(newData.entries())

    const sizeDiff = Math.abs(oldEntries.length - newEntries.length)
    return sizeDiff / Math.max(oldEntries.length, 1) < 0.2
  }

  /**
   * 执行增量更新
   */
  private performIncrementalUpdate(
    explorerUl: HTMLElement,
    trie: FileTrieNode,
    currentSlug: FullSlug,
    opts: ParsedOptions,
  ): void {
    if ((this.config as any).enablePerformanceMonitoring) {
      performanceMonitor.startTimer("incremental-update")
    }

    this.log("Using incremental update")

    this.updateChangedNodes(explorerUl, trie, currentSlug, opts)
    scrollToActiveElement(explorerUl)

    if ((this.config as any).enablePerformanceMonitoring) {
      const duration = performanceMonitor.endTimer("incremental-update")
      performanceMonitor.recordRendering("incremental", duration)
    }
  }

  /**
   * 执行完全重建
   */
  private performFullRebuild(
    explorer: HTMLElement,
    explorerUl: HTMLElement,
    trie: FileTrieNode,
    currentSlug: FullSlug,
    opts: ParsedOptions,
  ): void {
    if ((this.config as any).enablePerformanceMonitoring) {
      performanceMonitor.startTimer("full-rebuild")
    }

    this.log("Performing full rebuild")

    // 清除节点缓存
    this.state.nodeCache.clear()

    // 构建并插入新内容
    const fragment = this.buildExplorerTree(trie, currentSlug, opts)

    // 仅更新变化的部分
    const existingNodes = Array.from(explorerUl.children)
    const newNodes = Array.from(fragment.children)

    for (let i = 0; i < Math.max(existingNodes.length, newNodes.length); i++) {
      const existing = existingNodes[i]
      const newNode = newNodes[i]

      if (!existing && newNode) {
        explorerUl.appendChild(newNode)
        if ((this.config as any).enablePerformanceMonitoring) {
          performanceMonitor.recordDOMOperation("create", 0)
        }
      } else if (existing && !newNode) {
        existing.remove()
        if ((this.config as any).enablePerformanceMonitoring) {
          performanceMonitor.recordDOMOperation("remove", 0)
        }
      } else if (existing && newNode && !existing.isEqualNode(newNode)) {
        existing.replaceWith(newNode)
        if ((this.config as any).enablePerformanceMonitoring) {
          performanceMonitor.recordDOMOperation("update", 0)
        }
      }
    }

    // 恢复滚动位置
    restoreScrollPosition(explorerUl)

    // 设置事件监听器
    this.setupExplorerEventListeners(explorer, opts)

    // 更新缓存
    this.state.currentFileData = trie

    // 滚动到活动元素
    scrollToActiveElement(explorerUl)

    if ((this.config as any).enablePerformanceMonitoring) {
      const duration = performanceMonitor.endTimer("full-rebuild")
      performanceMonitor.recordRendering("full", duration)
    }
  }

  /**
   * 更新变化的节点
   */
  private updateChangedNodes(
    explorerUl: HTMLElement,
    trie: FileTrieNode,
    currentSlug: FullSlug,
    opts: ParsedOptions,
  ): void {
    const fragment = this.buildExplorerTree(trie, currentSlug, opts)

    const existingNodes = Array.from(explorerUl.children)
    const newNodes = Array.from(fragment.children)

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
   * 设置单个浏览器
   */
  private async setupSingleExplorer(explorer: HTMLElement, currentSlug: FullSlug): Promise<void> {
    try {
      // 解析配置选项
      const opts = this.parseExplorerOptions(explorer)

      // 加载保存的状态
      const serializedExplorerState = loadExplorerState(opts.useSavedState)
      setCurrentExplorerState(serializedExplorerState)

      // 创建旧状态索引
      const oldIndex = new Map<string, boolean>()
      for (const folder of serializedExplorerState) {
        oldIndex.set(folder.path, folder.collapsed)
      }

      // 获取并处理数据（带缓存）
      const cacheKey = this.generateCacheKey("content", "explorerData")
      let data = this.getFromCache(cacheKey)

      if (!data) {
        const fetchedData = await fetchData
        if (!fetchedData) {
          throw new Error("fetchData resolved to null or undefined")
        }
        data = fetchedData
        this.setToCache(cacheKey, data)
      }

      const entries = [...Object.entries(data as Record<FullSlug, ContentDetails>)] as [
        FullSlug,
        ContentDetails,
      ][]
      const trie = FileTrieNode.fromEntries(entries)

      // 应用数据处理函数
      this.applyDataProcessingFunctions(trie, opts)

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
      if (!explorerUl) {
        this.error("Explorer container not found")
        return
      }

      // 检查是否需要增量更新
      const config = this.getOptimizationConfig()
      const canUseIncrementalUpdate = this.state.currentFileData !== null

      if (
        (this.config as any).enableIncrementalUpdate &&
        config.dom.enableIncrementalUpdate &&
        canUseIncrementalUpdate &&
        this.isDataSimilar(this.state.currentFileData!, trie)
      ) {
        this.performIncrementalUpdate(explorerUl, trie, currentSlug, opts)
      } else {
        this.performFullRebuild(explorer, explorerUl, trie, currentSlug, opts)
      }

      this.log(`Explorer setup completed for element`)
    } catch (error) {
      this.error("Failed to setup explorer:", error)
    }
  }

  /**
   * 查找组件元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll("div.explorer")) as HTMLElement[]
  }

  /**
   * 初始化组件
   */
  protected async onInitialize(): Promise<void> {
    // 初始化状态
    ;(this.state as any).explorerElements = []
    ;(this.state as any).currentFileData = null
    ;(this.state as any).currentSlug = null
    ;(this.state as any).nodeCache = new Map()
    ;(this.state as any).cleanupInterval = null

    // 设置内存清理
    this.setupMemoryCleanup()

    // 监听配置变更
    optimizationConfig.addListener(() => {
      this.setupMemoryCleanup()
    })

    this.log("Explorer component initialized")
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // 查找浏览器元素
    ;(this.state as any).explorerElements = this.findComponentElements()

    this.log(`Found ${(this.state as any).explorerElements.length} explorer elements`)
  }

  /**
   * 页面设置（在导航事件后执行）
   */
  protected onSetupPage(_elements: HTMLElement[]): void {
    // 重新查找浏览器元素
    ;(this.state as any).explorerElements = this.findComponentElements()

    // 获取当前页面 slug
    const currentSlug = window.location.pathname as FullSlug
    ;(this.state as any).currentSlug = currentSlug

    // 设置每个浏览器
    ;(this.state as any).explorerElements.forEach((explorer: HTMLElement) => {
      this.setupSingleExplorer(explorer, currentSlug)
    })

    this.log(`Page setup completed for ${(this.state as any).explorerElements.length} explorers`)
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    // 清理内存定时器
    if ((this.state as any).cleanupInterval) {
      clearInterval((this.state as any).cleanupInterval)
      ;(this.state as any).cleanupInterval = null
    }

    // 清理缓存
    ;(this.state as any).nodeCache.clear()
    ;(this.state as any).currentFileData = null
    ;(this.state as any).explorerElements = []
    ;(this.state as any).currentSlug = null

    this.log("Explorer component cleaned up")
  }

  /**
   * 手动刷新浏览器
   */
  public async refreshExplorer(): Promise<void> {
    if ((this.state as any).currentSlug) {
      // 清除缓存
      const cacheKey = this.generateCacheKey("content", "explorerData")
      this.removeFromCache(cacheKey)

      // 重新设置
      await Promise.all(
        (this.state as any).explorerElements.map((explorer: HTMLElement) =>
          this.setupSingleExplorer(explorer, (this.state as any).currentSlug!),
        ),
      )
    }
  }

  /**
   * 获取浏览器统计信息
   */
  public getExplorerStats(): {
    explorerCount: number
    nodeCacheSize: number
    hasFileData: boolean
    currentSlug: string | null
    memoryCleanupEnabled: boolean
  } {
    return {
      explorerCount: (this.state as any).explorerElements.length,
      nodeCacheSize: (this.state as any).nodeCache.size,
      hasFileData: (this.state as any).currentFileData !== null,
      currentSlug: (this.state as any).currentSlug,
      memoryCleanupEnabled: (this.state as any).cleanupInterval !== null,
    }
  }
}
