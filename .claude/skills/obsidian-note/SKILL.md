---
name: obsidian-note
description: 使用 content/_templates 目录下的模板创建或追加 Obsidian 笔记内容
argument-hint: <笔记标题或路径>
allowed-tools: Glob,Read,Write,Edit,Bash
---

## 触发条件

当用户意图是**创建新笔记**或**追加内容到现有笔记**时使用此 skill。

### 使用示例

```
/obsidian-note 创建笔记 什么是闭包？
/obsidian-note 追加内容到 40-RESOURCES/前端性能优化.md
```

---

## 模板与目录

`content/_templates/template_{type}.md`

| content-type | 目录 |
|:---|:---|
| project | 10-PROJECTS |
| area | 20-AREAS |
| atomic | 30-ZETTELKASTEN |
| concept, sop, question, term, comparison, moc, record | 40-RESOURCES |
| article | 60-BLOGS |
| diary | 90-DIARY |

---

## 步骤

### Create（创建新笔记）

1. 读取模板 `template_{type}.md`
2. 替换占位符（tp.file.title, tp.file.creation_date 等）
3. 严格按模板结构生成内容
4. 写入文件

### Append（追加内容）

1. 读取现有笔记 + 对应模板
2. 对比差距
3. 基于模板生成内容
4. 追加到「总结」之前

---

## 规则

- **必须先读取模板**再生成内容
- **严格按模板结构**，不得自行调整章节
- **不使用模板时必须说明原因**

---

## 内容类型判断

| 用户意图 | content-type |
|:---|:---|
| "是什么？"、"什么是 XXX" | concept |
| "如何做？"、"怎样 XXX？" | question |
| "步骤"、"如何实现？" | sop |
| "XXX 和 XXX 区别" | comparison |
| "术语解释" | term |
| "领域/方向" | area |
| "项目"（目标+截止日期） | project |
| "观点/洞察" | atomic |
| "索引/入口" | moc |
| "博客文章" | article |
| "记录事件" | record |

---

## SOP / Question 定位

| 类型 | 位置 | 说明 |
|:---|:---|:---|
| SOP | Area 的「标准流程」 | 该领域有哪些标准操作流程 |
| Question | Concept 的「FAQ」 | 深化概念理解，探索开放性问题 |

---

## 常见问题

| 场景 | 处理 |
|:---|:---|
| 用户未指定类型 | 根据用户意图自动判断 |
| 模板不存在 | 返回错误，列出可用类型 |
| 追加时笔记不存在 | 提示使用 create 模式 |
| 路径包含空格 | 使用双引号包裹 |