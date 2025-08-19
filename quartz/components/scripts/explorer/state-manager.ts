import { CacheKeyFactory } from "../cache"
import { globalStorageManager } from "../managers"
import { FolderState } from "./data-processing"

export function loadExplorerState(useSavedState: boolean): FolderState[] {
  const fileTreeKey = CacheKeyFactory.generateUserKey("fileTree", "explorer_state")
  const storageTree = globalStorageManager.instance.getItem("local", fileTreeKey)
  return storageTree && useSavedState ? JSON.parse(storageTree) : []
}

export function saveExplorerState(explorerState: FolderState[]) {
  const stringifiedFileTree = JSON.stringify(explorerState)
  const fileTreeKey = CacheKeyFactory.generateUserKey("fileTree", "explorer_state")
  globalStorageManager.instance.setItem("local", fileTreeKey, stringifiedFileTree)
}

export function saveExplorerScrollPosition(scrollTop: number) {
  const scrollTopKey = CacheKeyFactory.generateUserKey("explorerScrollTop", "scroll_position")
  globalStorageManager.instance.setItem("session", scrollTopKey, scrollTop.toString())
}

export function loadExplorerScrollPosition(): number | null {
  const scrollTopKey = CacheKeyFactory.generateUserKey("explorerScrollTop", "scroll_position")
  const scrollTop = globalStorageManager.instance.getItem("session", scrollTopKey)
  return scrollTop ? parseInt(scrollTop) : null
}
