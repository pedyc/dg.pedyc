import { globalResourceManager } from "./managers"

function toggleCallout(this: HTMLElement) {
  const outerBlock = this.parentElement!
  outerBlock.classList.toggle("is-collapsed")
  const content = outerBlock.getElementsByClassName("callout-content")[0] as HTMLElement
  if (!content) return
  const collapsed = outerBlock.classList.contains("is-collapsed")
  content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"
}

function setupCallout() {
  const collapsible = document.getElementsByClassName(
    `callout is-collapsible`,
  ) as HTMLCollectionOf<HTMLElement>
  for (const div of collapsible) {
    const title = div.getElementsByClassName("callout-title")[0] as HTMLElement
    const content = div.getElementsByClassName("callout-content")[0] as HTMLElement
    if (!title || !content) continue

    globalResourceManager.instance.addCleanupTask(() =>
      title.removeEventListener("click", toggleCallout),
    )
    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    title.addEventListener("click", toggleCallout)

    const collapsed = div.classList.contains("is-collapsed")
    content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"
  }
}

// TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
// TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
document.addEventListener("nav", setupCallout)
