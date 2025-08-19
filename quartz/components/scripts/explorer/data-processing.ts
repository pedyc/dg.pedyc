import { FileTrieNode } from "../../../util/fileTrie"
import { FullSlug, simplifySlug } from "../../../util/path"
import { ExplorerConfig } from "./config"

export function processFileData(trie: FileTrieNode, config: ExplorerConfig): FileTrieNode {
  // Apply functions in order
  for (const fn of config.order) {
    switch (fn) {
      case "filter":
        if (config.filterFn) trie.filter(config.filterFn)
        break
      case "map":
        if (config.mapFn) trie.map(config.mapFn)
        break
      case "sort":
        if (config.sortFn) trie.sort(config.sortFn)
        break
    }
  }
  return trie
}

export function createFileNode(currentSlug: FullSlug, node: FileTrieNode): HTMLLIElement {
  const template = document.getElementById("template-file") as HTMLTemplateElement
  const clone = template.content.cloneNode(true) as DocumentFragment
  const li = clone.querySelector("li") as HTMLLIElement
  const a = li.querySelector("a") as HTMLAnchorElement
  a.href = node.slug
  a.dataset.for = node.slug
  a.textContent = node.displayName

  if (simplifySlug(currentSlug) === simplifySlug(node.slug)) {
    a.classList.add("active")
  }

  return li
}

export function createFolderNode(
  currentSlug: FullSlug,
  node: FileTrieNode,
  opts: ExplorerConfig,
  currentExplorerState: FolderState[],
): HTMLLIElement {
  const template = document.getElementById("template-folder") as HTMLTemplateElement
  const clone = template.content.cloneNode(true) as DocumentFragment
  const li = clone.querySelector("li") as HTMLLIElement
  const folderContainer = li.querySelector(".folder-container") as HTMLElement
  const titleContainer = folderContainer.querySelector("div") as HTMLElement
  const folderOuter = li.querySelector(".folder-outer") as HTMLElement
  const ul = folderOuter.querySelector("ul") as HTMLUListElement

  const folderPath = node.slug
  folderContainer.dataset.folderpath = folderPath

  if (opts.folderClickBehavior === "link") {
    // Replace button with link for link behavior
    const button = titleContainer.querySelector(".folder-button") as HTMLElement
    const a = document.createElement("a")
    a.href = node.slug
    a.dataset.for = folderPath
    a.className = "folder-title"
    a.textContent = node.displayName
    button.replaceWith(a)
  } else {
    const span = titleContainer.querySelector(".folder-title") as HTMLElement
    span.textContent = node.displayName
  }

  // if the saved state is collapsed or the default state is collapsed
  const isCollapsed =
    currentExplorerState.find((item) => item.path === folderPath)?.collapsed ??
    opts.folderDefaultState === "collapsed"

  // if this folder is a prefix of the current path we
  // want to open it anyways
  const simpleFolderPath = simplifySlug(folderPath)
  const folderIsPrefixOfCurrentSlug =
    simpleFolderPath === currentSlug.slice(0, simpleFolderPath.length)

  if (!isCollapsed || folderIsPrefixOfCurrentSlug) {
    folderOuter.classList.add("open")
  }

  for (const child of node.children) {
    const childNode = child.isFolder
      ? createFolderNode(currentSlug, child, opts, currentExplorerState)
      : createFileNode(currentSlug, child)
    ul.appendChild(childNode)
  }

  return li
}

export type FolderState = {
  path: string
  collapsed: boolean
}

export function setFolderState(folderElement: HTMLElement, collapsed: boolean) {
  return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open")
}

export function toggleFolder(evt: MouseEvent, currentExplorerState: FolderState[]) {
  evt.stopPropagation()
  const target = evt.target as HTMLElement | undefined
  if (!target) return

  // Check if target was svg icon or button
  const isSvg = target.nodeName === "svg"

  // corresponding <ul> element relative to clicked button/folder
  const folderContainer = (
    isSvg
      ? // svg -> div.folder-container
        target.parentElement
      : // button.folder-button -> div -> div.folder-container
        target.parentElement?.parentElement
  ) as HTMLElement | undefined
  if (!folderContainer) return
  const childFolderContainer = folderContainer.nextElementSibling as HTMLElement | undefined
  if (!childFolderContainer) return

  childFolderContainer.classList.toggle("open")

  // Collapse folder container
  const isCollapsed = !childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, isCollapsed)

  const currentFolderState = currentExplorerState.find(
    (item) => item.path === folderContainer.dataset.folderpath,
  )
  if (currentFolderState) {
    currentFolderState.collapsed = isCollapsed
  } else {
    currentExplorerState.push({
      path: folderContainer.dataset.folderpath as FullSlug,
      collapsed: isCollapsed,
    })
  }
}
