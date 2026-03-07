/**
 * 统一的存储管理器
 * 整合 LRU 内存缓存和持久化存储
 */

import { LRUCache } from './cache'
import { PersistentStorage } from './persistent'
import type { CacheEvent } from './types'

// 内容缓存项
export interface ContentCacheItem {
  html: string
  text: string
  title: string
  links: string[]
  tags: string[]
}

// 链接有效性缓存项
export interface ValidLinkCacheItem {
  valid: boolean
  status?: number
  redirect?: string
}

interface CacheManagerOptions {
  contentCacheSize?: number
  validLinkCacheSize?: number
  contentExpiresIn?: number // 毫秒
}

// 缓存管理器类
export class CacheManager {
  // 内存缓存
  private contentCache: LRUCache<ContentCacheItem>
  private validLinkCache: LRUCache<ValidLinkCacheItem>
  private domCache: LRUCache<HTMLElement>

  // 持久化存储
  private persistentContentStorage?: PersistentStorage
  private persistentValidLinkStorage?: PersistentStorage

  constructor(options: CacheManagerOptions = {}) {
    const contentCacheSize = options.contentCacheSize ?? 5
    const validLinkCacheSize = options.validLinkCacheSize ?? 50
    const contentExpiresIn = options.contentExpiresIn

    // 初始化内存缓存
    this.contentCache = new LRUCache<ContentCacheItem>(contentCacheSize)
    this.validLinkCache = new LRUCache<ValidLinkCacheItem>(validLinkCacheSize)
    this.domCache = new LRUCache<HTMLElement>(contentCacheSize)

    // 初始化持久化存储（可选）
    this.persistentContentStorage = new PersistentStorage({
      storageType: 'local',
      prefix: 'quartz_content_',
      expiresIn: contentExpiresIn
    })

    this.persistentValidLinkStorage = new PersistentStorage({
      storageType: 'local',
      prefix: 'quartz_validlink_',
      expiresIn: 24 * 60 * 60 * 1000 // 24小时
    })
  }

  // ===== 内容缓存 =====

  /**
   * 获取内容（多层缓存检查）
   * 1. 内存缓存 -> 2. 持久化存储 -> 3. 返回 undefined（需要网络请求）
   */
  getContent(slug: string): ContentCacheItem | undefined {
    // 1. 检查内存缓存
    const memoryContent = this.contentCache.get(slug)
    if (memoryContent) {
      return memoryContent
    }

    // 2. 检查持久化存储
    if (this.persistentContentStorage) {
      const persistentContent = this.persistentContentStorage.get<ContentCacheItem>(slug)
      if (persistentContent) {
        // 恢复到内存缓存
        this.contentCache.set(slug, persistentContent)
        return persistentContent
      }
    }

    return undefined
  }

  /**
   * 设置内容缓存
   */
  setContent(slug: string, content: ContentCacheItem): void {
    // 设置内存缓存
    this.contentCache.set(slug, content)

    // 设置持久化缓存
    if (this.persistentContentStorage) {
      this.persistentContentStorage.set(slug, content)
    }
  }

  /**
   * 检查内容是否存在缓存
   */
  hasContent(slug: string): boolean {
    return this.contentCache.has(slug) || (this.persistentContentStorage?.has(slug) ?? false)
  }

  // ===== 链接有效性缓存 =====

  /**
   * 获取链接有效性
   */
  getValidLink(url: string): ValidLinkCacheItem | undefined {
    return this.validLinkCache.get(url)
  }

  /**
   * 设置链接有效性
   */
  setValidLink(url: string, item: ValidLinkCacheItem): void {
    this.validLinkCache.set(url, item)

    if (this.persistentValidLinkStorage) {
      this.persistentValidLinkStorage.set(url, item)
    }
  }

  /**
   * 检查链接是否有效
   */
  isLinkValid(url: string): boolean | undefined {
    return this.validLinkCache.get(url)?.valid
  }

  // ===== DOM 缓存 =====

  /**
   * 获取 DOM 元素
   */
  getDOM(key: string): HTMLElement | undefined {
    return this.domCache.get(key)
  }

  /**
   * 设置 DOM 元素
   */
  setDOM(key: string, element: HTMLElement): void {
    this.domCache.set(key, element)
  }

  // ===== 通用方法 =====

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.contentCache.clear()
    this.validLinkCache.clear()
    this.domCache.clear()
    this.persistentContentStorage?.clear()
    this.persistentValidLinkStorage?.clear()
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    return {
      content: this.contentCache.getStats(),
      validLink: this.validLinkCache.getStats(),
      dom: this.domCache.getStats()
    }
  }

  /**
   * 获取命中率
   */
  getHitRates() {
    return {
      content: this.contentCache.getHitRate(),
      validLink: this.validLinkCache.getHitRate()
    }
  }

  /**
   * 获取所有缓存的 slug
   */
  getCachedSlugs(): string[] {
    return this.contentCache.keys()
  }
}

// ===== 事件系统 =====

/**
 * 监听缓存事件
 */
export function onCacheEvent<T = unknown>(
  callback: (event: CacheEvent<T>) => void
): () => void {
  const handler = (e: Event) => {
    callback((e as CustomEvent<CacheEvent<T>>).detail)
  }

  window.addEventListener('cache:event', handler)

  return () => {
    window.removeEventListener('cache:event', handler)
  }
}

/**
 * 触发自定义缓存事件
 */
export function dispatchCacheEvent<T = unknown>(event: CacheEvent<T>): void {
  window.dispatchEvent(new CustomEvent('cache:event', { detail: event }))
}

// ===== 预加载相关 =====

/**
 * 预加载链接内容
 */
export async function preloadLink(
  cacheManager: CacheManager,
  url: string,
  fetchFn?: (url: string) => Promise<string>
): Promise<ContentCacheItem | undefined> {
  // 检查是否已有缓存
  const cached = cacheManager.getContent(url)
  if (cached) {
    return cached
  }

  // 如果没有提供 fetchFn，使用默认的 fetch
  const fetcher = fetchFn || defaultFetchContent

  try {
    const html = await fetcher(url)
    const item = parseContent(url, html)
    cacheManager.setContent(url, item)
    return item
  } catch (error) {
    console.warn('Failed to preload link:', url, error)
    return undefined
  }
}

/**
 * 默认的内容获取函数
 */
async function defaultFetchContent(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

/**
 * 解析 HTML 内容
 */
function parseContent(url: string, html: string): ContentCacheItem {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // 提取文本内容（去除 HTML 标签）
  const text = doc.body.textContent?.trim() || ''

  // 提取标题
  const title = doc.querySelector('title')?.textContent ||
    doc.querySelector('h1')?.textContent ||
    url

  // 提取链接
  const links = Array.from(doc.querySelectorAll('a.internal'))
    .map(a => a.getAttribute('href') || '')
    .filter(Boolean)

  // 提取标签
  const tags = Array.from(doc.querySelectorAll('.tag'))
    .map(span => span.textContent || '')
    .filter(Boolean)

  return { html, text, title, links, tags }
}

// ===== 默认实例 =====

// 创建全局缓存管理器实例
export const cacheManager = new CacheManager({
  contentCacheSize: 5,
  validLinkCacheSize: 50,
  contentExpiresIn: 24 * 60 * 60 * 1000 // 24小时
})

// 导出
export { LRUCache } from './cache'
export { PersistentStorage } from './persistent'
export * from './types'
