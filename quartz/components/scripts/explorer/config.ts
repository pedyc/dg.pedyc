import { FileTrieNode } from "../../../util/fileTrie"

export interface ExplorerConfig {
  folderClickBehavior: "collapse" | "link"
  folderDefaultState: "collapsed" | "open"
  useSavedState: boolean
  sortFn: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn: (node: FileTrieNode) => boolean
  mapFn: (node: FileTrieNode) => void
  order: ("sort" | "filter" | "map")[]
}

export function parseExplorerOptions(element: HTMLElement): ExplorerConfig {
  const dataFns = JSON.parse(element.dataset.dataFns || "{}")
  return {
    folderClickBehavior: (element.dataset.behavior || "collapse") as "collapse" | "link",
    folderDefaultState: (element.dataset.collapsed || "collapsed") as "collapsed" | "open",
    useSavedState: element.dataset.savestate === "true",
    order: dataFns.order || ["filter", "map", "sort"],
    sortFn: new Function("return " + (dataFns.sortFn || "undefined"))(),
    filterFn: new Function("return " + (dataFns.filterFn || "undefined"))(),
    mapFn: new Function("return " + (dataFns.mapFn || "undefined"))(),
  }
}
