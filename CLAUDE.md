# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Quartz v4 digital garden - a static site generator for publishing notes and digital gardens as websites. The project is a fork of the original Quartz with customizations including Chinese localization (locale: zh-CN), custom theme colors, and specific font choices (LXGW WenKai).

**content/ directory** is a complete Obsidian local knowledge base with PARA + Zettelkasten methodology.

## Common Development Commands

- **Start dev server (content)**: `npm run server` or `npm run dev`
- **Start dev server (docs)**: `npm run docs`
- **Build for production**: `npm run build`
- **Type check**: `npm run type-check`
- **Check code quality**: `npm run check`
- **Format code**: `npm run format`
- **Run tests**: `npm run test`
- **Profile build performance**: `npm run profile`
- **Memory optimization**: `npm run memory:clean`, `npm run memory:monitor`

## Project Structure

- `content/` - Markdown notes and content source (Obsidian knowledge base)
- `quartz/` - Core Quartz engine code
  - `quartz/plugins/` - Plugin system (transformers, filters, emitters)
  - `quartz/components/` - Preact components for page rendering
  - `quartz/processors/` - Build pipeline processors (parse, filter, emit)
  - `quartz/util/` - Utility functions
  - `quartz/i18n/` - Internationalization (supports 20+ locales)
- `quartz.config.ts` - Main configuration (plugins, theme, features)
- `quartz.layout.ts` - Page layout definitions

---

# content/ Obsidian Knowledge Base

When working with notes in `content/` directory, follow these rules:

## Core Principles

- **Keep Context Intact**: Notes should serve the current context first. Linking to atomic notes is optional, not mandatory.
- **PARA + Zettelkasten**: Projects → Areas → Resources → Archive
- **Location is for organization, metadata is for templates**

## Directory Structure

```
content/
├── 00-META/           # System metadata (specs, architecture, indexes)
├── 10-PROJECTS/       # Projects (specific goals with deadlines)
├── 20-AREAS/          # Areas (ongoing focus areas)
├── 30-ZETTELCASTEN/   # Original notes (internalized knowledge)
├── 40-RESOURCES/      # External resources (clips, web archives)
├── 50-ARCHIVE/        # Archives (completed/obsolete content)
├── 90-DIARY/          # Diary (time-series records)
└── 99-ASSETS/         # Extra resources (plugins, attachments)
```

## Metadata Specification

### Standard Fields

| Field | Purpose | Values |
|-------|---------|--------|
| uid | Unique identifier | Timestamp |
| title | Note title | - |
| aliases | Search keywords | - |
| description | Description | - |
| tags | Tags | `#parent/child` format |
| status | Note lifecycle | See below |
| content-type | Content type | See below |
| category | Category | learning / work / life / hobby |
| up | Parent link | [[MOC/Concept]] |
| date-created | Creation date | Auto-generated |
| date-modified | Modification date | Auto-generated |

### status: Note Lifecycle

**One-way flow, cannot be reversed**

| Status | Meaning | Action |
|--------|---------|--------|
| fleeting | Draft/raw idea | Needs processing or deletion |
| cultivating | Growing | Adding content/links |
| active | Active | Main reference |
| completed | Completed | Project finished/note closed |
| archived | Archived | Stored, no longer maintained |

### content-type: Content Classification

- **Specific** (determined by physical location): `project`, `area`
- **General** (determined by content entropy):

| Type | Definition | Example |
|------|------------|---------|
| term | Terminology (from external sources) | HTTP, 多巴胺 |
| atomic | Permanent note (single insight/观点) | "闭包的本质是..." |
| concept | Concept set (overview + integration) | 闭包（概念总览） |
| comparison | Comparison, cross-concept analysis | A vs B, selection guide |
| question | Open-ended question, exploratory thinking | Q-如何学习编程 |
| sop | Standard operating procedure | Deployment process, 周回顾 SOP |
| moc | Map of Content, indexes multiple notes | Navigation page |

### Project-specific Fields

| Field | Purpose | Values |
|-------|---------|--------|
| consequence | Importance | 1~10 |
| urgency | Urgency | 1~10 |
| energy-type | Energy type | 💡 / ⚡ / 🔄 / 🏃 |
| quadrant | Eisenhower matrix | - |
| expire | Deadline | Date |

## Naming Conventions

### 前缀规范（通过 aliases 实现）

前缀由 `content-type` 属性决定，存储在 `aliases` 中。文件名使用纯标题，正文引用更通顺。

| Prefix | content-type | Example Alias |
|--------|-------------|---------------|
| P- | project | P-求职 |
| A- | area | A-人工智能 |
| Q- | question | Q-如何学习编程 |
| MOC- | moc | MOC-前端知识地图 |
| SOP- | sop | SOP-周回顾 |
| T- | term | T-TCP |
| C- | concept | C-闭包 |
| VS- | comparison | VS-Title1 vs Title2 |
| - | atomic | No specific prefix |

**使用方式：**
- concept: `闭包.md`, aliases: `[Closure, C-闭包]`, 引用: `[[闭包]]`
- atomic: `闭包的本质是...md`, aliases: `[]`, 引用: `[[闭包的本质是...]]`

### Directory Prefixes

Numeric prefixes for sorting:

```
00-META      → System metadata
10-PROJECTS  → Projects
20-AREAS     → Areas
30-ZETTELCASTEN → Original notes
40-RESOURCES → External resources
50-ARCHIVE   → Archives
90-DIARY     → Diary
99-ASSETS    → Extra resources
```

## Tag Conventions

### Format
- Format: `#父标签/子标签` (e.g., `#学习/前端`, `#工具/Obsidian`)
- Use Chinese for parent tags, English or Chinese for sub-tags

### Recommended Tag System

| Parent Tag | Sub-tags |
|------------|----------|
| #知识管理 | 方法论、工具、工作流、心智模型 |
| #人工智能 | AI助手、提示词、Agent |
| #前端开发 | JavaScript、React、工程化、CSS |
| #个人成长 | 健康、时间管理、习惯 |
| #工具 | AI、编辑器、效率 |
| #方法论 | PARA、卡片盒、费曼技巧 |
| #认知科学 | 心理学、记忆、学习 |

### Principles

- **content-type** (atomic/concept/sop/term) ≠ **tags**
  - content-type: 决定笔记形式（模板）
  - tags: 描述笔记主题
- Mainly used for Topic and Medium
- No quantity limit
- No special meaning tags

## Key Files

- `content/00-META/00-本库指南.md` - Core guide (all specs in one place)
- `content/00-META/01 索引/` - Indexes (领域, 方法论, 标签, 工作流, 术语)

## Templates

Templates are in `content/_templates/`:

- `template_area.md` - Area template
- `template_project.md` - Project template
- `template_atomic.md` - Atomic note template
- `template_concept.md` - Concept template
- `template_comp.md` - Comparison template
- `template_sop.md` - SOP template
- `template_moc.md` - MOC template
- `template_term.md` - Term template
- `template_diary.md` - Diary template
- `template_week.md` - Weekly report template

---

## Architecture Overview

Quartz is a static site generator with a plugin-based architecture:

### Build Pipeline

1. **Parse** (`quartz/processors/parse.ts`): Uses unified/remark/rehype to parse markdown files into AST
2. **Filter** (`quartz/processors/filter.ts`): Applies filters to determine what content to publish
3. **Emit** (`quartz/processors/emit.ts`): Runs emitters to generate output files

### Plugin System

- **Transformers**: Modify content during parsing (e.g., FrontMatter, GFM, SyntaxHighlighting, CrawlLinks)
- **Filters**: Determine which content to publish (e.g., RemoveDrafts)
- **Emitters**: Generate output files (e.g., ContentPage, TagPage, Assets, ContentIndex)

### Page Layout

Layout is defined in `quartz.layout.ts` using components placed in sections: `head`, `header`, `beforeBody`, `pageBody`, `afterBody`, `left`, `right`, `footer`. Components are Preact-based and use `quartz/styles/*.scss` for styling.

### Client-side

- Uses Preact for component rendering
- SPA routing via `spa.inline.ts` for fast navigation
- Interactive features: graph view, search (FlexSearch), explorer, dark mode

## Key Configuration Files

- `quartz.config.ts` - Site configuration and plugin setup
- `quartz.layout.ts` - Page component layouts
- `tsconfig.json` - TypeScript configuration
- `esbuild.config.mjs` - Build tool configuration

## Environment Requirements

- Node.js >= 22
- npm >= 10.9.2

## Code Review Guidelines

When reviewing code changes, follow these principles:

1. **Prioritize correctness** - Check for bugs, edge cases, error handling
2. **Emphasize readability** - Naming should express intent, avoid unnecessary complexity
3. **Focus on design** - Avoid over-abstraction, ensure clear responsibilities
4. **Consider maintainability** - Code should be easy to test, extend, and modify
5. **Be explicit about trade-offs** - Don't shy away from pointing out risks or issues
