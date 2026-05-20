---
name: llm-wiki-local
version: 1.0.0
description: |
  个人知识库构建系统（适配本库 PARA + Zettelkasten 三层架构）。

  **触发条件**：用户明确提到"知识库"、"wiki"，或要求执行消化/查询/健康检查等操作，
  且当前工作目录包含 `00-META/llm-wiki-schema.md`。

  本 skill 适配本库的三层架构：
  - Raw sources: `30-Zettelkasten/` (atomic)
  - Wiki 层: `40-RESOURCES/` (concept, moc, sop, term, comparison)
  - Archive: `50-ARCHIVE/`

  详细工作流定义见 `00-META/llm-wiki-schema.md`。
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - Bash
---

# llm-wiki-local — 适配本库的知识库系统

> 基于 llm-wiki-schema.md 的 LLM Wiki 工作流。适配本库的 PARA + Zettelkasten 三层架构。

## 前置检查

执行任何工作流前，先确认：

1. **检查 schema 是否存在**：
   - 尝试读取 `content/00-META/llm-wiki-schema.md`
   - 如果不存在 → 提示用户先阅读 `llm-wiki-schema.md` 了解架构

2. **确认知识库根目录**：
   - 知识库根目录 = `content/`
   - `WIKI_ROOT = {content根目录}`

3. **读取 schema**：
   - 读取 `content/00-META/llm-wiki-schema.md` 获取完整工作流定义

## 工作流路由

根据用户意图，路由到对应工作流：

| 用户意图 | 工作流 |
|---------|--------|
| "消化"、"整理"、"添加笔记" | → **ingest** |
| "查询"、"关于 XX"、"XX 是什么" | → **query** |
| "检查知识库"、"健康检查"、"lint" | → **lint** |
| "画个图谱"、"看看关联" | → **graph** |

---

## ingest 工作流

### 步骤 1：确认笔记位置

询问用户要添加的笔记类型：

- **atomic** → 保存到 `30-Zettelkasten/`
- **concept** → 保存到 `40-RESOURCES/`
- **moc** → 保存到 `40-RESOURCES/`
- **sop** → 保存到 `40-RESOURCES/`
- **term** → 保存到 `40-RESOURCES/`
- **comparison** → 保存到 `40-RESOURCES/`
- **area** → 保存到 `20-AREAS/`
- **project** → 保存到 `10-PROJECTS/`

### 步骤 2：确定文件名

根据 content-type 使用对应模板或纯标题：

- 如果用户提供了文件路径，直接使用
- 如果用户粘贴内容，询问或自动生成标题

### 步骤 3：保存原始内容

根据 content-type 保存到对应目录，文件名使用纯标题。

### 步骤 4：更新 wiki 层

如果 content-type 是 atomic：

1. **读取 schema** 中的 ingest 工作流定义
2. **更新相关 wiki 页面**（concept/moc/area）：
   - 读取 `wiki-index.md` 确定相关页面
   - 读取相关 concept/moc 页面
   - 追加新 atomic 的引用和核心观点
3. **更新索引**：在 `wiki-index.md` 中添加相关条目（如需要）
4. **记录日志**：在 `wiki-log.md` 中追加 ingest 记录

### 步骤 5：展示结果

```
已消化：{标题}

新增页面：
- {保存路径}

更新的 wiki 页面：
- {相关 concept/moc}

已更新索引：wiki-index.md
已记录日志：wiki-log.md
```

---

## query 工作流

### 步骤 1：读取 wiki-index

读取 `content/00-META/wiki-index.md` 了解知识库全貌。

### 步骤 2：搜索相关页面

1. 在 `content/` 下搜索用户查询的关键词
2. 优先读取：
   - `40-RESOURCES/` 下的 concept/moc/term/comparison
   - `20-AREAS/` 下的 area 页面
   - `30-Zettelkasten/` 下的 atomic 笔记
3. 按相关性排序，读取最相关的 3-5 个页面

### 步骤 3：综合回答

- 按 `WIKI_LANG` 用对应语言回答
- 标注信息来源（用 `[[页面名]]` 格式）
- 如果多个页面有不同观点，分别列出并标注来源

### 步骤 4：判断是否值得持久化

如果回答包含 3 个及以上来源的综合分析，提示用户是否保存到 wiki。

---

## lint 工作流

### 步骤 1：执行 schema 中的检查清单

按 `content/00-META/llm-wiki-schema.md` 中的 lint 工作流执行：

1. **矛盾检测**：搜索同一主题的多个页面，检查是否有矛盾
2. **孤儿页面**：检查没有 inbound link 的 concept/moc/area
3. **概念缺口**：扫描被多次提及但无专属页面的概念
4. **过时断言**：检查 status=archived 的笔记对应的 wiki 页面
5. **索引一致性**：检查 `wiki-index.md` 与实际页面是否一致

### 步骤 2：输出报告

```
知识库健康检查报告

检查范围：{N} 页

矛盾：
- [[页面A]] vs [[页面B]]: {矛盾描述}

孤儿页面：
- [[页面C]]：建议补充引用或归档

概念缺口：
- "{概念}" 被提及 N 次但无专属页面

过时断言：
- [[页面D]] 中的 {断言} 已被 [[新笔记]] supersede

索引不一致：
- {问题描述}
```

---

## graph 工作流

### 步骤 1：扫描双向链接

遍历 `content/` 下所有 `.md` 文件，提取 `[[链接]]` 语法，建立关系列表。

### 步骤 2：生成图谱

生成 Mermaid 格式的知识图谱，展示页面间的链接关系。

### 步骤 3：输出

```
知识图谱已生成！

共 {N} 个节点，{M} 条关联

查看方式：
- 在 Obsidian 中用 Graph View 查看
- 或用 VS Code Markdown Preview Enhanced 渲染 Mermaid
```
