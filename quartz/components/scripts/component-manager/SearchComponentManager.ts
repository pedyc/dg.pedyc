import { BaseComponentManager } from "./BaseComponentManager"
import { setupSearch, fillDocument } from "../search/setup"
// import { ContentIndex } from "../../../plugins/emitters/contentIndex"

export class SearchComponentManager extends BaseComponentManager {
  constructor() {
    super({ name: "search" })
  }
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.getElementsByClassName("search")) as HTMLElement[]
  }
  protected async onInitialize(): Promise<void> {
    // Search component does not require specific initialization logic beyond what's in onSetupPage
    this.log("Search component initialized.")
  }
  protected onSetupEventListeners(): void {
    // Event listeners are set up within onSetupPage based on navigation events
    this.log("Search component event listeners set up.")
  }
  protected onSetupPage(_elements: HTMLElement[]): void {
    const fetchData = new Promise<ContentIndex>(async (resolve, reject) => {
      try {
        const data = await fetch("../../static/contentIndex.json").then((res) => res.json())
        let indexPopulated = false
        await fillDocument(data, indexPopulated)
        indexPopulated = true
        resolve(data)
      } catch (error) {
        console.error("Error fetching search data:", error)
        reject(error)
      }
    })

    document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
      const currentSlug = e.detail.url
      const data = await fetchData
      const searchElement = document.getElementsByClassName("search")
      for (const element of searchElement) {
        await setupSearch(element, currentSlug, data)
      }
    })
  }
  protected onCleanup(): void {
    throw new Error("Method not implemented.")
  }
}
