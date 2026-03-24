---
name: note-analyzer
description: 分析与评价笔记内容，根据知识库设计原则给出优化建议
argument-hint: [path]
allowed-tools: Glob,Read,Edit
---

## 任务

分析笔记内容，对比模板差距，输出需要补充的内容。

## 步骤

1. **读取笔记**：获取 content-type
2. **读取模板**：`content/_templates/template_{type}.md`
3. **对比差距**：找出缺少的模板章节
4. **输出**：列出需要补充的内容

## content-type 说明

| 类型 | 目录 | 模板 |
|------|------|------|
| area | 20-AREAS | template_area.md |
| concept | 40-RESOURCES | template_concept.md |
| term | 40-RESOURCES | template_term.md |
| atomic | 30-ZETTELKASTEN | template_atomic.md |
| moc | 40-RESOURCES | template_moc.md |

## 输出格式

```
## 笔记：{{文件名}}
### 类型：{{type}}
### 缺少：{{章节列表}}
### 建议：{{补充建议}}
```
