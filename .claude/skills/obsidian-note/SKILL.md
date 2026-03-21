---
name: obsidian-note
description: 使用 content/_templates 目录下的模板创建或追加 Obsidian 笔记内容
argument-hint: [path] [action: create|append]
allowed-tools: Glob,Read,Write,Edit,Bash
---

## 模板位置

`content/_templates/template_{type}.md`

## content-type 与目录对应

| content-type | 目录 |
|--------------|------|
| `project` | 10-PROJECTS |
| `area` | 20-AREAS |
| `moc` | 20-AREAS 或 40-RESOURCES |
| `diary` | 90-DIARY |
| `article` | 60-BLOGS |
| `atomic` | 30-ZETTELKASTEN |
| `concept` | 40-RESOURCES |
| `sop` | 40-RESOURCES |
| `question` | 40-RESOURCES |
| `term` | 40-RESOURCES |
| `comparison` | 40-RESOURCES |

## 步骤

### Create（创建新笔记）

1. 根据 content-type 确定存放目录
2. 读取模板
3. 替换占位符
4. 写入新文件

### Append（追加内容）

1. 读取现有笔记
2. 读取对应模板
3. 对比差距
4. 基于模板生成内容
5. 追加到笔记

## 注意

- 严格基于模板结构
- 追加内容放在"总结"之前
