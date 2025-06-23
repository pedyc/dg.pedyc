import { slug as slugAnchor } from "github-slugger"
import type { Element as HastElement } from "hast"
import { clone } from "./clone"

// this file must be isomorphic so it can't use node libs (e.g. path)

import { OptimizedCacheManager } from "../components/scripts/managers/OptimizedCacheManager"
import { GlobalCacheConfig, CacheKeyGenerator } from "../components/scripts/config/cache-config"

// 使用统一的缓存配置
const urlCacheConfig = GlobalCacheConfig.URL_CACHE
const urlCache = new OptimizedCacheManager<URL>({
  capacity: urlCacheConfig.capacity,
  maxMemoryMB: 20,
  ttl: urlCacheConfig.ttl,
  cleanupIntervalMs: 300000,
})

/**
 * 移除路径中的重复段
 * @param path 路径字符串
 * @returns 清理后的路径
 */
export function removeDuplicatePathSegments(path: string): string {
  try {
    // 如果是完整URL，解析它；否则作为路径处理
    let pathname: string
    let search = ""
    let hash = ""

    if (path.startsWith("http") || path.startsWith("/")) {
      if (path.startsWith("http")) {
        const url = new URL(path)
        pathname = url.pathname
        search = url.search
        hash = url.hash
      } else {
        const parts = path.split("#")
        const pathAndSearch = parts[0]
        hash = parts[1] ? "#" + parts[1] : ""
        const searchIndex = pathAndSearch.indexOf("?")
        if (searchIndex !== -1) {
          pathname = pathAndSearch.substring(0, searchIndex)
          search = pathAndSearch.substring(searchIndex)
        } else {
          pathname = pathAndSearch
        }
      }
    } else {
      pathname = path
    }

    const segments = pathname.split("/").filter((segment) => segment.length > 0)
    const deduplicatedSegments: string[] = []

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]

      // 检查连续重复
      const isConsecutiveDuplicate =
        deduplicatedSegments.length > 0 &&
        deduplicatedSegments[deduplicatedSegments.length - 1] === segment

      if (!isConsecutiveDuplicate) {
        // 检查A/B/A模式和其他重复模式
        const isDuplicatePattern = isDuplicatePathPattern(deduplicatedSegments, segment)

        if (!isDuplicatePattern) {
          deduplicatedSegments.push(segment)
        }
      }
    }

    const cleanedPath = deduplicatedSegments.length > 0 ? "/" + deduplicatedSegments.join("/") : "/"
    return cleanedPath + search + hash
  } catch (error) {
    console.warn("Failed to clean duplicate path segments:", error)
    return path
  }
}

/**
 * 检查是否为重复模式
 * @param existingSegments 已存在的路径段
 * @param newSegment 新的路径段
 * @returns 是否为重复模式
 */
export function isDuplicatePathPattern(existingSegments: string[], newSegment: string): boolean {
  if (existingSegments.length < 1) {
    return false
  }

  // 检查是否形成重复序列模式（如 A/B/A/B）
  const segmentCount = existingSegments.length
  if (segmentCount >= 2) {
    // 检查A/B/A模式
    if (segmentCount >= 2 && existingSegments[segmentCount - 2] === newSegment) {
      return true
    }

    // 检查更复杂的重复模式
    for (let i = 0; i < segmentCount; i++) {
      if (existingSegments[i] === newSegment) {
        return true
      }
    }
  }

  return false
}

/**
 * 创建URL对象，带缓存优化
 * @param href URL字符串
 * @returns URL对象
 */
export function createUrl(href: string): URL {
  const cached = urlCache.get(href)
  if (cached) {
    return cached
  }

  const url = new URL(href)
  urlCache.set(href, url)
  return url
}

/**
 * 获取用于内容缓存的URL（移除hash并去重路径）
 * @param href URL字符串
 * @returns 用于缓存的URL对象
 */
export function getContentUrl(href: string): URL {
  const cacheKey = CacheKeyGenerator.content(href)
  const cached = urlCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const url = createUrl(href)
  const processedUrl = processUrlPath(url)

  // 缓存处理后的URL
  urlCache.set(cacheKey, processedUrl)
  return processedUrl
}

/**
 * 处理URL路径，去除重复段
 * @param url 原始URL对象
 * @returns 处理后的URL对象
 */
function processUrlPath(url: URL): URL {
  // 使用统一的路径去重函数
  const cleanedPath = removeDuplicatePathSegments(url.pathname)

  // 创建新的URL对象
  const processedUrl = new URL(url.toString())
  processedUrl.pathname = cleanedPath
  processedUrl.hash = "" // 移除hash用于缓存

  return processedUrl
}

/**
 * 清空URL缓存
 */
export function clearUrlCache(): void {
  urlCache.clear()
}

/**
 * 获取URL缓存统计信息
 */
export function getUrlCacheStats(): any {
  return urlCache.getStats()
}

export const QUARTZ = "quartz"

/// Utility type to simulate nominal types in TypeScript
type SlugLike<T> = string & { __brand: T }

/** Cannot be relative and must have a file extension. */
export type FilePath = SlugLike<"filepath">
export function isFilePath(s: string): s is FilePath {
  const validStart = !s.startsWith(".")
  return validStart && _hasFileExtension(s)
}

/** Cannot be relative and may not have leading or trailing slashes. It can have `index` as it's last segment. Use this wherever possible is it's the most 'general' interpretation of a slug. */
export type FullSlug = SlugLike<"full">
export function isFullSlug(s: string): s is FullSlug {
  const validStart = !(s.startsWith(".") || s.startsWith("/"))
  const validEnding = !s.endsWith("/")
  return validStart && validEnding && !containsForbiddenCharacters(s)
}

/** Shouldn't be a relative path and shouldn't have `/index` as an ending or a file extension. It _can_ however have a trailing slash to indicate a folder path. */
export type SimpleSlug = SlugLike<"simple">
export function isSimpleSlug(s: string): s is SimpleSlug {
  const validStart = !(s.startsWith(".") || (s.length > 1 && s.startsWith("/")))
  const validEnding = !endsWith(s, "index")
  return validStart && !containsForbiddenCharacters(s) && validEnding && !_hasFileExtension(s)
}

/** Can be found on `href`s but can also be constructed for client-side navigation (e.g. search and graph) */
export type RelativeURL = SlugLike<"relative">
export function isRelativeURL(s: string): s is RelativeURL {
  const validStart = /^\.{1,2}/.test(s)
  const validEnding = !endsWith(s, "index")
  return validStart && validEnding && ![".md", ".html"].includes(getFileExtension(s) ?? "")
}

export function isAbsoluteURL(s: string): boolean {
  try {
    new URL(s)
  } catch {
    return false
  }
  return true
}

export function getFullSlug(window: Window): FullSlug {
  const res = window.document.body.dataset.slug! as FullSlug
  return res
}

function sluggify(s: string): string {
  return s
    .split("/")
    .map((segment) =>
      segment
        .replace(/\s/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent")
        .replace(/\?/g, "")
        .replace(/#/g, ""),
    )
    .join("/") // always use / as sep
    .replace(/\/$/, "")
}

export function slugifyFilePath(fp: FilePath, excludeExt?: boolean): FullSlug {
  fp = stripSlashes(fp) as FilePath
  let ext = getFileExtension(fp)
  const withoutFileExt = fp.replace(new RegExp(ext + "$"), "")
  if (excludeExt || [".md", ".html", undefined].includes(ext)) {
    ext = ""
  }

  let slug = sluggify(withoutFileExt)

  // treat _index as index
  if (endsWith(slug, "_index")) {
    slug = slug.replace(/_index$/, "index")
  }

  return (slug + ext) as FullSlug
}

export function simplifySlug(fp: FullSlug): SimpleSlug {
  const res = stripSlashes(trimSuffix(fp, "index"), true)
  return (res.length === 0 ? "/" : res) as SimpleSlug
}

export function transformInternalLink(link: string): RelativeURL {
  let [fplike, anchor] = splitAnchor(decodeURI(link))

  const folderPath = isFolderPath(fplike)
  let segments = fplike.split("/").filter((x) => x.length > 0)
  let prefix = segments.filter(isRelativeSegment).join("/")
  let fp = segments.filter((seg) => !isRelativeSegment(seg) && seg !== "").join("/")

  // manually add ext here as we want to not strip 'index' if it has an extension
  const simpleSlug = simplifySlug(slugifyFilePath(fp as FilePath))
  const joined = joinSegments(stripSlashes(prefix), stripSlashes(simpleSlug))
  const trail = folderPath ? "/" : ""
  const res = (_addRelativeToStart(joined) + trail + anchor) as RelativeURL
  return res
}

// from micromorph/src/utils.ts
// https://github.com/natemoo-re/micromorph/blob/main/src/utils.ts#L5
/**
 * 重新设置HTML元素的属性URL，避免重复路径
 * @param el HTML元素
 * @param attr 属性名（href或src）
 * @param newBase 新的基础URL
 */
const _rebaseHtmlElement = (el: Element, attr: string, newBase: string | URL) => {
  const originalValue = el.getAttribute(attr)
  if (!originalValue) return

  try {
    const rebased = new URL(originalValue, newBase)
    // 使用pathname而不是完整URL，避免重复路径问题
    let finalPath = rebased.pathname

    // 使用统一的路径去重逻辑
    finalPath = removeDuplicatePathSegments(finalPath)
    el.setAttribute(attr, finalPath + (rebased.hash || ""))
  } catch (error) {
    console.warn(`Failed to rebase ${attr} for element:`, error)
  }
}

/**
 * 标准化HTML文档中的相对URL，防止重复处理
 * @param el HTML元素或文档
 * @param destination 目标URL
 */
export function normalizeRelativeURLs(el: Element | Document, destination: string | URL) {
  // 检查是否已经处理过，避免重复标准化
  const processedAttr = "data-urls-normalized"
  if (el instanceof Element && el.hasAttribute(processedAttr)) {
    return
  }
  if (el instanceof Document && el.documentElement?.hasAttribute(processedAttr)) {
    return
  }

  el.querySelectorAll('[href=""], [href^="./"], [href^="../"]').forEach((item) =>
    _rebaseHtmlElement(item, "href", destination),
  )
  el.querySelectorAll('[src=""], [src^="./"], [src^="../"]').forEach((item) =>
    _rebaseHtmlElement(item, "src", destination),
  )

  // 标记为已处理
  if (el instanceof Element) {
    el.setAttribute(processedAttr, "true")
  } else if (el instanceof Document && el.documentElement) {
    el.documentElement.setAttribute(processedAttr, "true")
  }
}

const _rebaseHastElement = (
  el: HastElement,
  attr: string,
  curBase: FullSlug,
  newBase: FullSlug,
) => {
  if (el.properties?.[attr]) {
    if (!isRelativeURL(String(el.properties[attr]))) {
      return
    }

    const rel = joinSegments(resolveRelative(curBase, newBase), "..", el.properties[attr] as string)
    el.properties[attr] = rel
  }
}

export function normalizeHastElement(rawEl: HastElement, curBase: FullSlug, newBase: FullSlug) {
  const el = clone(rawEl) // clone so we dont modify the original page
  _rebaseHastElement(el, "src", curBase, newBase)
  _rebaseHastElement(el, "href", curBase, newBase)
  if (el.children) {
    el.children = el.children.map((child) =>
      normalizeHastElement(child as HastElement, curBase, newBase),
    )
  }

  return el
}

// resolve /a/b/c to ../..
export function pathToRoot(slug: FullSlug): RelativeURL {
  let rootPath = slug
    .split("/")
    .filter((x: string) => x !== "")
    .slice(0, -1)
    .map((_: string) => "..")
    .join("/")

  if (rootPath.length === 0) {
    rootPath = "."
  }

  return rootPath as RelativeURL
}

export function resolveRelative(current: FullSlug, target: FullSlug | SimpleSlug): RelativeURL {
  const res = joinSegments(pathToRoot(current), simplifySlug(target as FullSlug)) as RelativeURL
  return res
}

export function splitAnchor(link: string): [string, string] {
  let [fp, anchor] = link.split("#", 2)
  if (fp.endsWith(".pdf")) {
    return [fp, anchor === undefined ? "" : `#${anchor}`]
  }
  anchor = anchor === undefined ? "" : "#" + slugAnchor(anchor)
  return [fp, anchor]
}

export function slugTag(tag: string) {
  return tag
    .split("/")
    .map((tagSegment) => sluggify(tagSegment))
    .join("/")
}

export function joinSegments(...args: string[]): string {
  if (args.length === 0) {
    return ""
  }

  let joined = args
    .filter((segment) => segment !== "" && segment !== "/")
    .map((segment) => stripSlashes(segment))
    .join("/")

  // if the first segment starts with a slash, add it back
  if (args[0].startsWith("/")) {
    joined = "/" + joined
  }

  // if the last segment is a folder, add a trailing slash
  if (args[args.length - 1].endsWith("/")) {
    joined = joined + "/"
  }

  return joined
}

export function getAllSegmentPrefixes(tags: string): string[] {
  const segments = tags.split("/")
  const results: string[] = []
  for (let i = 0; i < segments.length; i++) {
    results.push(segments.slice(0, i + 1).join("/"))
  }
  return results
}

export interface TransformOptions {
  strategy: "absolute" | "relative" | "shortest"
  allSlugs: FullSlug[]
}

export function transformLink(src: FullSlug, target: string, opts: TransformOptions): RelativeURL {
  let targetSlug = transformInternalLink(target)

  if (opts.strategy === "relative") {
    return targetSlug as RelativeURL
  } else {
    const folderTail = isFolderPath(targetSlug) ? "/" : ""
    const canonicalSlug = stripSlashes(targetSlug.slice(".".length))
    let [targetCanonical, targetAnchor] = splitAnchor(canonicalSlug)

    if (opts.strategy === "shortest") {
      // if the file name is unique, then it's just the filename
      const matchingFileNames = opts.allSlugs.filter((slug) => {
        const parts = slug.split("/")
        const fileName = parts.at(-1)
        return targetCanonical === fileName
      })

      // only match, just use it
      if (matchingFileNames.length === 1) {
        const targetSlug = matchingFileNames[0]
        return (resolveRelative(src, targetSlug) + targetAnchor) as RelativeURL
      }
    }

    // if it's not unique, then it's the absolute path from the vault root
    return (joinSegments(pathToRoot(src), canonicalSlug) + folderTail) as RelativeURL
  }
}

// path helpers
export function isFolderPath(fplike: string): boolean {
  return (
    fplike.endsWith("/") ||
    endsWith(fplike, "index") ||
    endsWith(fplike, "index.md") ||
    endsWith(fplike, "index.html")
  )
}

export function endsWith(s: string, suffix: string): boolean {
  return s === suffix || s.endsWith("/" + suffix)
}

export function trimSuffix(s: string, suffix: string): string {
  if (endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length)
  }
  return s
}

function containsForbiddenCharacters(s: string): boolean {
  return s.includes(" ") || s.includes("#") || s.includes("?") || s.includes("&")
}

function _hasFileExtension(s: string): boolean {
  return getFileExtension(s) !== undefined
}

export function getFileExtension(s: string): string | undefined {
  return s.match(/\.[A-Za-z0-9]+$/)?.[0]
}

function isRelativeSegment(s: string): boolean {
  return /^\.{0,2}$/.test(s)
}

export function stripSlashes(s: string, onlyStripPrefix?: boolean): string {
  if (s.startsWith("/")) {
    s = s.substring(1)
  }

  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1)
  }

  return s
}

function _addRelativeToStart(s: string): string {
  if (s === "") {
    s = "."
  }

  if (!s.startsWith(".")) {
    s = joinSegments(".", s)
  }

  return s
}
