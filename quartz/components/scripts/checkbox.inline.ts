import { UnifiedCacheKeyGenerator } from "./cache/unified-cache"

document.addEventListener("nav", () => {
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox]",
  ) as NodeListOf<HTMLInputElement>
  checkboxes.forEach((el) => {
    const elId = el.id
    const cacheKey = UnifiedCacheKeyGenerator.generateUserKey(elId, "checkbox_state")
    const switchState = (e: Event) => {
      const newCheckboxState = (e.target as HTMLInputElement)?.checked ? "true" : "false"
      localStorage.setItem(cacheKey, newCheckboxState)
    }

    el.addEventListener("change", switchState)
    window.addCleanup(() => el.removeEventListener("change", switchState))
    if (localStorage.getItem(cacheKey) === "true") {
      el.checked = true
    }
  })
})
