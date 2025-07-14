import FlexSearch from "flexsearch"
import { FullSlug, resolveRelative } from "../../../util/path"
import { globalResourceManager } from "../managers"

const resourceManager = globalResourceManager.instance

// 搜索相关类型定义
type SearchType = "basic" | "tags"

interface SearchResult {
  id: number
  slug: FullSlug
  title: string
  content: string
  tags: string[]
}

interface SearchData {
  slug: FullSlug
  title: string
  content: string
  tags: string[]
}

interface SearchOptions {
  enablePreview: boolean
  showTags: boolean
  searchType: SearchType
}

// 搜索状态管理
let searchIndex: any | null = null
let searchData: SearchData[] = []
let searchOptions: SearchOptions = {
  enablePreview: true,
  showTags: true,
  searchType: "basic",
}

/**
 * 初始化搜索索引
 * @param data 搜索数据
 * @param options 搜索选项
 */
export function initializeSearchIndex(data: SearchData[], options: Partial<SearchOptions> = {}) {
  searchData = data
  searchOptions = { ...searchOptions, ...options }

  // 创建 FlexSearch 索引
  searchIndex = new FlexSearch.Document({
    document: {
      id: "slug",
      index: ["title", "content", "tags"],
      store: ["title", "content", "tags", "slug"],
    },
    tokenize: "forward",
    resolution: 9,
    context: {
      depth: 2,
      resolution: 5,
      bidirectional: true,
    },
  })

  // 添加文档到索引
  for (const item of searchData) {
    searchIndex.add(item)
  }
}

/**
 * 执行搜索
 * @param query 搜索查询
 * @param limit 结果数量限制
 * @returns 搜索结果
 */
export function performSearch(query: string, limit: number = 10): SearchResult[] {
  if (!searchIndex || !query.trim()) {
    return []
  }

  try {
    const results = searchIndex.search(query, {
      limit,
      enrich: true,
    })

    const searchResults: SearchResult[] = []

    for (const result of results) {
      if (Array.isArray(result.result)) {
        for (const item of result.result) {
          const doc = item.doc as SearchData
          searchResults.push({
            id: searchResults.length,
            slug: doc.slug,
            title: doc.title,
            content: doc.content,
            tags: doc.tags,
          })
        }
      }
    }

    return searchResults.slice(0, limit)
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}

/**
 * 高亮搜索结果
 * @param text 原始文本
 * @param query 搜索查询
 * @returns 高亮后的HTML
 */
export function highlightSearchResults(text: string, query: string): string {
  if (!query.trim()) {
    return text
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

/**
 * 创建搜索结果预览
 * @param content 内容
 * @param query 搜索查询
 * @param maxLength 最大长度
 * @returns 预览文本
 */
export function createSearchPreview(
  content: string,
  query: string,
  maxLength: number = 200,
): string {
  if (!searchOptions.enablePreview) {
    return ""
  }

  const cleanContent = content.replace(/<[^>]*>/g, "").trim()

  if (!query.trim()) {
    return cleanContent.slice(0, maxLength) + (cleanContent.length > maxLength ? "..." : "")
  }

  // 查找查询词在内容中的位置
  const queryIndex = cleanContent.toLowerCase().indexOf(query.toLowerCase())

  if (queryIndex === -1) {
    return cleanContent.slice(0, maxLength) + (cleanContent.length > maxLength ? "..." : "")
  }

  // 计算预览的起始位置
  const start = Math.max(0, queryIndex - Math.floor(maxLength / 2))
  const end = Math.min(cleanContent.length, start + maxLength)

  let preview = cleanContent.slice(start, end)

  if (start > 0) {
    preview = "..." + preview
  }

  if (end < cleanContent.length) {
    preview = preview + "..."
  }

  return highlightSearchResults(preview, query)
}

/**
 * 渲染搜索结果
 * @param results 搜索结果
 * @param query 搜索查询
 * @param container 容器元素
 * @param currentSlug 当前页面slug
 */
export function renderSearchResults(
  results: SearchResult[],
  query: string,
  container: HTMLElement,
  currentSlug: FullSlug,
) {
  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-no-results">
        <p>No results found for "${query}"</p>
      </div>
    `
    return
  }

  const resultElements = results
    .map((result) => {
      const preview = createSearchPreview(result.content, query)
      const highlightedTitle = highlightSearchResults(result.title, query)
      const relativePath = resolveRelative(currentSlug, result.slug)

      const tagsHtml =
        searchOptions.showTags && result.tags.length > 0
          ? `<div class="search-tags">${result.tags.map((tag) => `<span class="search-tag">#${tag}</span>`).join("")}</div>`
          : ""

      return `
      <li class="search-result-item">
        <a href="${relativePath}" class="search-result-link">
          <h3 class="search-result-title">${highlightedTitle}</h3>
          ${preview ? `<p class="search-result-preview">${preview}</p>` : ""}
          ${tagsHtml}
        </a>
      </li>
    `
    })
    .join("")

  container.innerHTML = `
    <div class="search-results-header">
      <p class="search-results-count">Found ${results.length} result${results.length === 1 ? "" : "s"} for "${query}"</p>
    </div>
    <ul class="search-results-list">
      ${resultElements}
    </ul>
  `
}

/**
 * 初始化搜索功能
 * @param searchElement 搜索容器元素
 * @param currentSlug 当前页面slug
 */
export async function initializeSearch(searchElement: HTMLElement, currentSlug: FullSlug) {
  try {
    // 获取搜索配置
    const config = JSON.parse(searchElement.dataset["cfg"] || "{}")
    searchOptions = { ...searchOptions, ...config }

    // 获取搜索数据
    const searchDataUrl = new URL(`static/contentIndex.json`, window.location.origin)
    const response = await fetch(searchDataUrl.toString())

    if (!response.ok) {
      throw new Error(`Failed to fetch search data: ${response.status}`)
    }

    const rawData = await response.json()
    const searchData: SearchData[] = Object.values(rawData)
    initializeSearchIndex(searchData, searchOptions)

    // 设置搜索界面
    setupSearchInterface(searchElement, currentSlug)
  } catch (error) {
    console.error("Failed to initialize search:", error)
    searchElement.innerHTML = `
      <div class="search-error">
        <p>Failed to load search functionality</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `
  }
}

/**
 * 设置搜索界面
 * @param container 搜索容器
 * @param currentSlug 当前页面slug
 */
function setupSearchInterface(container: HTMLElement, currentSlug: FullSlug) {
  const searchInput = container.querySelector<HTMLInputElement>(".search-input")
  const searchResults = container.querySelector<HTMLElement>(".search-results")

  if (!searchInput || !searchResults) {
    console.error("Search input or results container not found")
    return
  }

  let searchTimeout: NodeJS.Timeout

  // 搜索输入处理
  const handleSearch = () => {
    const query = searchInput.value.trim()

    if (query.length < 2) {
      searchResults.innerHTML = ""
      return
    }

    const results = performSearch(query, 10)
    renderSearchResults(results, query, searchResults, currentSlug)
  }

  // 防抖搜索
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(handleSearch, 300)
  })

  // 键盘导航
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.blur()
      searchResults.innerHTML = ""
    }
  })

  // 注册清理函数
  if (resourceManager) {
    resourceManager.addCleanupTask(() => {
      clearTimeout(searchTimeout)
    })
  }
}

/**
 * 清理搜索资源
 */
export function cleanupSearch() {
  searchIndex = null
  searchData = []
}
