import { FileTrieNode } from "../../../util/fileTrie"
import { FullSlug } from "../../../util/path"
import { ExplorerConfig, parseExplorerOptions } from "./config"
import { processFileData, createFileNode, createFolderNode, FolderState } from "./data-processing"
import { loadExplorerState, loadExplorerScrollPosition } from "./state-manager"
import { setupExplorerToggle, setupFolderClickHandlers } from "./event-handlers"

export async function setupExplorer(currentSlug: FullSlug, allContent: [FullSlug, any][]) {
  const allExplorers = document.querySelectorAll("div.explorer") as NodeListOf<HTMLElement>

  for (const explorer of allExplorers) {
    const opts: ExplorerConfig = parseExplorerOptions(explorer)
    let currentExplorerState: FolderState[] = loadExplorerState(opts.useSavedState)

    const oldIndex = new Map<string, boolean>()
    for (const folder of currentExplorerState) {
      oldIndex.set(folder.path, folder.collapsed)
    }

    const trie = FileTrieNode.fromEntries(allContent)
    const processedTrie = processFileData(trie, opts)

    // Get folder paths for state management
    const folderPaths = processedTrie.getFolderPaths()
    currentExplorerState = folderPaths.map((path) => {
      const previousState = oldIndex.get(path)
      return {
        path,
        collapsed:
          previousState === undefined ? opts.folderDefaultState === "collapsed" : previousState,
      }
    })

    const explorerUl: HTMLElement | null = explorer.querySelector(".explorer-ul")
    if (!explorerUl) continue

    // Create and insert new content
    const fragment = document.createDocumentFragment()
    for (const child of processedTrie.children) {
      const node = child.isFolder
        ? createFolderNode(currentSlug, child, opts, currentExplorerState)
        : createFileNode(currentSlug, child)

      fragment.appendChild(node)
    }
    // Clear old content to avoid duplicate rendering
    explorerUl.innerHTML = ""
    explorerUl.insertBefore(fragment, explorerUl.firstChild)

    // restore explorer scrollTop position if it exists
    const scrollTop = loadExplorerScrollPosition()
    if (scrollTop) {
      explorerUl.scrollTop = scrollTop
    }

    // Set up event handlers
    setupExplorerToggle(explorer)
    setupFolderClickHandlers(explorer, opts.folderClickBehavior, currentExplorerState)

    // Attempt to scroll active element into view
    const activeElement: HTMLElement | null = explorerUl.querySelector(".active")
    if (activeElement) {
      requestAnimationFrame(() => {
        const explorerRect = explorerUl.getBoundingClientRect()
        const activeRect = activeElement.getBoundingClientRect()

        if (activeRect.top < explorerRect.top || activeRect.bottom > explorerRect.bottom) {
          const newScrollTop =
            activeElement.offsetTop -
            explorerUl.offsetTop -
            explorerRect.height / 2 +
            activeRect.height / 2
          explorerUl.scrollTo({ top: newScrollTop, behavior: "smooth" })
        }
      })
    }
  }
}
