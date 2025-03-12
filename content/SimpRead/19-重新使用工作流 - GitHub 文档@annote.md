---
title: 19-重新使用工作流 - GitHub 文档@annote
date-created: 2025-03-11
date-modified: 2025-03-11
alias: ["srAnnote@重新使用工作流 - GitHub 文档"]
index: 19
type: Simpread
UID: 20250311220118
---

## 重新使用工作流 - GitHub 文档

> [!timeline]+ 简介
>
> > **元数据**
>
> ---
> **原文**:: [重新使用工作流 - GitHub 文档](https://docs.github.com/zh/actions/sharing-automations/reusing-workflows#next-steps)
> **日期**:: [[2025-03-11]]
> **标签**:: #SimpRead
>
> > **摘要**
>
> ---
> 了解如何通过重用现有工作流程来避免在创建工作流程时重复。

### 笔记

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/19#id=1741701678621>)
> 使用其他工作流程的工作流程称为 " 调用方 " 工作流程。 可重用工作流程是 " 被调用 " 工作流程。 一个调用方工作流程可以使用多个被调用的工作流程。 每个被调用的工作流程都在一行中引用。 结果是，调用方工作流程文件可能只包含几行 YAML，但在运行时可能会执行大量任务。 当您重用工作流程时，将使用整个被调用的工作流程，就像它是调用方工作流程的一部分一样。
^sran-1741701678621
