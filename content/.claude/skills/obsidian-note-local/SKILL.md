---
name: obsidian-note-local
version: 1.0.0
description: |
  使用 `content/_templates` 目录下的模板创建或追加 Obsidian 笔记内容。
  适配本库的 content-type 体系和 aliases 前缀规则。
  触发条件：用户要求创建新笔记、使用模板、或追加内容到现有笔记。
argument-hint: "<content-type> <标题> [内容]"
allowed-tools:
  - Read
  - Write
  - Glob
---

# obsidian-note-local

执行前读取 `content/_templates/` 下的对应模板和 `content/00-META/本库指南.md` 了解 aliases 前缀规则。

目录对应关系：
- atomic → `30-Zettelkasten/`
- concept/moc/sop/term/comparison/question → `40-RESOURCES/`
- area → `20-AREAS/`
- project → `10-PROJECTS/`
- article → `60-BLOGS/`
- diary → `90-DIARY/`
- record → `40-RESOURCES/`