---
title: 17-缓存依赖项以加快工作流程 - GitHub 文档@annote
date-created: 2025-03-11
date-modified: 2025-03-11
alias: ["srAnnote@缓存依赖项以加快工作流程 - GitHub 文档"]
index: 17
type: Simpread
UID: 20250311120546
---

## 缓存依赖项以加快工作流程 - GitHub 文档

> [!timeline]+ 简介
>
> > **元数据**
>
> ---
> **原文**:: [缓存依赖项以加快工作流程 - GitHub 文档](https://docs.github.com/zh/actions/writing-workflows/choosing-what-your-workflow-does/caching-dependencies-to-speed-up-workflows)
> **日期**:: [[2025-03-11]]
> **标签**:: #SimpRead
>
> > **摘要**
>
> ---
> 为了使工作流程更快、更高效，可以为依赖项及其他经常重复使用的文件创建和使用缓存。

### 笔记

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/17#id=1741665949176>)
> GitHub 托管的运行器上的 作业在干净的运行器映像中启动，每次都必须下载依赖项，导致网络利用率提高、运行时间延长和成本增加。 为帮助加快重新创建依赖项等文件，GitHub 可以缓存你在工作流中经常使用的文件。
^sran-1741665949176

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/17#id=1741667285105>)
> 要缓存作业的依赖项，可以使用 GitHub 的 [`cache` 操作](https://github.com/actions/cache)。 该操作创建和还原由唯一键标识的缓存。 或者，如果要缓存下列包管理器，则使用其各自的 setup-* 操作需要最小配置并将为你创建和还原依赖项缓存。
^sran-1741667285105
