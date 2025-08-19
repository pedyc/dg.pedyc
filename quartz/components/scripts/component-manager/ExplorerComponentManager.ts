import type { FullSlug } from "../../../util/path"

import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"
import { setupExplorer } from "../explorer/index"

interface ExplorerComponentManagerOptions extends ComponentConfig {
  enablePerformanceMonitoring: boolean
}

interface ExplorerComponentManagerState extends ComponentState {
  currentFileData: Record<FullSlug, any>
}

export class ExplorerComponentManager extends BaseComponentManager<
  ExplorerComponentManagerOptions,
  ExplorerComponentManagerState
> {
  constructor(options: ExplorerComponentManagerOptions) {
    super(options)
    this.state.currentFileData = {}
  }

  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".explorer"))
  }

  async onInitialize(): Promise<void> {
    // Initial setup of the explorer when the DOM is ready.
    // This will be called once when the component manager is initialized.
    const currentSlug = window.location.pathname.replace(/\/index\.html$/, "") as FullSlug
    if (!window.quartzContent) {
      console.warn("window.quartzContent is undefined or null. Explorer cannot be initialized.")
      return
    }
    const allContent = Object.entries(window.quartzContent) as [FullSlug, any][]
    this.state.currentFileData = window.quartzContent
    await setupExplorer(currentSlug, allContent)
  }

  onSetupEventListeners(): void {
    this.resourceManager.addEventListener(
      document as any as EventTarget,
      "nav",
      async (e: Event) => {
        const customEvent = e as CustomEvent<{ url: FullSlug }>
        const currentSlug = customEvent.detail.url
        const allContent = Object.entries(window.quartzContent) as [FullSlug, any][]
        await setupExplorer(currentSlug, allContent)
      },
    )

    this.resourceManager.addEventListener(
      document as any as EventTarget,
      "cacheCleared",
      async () => {
        const currentSlug = window.location.pathname.replace(/\/index\.html$/, "") as FullSlug
        const allContent = Object.entries(window.quartzContent) as [FullSlug, any][]
        await setupExplorer(currentSlug, allContent)
        console.log("Explorer reinitialized after cache clear.")
      },
    )

    this.resourceManager.addEventListener(
      document as any as EventTarget,
      "reinit-explorer",
      async (e: Event) => {
        const customEvent = e as CustomEvent<{ url: FullSlug }>
        console.log("reinit-explorer", customEvent)
        const currentSlug = customEvent.detail.url
        const allContent = Object.entries(window.quartzContent) as [FullSlug, any][]
        await setupExplorer(currentSlug, allContent)
      },
    )

    // Setup global event handlers once.
  }

  protected onSetupPage(): void {
    // No specific page setup needed here as setupExplorer handles DOM manipulation
  }

  protected onCleanup(): void {
    // No specific cleanup needed here as event listeners are managed by ResourceManager
  }
}
