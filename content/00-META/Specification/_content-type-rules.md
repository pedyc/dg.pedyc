---
uid: 202605201735a
title: _content-type-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-07-31
status: active
content-type: [article]
up: [["Architecture/llm-wiki-schema"]]
---

> **内容已合并到 [[Specification/_笔记类型规范]]** — 本文件作为兼容入口保留，AI 应优先读取 _笔记类型规范。

## content-type 约定

| 类型 | 目录 | aliases 前缀 | 说明 |
|------|------|-------------|------|
| atomic | `30-ZETTELKASTEN/` | 无 | 一句话洞察，陈述句观点 |
| concept | `40-RESOURCES/` | C-xxx | 概念整合，核心命题 |
| moc | `40-RESOURCES/` | MOC-xxx | 领域入口，索引集合 |
| sop | `40-RESOURCES/` | SOP-xxx | 标准流程 |
| term | `40-RESOURCES/` | T-xxx | 术语定义 |
| comparison | `40-RESOURCES/` | VS-xxx | 比较分析 |
| area | `20-AREAS/` | A-xxx | 领域定义 |
| project | `10-PROJECTS/` | P-xxx | 项目 |
| article | `60-BLOGS/` | 无 | 博客文章 |
| record | `40-RESOURCES/` | R-xxx | 事件记录 |
| question | 混合 | Q-xxx | 开放性问题 |
| diary | `90-DIARY/` | 无 | 日记 |
| roadmap | `40-RESOURCES/` | R-xxx | 线性演进路线图，版本迭代/技术发展时间线 |
| person | `40-RESOURCES/` | R-xxx | 人物生平与思想记录 |

### 前缀规则

| 前缀 | content-type | aliases 示例 |
|------|-------------|--------------|
| A- | area | `A-人工智能` |
| P- | project | `P-求职` |
| Q- | question | `Q-如何学习编程` |
| MOC- | moc | `MOC-前端知识地图` |
| SOP- | sop | `SOP-周回顾` |
| T- | term | `T-TCP` |
| C- | concept | `C-闭包` |
| VS- | comparison | `VS-React vs Vue` |
| R- | record | `R-俄乌冲突` |
| R- | roadmap | `R-Angular-版本演进`（同 record 共享 R- 前缀，语义不冲突） |
| R- | person | `R-爱因斯坦`（同 record/roadmap 共享 R- 前缀，语义不冲突） |

子主题需加父级前缀（如 `C-React-Fiber`、`T-链表-虚拟头节点`）。

> **完整细则（含内联规则、SOP-Q 关联、状态流转等）→ [[Specification/_笔记类型规范]]**
