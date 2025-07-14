import { FullSlug, getFullSlug } from "../../util/path"
import { globalResourceManager } from "./managers"

// 评论懒加载状态管理
const commentsLoadingStates = new Map<HTMLElement, boolean>()
const resourceManager = globalResourceManager.instance
let commentsModulePromise: Promise<typeof import("./lazy/comments")> | null = null

/**
 * 预加载评论模块
 * @returns Promise<评论模块>
 */
function preloadCommentsModule() {
  if (!commentsModulePromise) {
    commentsModulePromise = import("./lazy/comments")
  }
  return commentsModulePromise
}

/**
 * 检查元素是否包含旧格式的 Giscus 配置
 * @param element 评论容器元素
 * @returns 是否包含旧格式配置
 */
function hasLegacyGiscusConfig(element: HTMLElement): boolean {
  return !!(
    element.dataset.repo &&
    element.dataset.repoId &&
    element.dataset.category &&
    element.dataset.categoryId
  )
}

/**
 * 将旧格式的 Giscus 配置转换为新格式
 * @param element 评论容器元素
 */
function convertLegacyGiscusConfig(element: HTMLElement): void {
  const config = {
    provider: "giscus" as const,
    options: {
      repo: element.dataset.repo || "",
      repoId: element.dataset.repoId || "",
      category: element.dataset.category || "",
      categoryId: element.dataset.categoryId || "",
      mapping: element.dataset.mapping || "pathname",
      strict: element.dataset.strict === "1" || element.dataset.strict === "true",
      reactionsEnabled:
        element.dataset.reactionsEnabled === "1" || element.dataset.reactionsEnabled === "true",
      emitMetadata: false,
      inputPosition: (element.dataset.inputPosition as "top" | "bottom") || "bottom",
      theme: element.dataset.lightTheme || "light",
      lang: element.dataset.lang || "en",
      loading: "lazy" as const,
      themeUrl: element.dataset.themeUrl,
      lightTheme: element.dataset.lightTheme,
      darkTheme: element.dataset.darkTheme,
    },
  }

  // 设置新格式的配置
  element.dataset["cfg"] = JSON.stringify(config)
}

/**
 * 初始化评论元素的懒加载
 * @param commentsElement 评论容器元素
 * @param fullSlug 当前页面的完整 slug
 */
async function initializeCommentsElement(commentsElement: HTMLElement, fullSlug: FullSlug) {
  // 防止重复初始化
  if (commentsLoadingStates.get(commentsElement)) {
    return
  }

  commentsLoadingStates.set(commentsElement, true)

  try {
    // 动态加载评论模块
    const commentsModule = await preloadCommentsModule()

    // 检查是否有配置数据（兼容新旧格式）
    const hasConfig = commentsElement.dataset["cfg"] || hasLegacyGiscusConfig(commentsElement)

    if (!hasConfig) {
      console.warn("Comments element has no config data. Skipping initialization.")
      commentsElement.innerHTML = `
        <div class="comments-error">
          <p>No comment configuration found for this element.</p>
        </div>
      `
      return
    }

    // 如果没有新格式配置但有旧格式配置，则转换为新格式
    if (!commentsElement.dataset["cfg"] && hasLegacyGiscusConfig(commentsElement)) {
      convertLegacyGiscusConfig(commentsElement)
    }

    // 初始化评论
    await commentsModule.initializeComments(commentsElement, fullSlug)
  } catch (error) {
    console.error("Failed to load comments module:", error)
    commentsElement.innerHTML = `
      <div class="comments-error">
        <p>Failed to load comments</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `
  } finally {
    commentsLoadingStates.set(commentsElement, false)
  }
}

/**
 * 设置评论页面的初始化逻辑
 */
function setupCommentsPage() {
  const slug = getFullSlug(window)
  const commentsElements = document.querySelectorAll<HTMLElement>(
    ".giscus, .utterances, .disqus, .comments-container",
  )

  if (commentsElements.length === 0) {
    return
  }

  // 使用 Intersection Observer 实现可视区域懒加载
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const commentsElement = entry.target as HTMLElement
          observer.unobserve(commentsElement)
          initializeCommentsElement(commentsElement, slug)
        }
      })
    },
    {
      rootMargin: "100px", // 提前100px开始加载
      threshold: 0.1,
    },
  )

  commentsElements.forEach((element) => {
    observer.observe(element)
  })

  // 注册清理函数
  if (resourceManager) {
    resourceManager.addCleanupTask(() => {
      observer.disconnect()
      commentsLoadingStates.clear()
    })
  }

  // 预加载评论模块（在空闲时间）
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      preloadCommentsModule().catch(() => {
        // 静默处理预加载失败
      })
    })
  } else {
    // 降级方案：延迟预加载
    setTimeout(() => {
      preloadCommentsModule().catch(() => {
        // 静默处理预加载失败
      })
    }, 5000)
  }
}

/**
 * 设置评论相关的事件监听器和清理任务
 * 使用全局注入的实例避免 ES6 模块导入问题
 */
function setupCommentsEventListeners() {
  if (!resourceManager) {
    console.error("[Comments] Global instances not available for event listener setup")
    return
  }

  // 页面导航时重新初始化
  resourceManager.addEventListener(document as unknown as EventTarget, "nav", setupCommentsPage)

  // DOM加载完成时初始化
  resourceManager.addEventListener(
    document as unknown as EventTarget,
    "DOMContentLoaded",
    setupCommentsPage,
  )

  // 监听主题变化事件，同步评论区主题
  resourceManager.addEventListener(
    document as unknown as EventTarget,
    "themechange",
    async (e: Event) => {
      const customEvent = e as CustomEvent<CustomEventMap["themechange"]>
      const newTheme = (customEvent as unknown as CustomEvent<{ theme: "light" | "dark" }>).detail
        ?.theme

      // 遍历所有评论元素，更新其主题
      const commentsElements = document.querySelectorAll<HTMLElement>(
        ".giscus, .utterances, .disqus, .comments-container",
      )
      for (const commentsElement of Array.from(commentsElements)) {
        // 确保评论模块已加载
        const commentsModule = await preloadCommentsModule()
        if (commentsModule && commentsModule.updateCommentsTheme) {
          // 调用评论模块的更新主题方法
          commentsModule.updateCommentsTheme(commentsElement, newTheme)
        }
      }
    },
  )
}

// 延迟执行，确保全局实例已注入
if (resourceManager) {
  setupCommentsEventListeners()
} else {
  // 如果全局实例尚未注入，等待一段时间后重试
  setTimeout(() => {
    setupCommentsEventListeners()
  }, 100)
}
