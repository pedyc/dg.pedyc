---
uid: 202605201735
title: llm-wiki-schema
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-06-12
status: active
content-type: [article]
up: "[[Guide/本库指南]]"
---

## LLM Wiki Schema for 本库

本文档是 LLM 维护本知识库的作业指南。LLM 根据此 schema 消化 (ingest) 新笔记、回答查询 (query)、以及定期检查 (lint) 知识库健康度。

> **详细规则**：本文件是索引，各工作流详细规则见子文档。
> - [[Specification/_skills-overview]] — 所有 skill 的用法总览
> - [[Specification/_content-type-rules]] — content-type 定义、前缀规则、Wiki 层内联规则
> - [[Specification/_ingest-rules]] — ingest 工作流 + inbox review 工作流
> - [[Specification/_query-rules]] — query 工作流
> - [[Specification/_lint-rules]] — lint 工作流 + 健康检查
> - [[Specification/_sync-rules]] — sync 工作流

---

### 三层架构

| 层级 | 位置 | 负责方 | 说明 |
|------|------|--------|------|
| Raw sources | `30-ZETTELKASTEN/` | 你 | 原始 atomic 笔记，不修改 |
| Wiki | `40-RESOURCES/` | LLM | concept/moc/SOP/term/comparison，由 LLM 持续维护 |
| Archive | `50-ARCHIVE/` | 你 + LLM | 过时知识、已完成项目 |

> **关键原则**：atomic 是 source of truth，永不修改。Wiki 层是 LLM 的作品，LLM 负责维护其一致性和完整性。

### wiki-log 记录规范

**目的**：wiki-log 是 append-only 时间线，记录**知识加工事件**，不是系统操作日志。

**应记录的操作类型**：

| 操作 | 说明 | 示例 |
|------|------|------|
| `ingest` | 新笔记整合到 wiki 层 | `ingest | 新增 concept「闭包」` |
| `inbox-review` | Inbox 审核结果 | `inbox-review | 移动 4 个文章到 BLOGS` |
| `lint` | 健康检查结果 | `lint | full 健康检查，矛盾 0 个` |
| `query` | 有价值的查询结果 | `query | 关于闭包的回答，产生新洞见` |
| `refactor` | 系统重构（skill/spec/规则变更） | `refactor | skill 分层重构，obsidian-note-local v2.1.0` |

**不应记录的操作**：
- `sync` — 系统状态同步（系统维护）
- `update` — 常规文件编辑（系统维护）
- `create` — 笔记创建（应归入 ingest）

---

### 工具支持

- **Obsidian Web Clipper**：采集网页为 markdown 到 raw sources
- **Graph View**：可视化 wiki 结构，识别 hub 和孤儿
- **Dataview**：查询 frontmatter 找特定条件的页面
- **qmd**：wiki 规模扩大后用做本地搜索（BM25 + vector + LLM rerank）

---

### 协作约定

- **你**负责：采集来源、提出问题、判断价值、审核 LLM 输出
- **LLM**负责：所有 bookkeeping——写入、更新、交叉引用、维护索引和日志
- **冲突解决**：你有最终决定权。LLM 标记矛盾，由你判断保留哪个
