import type { ContentDetails } from "../../../plugins/emitters/contentIndex"
import type { FullSlug, SimpleSlug } from "../../../util/path"
import { simplifySlug } from "../../../util/path"
import type { SimpleLinkData, GraphData } from "./types"
import { GRAPH_CONSTANTS } from "./constants"
import { CacheKeyFactory } from "../cache"
import { STORAGE_KEYS } from "./constants"
import { globalStorageManager } from "../managers"

// 声明全局 fetchData 变量
declare const fetchData: Promise<Record<string, ContentDetails>>

/**
 * 图谱数据服务类
 */
export class GraphDataService {
  private static readonly localStorageKey = CacheKeyFactory.generateSystemKey(
    STORAGE_KEYS.GRAPH_VISITED,
    STORAGE_KEYS.NAVIGATION_HISTORY,
  )

  /**
   * 获取已访问的页面集合
   * @returns 已访问页面的 SimpleSlug 集合
   */
  static getVisited(): Set<SimpleSlug> {
    return new Set(
      JSON.parse(globalStorageManager.instance.getItem("local", this.localStorageKey) ?? "[]"),
    )
  }

  /**
   * 获取图谱原始数据
   * 直接使用全局 fetchData，这是最可靠的方式
   * @returns Promise<Record<string, ContentDetails>>
   */
  static async fetchGraphData(): Promise<Record<string, ContentDetails>> {
    try {
      // 使用全局 fetchData 变量，fetchData 本身就是一个 Promise
      const data = await fetchData
      if (!data) {
        throw new Error("fetchData resolved to null or undefined")
      }
      return data
    } catch (error) {
      console.error("Failed to fetch graph data:", error)
      throw new Error("Failed to load graph data")
    }
  }

  /**
   * 处理图谱数据，生成节点和链接
   * @param rawData 原始数据
   * @param config 配置选项
   * @returns 处理后的图谱数据
   */
  static processGraphData(
    rawData: Record<string, ContentDetails>,
    config: {
      showTags: boolean
      removeTags: string[]
      depth: number
      currentSlug: SimpleSlug
    },
  ): GraphData {
    const data: Map<SimpleSlug, ContentDetails> = new Map(
      Object.entries<ContentDetails>(rawData).map(([k, v]) => [simplifySlug(k as FullSlug), v]),
    )

    const links: SimpleLinkData[] = []
    const tags: SimpleSlug[] = []
    const validLinks = new Set(data.keys())

    // 构建链接和标签
    for (const [source, details] of data.entries()) {
      const outgoing = details.links ?? []

      for (const dest of outgoing) {
        if (validLinks.has(dest)) {
          links.push({ source: source, target: dest })
        }
      }

      if (config.showTags) {
        const localTags = details.tags
          .filter((tag) => !config.removeTags.includes(tag))
          .map((tag) => simplifySlug((GRAPH_CONSTANTS.TAG_PREFIX + tag) as FullSlug))

        tags.push(...localTags.filter((tag) => !tags.includes(tag)))

        for (const tag of localTags) {
          links.push({ source: source, target: tag })
        }
      }
    }

    // 计算邻域
    const neighbourhood = this.calculateNeighbourhood(
      links,
      config.currentSlug,
      config.depth,
      validLinks,
      tags,
      config.showTags,
    )

    // 生成节点
    const nodes = [...neighbourhood].map((url) => {
      const text = url.startsWith(GRAPH_CONSTANTS.TAG_PREFIX)
        ? GRAPH_CONSTANTS.TAG_DISPLAY_PREFIX + url.substring(GRAPH_CONSTANTS.TAG_PREFIX.length)
        : (data.get(url)?.title ?? url)
      return {
        id: url,
        text,
        tags: data.get(url)?.tags ?? [],
      }
    })

    // 生成最终的图谱数据
    const graphData: GraphData = {
      nodes,
      links: links
        .filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
        .map((l) => ({
          source: nodes.find((n) => n.id === l.source)!,
          target: nodes.find((n) => n.id === l.target)!,
        })),
    }

    console.log(
      `Graph data prepared: ${graphData.nodes.length} nodes, ${graphData.links.length} links`,
    )
    return graphData
  }

  /**
   * 计算节点邻域
   * @param links 链接数组
   * @param currentSlug 当前页面slug
   * @param depth 深度
   * @param validLinks 有效链接集合
   * @param tags 标签数组
   * @param showTags 是否显示标签
   * @returns 邻域节点集合
   */
  private static calculateNeighbourhood(
    links: SimpleLinkData[],
    currentSlug: SimpleSlug,
    depth: number,
    validLinks: Set<SimpleSlug>,
    tags: SimpleSlug[],
    showTags: boolean,
  ): Set<SimpleSlug> {
    const neighbourhood = new Set<SimpleSlug>()
    const wl: (SimpleSlug | "__SENTINEL")[] = [currentSlug, "__SENTINEL"]

    if (depth >= 0) {
      while (depth >= 0 && wl.length > 0) {
        const cur = wl.shift()!
        if (cur === "__SENTINEL") {
          depth--
          wl.push("__SENTINEL")
        } else {
          neighbourhood.add(cur)
          const outgoing = links.filter((l) => l.source === cur)
          const incoming = links.filter((l) => l.target === cur)
          wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source))
        }
      }
    } else {
      validLinks.forEach((id) => neighbourhood.add(id))
      if (showTags) tags.forEach((tag) => neighbourhood.add(tag))
    }

    return neighbourhood
  }
}
