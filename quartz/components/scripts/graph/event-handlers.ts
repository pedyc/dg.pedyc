import { FullSlug, getFullSlug } from "../../../util/path"
import { registerEscapeHandler } from "../utils/util"

export function setupGraphEventHandlers(
  renderLocalGraph: (graphContainer: HTMLElement, slug: FullSlug) => Promise<() => void>,
  renderGlobalGraph: (graphContainer: HTMLElement, slug: FullSlug) => Promise<() => void>,
) {
  let localGraphCleanups: (() => void)[] = []
  let globalGraphCleanups: (() => void)[] = []

  function cleanupLocalGraphs() {
    for (const cleanup of localGraphCleanups) {
      cleanup()
    }
    localGraphCleanups = []
  }

  function cleanupGlobalGraphs() {
    for (const cleanup of globalGraphCleanups) {
      cleanup()
    }
    globalGraphCleanups = []
  }

  document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
    const slug = e.detail.url

    async function _renderLocalGraphInternal() {
      cleanupLocalGraphs()
      const localGraphContainers = document.getElementsByClassName("graph-container")
      for (const container of localGraphContainers) {
        localGraphCleanups.push(await renderLocalGraph(container as HTMLElement, slug))
      }
    }

    await _renderLocalGraphInternal()
    const handleThemeChange = () => {
      void _renderLocalGraphInternal()
    }

    document.addEventListener("themechange", handleThemeChange)
    window.addCleanup(() => {
      document.removeEventListener("themechange", handleThemeChange)
    })

    const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]
    async function _renderGlobalGraphInternal() {
      const currentFullSlug = getFullSlug(window)
      for (const container of containers) {
        container.classList.add("active")
        const sidebar = container.closest(".sidebar") as HTMLElement
        if (sidebar) {
          sidebar.style.zIndex = "1"
        }

        const graphContainer = container.querySelector(".global-graph-container") as HTMLElement
        registerEscapeHandler(container, () => hideGlobalGraph())
        if (graphContainer) {
          globalGraphCleanups.push(await renderGlobalGraph(graphContainer, currentFullSlug))
        }
      }
    }

    function hideGlobalGraph() {
      cleanupGlobalGraphs()
      for (const container of containers) {
        container.classList.remove("active")
        const sidebar = container.closest(".sidebar") as HTMLElement
        if (sidebar) {
          sidebar.style.zIndex = ""
        }
      }
    }

    async function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
      if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        const anyGlobalGraphOpen = containers.some((container) =>
          container.classList.contains("active"),
        )
        anyGlobalGraphOpen ? hideGlobalGraph() : _renderGlobalGraphInternal()
      }
    }

    const icon = document.querySelector("#global-graph")
    if (icon) {
      const clickHandler = () => {
        const anyGlobalGraphOpen = containers.some((container) =>
          container.classList.contains("active"),
        )
        if (anyGlobalGraphOpen) {
          hideGlobalGraph()
        } else {
          _renderGlobalGraphInternal()
        }
      }
      icon.addEventListener("click", clickHandler)
      window.addCleanup(() => icon.removeEventListener("click", clickHandler))
    }

    document.addEventListener("keydown", shortcutHandler)
    window.addCleanup(() => {
      document.removeEventListener("keydown", shortcutHandler)
      cleanupLocalGraphs()
      cleanupGlobalGraphs()
    })
  })
}
