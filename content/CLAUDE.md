---
title: CLAUDE
date-created: 2026-03-25
date-modified: 2026-07-28
---

## content/ Knowledge Base Guide

本目录是基于 Obsidian 的个人知识库，集成 LLM Wiki 维护系统。

### Quick Reference

- **Main Guide**: [[本库指南]] - Complete methodology and conventions
- **Templates**: `_templates/` directory
- **LLM Wiki Schema**: `00-META/Architecture/llm-wiki-schema.md` — 工作流定义（ingest/query/lint），**每次 llm-wiki 相关操作前必须阅读**

### Key Conventions

See [[本库指南]] for:
- PARA + Zettelkasten methodology
- Three-layer architecture: Raw sources → Wiki → Archive
- Directory structure (00-META to 99-ASSETS)
- content-type classification (atomic, concept, term, moc, sop, etc.)
- Status lifecycle (fleeting → cultivating → active → completed → archived)  
- Naming conventions via aliases (P-, A-, Q-, MOC-, T-, C-, VS-)
- Tag system (#父/子 format)

### LLM Wiki System

Skills 位于 `content/.claude/skills/`：
- `llm-wiki-local` — ingest/query/lint/graph 工作流（内容层）
- `wiki-sync-local` — 维护索引、日志、同步状态（元数据层）.
- `content-evaluator-local` — 健康度评估（元数据层）
- `content-verifier-local` — 内容质量核查（元数据层）
- `obsidian-note-local` — 创建/更新笔记全流程（创建层）
- `action-suggest` — 基于状态生成行动建议

详见 `00-META/Specification/_skills-overview.md` 和 `00-META/Architecture/llm-wiki-schema.md`。

### Templates

Located in `content/_templates/`:
- template_area.md, template_project.md
- template_atomic.md, template_concept.md, template_term.md
- template_moc.md, template_sop.md
- template_comp.md, template_question.md
- template_diary.md, template_week.md
- template_article.md

### 强制规则：创建笔记使用 obsidian-note-local skill

**每次创建或重写笔记时，必须调用 `obsidian-note-local` skill。** 该 skill 一步完成：
1. 读取对应模板生成笔记内容
2. 自动更新 `up` 指向的父级页面引用
3. 同步 wiki-index / wiki-log / sync-state（内部调用 `wiki-sync-local`）
4. 评估笔记健康度（内部调用 `content-evaluator-local`）
5. 核查内容质量（内部调用 `content-verifier-local [light|full]`）

不遵守此规则将导致笔记结构不完整、父页面引用滞后、wiki-index 不同步。

### 强制规则：修改 skill 必须同步 _skills-overview

**每次修改 `content/.claude/skills/*/SKILL.md` 后，必须同步更新 `00-META/Specification/_skills-overview.md` 中的对应描述。**

包括：
- version 升级 → 更新版本号
- description/职责变更 → 更新描述和分层归属
- 新增/删除 skill → 更新总览表和 layer 分类

### 强制规则：llm-wiki 操作前阅读 schema

**每次执行 llm-wiki 相关工作前（ingest/query/lint/笔记创建更新），必须先阅读 `00-META/Architecture/llm-wiki-schema.md`。** 该文档定义了：
- 三层架构职责（raw sources → wiki → archive）
- wiki-log 记录规范（哪些操作该记、不该记）
- 协作约定（你负责判断价值，LLM 负责 bookkeeping）

不遵守此规则可能导致操作不符合知识库架构约定。
