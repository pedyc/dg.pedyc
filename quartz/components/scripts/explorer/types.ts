import { FileTrieNode } from "../../../util/fileTrie"
import { FullSlug } from "../../../util/path"

/**
 * 可能为 undefined 的 HTML 元素类型
 */
export type MaybeHTMLElement = HTMLElement | undefined

/**
 * 解析后的 Explorer 配置选项
 */
export interface ParsedOptions {
  folderClickBehavior: "collapse" | "link"
  folderDefaultState: "collapsed" | "open"
  useSavedState: boolean
  sortFn: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn: (node: FileTrieNode) => boolean
  mapFn: (node: FileTrieNode) => void
  order: ("sort" | "filter" | "map")[]
}

/**
 * 文件夹状态类型
 */
export type FolderState = {
  path: string
  collapsed: boolean
}

/**
 * 自定义事件映射类型
 */
export interface CustomEventMap {
  nav: CustomEvent<{ url: FullSlug }>
  prenav: CustomEvent
  cacheCleared: CustomEvent
  "reinit-explorer": CustomEvent<{ url: FullSlug }>
}

/**
 * 全局声明扩展
 */
declare global {
  interface Window {
    fetchData: any
  }
}
