---
uid: 202605201735b
title: _ingest-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-08-16
content-type: article
up: "[[llm-wiki-schema]]"
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
git mv "00-INBOX/源文件名.md" "40-ARCHIVE/"
```

> **原则**：已消化的原始素材不再保留在 Inbox 中，避免重复处理。之后如需查阅原文，通过消化笔记中的 `参考来源` 章节追溯。

### 补充：外部文章消化与 atomic 的分工

「消化 Inbox 外部文章」与「整合你的 atomic 笔记」是两条不同的路径，别混为一谈：

- **外部文章 → Wiki 层**：文章的客观事实、机制、对比应收敛为 term/concept/comparison/sop，这是 LLM 的职责，**不要求经过 atomic**。
- **你的洞察 → atomic**：atomic 是「你」的独立陈述句观点（`50-ZETTELCASTEN/`），负责方是你本人，LLM 无法替你内化。

**收尾判断**：每次消化外部文章后，问一句「这篇文章有没有一句我想长期持有的话？」——有则提炼为 atomic 写进 `50-ZETTELCASTEN/`，并在对应 concept 的「核心命题」或 comparison 的「知识图谱」中挂载引用；无则到此为止。atomic 不是外部知识的必经中转站，而是你自己洞见的家。

---

## Inbox Review 工作流

当你要求「审核 Inbox」时，执行以下步骤。

### 步骤 1：列出 Inbox 内容

扫描 `00-INBOX/`，取得全部待审核文件。Inbox 只有一层，不处理子目录。

### 步骤 2：判断形态

形态的定义、判据、易混类型的辨析只有一处真值：[[笔记类型规范]]。复核时打开它对照，不要凭印象，也不要在本文件里另抄一份。

需要看的三节：

- `content-type 总览` —— 14 种取值与各自的一句话定位
- `各类型定位` —— 每种形态是什么、不是什么
- `类型辨析（判断标准）` —— atomic / concept / term、area / concept / moc、sop / question 的分界

剪藏素材最容易误判成 `article`：带 `author` / `source` / `published` 不等于「自己的文章」，那些是 Web Clipper 的字段。判形态看内容归属，对照 `各类型定位` 里 `record` 与 `article` 两节。

### 步骤 3：决定归属

归属与形态是两个正交维度，互不推导。判归属只看「这篇东西归谁负责」，顺序见 [[本库目录结构]] 的 `归属判定顺序`。

形态**不决定**目录——不存在「concept 就放 30-RESOURCES」这类映射。

### 步骤 4：更新 front matter

按 [[元数据规范]] 补齐字段。`content-type` 必须是标量字符串，写成数组会让 `.base` 的 `content-type == "x"` 静默失效。

### 步骤 5：移动文件

用 `git mv` 保留历史。移动后原路径的链接会自动解析到新位置——Obsidian 按文件名解析，不按路径。

### 步骤 6：记录日志

格式见 [[llm-wiki-schema]] 的 `wiki-log 记录规范`：

```markdown
- [日期] inbox-review | 文件名
	- 原类型：xxx → 新类型：xxx
	- 移动：Inbox → 目标目录
```
