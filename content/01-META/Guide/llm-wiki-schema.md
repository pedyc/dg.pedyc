---
uid: 202605201735
title: llm-wiki-schema
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-11-06
content-type: article
up: "[[本库指南]]"
---

## LLM Wiki Schema for 本库

本文档是 LLM 维护本知识库的作业指南，定义四条工作流：ingest、query、lint、sync。它们不是本库的日常主线——日常是存量治理（判据先行 → 固化到 Truth → 全库回填），两者的关系见 [[本库的实际运行方式]]，存量治理的操作步骤见 [[存量治理]]。

> [!note] 边界：本文件专供 llm-wiki 工作流
> 这里只讲「怎么做」。本库的架构总览（目录结构、子系统关系、粒度模型）在 [[本库子系统概述]]，两份文件**不合并**：这份随工作流演进而改，那份随架构演进而改。类型定义、字段定义、命名规则一律引用 [[真值索引]] 里的文档，本文件不复制。

> **详细规则**：本文件是索引，各工作流详细规则见子文档。
> - [[_skills-overview]] — 所有 skill 的用法总览
> - [[_anki-sync-rules]] — Anki 集成规则（哪些笔记生成卡片、卡片格式、同步工作流）
> - [[_content-type-rules]] — 已废弃（DEPRECATED），定义见 [[笔记类型规范]]
> - [[_ingest-rules]] — ingest 工作流（INBOX 有素材时启动）+ inbox review 工作流
> - [[_query-rules]] — query 工作流
> - [[_lint-rules]] — lint 工作流 + 健康检查
> - [[_sync-rules]] — sync 工作流
> - [[_wiki-index-format]] — wiki-index 索引格式规范

---

### 四层架构

| 层级 | 位置 | 负责方 | 说明 |
|------|------|--------|------|
| 原子笔记层 | `50-ZETTELCASTEN/` | 你 | 已内化的洞见（atomic），source of truth |
| Wiki | `30-RESOURCES/` | LLM | concept/moc/SOP/term/comparison/question/record/roadmap/person，由 LLM 持续维护 |
| 真值层 | `01-META/Truth/` | 你 + LLM | 判据、字段定义、命名规则的唯一来源。2026-10 起独立成层，原三层架构里没有它的位置 |
| Archive | `40-ARCHIVE/` | 你 + LLM | 过时知识、已完成项目 |

> **关键原则**：Wiki 层是 LLM 的作品，LLM 负责维护其一致性和完整性。

> [!warning] atomic 的「不修改」有条件
> 它成立的前提是判据已稳定。判据还在演进时，按旧判据写的 atomic 必须回填——2026-10 至 11 月已发生多轮（atomic 写作方法论定稿、`up` 改挂、族内重切）。把「永不修改」当绝对规则，会让旧判据的产物一直留在库里。

### 工作流的实际权重（2026-11-06 修正）

| 工作流 | 实际状态 |
|:---|:---|
| ingest | 只在 `00-INBOX/` 有素材时启动，不是日常主线。它解决「新素材怎么并入」，不解决「已有结构不对」 |
| query | 按需。回答问题时读 wiki-index → wiki 层 → atomic，不沉淀（沉淀交给新建笔记） |
| lint | 内容层检查（矛盾、孤儿、缺口）按需跑；字段与链接校验已由 `_scripts/validate_meta.py` 承担，两条线不重叠也不互相替代 |
| sync | 已停用，`wiki-sync-state.json` 停在 2026-10-23 |

日常主线不属于 llm-wiki，见 [[本库的实际运行方式]]。这里是权重声明，不是第二份定义。

### wiki-log（2026-10-28 起停用）

`01-META/Log/wiki-log.md` 冻结于 2026-10-27，**不再追加条目**。知识加工事件（ingest / inbox-review / lint / refactor）的叙事与决策理由，改记库根 `.workbuddy/memory/YYYY-MM-DD.md`。

停用的原因不是「读的人少」，而是读写两端同时断了：

- **写端**：条目由 `wiki-sync-local` 追加，该链条在 2026-10-27 后未再执行——同期有 43 篇笔记的改动、13 次备份，wiki-log 零条目。
- **读端**：没有任何工作流把「读 wiki-log」写进步骤。它在本文件里只以「记录规范」出现，是输出契约，不是输入依赖。

载体迁移后，memory 承担同一职责，且不需要维护「条目挂在自己日期下」这种骨架。

**不要在 wiki-log 里补记 10-27 之后的条目**：该文件只作考古，补记等于制造一段从未真实发生过的时间线。需要查历史时按 `AGENTS.md` 入口表走，不要通读。

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
