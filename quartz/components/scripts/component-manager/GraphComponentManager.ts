import { BaseComponentManager } from "./BaseComponentManager"
import type { FullSlug } from "../../../util/path"
import { getFullSlug } from "../../../util/path"
import { renderGraph } from "../graph/render"
import { getGraphData } from "../graph/data-processing"
import { setupGraphEventHandlers } from "../graph/event-handlers"
import { addToVisited } from "../graph/data-processing"

export class GraphComponentManager extends BaseComponentManager {
  async onInitialize(): Promise<void> {
    // Initial graph rendering on page load
    const graphElement =
      document.querySelector<HTMLElement>(".graph-container") ??
      document.querySelector<HTMLElement>(".global-graph-container")
    if (graphElement) {
      const currentFullSlug = getFullSlug(window)
      await this.renderAndCleanupGraph(graphElement, currentFullSlug)
    }
  }

  onSetupEventListeners(): void {
    // Setup event handlers for graph component
    setupGraphEventHandlers(
      async (container: HTMLElement, slug: FullSlug) => {
        const fetchData = fetch("/.data/contentIndex.json").then((res) => res.json())
        const graphData = await getGraphData(container, slug, fetchData)
        return renderGraph(container, slug, graphData)
      },
      async (container: HTMLElement, slug: FullSlug) => {
        const fetchData = fetch("/.data/contentIndex.json").then((res) => res.json())
        const graphData = await getGraphData(container, slug, fetchData)
        return renderGraph(container, slug, graphData)
      },
    )

    // Listen for reinit-graph event
    document.addEventListener("reinit-graph", async (e: CustomEvent<{ url: FullSlug }>) => {
      console.log("reinit-graph", e)
      const graph = document.getElementById("graph-container")
      if (graph) {
        const fullSlug = e.detail.url
        const fetchData = fetch("/.data/contentIndex.json").then((res) => res.json())
        const graphData = await getGraphData(graph, fullSlug, fetchData)
        await renderGraph(graph, fullSlug, graphData)
      }
    })

    // Add to visited on nav event
    document.addEventListener("nav", (e: CustomEventMap["nav"]) => {
      addToVisited(e.detail.url)
    })
  }

  findComponentElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".graph-container")) as HTMLElement[]
  }

  onCleanup(): void {
    // Cleanup graph event handlers
  }

  protected onSetupPage(elements: HTMLElement[]): void {
    elements.forEach((element) => {
      const fullSlug = getFullSlug(window)
      this.renderAndCleanupGraph(element, fullSlug)
    })
  }

  private async renderAndCleanupGraph(graphElement: HTMLElement, fullSlug: FullSlug) {
    const fetchData = fetch("/.data/contentIndex.json").then((res) => res.json())
    const graphData = await getGraphData(graphElement, fullSlug, fetchData)
    const cleanup = await renderGraph(graphElement, fullSlug, graphData)
    this.state.cleanupTasks.push(cleanup)
  }
}
