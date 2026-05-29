---
uid: 202605201735a
title: _content-type-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-05-28
status: active
content-type: [article]
up: [["Architecture/llm-wiki-schema"]]
---

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

子主题需加父级前缀（如 `C-React-Fiber`、`T-链表-虚拟头节点`）。

---

## Wiki 层内联规则

Wiki 层（`40-RESOURCES/`）除 atomic 外的其他类型也需要遵循特定的引用和整合规则。

### content-type 定位速查

| content-type | 目录 | 父级引用 | wiki-index 位置 | 是否需要 ingest |
|-------------|------|---------|----------------|----------------|
| atomic | 30-ZETTELKASTEN/ | concept | — | ✅ atomic → concept |
| concept | 40-RESOURCES/ | area | Concepts 章节 | ❌ wiki 内部类型 |
| sop | 40-RESOURCES/ | area/concept | SOPs 章节 | ❌ wiki 内部类型 |
| term | 40-RESOURCES/ | concept | Terms 章节 | ❌ wiki 内部类型 |
| comparison | 40-RESOURCES/ | 相关 concept | Comparisons 章节 | ❌ wiki 内部类型 |
| record | 40-RESOURCES/ | 时政/政治经济 area | Records 章节 | ❌ wiki 内部类型 |
| moc | 40-RESOURCES/ | area | MOCs 章节 | ❌ wiki 内部类型 |
| question | 混合 | area/moc | 关联 area 的 FAQ | ❌ wiki 内部类型 |
| diary | 90-DIARY/ | — | — | ❌ 不需要 ingest |

### SOP（标准流程）

**定位**：被 area/concept 引用，不独立存在

**特征**：aliases 前缀 `SOP-`，目录 `40-RESOURCES/`

**内联规则**：
- SOP 创建后，在 `wiki-index.md` 的 SOPs 章节添加条目
- 如 SOP 属于某 area，在该 area 页面的 SOPs 小节添加链接
- 如 SOP 与某 concept 相关，在该 concept 的知识图谱中添加引用

**典型结构**：

```markdown
## 知识图谱

- **相关 SOP**：
  - [[SOP-XXX使用流程]]
```

### Term（术语）

**定位**：被 concept 引用，是概念的组成部分

**特征**：aliases 前缀 `T-`，目录 `40-RESOURCES/`

**内联规则**：
- Term 创建后，在 `wiki-index.md` 的 Terms 章节添加条目
- Term 被某 concept 引用时，在该 concept 的知识图谱中添加「相关术语」条目
- Term 不需要独立维护，随所属 concept 一起更新

**典型结构**：

```markdown
## 知识图谱

- **相关术语**：
  - [[T-XXX]] — 术语说明
```

### Comparison（比较分析）

**定位**：被相关概念引用，出现在 wiki-index Comparisons 章节

**特征**：aliases 前缀 `VS-xxx`，目录 `40-RESOURCES/`

**内联规则**：
- Comparison 创建后，在 `wiki-index.md` 的 Comparisons 章节添加条目
- 如比较 "A vs B"，在 A 和 B 的 concept 页面的「并列概念」或「关键区别」中添加引用

**典型结构**：

```markdown
## 关键区别

| 维度 | [[A]] | [[B]] |
|:--- |:--- |:--- |
| ... | ... | ... |
```

### Record（事件记录）

**定位**：被时政/政治经济领域引用

**特征**：aliases 前缀 `R-xxx`，目录 `40-RESOURCES/`

**内联规则**：
- Record 创建后，在 `wiki-index.md` 的 Records 章节添加条目
- 在时政/政治经济 area 页面添加引用
- Record 保持时间线结构，作为事件溯源

**典型结构**：

```markdown
## 事件时间线

- [日期] 事件描述
```

### Question（开放性问题）

**定位**：被 area/moc 引用，与 SOP 互补

**特征**：aliases 前缀 `Q-xxx`，目录混合（30/40）

**内联规则**：
- Question 创建后，在相关 area 或 moc 页面的 FAQ 小节添加条目
- Question 与 SOP 的区别：SOP 是标准流程（已验证），Q 是开放性问题（待探索）
- Q 不需要有最终答案，保持「待探索」状态

**典型结构**：

```markdown
## FAQ

> **待探索**：[[Q-XXX]] — 问题描述
```

### MOC（领域入口）

**定位**：area 的子级索引，串联同领域多个 concept/sop

**特征**：aliases 前缀 `MOC-xxx`，目录 `40-RESOURCES/` 或 `20-AREAS/`

**内联规则**：
- MOC 作为 area 的入口，在 area 页面添加引用
- MOC 内部链接到同领域 concept/sop/term
- MOC 本身不消化 atomic，只做索引

**典型结构**：

```markdown
## 核心原则

- [[C-XXX]] — 概念说明

## 链接集合

- [[SOP-XXX]]
- [[T-XXX]]
```

### Diay（日记）

**定位**：source of truth，不需要 ingest 到 wiki 层

**特征**：目录 `90-DIARY/`

**说明**：diary 是时间序列记录，wiki-index 不收录，由用户自行查阅。
