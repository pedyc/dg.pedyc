---
name: obsidian-note-local
version: 2.2.0
description: |
  使用 `content/_templates` 下的模板创建笔记，完成后自动更新父 Area/MOC 的引用。
  支持所有 content-type 包括 roadmap。**职责边界：只创建内容页 + 更新直接父级引用。wiki-index / wiki-log 由 wiki-sync-local 负责。**
  适配本库的 content-type 体系和 aliases 前缀规则。
argument-hint: "<content-type> <标题> [内容]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# obsidian-note-local

## 流程

### 步骤 1：读取模板

根据 content-type 读取 `content/_templates/` 下对应模板：
- atomic → `template_atomic.md`
- concept → `template_concept.md`
- moc → `template_moc.md`
- sop → `template_sop.md`
- term → `template_term.md`
- question → `template_question.md`
- area → `template_area.md`
- project → `template_project.md`
- article → `template_article.md`
- comparison → `template_comp.md`
- diary → `template_diary.md`
- roadmap → `template_roadmap.md`

### 步骤 2：创建笔记

按模板生成文件（填充 uid、标题、aliases、日期、描述、tags 等），写入对应目录。

目录对应关系：
- atomic → `30-Zettelkasten/`
- concept/moc/sop/term/comparison/question → `40-RESOURCES/`
- area → `20-AREAS/`
- project → `10-PROJECTS/`
- article → `60-BLOGS/`
- diary → `90-DIARY/`
- record → `40-RESOURCES/`
- roadmap → `40-RESOURCES/`

### 步骤 3：更新父页面引用

读取 frontmatter 的 `up` 字段，确定父页面（如 `up: [[A-前端]]` 或 `up: [[MOC-前端面试真题库]]`），在父页面中添加引用：

- 如果父页面是 **Area**（`20-AREAS/`）：
  - 按类型插入对应章节（concept → 关键领域、sop → SOP、moc → FAQ）
  - 格式：`- [[新笔记]] — 一句话说明`
- 如果父页面是 **MOC**（`40-RESOURCES/MOC-*`）：
  - 在链接列表末尾添加 `- [[新笔记]]`
- 如果父页面是 **Concept**（`40-RESOURCES/`，atomic 场景）：
  - 在"相关原子笔记"章节添加 `- [[新笔记]]`

### 步骤 4：完成

创建完成。wiki-index 和 wiki-log 的更新由 `wiki-sync-local` 在后续同步中处理。

---

### 目录对应关系速查

| content-type | 目标目录 | aliases 前缀 |
|---|---|---|
| atomic | `30-Zettelkasten/` | 无 |
| concept | `40-RESOURCES/` | `C-` |
| moc | `40-RESOURCES/` | `MOC-` |
| sop | `40-RESOURCES/` | `SOP-` |
| term | `40-RESOURCES/` | `T-` |
| question | `40-RESOURCES/` | `Q-` |
| comparison | `40-RESOURCES/` | 无 |
| area | `20-AREAS/` | `A-` |
| project | `10-PROJECTS/` | `P-` |
| article | `60-BLOGS/` | 无 |
| diary | `90-DIARY/` | 无 |
| roadmap | `40-RESOURCES/` | `R-`（同 record 共享） |

### 父页面引用位置速查

| 新建类型 | 父类型 | 更新位置 | 插入方式 |
|---|---|---|---|
| moc | Area | FAQ 章节 | `- [[MOC-X]] — 描述` |
| concept | Area | 关键领域章节 | 按子分类插入 |
| sop | Area | SOP 章节 | `- [[SOP-X]] — 描述` |
| term | Area | 关键领域（如适用） | 或直接由 wiki-index 管理 |
| atomic | concept | 相关原子笔记章节 | `- [[atomic-title]]` |
| moc | MOC | 列表末尾 | `- [[MOC-X]]` |
| concept/question | MOC | 列表末尾 | `- [[笔记]]` |