---
uid: 202605201735b
title: _ingest-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-08-16
status: active
content-type: article
up: [["llm-wiki-schema"]]
---

## Ingest 工作流

当你添加新笔记时，执行以下步骤：

### 步骤 1：读取新笔记

读取 `50-ZETTELCASTEN/` 下新创建的 atomic 笔记。理解其核心观点和涉及的领域。

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

### 步骤 6：归档原始素材

消化完成后，将 Inbox 中的原始素材移动到 `40-ARCHIVE/`：

```bash
git mv "30-RESOURCES/Inbox/源文件名.md" "40-ARCHIVE/"
```

> **原则**：已消化的原始素材不再保留在 Inbox 中，避免重复处理。之后如需查阅原文，通过消化笔记中的 `参考来源` 章节追溯。

### 补充：外部文章消化与 atomic 的分工

「消化 Inbox 外部文章」与「整合你的 atomic 笔记」是两条不同的路径，别混为一谈：

- **外部文章 → Wiki 层**：文章的客观事实、机制、对比应收敛为 term/concept/comparison/sop，这是 LLM 的职责，**不要求经过 atomic**。
- **你的洞察 → atomic**：atomic 是「你」的独立陈述句观点（`50-ZETTELCASTEN/`），负责方是你本人，LLM 无法替你内化。

**收尾判断**：每次消化外部文章后，问一句「这篇文章有没有一句我想长期持有的话？」——有则提炼为 atomic 写进 `50-ZETTELCASTEN/`，并在对应 concept 的「核心命题」或 comparison 的「知识图谱」中挂载引用；无则到此为止。atomic 不是外部知识的必经中转站，而是你自己洞见的家。

---

## Inbox Review 工作流

当你要求 " 审核 Inbox" 时，执行以下步骤：

### 步骤 1：列出 Inbox 内容

扫描 `30-RESOURCES/Inbox/` 目录，获取所有待审核文件。

### 步骤 2：逐个判断类型

读取文件 front matter，分析以下特征：

| content-type | 特征 | 目标目录 |
|--------------|------|----------|
| article | 有 source、author、published=true | 60-BLOGS/ |
| concept | 知识整合、核心命题、多概念关联 | 30-RESOURCES/ |
| atomic | 一句话洞察、陈述句（如 "X 的本质是 Y"） | 50-ZETTELCASTEN/ |
| term | 术语定义、" 什么是 X" | 30-RESOURCES/ (aliases: T-xxx) |
| moc | 索引性质、链接集合 | 30-RESOURCES/ (aliases: MOC-xxx) |

### 步骤 3：移动文件

使用 git mv 保持历史：

```bash
git mv "30-RESOURCES/Inbox/xxx.md" "目标目录/xxx.md"
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
