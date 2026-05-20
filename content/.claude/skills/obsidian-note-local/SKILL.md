---
name: obsidian-note-local
version: 1.0.0
description: |
  使用 `content/_templates` 目录下的模板创建或追加 Obsidian 笔记内容。
  适配本库的 content-type 体系和 aliases 前缀规则。
  触发条件：用户要求创建新笔记、使用模板、或追加内容到现有笔记。
allowed-tools:
  - Read
  - Write
  - Glob
---

# obsidian-note-local — Obsidian 笔记创建

> 使用本库模板创建笔记，遵循 aliases 前缀规则。

## 前置检查

1. 确认知识库根目录：`content/`
2. 读取 `content/_templates/` 下的模板

## Content-Type 对应的模板

| content-type | 模板文件 |
|--------------|----------|
| atomic | `template_atomic.md` |
| concept | `template_concept.md` |
| moc | `template_moc.md` |
| sop | `template_sop.md` |
| term | `template_term.md` |
| comparison | `template_comp.md` |
| question | `template_question.md` |
| area | `template_area.md` |
| project | `template_project.md` |
| article | `template_article.md` |
| diary | `template_diary.md` |
| record | `template_record.md` |

## aliases 前缀规则

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

**子主题命名**：加父级前缀（如 `C-React-Fiber`、`T-链表-虚拟头节点`）

## 目录结构

- `atomic` → `30-Zettelkasten/`
- `concept/moc/sop/term/comparison/question` → `40-RESOURCES/`
- `area` → `20-AREAS/`
- `project` → `10-PROJECTS/`
- `article` → `60-BLOGS/`
- `diary` → `90-DIARY/`
- `record` → `40-RESOURCES/`

## 流程

1. 询问用户要创建的笔记类型和标题
2. 根据 content-type 选择对应模板
3. 生成文件名（纯标题，不含前缀）
4. 写入对应目录，frontmatter 中的 aliases 包含前缀

## 输出格式

```
已创建：{标题}

路径：{保存路径}
content-type：{类型}
aliases：{前缀-标题}
```