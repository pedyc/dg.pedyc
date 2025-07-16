import { FullSlug } from "../../../util/path"
import { FolderState } from "./types"
import { CacheKeyFactory } from "../cache"
import { globalStorageManager } from "../managers"

/**
 * 当前 Explorer 状态
 */
let currentExplorerState: Array<FolderState> = []

/**
 * 获取当前 Explorer 状态
 * @returns 当前状态数组
 */
export function getCurrentExplorerState(): Array<FolderState> {
  return currentExplorerState
}

/**
 * 设置当前 Explorer 状态
 * @param state 新的状态数组
 */
export function setCurrentExplorerState(state: Array<FolderState>): void {
  currentExplorerState = state
}

/**
 * 从存储中加载 Explorer 状态
 * @param useSavedState 是否使用保存的状态
 * @returns 加载的状态数组
 */
export function loadExplorerState(useSavedState: boolean): Array<FolderState> {
  if (!useSavedState) {
    return []
  }

  const fileTreeKey = CacheKeyFactory.generateUserKey("fileTree", "explorer_state")
  const storageTree = globalStorageManager.instance.getItem("local", fileTreeKey)

  return storageTree ? JSON.parse(storageTree) : []
}

/**
 * 保存 Explorer 状态到存储
 */
export function saveExplorerState(): void {
  const stringifiedFileTree = JSON.stringify(currentExplorerState)
  const fileTreeKey = CacheKeyFactory.generateUserKey("fileTree", "explorer_state")
  globalStorageManager.instance.setItem("local", fileTreeKey, stringifiedFileTree)
}

/**
 * 更新文件夹状态
 * @param folderPath 文件夹路径
 * @param collapsed 是否折叠
 */
export function updateFolderState(folderPath: string, collapsed: boolean): void {
  const currentFolderState = currentExplorerState.find((item) => item.path === folderPath)

  if (currentFolderState) {
    currentFolderState.collapsed = collapsed
  } else {
    currentExplorerState.push({
      path: folderPath as FullSlug,
      collapsed: collapsed,
    })
  }

  saveExplorerState()
}

/**
 * 保存 Explorer 滚动位置
 * @param scrollTop 滚动位置
 */
export function saveScrollPosition(scrollTop: number): void {
  const scrollTopKey = CacheKeyFactory.generateUserKey("explorerScrollTop", "scroll_position")
  globalStorageManager.instance.setItem("session", scrollTopKey, scrollTop.toString())
}

/**
 * 恢复 Explorer 滚动位置
 * @param explorerUl Explorer 的 ul 元素
 */
export function restoreScrollPosition(explorerUl: HTMLElement): void {
  const scrollTopKey = CacheKeyFactory.generateUserKey("explorerScrollTop", "scroll_position")
  const scrollTop = globalStorageManager.instance.getItem("session", scrollTopKey)

  if (scrollTop) {
    explorerUl.scrollTop = parseInt(scrollTop)
  }
}

/**
 * 根据文件夹路径和默认状态创建状态数组
 * @param folderPaths 文件夹路径数组
 * @param oldIndex 旧状态索引
 * @param defaultCollapsed 默认是否折叠
 * @returns 新的状态数组
 */
export function createExplorerState(
  folderPaths: string[],
  oldIndex: Map<string, boolean>,
  defaultCollapsed: boolean,
): Array<FolderState> {
  return folderPaths.map((path) => {
    const previousState = oldIndex.get(path)
    return {
      path,
      collapsed: previousState === undefined ? defaultCollapsed : previousState,
    }
  })
}
