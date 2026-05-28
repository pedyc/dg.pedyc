---
uid: 202605201735
title: llm-wiki-schema
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-05-27
status: active
content-type: [article]
up: "[[本库指南]]"
---

## LLM Wiki Schema for 本库

本文档是 LLM 维护本知识库的作业指南。LLM 根据此 schema 消化 (ingest) 新笔记、回答查询 (query)、以及定期检查 (lint) 知识库健康度。

### 三层架构

| 层级          | 位置                 | 负责方     | 说明                                                 |
| ----------- | ------------------ | ------- | -------------------------------------------------- |
| Raw sources | `30-ZETTELKASTEN/` | 你       | 原始 atomic 笔记，不修改                                   |
| Wiki        | `40-RESOURCES/`    | LLM     | concept / moc / SOP / term / comparison，由 LLM 持续维护 |
| Archive     | `50-ARCHIVE/`      | 你 + LLM | 过时知识、已完成项目                                         |

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

**不应记录的操作**：
- `sync` — 系统状态同步（系统维护）
- `update` — 常规文件编辑（系统维护）
- `create` — 笔记创建（应归入 ingest）

### content-type 约定

```bash
atomic      → 30-ZETTELKASTEN/  一句话洞察，aliases 无前缀
concept     → 40-RESOURCES/      概念整合，aliases: C-xxx
moc         → 40-RESOURCES/      领域入口，aliases: MOC-xxx
sop         → 40-RESOURCES/      标准流程，aliases: SOP-xxx
term        → 40-RESOURCES/      术语定义，aliases: T-xxx
comparison  → 40-RESOURCES/      比较分析，aliases: VS-xxx
area        → 20-AREAS/          领域定义，aliases: A-xxx
project     → 10-PROJECTS/       项目，aliases: P-xxx
article     → 60-BLOGS/           博客文章
record      → 40-RESOURCES/      事件记录，aliases: R-xxx
```

### 前缀规则（aliases）

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

## Inbox Review 工作流

当你要求 " 审核 Inbox" 时，执行以下步骤：

### 步骤 1：列出 Inbox 内容

扫描 `40-RESOURCES/Inbox/` 目录，获取所有待审核文件。

### 步骤 2：逐个判断类型

读取文件 front matter，分析以下特征：

| content-type | 特征 | 目标目录 |
|--------------|------|----------|
| article | 有 source、author、published=true | 60-BLOGS/ |
| concept | 知识整合、核心命题、多概念关联 | 40-RESOURCES/ |
| atomic | 一句话洞察、陈述句（如 "X 的本质是 Y"） | 30-Zettelkasten/ |
| term | 术语定义、" 什么是 X" | 40-RESOURCES/ (aliases: T-xxx) |
| moc | 索引性质、链接集合 | 40-RESOURCES/ (aliases: MOC-xxx) |

### 步骤 3：移动文件

使用 git mv 保持历史：

```bash
git mv "40-RESOURCES/Inbox/xxx.md" "目标目录/xxx.md"
```

### 步骤 4：更新 front matter

根据目标目录补充/修改 front matter：
- 添加 `aliases` 前缀（如 C-xxx）
- 确保 `content-type` 正确
- 移除 `source` 字段（如果是摘录，保留作为 reference）

### 步骤 5：记录日志

追加到 `wiki-log.md`：

```markdown
- [日期] inbox-review | 文件名
  - 原类型：xxx → 新类型：xxx
  - 移动：Inbox → 目标目录
```

---

## Ingest 工作流

当你添加新笔记时，执行以下步骤：

### 步骤 1：读取新笔记

读取 `30-ZETTELKASTEN/` 下新创建的 atomic 笔记。理解其核心观点和涉及的领域。

### 步骤 2：确定相关页面

根据笔记主题，检查 `wiki-index.md` 确定需要更新的 concept / moc / area 页面。典型场景：

- 新 atomic 补充现有 concept → 更新该 concept
- 新 atomic 引入新主题 → 建议创建新 concept
- 新 atomic 关联多个 area → 建议更新多个 area

### 步骤 3：更新 Wiki

对每个受影响的 wiki 页面执行：

1. **读取** 现有页面内容
2. **分析** 新 atomic 与现有内容的关系（补充、强化、矛盾？）
3. **修改** 页面，更新知识图谱、补充交叉引用、标注矛盾（如有）
4. **保持** 现有 atomic 内容不变（不合并，只引用）

### 步骤 4：更新索引

- 读取 `wiki-index.md`
- 如果创建了新 concept/moc/area，在对应分类下添加条目
- 如果删除了页面，从索引中移除

### 步骤 5：记录日志

追加条目到 `wiki-log.md`：

```markdown
## [2026-05-20] ingest | 笔记标题
- 主题：xxx
- 更新的页面：[[页面名]]
- 新建页面：[[页面名]]
```

---

## Query 工作流

当你回答问题时，执行以下步骤：

### 步骤 1：查索引

读取 `wiki-index.md`，根据问题领域找到相关的 concept/moc/area。

### 步骤 2：读 Wiki 层

读取相关 concept/moc 页面，获取该领域的整合视图和交叉引用。

### 步骤 3：深入 Raw Sources

如需更多细节，再进入 `30-ZETTELKASTEN/` 读具体 atomic 笔记。

### 步骤 4：合成回答

综合 wiki 层和 atomic 层的信息，给出有结构的回答。引用时标注来源：

- Wiki 层引用：`[[C-闭包]]`
- Atomic 层引用：`[[变量提升的本质是...]]`

### 步骤 5：归档有价值结论

如果回答中产生了新的洞见、对比、或综合：

- **值得整合** → 更新相关 concept/moc 页面
- **值得记录** → 建议创建新 atomic 或 concept

---

## Wiki 层内联规则

Wiki 层（`40-RESOURCES/`）包含多种 content-type，除 atomic 外的其他类型也需要遵循特定的引用和整合规则。

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

> **说明**：以上类型除 atomic 外都是 wiki 内部类型，它们的「ingest」是指被正确引用到 wiki-index 和相关 area/concept，而不是像 atomic 一样需要从外部消化。

---

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

---

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

---

### Comparison（比较分析）

**定位**：被相关概念引用，出现在 wiki-index Comparisons 章节

**特征**：aliases 前缀 `VS-xxx`，目录 `40-RESOURCES/`

**内联规则**：
- Comparison 创建后，在 `wiki-index.md` 的 Comparisons 章节添加条目
- 如比较 "A vs B"，在 A 和 B 的 concept 页面的「并列概念」或「关键区别」中添加引用
- 在 wiki-index 相关分类下添加条目（如框架对比出现在「框架对比」小节）

**典型结构**：

```markdown
## 关键区别

| 维度 | [[A]] | [[B]] |
|:--- |:--- |:--- |
| ... | ... | ... |
```

---

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

---

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

---

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

---

### Diay（日记）

**定位**：source of truth，不需要 ingest 到 wiki 层

**特征**：目录 `90-DIARY/`

**说明**：diary 是时间序列记录，wiki-index 不收录，由用户自行查阅。

---

## Lint 工作流

定期检查知识库健康度。执行频率：每周一次或每新增 10+ 篇笔记后。

---

## Sync 工作流

当笔记发生创建、修改、删除时，被动触发同步到 Wiki 层。

### 职责边界

**Sync 只负责系统文件维护**，不处理 content 变更：
- 更新 `wiki-sync-state.json`
- **不记录 wiki-log**（这是系统维护，不是知识加工）
- 维护 `wiki-index.md`（仅系统条目）

**Content 变更由 ingest 工作流处理**：sync 检测到变更后，由 ingest 工作流决定如何整合并记录到 wiki-log。

### 触发条件

- 用户或 LLM 创建了新笔记
- 用户或 LLM 修改了现有笔记
- 用户或 LLM 删除了笔记
- 手动调用 `/wiki-sync-local` 时，通过 git diff 自动检测所有变更（无需手动告知）

### 状态文件

同步状态记录在 `content/00-META/wiki-sync-state.json`：

```json
{
  "lastCommit": "a74391a2",
  "lastSyncTime": "2026-05-26T11:00:00Z"
}
```

**重要**：sync 完成后会主动 commit 状态文件的变更（`git add` + `git commit`），确保 lastCommit 立即更新，不再依赖外部 vault backup。

### 同步规则（简化版）

| 操作 | Sync 处理 | Ingest 处理 |
|------|----------|-------------|
| 新增笔记 | 记录到日志 | 整合到 wiki 层 |
| 修改笔记 | 记录到日志 | 更新 wiki 引用 |
| 删除笔记 | 记录到日志 | 从 wiki 移除引用 |

**原则**：sync 检测变更、记录事件；ingest 分析内容、执行整合。

### 工作流程（简化版）

#### 自动检测 Git 变更

1. 读取 `wiki-sync-state.json` 获取 `lastCommit`
2. 执行 `git diff <lastCommit>..HEAD --name-status` 获取变更文件
3. 过滤 `content/` 下 `.md` 文件（排除系统文件和 Inbox）
4. 根据 git status（A/M/D）确定操作类型
5. **不记录 wiki-log**（变更检测是系统维护，不属于知识加工事件）
6. 更新 `wiki-sync-state.json` 为当前 HEAD commit
7. 主动 commit 状态变更

#### 手动指定笔记（如需要）

- **create/update/delete**：只记录到日志，不处理 content
- 具体 content 处理由 ingest 工作流负责

---

### 检查清单

#### 1. 矛盾检测

- 搜索同一主题的多个 atomic 和 concept
- 标记相互矛盾的断言
- 在矛盾页面添加注解，注明分歧

#### 2. 孤儿页面

- 检查没有 inbound link 的 concept/moc/area
- 对孤儿页面：
	- 如有价值但缺少引用 → 补充相关页面的引用
	- 如已过时 → 移动到 `50-ARCHIVE/`
	- 如无价值 → 询问是否删除

#### 3. 概念缺口

- 扫描 atomic 中被多次提及但无专属页面的概念
- 建议创建新 concept 或补充现有 concept

#### 4. 过时断言

- 检查 status=archived 的笔记对应的 wiki 页面
- 标记被新知识 supersede 的断言

#### 5. 索引一致性

- 检查 `wiki-index.md` 是否与实际页面一致
- 检查 `wiki-log.md` 是否有遗漏的 ingest 记录

### Lint 输出格式

```markdown
## Lint Report - [日期]

### 矛盾
- [[页面A]] vs [[页面B]]: xxx

### 孤儿页面
- [[页面C]]: 无 inbound link，建议补充引用或归档

### 概念缺口
- "XXX" 被提及 5 次但无专属页面，建议创建 [[C-XXX]]

### 过时断言
- [[页面D]] 中的 xxx 已被 [[新笔记]] supersede
```

### 主动健康检查（定时任务）

每周自动执行一次健康检查，确保知识库保持健康状态。

**Cron 表达式**：`0 9 * * 1`（每周一 09:00）

**执行内容**：
1. 调用 `/content-evaluator-local full`
2. 检查结果追加到 `wiki-log.md`
3. 如发现问题，标记到日志并发出预警

**预警条件**：
- 矛盾 > 3 个
- 孤儿页面 > 5 个
- 概念缺口 > 5 个

**日志格式**：

```markdown
## Lint Report - [日期]

### 发现问题
- 矛盾：X 个
- 孤儿页面：Y 个
- 概念缺口：Z 个

### 建议
- [[页面A]]: xxx
```

---

## 工具支持

- **Obsidian Web Clipper**：采集网页为 markdown 到 raw sources
- **Graph View**：可视化 wiki 结构，识别 hub 和孤儿
- **Dataview**：查询 frontmatter 找特定条件的页面
- **qmd**：wiki 规模扩大后用做本地搜索（BM25 + vector + LLM rerank）

---

## 协作约定

- **你**负责：采集来源、提出问题、判断价值、审核 LLM 输出
- **LLM**负责：所有 bookkeeping——写入、更新、交叉引用、维护索引和日志
- **冲突解决**：你有最终决定权。LLM 标记矛盾，由你判断保留哪个
