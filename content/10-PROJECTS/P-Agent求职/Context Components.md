---
title: Context Components
aliases:
  - 上下文组成
  - 上下文组成与构建流程
  - C-Context Components
date-created: 2026-10-02
date-modified: 2026-10-03
---

## Context 的基本组成

以Coding Agent 为例，可以抽象成：

```bash
Context
├── Instruction
│   ├── System Prompt
│   └── Agent / Task Instructions
│
├── Task
│   └── 当前用户任务
│
├── State
│   └── 当前任务执行状态
│
├── Tool Definition
│   └── 当前可用工具 + Schema
│
├── Tool Result
│   └── 前面工具执行产生的结果
│
├── Retrieved Context
│   ├── 相关代码
│   ├── 项目文档
│   └── RAG 检索结果
│
└── Relevant Memory
    └── 与当前任务相关的历史信息
```

> [!hint] 注意：
> **这些并不意味着每次都全部存在。**
> Runtime 会根据当前任务选择需要的信息。

## Context 组装与构建流程

> 多种信息来源 → Runtime 选择/组装（Context Builder） → Context → LLM → ToolCall → ToolResult → Context 更新。

![[../../_resources/Context Components/b357c4e770eb366366cb150186f1c698_MD5.webp]]
