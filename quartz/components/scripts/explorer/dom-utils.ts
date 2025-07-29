import { FileTrieNode } from "../../../util/fileTrie"
import { FullSlug, resolveRelative, simplifySlug } from "../../../util/path"
import { ParsedOptions } from "./types"
import { getCurrentExplorerState } from "./state-manager"
// import { GlobalManagerController } from "../managers/global-instances" // 暂时注释未使用的导入
import { performanceMonitor } from "./performance-monitor"
import { optimizationConfig } from "./optimization-config"

// 获取优化配置
const getConfig = () => optimizationConfig.getConfig()

// 路径计算缓存
// 使用Map作为路径缓存，替代不存在的systemCache
const pathCache = new Map<string, { value: string; timestamp: number }>()
const PATH_CACHE_PREFIX = "explorer_path_"

// DOM 节点模板缓存
const nodeTemplateCache = new Map<string, HTMLElement>()

/**
 * 获取缓存的路径计算结果
 */
function getCachedPath(segments: string[], currentSlug: string): string | null {
  const config = getConfig()
  if (!config.cache.enablePathCache) {
    performanceMonitor.recordPathCalculation(false, 0)
    return null
  }

  const cacheKey = `${PATH_CACHE_PREFIX}${segments.join("/")}_${currentSlug}`
  const cached = pathCache.get(cacheKey)
  const result = cached ? cached.value : null

  // 记录缓存命中/未命中
  performanceMonitor.recordPathCalculation(result !== null, 0)

  return result
}

/**
 * 设置路径缓存
 */
function setCachedPath(segments: string[], currentSlug: string, href: string): void {
  const config = getConfig()
  if (!config.cache.enablePathCache) return

  const cacheKey = `${PATH_CACHE_PREFIX}${segments.join("/")}_${currentSlug}`
  pathCache.set(cacheKey, { value: href, timestamp: Date.now() })
}

/**
 * 优化的路径解析函数
 */
function resolvePathOptimized(currentSlug: string, targetPath: string): string {
  const segments = targetPath.split("/")
  let cachedResult = getCachedPath(segments, currentSlug)

  if (!cachedResult) {
    performanceMonitor.startTimer("path-calculation")
    cachedResult = resolveRelative(currentSlug as FullSlug, targetPath as FullSlug)
    const duration = performanceMonitor.endTimer("path-calculation")

    setCachedPath(segments, currentSlug, cachedResult)
    performanceMonitor.recordPathCalculation(false, duration)
  }

  return cachedResult
}

/**
 * 创建文件节点的 DOM 元素
 * @param currentSlug 当前页面的 slug
 * @param node 文件节点
 * @param opts 解析后的配置选项
 * @returns 创建的 li 元素
 */
export function createFileNode(
  currentSlug: FullSlug,
  node: FileTrieNode,
  _opts: ParsedOptions,
): HTMLLIElement {
  const config = getConfig()
  const filePath = node.slug

  // 检查路径计算缓存
  const segments = filePath.split("/")
  // let cachedHref = getCachedPath(segments, currentSlug) // 暂时注释未使用的变量

  let li: HTMLLIElement

  // 检查是否启用节点缓存
  if (config.cache.enableNodeCache) {
    // 尝试从节点模板缓存获取
    const templateKey = `file_${segments.length}`
    const template = nodeTemplateCache.get(templateKey)

    if (template) {
      // 克隆模板
      li = template.cloneNode(true) as HTMLLIElement
    } else {
      // 创建新节点并缓存模板
      const templateElement = document.getElementById("template-file") as HTMLTemplateElement
      const clone = templateElement.content.cloneNode(true) as DocumentFragment
      li = clone.querySelector("li") as HTMLLIElement

      const templateToCache = li.cloneNode(true) as HTMLLIElement
      nodeTemplateCache.set(templateKey, templateToCache)
    }
  } else {
    // 直接创建节点，不使用缓存
    const template = document.getElementById("template-file") as HTMLTemplateElement
    const clone = template.content.cloneNode(true) as DocumentFragment
    li = clone.querySelector("li") as HTMLLIElement
  }
  const a = li.querySelector("a") as HTMLAnchorElement

  // 使用优化的路径解析
  a.href = resolvePathOptimized(currentSlug, filePath)
  a.dataset.for = filePath
  a.textContent = node.displayName

  if (simplifySlug(currentSlug) === simplifySlug(filePath)) {
    a.classList.add("active")
  }

  return li
}

/**
 * 创建文件夹节点的 DOM 元素
 * @param currentSlug 当前页面的 slug
 * @param node 文件夹节点
 * @param opts 解析后的配置选项
 * @returns 创建的 li 元素
 */
export function createFolderNode(
  currentSlug: FullSlug,
  node: FileTrieNode,
  opts: ParsedOptions,
): HTMLLIElement {
  const config = getConfig()
  const folderPath = node.slug

  // 检查路径计算缓存
  const segments = folderPath.split("/")
  // let cachedHref = getCachedPath(segments, currentSlug) // 暂时注释未使用的变量

  let li: HTMLLIElement

  // 检查是否启用节点缓存
  if (config.cache.enableNodeCache) {
    // 尝试从节点模板缓存获取
    const templateKey = `folder_${segments.length}`
    const template = nodeTemplateCache.get(templateKey)

    if (template) {
      // 克隆模板
      li = template.cloneNode(true) as HTMLLIElement
    } else {
      // 创建新节点并缓存模板
      const templateElement = document.getElementById("template-folder") as HTMLTemplateElement
      const clone = templateElement.content.cloneNode(true) as DocumentFragment
      li = clone.querySelector("li") as HTMLLIElement

      const templateToCache = li.cloneNode(true) as HTMLLIElement
      nodeTemplateCache.set(templateKey, templateToCache)
    }
  } else {
    // 直接创建节点，不使用缓存
    const template = document.getElementById("template-folder") as HTMLTemplateElement
    const clone = template.content.cloneNode(true) as DocumentFragment
    li = clone.querySelector("li") as HTMLLIElement
  }
  const folderContainer = li.querySelector(".folder-container") as HTMLElement
  const titleContainer = folderContainer.querySelector("div") as HTMLElement
  const folderOuter = li.querySelector(".folder-outer") as HTMLElement
  const ul = folderOuter.querySelector("ul") as HTMLUListElement

  folderContainer.dataset.folderpath = folderPath

  // 根据点击行为配置文件夹标题
  if (opts.folderClickBehavior === "link") {
    // 替换按钮为链接
    const button = titleContainer.querySelector(".folder-button") as HTMLElement
    const a = document.createElement("a")

    // 使用优化的路径解析
    a.href = resolvePathOptimized(currentSlug, folderPath)
    a.dataset.for = folderPath
    a.className = "folder-title"
    a.textContent = node.displayName
    button.replaceWith(a)
  } else {
    const span = titleContainer.querySelector(".folder-title") as HTMLElement
    span.textContent = node.displayName
  }

  // 确定文件夹是否应该折叠
  const currentExplorerState = getCurrentExplorerState()
  const isCollapsed =
    currentExplorerState.find((item) => item.path === folderPath)?.collapsed ??
    opts.folderDefaultState === "collapsed"

  // 如果此文件夹是当前路径的前缀，则无论如何都要打开它
  const simpleFolderPath = simplifySlug(folderPath)
  const simpleCurrentSlug = simplifySlug(currentSlug)
  const folderIsPrefixOfCurrentSlug =
    simpleCurrentSlug.startsWith(simpleFolderPath + "/") || simpleCurrentSlug === simpleFolderPath

  if (!isCollapsed || folderIsPrefixOfCurrentSlug) {
    folderOuter.classList.add("open")
  }

  // 递归创建子节点
  for (const child of node.children) {
    const childNode = child.isFolder
      ? createFolderNode(currentSlug, child, opts)
      : createFileNode(currentSlug, child, opts)
    ul.appendChild(childNode)
  }

  return li
}

/**
 * 设置文件夹的展开/折叠状态
 * @param folderElement 文件夹元素
 * @param collapsed 是否折叠
 */
export function setFolderState(folderElement: HTMLElement, collapsed: boolean): void {
  if (collapsed) {
    folderElement.classList.remove("open")
  } else {
    folderElement.classList.add("open")
  }
}

/**
 * 滚动到活动元素
 * @param explorerUl Explorer 的 ul 元素
 */
export function scrollToActiveElement(explorerUl: HTMLElement): void {
  const activeElement: HTMLElement | null = explorerUl.querySelector(".active")

  if (activeElement) {
    // 检查活动元素是否在视图内
    const explorerRect = explorerUl.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()

    const isVisible = activeRect.top >= explorerRect.top && activeRect.bottom <= explorerRect.bottom

    if (!isVisible) {
      // 元素不在视图内，滚动到视图
      activeElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }
}
