import { SimpleSlug, FullSlug, simplifySlug } from "../../../util/path"
import type { ContentDetails } from "../../../plugins/emitters/contentIndex.tsx"
import { D3Config } from "../../Graph"
import { localStorageKey } from "./config"

export function getVisited(): Set<SimpleSlug> {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

export function addToVisited(slug: SimpleSlug) {
  const visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

export async function determineGraphicsAPI(): Promise<"webgpu" | "webgl"> {
  const adapter = await navigator.gpu?.requestAdapter().catch(() => null)
  if (!adapter) {
    return "webgl"
  }
  return adapter.features.has("float32-blendable") ? "webgpu" : "webgl"
}

export async function getGraphData(
  graph: HTMLElement,
  fullSlug: FullSlug,
  fetchData: Promise<{ [key: string]: ContentDetails }>,
) {
  const slug = simplifySlug(fullSlug)
  let { depth, showTags, removeTags } = JSON.parse(graph.dataset["cfg"]!) as D3Config

  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
      simplifySlug(k as FullSlug),
      v,
    ]),
  )
  const links: { source: SimpleSlug; target: SimpleSlug }[] = []
  const tags: SimpleSlug[] = []
  const validLinks = new Set(data.keys())

  for (const [source, details] of data.entries()) {
    const outgoing = details.links ?? []

    for (const dest of outgoing) {
      if (validLinks.has(dest)) {
        links.push({ source: source, target: dest })
      }
    }

    if (showTags) {
      const localTags = details.tags
        .filter((tag: string) => !removeTags.includes(tag))
        .map((tag: string) => simplifySlug(("tags/" + tag) as FullSlug))

      tags.push(...localTags.filter((tag: string) => !tags.includes(tag as SimpleSlug)))

      for (const tag of localTags) {
        links.push({ source: source, target: tag })
      }
    }
  }

  const neighbourhood = new Set<SimpleSlug>()
  const wl: (SimpleSlug | "__SENTINEL")[] = [slug, "__SENTINEL"]
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

  const nodes = [...neighbourhood].map((url) => {
    const text = url.startsWith("tags/") ? "#" + url.substring(5) : (data.get(url)?.title ?? url)
    return {
      id: url,
      text,
      tags: data.get(url)?.tags ?? [],
    }
  })

  return {
    nodes,
    links: links
      .filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
      .map((l) => ({
        source: nodes.find((n) => n.id === l.source)!,
        target: nodes.find((n) => n.id === l.target)!,
      })),
  }
}
