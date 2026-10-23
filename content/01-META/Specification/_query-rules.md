---
uid: 202605201735c
title: _query-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-07-17
status: active
content-type: article
up: [["llm-wiki-schema"]]
---

## Query 工作流

当你回答问题时，执行以下步骤：

### 步骤 1：查索引

读取 `wiki-index.md`，根据问题领域找到相关的 concept/moc/area。

### 步骤 2：读 Wiki 层

读取相关 concept/moc 页面，获取该领域的整合视图和交叉引用。

### 步骤 3：深入 Raw Sources

如需更多细节，再进入 `50-ZETTELCASTEN/` 读具体 atomic 笔记。

### 步骤 4：合成回答

综合 wiki 层和 atomic 层的信息，给出有结构的回答。引用时标注来源：

- Wiki 层引用：`[[C-闭包]]`
- Atomic 层引用：`[[变量提升的本质是...]]`

### 步骤 5：沉淀有价值结论（query 只读，写入交给 ingest）

如果回答中产生了新的洞见、对比、或综合，query 本身不写库，只标记建议：

- **值得整合** → 建议更新相关 concept/moc 页面（交由 ingest / obsidian-note 执行）
- **值得记录** → 建议创建新 atomic 或 concept
