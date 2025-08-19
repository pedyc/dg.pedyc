import type { ContentDetails } from "../plugins/emitters/contentIndex.tsx"
import { FullSlug, joinSegments } from "./path"

interface FileTrieData {
  slug: string
  title: string
  filePath: string
}

export class FileTrieNode<T extends FileTrieData = ContentDetails> {
  isFolder: boolean
  children: Array<FileTrieNode<T>>

  private slugSegments: string[]
  // prefer showing the file path segment over the slug segment
  // so that folders that dont have index files can be shown as is
  // without dashes in the slug
  private fileSegmentHint?: string
  private displayNameOverride?: string
  data: T | null

  constructor(segments: string[], data?: T) {
    this.children = []
    this.slugSegments = segments
    this.data = data ?? null
    this.isFolder = false
    this.displayNameOverride = undefined
  }

  get displayName(): string {
    const nonIndexTitle = this.data?.title === "index" ? undefined : this.data?.title
    return (
      this.displayNameOverride ?? nonIndexTitle ?? this.fileSegmentHint ?? this.slugSegment ?? ""
    )
  }

  set displayName(name: string) {
    this.displayNameOverride = name
  }

  get slug(): FullSlug {
    const path = joinSegments(...this.slugSegments) as FullSlug
    if (this.isFolder) {
      return joinSegments(path, "index") as FullSlug
    }

    return path
  }

  get slugSegment(): string {
    return this.slugSegments[this.slugSegments.length - 1]
  }

  private makeChild(path: string[], file?: T) {
    const fullPath = [...this.slugSegments, path[0]]
    const child = new FileTrieNode<T>(fullPath, file)
    this.children.push(child)
    return child
  }

  private insert(path: string[], file: T) {
    if (path.length === 0) {
      throw new Error("path is empty")
    }

    // if we are inserting, we are a folder
    this.isFolder = true
    const segment = path[0]
    if (path.length === 1) {
      // base case, we are at the end of the path
      if (segment === "index") {
        this.data ??= file
      } else {
        this.makeChild(path, file)
      }
    } else if (path.length > 1) {
      // recursive case, we are not at the end of the path
      const child =
        this.children.find((c) => c.slugSegment === segment) ?? this.makeChild(path, undefined)

      const fileParts = file.filePath.split("/")
      child.fileSegmentHint = fileParts.at(-path.length)
      child.insert(path.slice(1), file)
    }
  }

  // Add new file to trie
  add(file: T) {
    this.insert(file.slug.split("/"), file)
  }

  findNode(path: string[]): FileTrieNode<T> | undefined {
    if (path.length === 0 || (path.length === 1 && path[0] === "index")) {
      return this
    }

    return this.children.find((c) => c.slugSegment === path[0])?.findNode(path.slice(1))
  }

  ancestryChain(path: string[]): Array<FileTrieNode<T>> | undefined {
    if (path.length === 0 || (path.length === 1 && path[0] === "index")) {
      return [this]
    }

    const child = this.children.find((c) => c.slugSegment === path[0])
    if (!child) {
      return undefined
    }

    const childPath = child.ancestryChain(path.slice(1))
    if (!childPath) {
      return undefined
    }

    return [this, ...childPath]
  }

  /**
   * 过滤文件树节点（优化版本，减少递归调用）
   * @param filterFn 过滤函数
   * @returns 过滤后的新文件树
   */
  filter(filterFn: (node: FileTrieNode<T>) => boolean): FileTrieNode<T> {
    const newRoot = new FileTrieNode<T>(this.slugSegments, this.data ?? undefined)
    newRoot.isFolder = this.isFolder
    newRoot.displayName = this.displayName

    if (!filterFn(this)) {
      return newRoot
    }

    // 使用迭代而非递归，提高性能
    const stack: Array<{ source: FileTrieNode<T>; target: FileTrieNode<T> }> = [
      { source: this, target: newRoot },
    ]

    while (stack.length > 0) {
      const { source, target } = stack.pop()!

      for (const child of source.children) {
        if (filterFn(child)) {
          const newChild = new FileTrieNode<T>(child.slugSegments, child.data ?? undefined)
          newChild.isFolder = child.isFolder
          newChild.displayName = child.displayName
          target.children.push(newChild)

          // 如果有子节点，加入栈中继续处理
          if (child.children.length > 0) {
            stack.push({ source: child, target: newChild })
          }
        }
      }
    }

    return newRoot
  }

  /**
   * Map over trie nodes（优化版本，使用迭代）
   */
  map(mapFn: (node: FileTrieNode<T>) => void) {
    // 使用迭代而非递归，提高性能
    const stack: FileTrieNode<T>[] = [this]

    while (stack.length > 0) {
      const node = stack.pop()!
      mapFn(node)

      // 将子节点加入栈中继续处理
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }

  /**
   * Sort trie nodes according to sort/compare function（优化版本，使用迭代）
   */
  sort(sortFn: (a: FileTrieNode<T>, b: FileTrieNode<T>) => number) {
    // 使用迭代而非递归，提高性能
    const stack: FileTrieNode<T>[] = [this]

    while (stack.length > 0) {
      const node = stack.pop()!
      node.children = node.children.sort(sortFn)

      // 将子节点加入栈中继续处理
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }

  static fromEntries<T extends FileTrieData>(entries: [FullSlug, T][]) {
    const trie = new FileTrieNode<T>([])
    entries.forEach(([, entry]) => trie.add(entry))
    return trie
  }

  /**
   * Get all entries in the trie
   * in the a flat array including the full path and the node
   */
  entries(): [FullSlug, FileTrieNode<T>][] {
    const traverse = (node: FileTrieNode<T>): [FullSlug, FileTrieNode<T>][] => {
      const result: [FullSlug, FileTrieNode<T>][] = [[node.slug, node]]
      return result.concat(...node.children.map(traverse))
    }

    return traverse(this)
  }

  /**
   * Get all folder paths in the trie
   * @returns array containing folder state for trie
   */
  getFolderPaths() {
    return this.entries()
      .filter(([_, node]) => node.isFolder)
      .map(([path, _]) => path)
  }
}
