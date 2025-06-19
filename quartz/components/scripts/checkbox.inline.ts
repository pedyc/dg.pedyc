import { CacheKeyGenerator } from "./config/cache-config"

document.addEventListener("nav", () => {
  const checkboxes = document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>
  checkboxes.forEach((el) => {
    const elId = el.id
    const cacheKey = CacheKeyGenerator.user(elId, 'checkbox_state')
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
