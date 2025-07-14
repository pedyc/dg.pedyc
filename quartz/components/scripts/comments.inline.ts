import { globalResourceManager } from "./managers"

const changeTheme = (e: CustomEventMap["themechange"]) => {
  const theme = e.detail.theme
  const iframe = document.querySelector("iframe.giscus-frame") as HTMLIFrameElement
  if (!iframe) {
    return
  }

  if (!iframe.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      giscus: {
        setConfig: {
          theme: theme,
          theme_url: getThemeUrl(getThemeName(theme)),
        },
      },
    },
    "https://giscus.app",
  )
}

/**
 * 获取 Giscus 主题名称
 * @param theme 当前主题（light/dark）
 * @returns Giscus 主题名称
 */
const getThemeName = (theme: string) => {
  const giscusContainer = document.querySelector(".giscus") as GiscusElement
  if (!giscusContainer) {
    return theme
  }
  const darkGiscus = giscusContainer.dataset.darkTheme ?? "dark"
  const lightGiscus = giscusContainer.dataset.lightTheme ?? "light"
  return theme === "dark" ? darkGiscus : lightGiscus
}

/**
 * 获取 Giscus 主题 URL
 * @param themeName Giscus 主题名称
 * @returns Giscus 主题 URL
 */
const getThemeUrl = (themeName: string) => {
  const giscusContainer = document.querySelector(".giscus") as GiscusElement
  if (!giscusContainer) {
    return `https://giscus.app/themes/${themeName}.css`
  }
  // 如果 themeUrl 存在，则使用 themeUrl + themeName
  if (giscusContainer.dataset.themeUrl) {
    return `${giscusContainer.dataset.themeUrl}/${themeName}.css`
  }
  // 否则使用默认的 giscus.app 主题路径
  return `https://giscus.app/themes/${themeName}`
}

type GiscusElement = Omit<HTMLElement, "dataset"> & {
  dataset: DOMStringMap & {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    themeUrl: string
    lightTheme: string
    darkTheme: string
    mapping: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict: string
    reactionsEnabled: string
    inputPosition: "top" | "bottom"
    lang: string
  }
}

document.addEventListener("nav", () => {
  const giscusContainer = document.querySelector(".giscus") as GiscusElement
  if (!giscusContainer) {
    return
  }

  // 清理已存在的 giscus 实例
  const existingScript = giscusContainer.querySelector('script[src="https://giscus.app/client.js"]')
  const existingIframe = giscusContainer.querySelector("iframe.giscus-frame")

  if (existingScript) {
    existingScript.remove()
  }
  if (existingIframe) {
    existingIframe.remove()
  }

  const giscusScript = document.createElement("script")
  giscusScript.src = "https://giscus.app/client.js"
  giscusScript.async = true
  giscusScript.crossOrigin = "anonymous"
  giscusScript.setAttribute("data-loading", "lazy")
  giscusScript.setAttribute("data-emit-metadata", "0")
  giscusScript.setAttribute("data-repo", giscusContainer.dataset.repo)
  giscusScript.setAttribute("data-repo-id", giscusContainer.dataset.repoId)
  giscusScript.setAttribute("data-category", giscusContainer.dataset.category)
  giscusScript.setAttribute("data-category-id", giscusContainer.dataset.categoryId)
  giscusScript.setAttribute("data-mapping", giscusContainer.dataset.mapping)
  giscusScript.setAttribute("data-strict", giscusContainer.dataset.strict)
  giscusScript.setAttribute("data-reactions-enabled", giscusContainer.dataset.reactionsEnabled)
  giscusScript.setAttribute("data-input-position", giscusContainer.dataset.inputPosition)
  giscusScript.setAttribute("data-lang", giscusContainer.dataset.lang)
  const theme = document.documentElement.getAttribute("saved-theme")
  /**
   * 设置 Giscus 主题
   * 根据当前主题（亮色/暗色）获取对应的 Giscus 主题名称和 URL，并设置到 script 标签的 data-theme 属性上。
   */
  if (theme) {
    const giscusThemeName = getThemeName(theme)
    const giscusThemeUrl = getThemeUrl(giscusThemeName)
    giscusScript.setAttribute("data-theme", theme)
    giscusScript.setAttribute("data-theme-url", giscusThemeUrl)
  }

  giscusContainer.appendChild(giscusScript)

  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  document.addEventListener("themechange", changeTheme)
  globalResourceManager.instance.addCleanupTask(() =>
    document.removeEventListener("themechange", changeTheme),
  )
})
