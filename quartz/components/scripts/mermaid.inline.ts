import { globalResourceManager } from "./managers"

// Mermaid 懒加载状态管理
const mermaidLoadingStates = new Map<HTMLElement, boolean>()
const resourceManager = globalResourceManager.instance
let mermaidModulePromise: Promise<typeof import("./lazy/mermaid")> | null = null

/**
 * 预加载 Mermaid 模块
 * @returns Promise<Mermaid 模块>
 */
function preloadMermaidModule() {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import("./lazy/mermaid")
  }
  return mermaidModulePromise
}

/**
 * 初始化 Mermaid 图表的懒加载
 * @param nodes Mermaid 代码块节点列表
 */
async function initializeMermaidElements(nodes: NodeListOf<HTMLElement>) {
  // 防止重复初始化
  const firstNode = nodes[0]
  if (mermaidLoadingStates.get(firstNode)) {
    return
  }

  mermaidLoadingStates.set(firstNode, true)

  try {
    // 动态加载 Mermaid 模块
    const mermaidModule = await preloadMermaidModule()

    // 初始化 Mermaid 图表
    const result = await mermaidModule.initializeMermaid(nodes)

    // 注册清理函数
    if (result?.cleanup) {
      globalResourceManager.instance.addCleanupTask(result.cleanup)
    }
  } catch (error) {
    console.error("Failed to load mermaid module:", error)

    // 显示错误状态
    nodes.forEach((node) => {
      const pre = node.parentElement as HTMLPreElement
      if (pre) {
        const errorDiv = document.createElement("div")
        errorDiv.className = "mermaid-error"
        errorDiv.innerHTML = `
          <p>Failed to load Mermaid diagram</p>
          <button onclick="location.reload()">Retry</button>
        `
        pre.appendChild(errorDiv)
      }
    })
  } finally {
    mermaidLoadingStates.set(firstNode, false)
  }
}

/**
 * 设置 Mermaid 页面的初始化逻辑
 */
function setupMermaidPage() {
  const center = document.querySelector(".center") as HTMLElement
  if (!center) return

  const nodes = center.querySelectorAll("code.mermaid") as NodeListOf<HTMLElement>
  if (nodes.length === 0) return

  // 使用 Intersection Observer 实现可视区域懒加载
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleNodes: HTMLElement[] = []
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const mermaidNode = entry.target as HTMLElement
          observer.unobserve(mermaidNode)
          visibleNodes.push(mermaidNode)
        }
      })

      if (visibleNodes.length > 0) {
        // 将所有可见的 Mermaid 节点转换为 NodeListOf<HTMLElement>
        const nodeList = {
          ...visibleNodes,
          item: (index: number) => visibleNodes[index] || null,
          [Symbol.iterator]: function* () {
            for (const node of visibleNodes) {
              yield node
            }
          },
        } as unknown as NodeListOf<HTMLElement>

        initializeMermaidElements(nodeList)
      }
    },
    {
      rootMargin: "100px", // 提前100px开始加载
      threshold: 0.1,
    },
  )

  nodes.forEach((node) => {
    observer.observe(node)
  })

  // 注册清理函数
  if (resourceManager) {
    resourceManager.addCleanupTask(() => {
      observer.disconnect()
      mermaidLoadingStates.clear()
    })
  }

  // 预加载 Mermaid 模块（在空闲时间）
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      preloadMermaidModule().catch(() => {
        // 静默处理预加载失败
      })
    })
  } else {
    // 降级方案：延迟预加载
    setTimeout(() => {
      preloadMermaidModule().catch(() => {
        // 静默处理预加载失败
      })
    }, 3000)
  }
}

/**
 * 设置 Mermaid 相关的事件监听器和清理任务
 * 使用全局注入的实例避免 ES6 模块导入问题
 */
function setupMermaidEventListeners() {
  if (!resourceManager) {
    console.error("[Mermaid] Global instances not available for event listener setup")
    return
  }

  // 页面导航时重新初始化
  resourceManager.addEventListener(document as unknown as EventTarget, "nav", setupMermaidPage)

  // DOM加载完成时初始化
  resourceManager.addEventListener(
    document as unknown as EventTarget,
    "DOMContentLoaded",
    setupMermaidPage,
  )
}

// 延迟执行，确保全局实例已注入
if (resourceManager) {
  setupMermaidEventListeners()
} else {
  // 如果全局实例尚未注入，等待一段时间后重试
  setTimeout(() => {
    setupMermaidEventListeners()
  }, 100)
}
