import { FullSlug } from "../../../util/path"
import { globalResourceManager } from "../managers"

const resourceManager = globalResourceManager.instance

// 评论系统类型定义
interface CommentConfig {
  provider: "giscus" | "utterances" | "disqus" | "custom"
  options: Record<string, any>
}

interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping: "pathname" | "url" | "title" | "og:title"
  strict: boolean
  reactionsEnabled: boolean
  emitMetadata: boolean
  inputPosition: "top" | "bottom"
  theme: string
  lightTheme?: string
  darkTheme?: string
  lang: string
  loading: "lazy" | "eager"
}

interface UtterancesConfig {
  repo: string
  issueTerm: "pathname" | "url" | "title" | "og:title"
  label?: string
  theme: string
  crossorigin: "anonymous"
}

/**
 * 初始化 Giscus 评论系统
 * @param container 评论容器
 * @param config Giscus 配置
 * @param currentSlug 当前页面 slug
 */
function initializeGiscus(container: HTMLElement, config: GiscusConfig, _currentSlug: FullSlug) {
  const script = document.createElement("script")
  script.src = "https://giscus.app/client.js"
  script.async = true
  script.crossOrigin = "anonymous"

  // 设置 Giscus 属性
  script.setAttribute("data-repo", config.repo)
  script.setAttribute("data-repo-id", config.repoId)
  script.setAttribute("data-category", config.category)
  script.setAttribute("data-category-id", config.categoryId)
  script.setAttribute("data-mapping", config.mapping)
  script.setAttribute("data-strict", String(!!config.strict))
  script.setAttribute("data-reactions-enabled", String(!!config.reactionsEnabled))
  script.setAttribute("data-emit-metadata", String(!!config.emitMetadata))
  script.setAttribute("data-input-position", config.inputPosition)
  // 确保 data-theme 是一个主题名称，而不是 URL
  const themeName = config.theme.includes("giscus.app") ? "light" : config.theme // 临时修复，如果包含 giscus.app 则默认为 light
  script.setAttribute("data-theme", themeName)
  script.setAttribute("data-light-theme", config.lightTheme ?? "light")
  script.setAttribute("data-dark-theme", config.darkTheme ?? "dark")
  script.setAttribute("data-lang", config.lang)
  script.setAttribute("data-loading", config.loading)

  container.appendChild(script)

  // Giscus 已经内置了主题切换逻辑，通过 postMessage 实现
  // 无需在此处额外监听 themechange 事件
}

/**
 * 更新 Giscus 评论框的主题
 * @param container 评论容器
 * @param newTheme 新主题名称
 */
export function updateCommentsTheme(container: HTMLElement, newTheme: string) {
  const iframe = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: newTheme,
          },
        },
      },
      "https://giscus.app",
    )
  }
}

/**
 * 初始化 Utterances 评论系统
 * @param container 评论容器
 * @param config Utterances 配置
 * @param currentSlug 当前页面 slug
 */
function initializeUtterances(
  container: HTMLElement,
  config: UtterancesConfig,
  currentSlug: FullSlug,
) {
  const script = document.createElement("script")
  script.src = "https://utteranc.es/client.js"
  script.async = true
  script.crossOrigin = config.crossorigin

  // 设置 Utterances 属性
  script.setAttribute("repo", config.repo)
  script.setAttribute("issue-term", config.issueTerm)
  if (config.label) {
    script.setAttribute("label", config.label)
  }
  script.setAttribute("theme", config.theme)

  container.appendChild(script)

  // Utterances 不支持动态主题切换，需要重新加载
  const handleThemeChange = () => {
    const iframe = container.querySelector<HTMLIFrameElement>(".utterances-frame")
    if (iframe) {
      iframe.remove()
      // 重新初始化
      setTimeout(() => {
        initializeUtterances(
          container,
          {
            ...config,
            theme: document.documentElement.getAttribute("data-theme") || config.theme,
          },
          currentSlug,
        )
      }, 100)
    }
  }

  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  // TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener
  document.addEventListener("themechange", handleThemeChange)

  // 注册清理函数
  if (resourceManager) {
    resourceManager.addCleanupTask(() => {
      document.removeEventListener("themechange", handleThemeChange)
    })
  } else {
    console.warn("[Comments] Global resource manager not available for cleanup registration")
  }
}

/**
 * 初始化 Disqus 评论系统
 * @param container 评论容器
 * @param config Disqus 配置
 * @param currentSlug 当前页面 slug
 */
function initializeDisqus(container: HTMLElement, config: any, currentSlug: FullSlug) {
  // 创建 Disqus 容器
  const disqusDiv = document.createElement("div")
  disqusDiv.id = "disqus_thread"
  container.appendChild(disqusDiv)

  // 设置 Disqus 配置
  ;(window as any).disqus_config = function () {
    this.page.url = window.location.href
    this.page.identifier = currentSlug
    this.page.title = document.title
  }

  // 加载 Disqus 脚本
  const script = document.createElement("script")
  script.src = `https://${config.shortname}.disqus.com/embed.js`
  script.async = true
  script.setAttribute("data-timestamp", Date.now().toString())

  document.head.appendChild(script)

  // 注册清理函数
  if (resourceManager) {
    resourceManager.addCleanupTask(() => {
      // Disqus 清理比较复杂，通常需要重新加载页面
      if ((window as any).DISQUS) {
        ;(window as any).DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = ""
            this.page.url = ""
          },
        })
      }
    })
  } else {
    console.warn("[Comments] Global resource manager not available for cleanup registration")
  }
}

/**
 * 初始化自定义评论系统
 * @param container 评论容器
 * @param config 自定义配置
 * @param currentSlug 当前页面 slug
 */
function initializeCustomComments(container: HTMLElement, config: any, _currentSlug: FullSlug) {
  // 这里可以根据具体的自定义评论系统进行实现
  console.log("Custom comments system not implemented", config)

  container.innerHTML = `
    <div class="custom-comments-placeholder">
      <p>Custom comments system configuration needed</p>
      <pre>${JSON.stringify(config, null, 2)}</pre>
    </div>
  `
}

/**
 * 初始化评论系统
 * @param container 评论容器元素
 * @param currentSlug 当前页面 slug
 */
export async function initializeComments(container: HTMLElement, currentSlug: FullSlug) {
  try {
    // 获取评论配置
    const configData = container.dataset["cfg"]

    if (!configData) {
      throw new Error("No comment configuration found")
    }

    const config: CommentConfig = JSON.parse(configData)

    // 显示加载状态
    container.innerHTML = `
      <div class="comments-loading">
        <div class="loading-spinner"></div>
        <p>Loading comments...</p>
      </div>
    `

    // 根据提供商初始化相应的评论系统
    switch (config.provider) {
      case "giscus":
        initializeGiscus(container, config.options as GiscusConfig, currentSlug)
        break
      case "utterances":
        initializeUtterances(container, config.options as UtterancesConfig, currentSlug)
        break
      case "disqus":
        initializeDisqus(container, config.options, currentSlug)
        break
      case "custom":
        initializeCustomComments(container, config.options, currentSlug)
        break
      default:
        throw new Error(`Unsupported comment provider: ${config.provider}`)
    }
  } catch (error) {
    console.error("Failed to initialize comments:", error)
    container.innerHTML = `
      <div class="comments-error">
        <p>Failed to load comments</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `
  }
}

/**
 * 清理评论系统资源
 */
export function cleanupComments() {
  // 清理 Giscus
  const giscusFrames = document.querySelectorAll("iframe.giscus-frame")
  giscusFrames.forEach((frame) => frame.remove())

  // 清理 Utterances
  const utterancesFrames = document.querySelectorAll(".utterances-frame")
  utterancesFrames.forEach((frame) => frame.remove())

  // 清理 Disqus
  const disqusThreads = document.querySelectorAll("#disqus_thread")
  disqusThreads.forEach((thread) => thread.remove())

  // 清理相关脚本
  const commentScripts = document.querySelectorAll(
    'script[src*="giscus.app"], script[src*="utteranc.es"], script[src*="disqus.com"]',
  )
  commentScripts.forEach((script) => script.remove())
}
