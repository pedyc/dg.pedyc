# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Quartz v4 digital garden - a static site generator for publishing notes and digital gardens as websites. The project is a fork of the original Quartz with customizations including Chinese localization (locale: zh-CN), custom theme colors, and specific font choices (LXGW WenKai).

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

- `content/` - Markdown notes and content source
- `quartz/` - Core Quartz engine code
  - `quartz/plugins/` - Plugin system (transformers, filters, emitters)
  - `quartz/components/` - Preact components for page rendering
  - `quartz/processors/` - Build pipeline processors (parse, filter, emit)
  - `quartz/util/` - Utility functions
  - `quartz/i18n/` - Internationalization (supports 20+ locales)
- `quartz.config.ts` - Main configuration (plugins, theme, features)
- `quartz.layout.ts` - Page layout definitions

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
