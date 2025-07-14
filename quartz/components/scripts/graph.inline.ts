import { registerEscapeHandler } from "./utils/util"
import { FullSlug, getFullSlug } from "../../util/path"
import { globalResourceManager } from "./managers"
import { globalGraphManagerInstance } from "./graph/global-graph-manager"

// 图谱懒加载状态管理
const graphLoadingStates = new Map<HTMLElement, boolean>()
const graphInitializedStates = new Map<HTMLElement, boolean>()
let graphModulePromise: Promise<typeof import("./lazy/graph")> | null = null
let currentObserver: IntersectionObserver | null = null

/**
 * 预加载图谱模块
 * @returns Promise<图谱模块>
 */
function preloadGraphModule() {
  if (!graphModulePromise) {
    graphModulePromise = import("./lazy/graph")
  }
  return graphModulePromise
}

/**
 * 初始化图谱元素的懒加载
 * @param graphElement 图谱容器元素
 * @param fullSlug 当前页面的完整 slug
 */
async function initializeGraphElement(graphElement: HTMLElement, fullSlug: FullSlug) {
  // 防止重复初始化
  if (graphLoadingStates.get(graphElement) || graphInitializedStates.get(graphElement)) {
    return
  }

  graphLoadingStates.set(graphElement, true)

  try {
    // 显示加载状态
    graphElement.innerHTML = `
      <div class="graph-loading">
        <div class="loading-spinner"></div>
        <p>Loading graph visualization...</p>
      </div>
    `

    // 动态加载图谱模块
    const graphModule = await preloadGraphModule()

    // 初始化图谱
    await graphModule.initializeGraph(graphElement, fullSlug)

    // 标记为已初始化
    graphInitializedStates.set(graphElement, true)
    console.log("Graph initialized successfully for element:", graphElement.className)
  } catch (error) {
    console.error("Failed to load graph module:", error)
    graphElement.innerHTML = `
      <div class="graph-error">
        <p>Failed to load graph visualization</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `
  } finally {
    graphLoadingStates.set(graphElement, false)
  }
}

/**
 * 设置图谱页面的初始化逻辑
 */
function setupGraphPage() {
  const slug = getFullSlug(window)
  const graphElements = document.querySelectorAll<HTMLElement>(
    ".graph-container, .global-graph-container",
  )

  if (graphElements.length === 0) {
    return
  }

  // 清理之前的 observer
  if (currentObserver) {
    currentObserver.disconnect()
    currentObserver = null
  }

  // 过滤出未初始化的图谱元素
  const uninitializedElements = Array.from(graphElements).filter(
    (element) => !graphInitializedStates.get(element),
  )

  if (uninitializedElements.length === 0) {
    console.log("All graph elements already initialized, skipping setup")
    return
  }

  // 使用 Intersection Observer 实现可视区域懒加载
  currentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const graphElement = entry.target as HTMLElement
          currentObserver?.unobserve(graphElement)
          initializeGraphElement(graphElement, slug)
        }
      })
    },
    {
      rootMargin: "50px", // 提前50px开始加载
      threshold: 0.1,
    },
  )

  uninitializedElements.forEach((element) => {
    currentObserver?.observe(element)
  })

  console.log(`Setup graph page: observing ${uninitializedElements.length} uninitialized elements`)

  // 预加载图谱模块（在空闲时间）
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      preloadGraphModule().catch(() => {
        // 静默处理预加载失败
      })
    })
  } else {
    // 降级方案：延迟预加载
    setTimeout(() => {
      preloadGraphModule().catch(() => {
        // 静默处理预加载失败
      })
    }, 2000)
  }
}

/**
 * 设置图谱相关的事件监听器和清理任务
 * 使用全局注入的实例避免 ES6 模块导入问题
 */
function setupGraphEventListeners() {
  if (!globalResourceManager.instance) {
    console.error("[Graph] Global instances not available for event listener setup")
    return
  }

  // 注册清理函数
  globalResourceManager.instance.addCleanupTask(() => {
    // 清理所有图谱状态
    graphLoadingStates.clear()
    graphInitializedStates.clear()

    // 清理 observer
    if (currentObserver) {
      currentObserver.disconnect()
      currentObserver = null
    }

    console.log("Graph states and observers cleaned up")
  })

  // 页面导航时重新初始化
  globalResourceManager.instance.addEventListener(document as any, "nav", setupGraphPage)

  // DOM加载完成时初始化
  globalResourceManager.instance.addEventListener(
    document as any,
    "DOMContentLoaded",
    setupGraphPage,
  )
}

// 初始化全局图谱管理器
globalGraphManagerInstance.initialize()

// 延迟执行，确保全局实例已注入
if (globalResourceManager.instance) {
  setupGraphEventListeners()
} else {
  // 如果全局实例尚未注入，等待一段时间后重试
  setTimeout(() => {
    setupGraphEventListeners()
  }, 100)
}

// 注册 ESC 键处理（如果需要）
registerEscapeHandler(document as unknown as HTMLElement, () => {
  // 图谱相关的 ESC 键处理逻辑
  const activeGraphs = document.querySelectorAll(".graph.active")
  activeGraphs.forEach((graph) => {
    graph.classList.remove("active")
  })
})
