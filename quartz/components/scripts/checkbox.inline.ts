import { CacheKeyFactory } from "./cache"
import { globalResourceManager, globalStorageManager } from "./managers"

// 防止重复注册事件监听器的标志
let checkboxNavListenerSetup = false

/**
 * 设置复选框状态管理
 */
function setupCheckboxes() {
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox]",
  ) as NodeListOf<HTMLInputElement>
  checkboxes.forEach((el) => {
    const elId = el.id
    const cacheKey = CacheKeyFactory.generateUserKey(elId, "checkbox_state")
    const switchState = (e: Event) => {
      const newCheckboxState = (e.target as HTMLInputElement)?.checked ? "true" : "false"
      globalStorageManager.instance.setItem("local", cacheKey, newCheckboxState)
    }

    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
    el.addEventListener("change", switchState)
    globalResourceManager.instance.addCleanupTask(() =>
      el.removeEventListener("change", switchState),
    )
    if (globalStorageManager.instance.getItem("local", cacheKey) === "true") {
      el.checked = true
    }
  })
}

// 设置 nav 事件监听器（只设置一次）
if (!checkboxNavListenerSetup) {
  console.log("[Checkbox] 设置 nav 事件监听器")
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  document.addEventListener("nav", setupCheckboxes)
  checkboxNavListenerSetup = true
  console.log("[Checkbox] nav 事件监听器设置完成")
}

// 初始化当前页面的复选框
setupCheckboxes()
