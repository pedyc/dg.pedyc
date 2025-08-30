import { removeAllChildren } from "../utils/util"
import { FullSlug, normalizeRelativeURLs, resolveRelative } from "../../../util/path"
import { index, currentSearchTerm, Item } from "./search-index"

export async function onType(
  e: Event,
  _searchLayout: HTMLElement,
  idDataMap: FullSlug[],
  data: ContentIndex,
  _currentSlug: FullSlug,
  localDisplayResults: (finalResults: Item[]) => Promise<void>,
) {
  const searchBar = e.target as HTMLInputElement
  const searchTerm = searchBar.value
  const searchType = searchTerm.startsWith("#") ? "tags" : "basic"

  // if we're searching tags, we want to remove the # from the search term
  const actualSearchTerm = searchType === "tags" ? searchTerm.substring(1) : searchTerm

  // dont search if there's no search term
  if (actualSearchTerm.length === 0) {
    localDisplayResults([])
    return
  }

  currentSearchTerm.set(actualSearchTerm)

  const results: any = await index.searchAsync(actualSearchTerm, {
    enrich: true,
    suggest: true,
    limit: 10,
  })

  const finalResults: Item[] = []

  // Add tag matches
  if (searchType === "tags") {
    const tagMatches = (results as any[]).filter((res: any) => res.field === "tags")
    for (const res of tagMatches) {
      finalResults.push(formatForDisplay(searchTerm, res.id, idDataMap, data, searchType))
    }
  }

  // Add content matches
  const contentMatches = (results as any[]).filter(
    (res: any) => res.field === "content" || res.field === "title",
  )
  for (const res of contentMatches) {
    finalResults.push(formatForDisplay(searchTerm, res.id, idDataMap, data, searchType))
  }

  // numSearchResults = finalResults.length // This is a constant, cannot be reassigned.
  localDisplayResults(finalResults)
}

const p = new DOMParser()
const contextWindowWords = 30
const numTagResults = 5

export const tokenizeTerm = (term: string) => {
  const tokens = term.split(/\s+/).filter((t) => t.trim() !== "")
  const tokenLen = tokens.length
  if (tokenLen > 1) {
    for (let i = 1; i < tokenLen; i++) {
      tokens.push(tokens.slice(0, i + 1).join(" "))
    }
  }

  return tokens.sort((a, b) => b.length - a.length) // always highlight longest terms first
}

export function highlight(searchTerm: string, text: string, trim?: boolean) {
  const tokenizedTerms = tokenizeTerm(searchTerm)
  let tokenizedText = text.split(/\s+/).filter((t) => t !== "")

  let startIndex = 0
  let endIndex = tokenizedText.length - 1
  if (trim) {
    const includesCheck = (tok: string) =>
      tokenizedTerms.some((term) => tok.toLowerCase().startsWith(term.toLowerCase()))
    const occurrencesIndices = tokenizedText.map(includesCheck)

    let bestSum = 0
    let bestIndex = 0
    for (let i = 0; i < Math.max(tokenizedText.length - contextWindowWords, 0); i++) {
      const window = occurrencesIndices.slice(i, i + contextWindowWords)
      const windowSum = window.reduce((total, cur) => total + (cur ? 1 : 0), 0)
      if (windowSum >= bestSum) {
        bestSum = windowSum
        bestIndex = i
      }
    }

    startIndex = Math.max(bestIndex - contextWindowWords, 0)
    endIndex = Math.min(startIndex + 2 * contextWindowWords, tokenizedText.length - 1)
    tokenizedText = tokenizedText.slice(startIndex, endIndex)
  }

  const slice = tokenizedText
    .map((tok) => {
      // see if this tok is prefixed by any search terms
      for (const searchTok of tokenizedTerms) {
        if (tok.toLowerCase().includes(searchTok.toLowerCase())) {
          const regex = new RegExp(searchTok.toLowerCase(), "gi")
          return tok.replace(regex, `<span class="highlight">$&</span>`)
        }
      }
      return tok
    })
    .join(" ")

  return `${startIndex === 0 ? "" : "..."}${slice}${endIndex === tokenizedText.length - 1 ? "" : "..."}`
}

export function highlightHTML(searchTerm: string, el: HTMLElement) {
  const p = new DOMParser()
  const tokenizedTerms = tokenizeTerm(searchTerm)
  const html = p.parseFromString(el.innerHTML, "text/html")

  const createHighlightSpan = (text: string) => {
    const span = document.createElement("span")
    span.className = "highlight"
    span.textContent = text
    return span
  }

  const highlightTextNodes = (node: Node, term: string) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeText = node.nodeValue ?? ""
      const regex = new RegExp(term.toLowerCase(), "gi")
      const matches = nodeText.match(regex)
      if (!matches || matches.length === 0) return
      const spanContainer = document.createElement("span")
      let lastIndex = 0
      for (const match of matches) {
        const matchIndex = nodeText.indexOf(match, lastIndex)
        spanContainer.appendChild(document.createTextNode(nodeText.slice(lastIndex, matchIndex)))
        spanContainer.appendChild(createHighlightSpan(match))
        lastIndex = matchIndex + match.length
      }
      spanContainer.appendChild(document.createTextNode(nodeText.slice(lastIndex)))
      node.parentNode?.replaceChild(spanContainer, node)
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).classList.contains("highlight")) return
      Array.from(node.childNodes).forEach((child) => highlightTextNodes(child, term))
    }
  }

  for (const term of tokenizedTerms) {
    highlightTextNodes(html.body, term)
  }

  return html.body
}

export const formatForDisplay = (
  term: string,
  id: number,
  idDataMap: FullSlug[],
  data: ContentIndex,
  searchType: "basic" | "tags",
): Item => {
  const slug = idDataMap[id]
  return {
    id,
    slug,
    title: searchType === "tags" ? data[slug].title : highlight(term, data[slug].title ?? ""),
    content: highlight(term, data[slug].content ?? "", true),
    tags: highlightTags(term.substring(1), data[slug].tags),
    field: "", // Added to satisfy Item interface
  }
}

export function highlightTags(term: string, tags: string[]) {
  if (!tags) {
    return []
  }

  return tags
    .map((tag) => {
      if (tag.toLowerCase().includes(term.toLowerCase())) {
        return `<li><p class="match-tag">#${tag}</p></li>`
      } else {
        return `<li><p>#${tag}</p></li>`
      }
    })
    .slice(0, numTagResults)
}

export function resolveUrl(currentSlug: FullSlug, slug: FullSlug): URL {
  return new URL(resolveRelative(currentSlug, slug), location.toString())
}

export const resultToHTML = (item: Item, currentSlug: FullSlug, hideSearch: () => void) => {
  const { slug, title, content, tags } = item
  const htmlTags = tags.length > 0 ? `<ul class="tags">${tags.join("")}</ul>` : ``
  const itemTile = document.createElement("a")
  itemTile.classList.add("result-card")
  itemTile.id = slug
  itemTile.href = resolveUrl(currentSlug, slug as FullSlug).toString()
  itemTile.innerHTML = `
    <h3 class="card-title">${title}</h3>
    ${htmlTags}
    <p class="card-description">${content}</p>
  `
  itemTile.addEventListener("click", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    hideSearch()
  })

  const handler = (event: MouseEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    hideSearch()
  }

  itemTile.addEventListener("click", handler)
  window.addCleanup(() => itemTile.removeEventListener("click", handler))

  return itemTile
}

export const fetchContentCache: Map<FullSlug, Element[]> = new Map()

export async function fetchContent(slug: FullSlug, currentSlug: FullSlug): Promise<Element[]> {
  if (fetchContentCache.has(slug)) {
    return fetchContentCache.get(slug) as Element[]
  }

  const targetUrl = resolveUrl(currentSlug, slug).toString()
  const contents = await fetch(targetUrl)
    .then((res) => res.text())
    .then((contents) => {
      if (contents === undefined) {
        throw new Error(`Could not fetch ${targetUrl}`)
      }
      const html = p.parseFromString(contents ?? "", "text/html")
      normalizeRelativeURLs(html, targetUrl)
      return [...html.getElementsByClassName("popover-hint")]
    })

  fetchContentCache.set(slug, contents)
  return contents
}

export async function displayPreview(
  searchLayout: HTMLElement,
  enablePreview: boolean,
  el: HTMLElement | null,
  preview: HTMLDivElement | undefined,
  currentSearchTerm: string,
  currentSlug: FullSlug,
) {
  if (!searchLayout || !enablePreview || !el || !preview) return
  const slug = el.id as FullSlug
  const innerDiv = await fetchContent(slug, currentSlug).then((contents) =>
    contents.flatMap((el) => [...highlightHTML(currentSearchTerm, el as HTMLElement).children]),
  )
  const previewInner = document.createElement("div")
  previewInner.classList.add("preview-inner")
  previewInner.append(...innerDiv)
  preview.replaceChildren(previewInner)

  // scroll to longest
  const highlights = [...preview.getElementsByClassName("highlight")].sort(
    (a, b) => b.innerHTML.length - a.innerHTML.length,
  )
  highlights[0]?.scrollIntoView({ block: "start" })
}

export async function displayResults(
  finalResults: Item[],
  results: HTMLElement,
  preview: HTMLDivElement | undefined,
  displayPreviewFunc: (el: HTMLElement | null) => Promise<void>,
) {
  removeAllChildren(results)
  if (finalResults.length === 0) {
    results.innerHTML = `<a class="result-card no-match">
          <h3>No results.</h3>
          <p>Try another search term?</p>
      </a>`
  } else {
    results.append(
      ...finalResults.map((item) => {
        const itemTile = item as unknown as HTMLAnchorElement
        itemTile.addEventListener("mouseenter", async (ev) => {
          if (!ev.target) return
          const target = ev.target as HTMLInputElement
          await displayPreviewFunc(target)
        })
        window.addCleanup(() =>
          itemTile.removeEventListener("mouseenter", async (ev) => {
            if (!ev.target) return
            const target = ev.target as HTMLInputElement
            await displayPreviewFunc(target)
          }),
        )
        return itemTile
      }),
    )
  }

  if (finalResults.length === 0 && preview) {
    // no results, clear previous preview
    removeAllChildren(preview)
  } else {
    // focus on first result, then also dispatch preview immediately
    const firstChild = results.firstElementChild as HTMLElement
    firstChild.classList.add("focus")
    await displayPreviewFunc(firstChild)
  }
}

export type SearchType = "basic" | "tags"
