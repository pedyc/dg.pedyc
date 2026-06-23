---
uid: 202606121400
title: _skills-overview
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-06-12
date-modified: 2026-06-23
status: active
content-type: article
up: [["llm-wiki-schema"]]
---

## Skills 概览

本库 6 个本地 skill，按 PARA 分层组织，职责互不重叠。

### 三层架构

| 层 | Skill | 版本 | 职责 | 操作范围 |
|---|---|---|---|---|
| **创建层** | `obsidian-note-local` | v2.1.0 | 模板创建 + 挂载到父页面 | 内容页 + 父页面引用 |
| **元数据层** | `wiki-sync-local` | v3.0.0 | 维护索引、日志、同步状态 | 仅 `00-META/` |
| | `content-evaluator-local` | v1.0.0 | 健康检查（lint） | 全库只读 |
| | `content-verifier-local` | v1.0.0 | 内容质量核查 | 指定笔记 |
| **内容层** | `llm-wiki-local` | v1.0.0 | ingest / query / lint / graph | 内容页 |
| | `action-suggest` | v1.0.0 | 基于状态生成行动建议 | 全库只读 |

### 调用流程

```mermaid
flowchart LR
    A[/obsidian-note-local/] --> B[/wiki-sync-local/]
    B --> C[/llm-wiki-local ingest/]
    C --> D[/content-verifier-local/]
    D --> E[/content-evaluator-local/]
```

```bash
创建笔记 → 更新索引和日志 → 内容整合 → 质量核查 → 定期健康检查
```

### 各 skill 详解

#### obsidian-note-local

**用途**：创建新笔记，自动挂载到父页面。

```bash
/obsidian-note-local moc "Angular面试题"
/obsidian-note-local concept "闭包"
/obsidian-note-local atomic "变量提升的本质是变量对象在创建阶段的初始化"
```

**做了什么**：
1. 按 content-type 读取对应模板
2. 生成 frontmatter（uid、aliases、日期等）
3. 写入对应目录
4. 读取 `up` 字段，在父页面中追加引用

**不做什么**：不碰 wiki-index、wiki-log、sync-state。

---

#### wiki-sync-local

**用途**：维护系统元数据层。手动触发（创建/删除笔记后）或自动触发（会话启动时检测 git 变更）。

**手动模式**：

```bash
/wiki-sync-local create "40-RESOURCES/MOC-Angular面试题.md"
/wiki-sync-local delete "40-RESOURCES/某页面.md"
```

**做了什么**：
1. 更新 `wiki-index.md`（添加/移除条目）
2. 记录 `wiki-log.md`
3. 更新 `wiki-sync-state.json`
4. git commit 状态文件

**不做什么**：不修改任何内容页。

---

#### llm-wiki-local

**用途**：知识库内容工作流。四个子路由：

| 路由 | 触发词 | 职责 |
|---|---|---|
| ingest | 消化、整理、添加笔记 | 将 atomic 整合到 wiki 层 concept/moc |
| query | 查询、关于 XX | 基于知识库回答问题 |
| lint | 检查知识库、健康检查 | 执行健康度检查（委托 content-evaluator） |
| graph | 图谱、关联 | 分析知识网络结构 |

```bash
/llm-wiki ingest "消化新的 atomic 笔记"
/llm-wiki query "闭包是什么？"
/llm-wiki lint full
/llm-wiki graph
```

---

#### content-evaluator-local

**用途**：执行 `_lint-rules.md` 定义的健康检查。

```bash
/content-evaluator-local full
/content-evaluator-local light
```

**检查维度**：
- 矛盾检测
- 孤儿页面
- 概念缺口
- 过时断言
- 索引一致性

---

#### content-verifier-local

**用途**：逐层核查单篇笔记质量。

```bash
/content-verifier-local "40-RESOURCES/闭包.md"
```

**检查维度**（由浅到深）：
1. 模板完整 — frontmatter、章节结构
2. 知识网络 — 引用是否正确、双向链接
3. 逻辑正确 — 断言是否准确
4. 内容覆盖 — 是否有明显缺口

---

#### action-suggest

**用途**：基于知识库状态，推荐下一步行动。

```bash
/action-suggest
/action-suggest light
```

---

### 相关文档

- `llm-wiki-schema.md` — 知识库工作流整体架构
- `_ingest-rules.md` — ingest 工作流详细规则
- `_lint-rules.md` — lint 工作流 + 分析脚本
- `_content-type-rules.md` — content-type 定义和前缀规则
- `_query-rules.md` — query 工作流
- `_sync-rules.md` — sync 工作流
