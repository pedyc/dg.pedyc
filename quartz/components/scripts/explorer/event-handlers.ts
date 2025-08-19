import { FullSlug } from "../../../util/path"
import { globalResourceManager } from "../managers"
import { toggleFolder, FolderState } from "./data-processing"
import { saveExplorerScrollPosition } from "./state-manager"

export function setupExplorerToggle(explorer: HTMLElement) {
  const explorerButtons = explorer.getElementsByClassName(
    "explorer-toggle",
  ) as HTMLCollectionOf<HTMLElement>
  for (const button of explorerButtons) {
    button.addEventListener("click", toggleExplorer)
    globalResourceManager.instance.addCleanupTask(() =>
      button.removeEventListener("click", toggleExplorer),
    )
  }
}

export function setupFolderClickHandlers(
  explorer: HTMLElement,
  folderClickBehavior: "collapse" | "link",
  currentExplorerState: FolderState[],
) {
  if (folderClickBehavior === "collapse") {
    const folderButtons = explorer.getElementsByClassName(
      "folder-button",
    ) as HTMLCollectionOf<HTMLElement>
    for (const button of folderButtons) {
      button.addEventListener("click", (evt) => toggleFolder(evt, currentExplorerState))
      globalResourceManager.instance.addCleanupTask(() =>
        button.removeEventListener("click", (evt) => toggleFolder(evt, currentExplorerState)),
      )
    }
  }

  const folderIcons = explorer.getElementsByClassName(
    "folder-icon",
  ) as HTMLCollectionOf<HTMLElement>
  for (const icon of folderIcons) {
    icon.addEventListener("click", (evt) => toggleFolder(evt, currentExplorerState))
    globalResourceManager.instance.addCleanupTask(() =>
      icon.removeEventListener("click", (evt) => toggleFolder(evt, currentExplorerState)),
    )
  }
}

export function setupGlobalEventHandlers() {
  document.addEventListener("prenav", () => {
    const explorer = document.querySelector(".explorer-ul")
    if (!explorer) return
    saveExplorerScrollPosition(explorer.scrollTop)
  })

  document.addEventListener("nav", async (e: CustomEvent<{ url: FullSlug }>) => {
    const currentSlug = e.detail.url
    // Re-initialize explorer on navigation
    const { setupExplorer } = await import("../explorer/index")
    const allContent = Object.entries(window.quartzContent) as [FullSlug, any][]
    await setupExplorer(currentSlug, allContent)

    // if mobile hamburger is visible, collapse by default
    for (const explorer of document.getElementsByClassName("explorer")) {
      const mobileExplorer = explorer.querySelector(".mobile-explorer")
      if (!mobileExplorer) return

      if (mobileExplorer.checkVisibility()) {
        explorer.classList.add("collapsed")
        explorer.setAttribute("aria-expanded", "false")

        // Allow <html> to be scrollable when mobile explorer is collapsed
        document.documentElement.classList.remove("mobile-no-scroll")
      }

      mobileExplorer.classList.remove("hide-until-loaded")
    }
  })

  window.addEventListener("resize", function () {
    const explorer = document.querySelector(".explorer")
    if (explorer && !explorer.classList.contains("collapsed")) {
      document.documentElement.classList.add("mobile-no-scroll")
      return
    }
  })
}

function toggleExplorer(this: HTMLElement) {
  const nearestExplorer = this.closest(".explorer") as HTMLElement
  if (!nearestExplorer) return
  const explorerCollapsed = nearestExplorer.classList.toggle("collapsed")
  nearestExplorer.setAttribute(
    "aria-expanded",
    nearestExplorer.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )

  if (!explorerCollapsed) {
    document.documentElement.classList.add("mobile-no-scroll")
  } else {
    document.documentElement.classList.remove("mobile-no-scroll")
  }
}
