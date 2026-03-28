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

## 模板位置

`content/_templates/template_{type}.md`

## content-type 与目录对应

| content-type | 目录 |
|--------------|------|
| `project` | 10-PROJECTS |
| `area` | 20-AREAS |
| `moc` | 40-RESOURCES |
| `diary` | 90-DIARY |
| `article` | 60-BLOGS |
| `atomic` | 30-ZETTELKASTEN |
| `concept` | 40-RESOURCES |
| `sop` | 40-RESOURCES |
| `question` | 40-RESOURCES |
| `term` | 40-RESOURCES |
| `comparison` | 40-RESOURCES |
| `record` | 40-RESOURCES |

## Area 模板结构（简化版）

Area 模板已简化为以下核心章节：

| 章节 | 说明 |
|:---|:---|
| 领域定义 | 核心范畴、不包括、区别于相关领域 |
| 长期目标 | 愿景 + 里程碑 |
| 关键领域 | 核心知识主题（链接概念笔记） |
| FAQ | 常见问题（链接 Question 或 MOC） |
| 领域健康度 | 目标进展、认知更新、行动频率 |

**已移除**：核心心智模型、执行系统、知识网络、探索前沿、复盘

## 步骤

### Create（创建新笔记）

1. **根据 content-type 确定存放目录**
2. **读取模板**（content/_templates/template_{type}.md）
3. 替换占位符（tp.file.title, tp.file.creation_date 等）
4. **严格按模板结构生成内容**
5. 写入新文件

### Append（追加内容）

1. 读取现有笔记
2. 读取对应模板
3. 对比差距
4. 基于模板生成内容
5. 追加到笔记

## 重要规则

- **必须先读取模板再生成内容**
- **严格基于模板结构**，不得自行调整章节
- **不使用模板时必须说明原因**
- 追加内容放在"总结"之前

## 内容类型判断

当用户提出一个话题/问题/主题时，根据语义判断应使用的模板：

| 用户意图 | content-type | 判断依据 |
|:---|:---|:---|
| "是什么？"、"什么是 XXX"、"概念" | concept | 询问定义、原理、机制 |
| "如何做？"、"怎样 XXX？"、"方法" | question | 询问解决方法、策略 |
| "如何实现？"、"步骤" | sop | 询问标准操作流程 |
| "XXX 和 XXX 区别" | comparison | 询问对比 |
| "术语解释" | term | 询问术语定义 |
| "记录事件" | record | 描述事件、时间线 |
| "项目" | project | 明确的项目目标+截止日期 |
| "领域/方向" | area | 长期关注的范围 |
| "索引/入口" | moc | 需要整合多个笔记 |
| "观点/洞察" | atomic | 陈述句观点，一句话洞见 |
| "博客文章" | article | 正式的长文输出 |

## 常见问题处理

| 问题场景 | 处理方式 |
|:---|:---|
| 用户未指定笔记类型 | 根据用户意图（"是什么""如何做"等）自动判断 |
| 模板不存在 | 返回错误，提示可用的模板类型 |
| 追加时笔记不存在 | 提示用户使用 create 模式 |
| 路径包含空格 | 使用双引号包裹路径 |
