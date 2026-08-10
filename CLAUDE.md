# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this Quartz project.

## Project Overview

This is a **Quartz v5** digital garden - a static site generator for publishing notes and digital gardens as websites. The project is a fork of the original Quartz with customizations including Chinese localization (locale: zh-CN), custom theme colors, and specific font choices (LXGW WenKai).

It lives inside a **pnpm monorepo** at `D:\Workspace\pedyc\site` (workspace member `apps/dg`). Run commands via `pnpm -C apps/dg ...` from the repo root, or directly inside this directory.

## Common Development Commands

Run from the monorepo root (`D:\Workspace\pedyc\site`) or inside this directory:

- **Start dev server**: `pnpm -C apps/dg run server` (or `npm run server` here)
- **Build for production**: `pnpm -C apps/dg run build` (outputs to `public/`)
- **Build custom local plugins**: `npm run build:custom` (part of `prebuild`, auto-runs before build)
- **Install community plugins**: `npm run install-plugins` (part of `prebuild`)
- **Subset fonts**: `npm run subset-fonts` (requires the original `lxgw.woff`, not committed)
- **Type check**: `npm run type-check`
- **Check code quality**: `npm run check`
- **Format code**: `npm run format`
- **Run tests**: `npm run test`
- **Profile build performance**: `npm run profile`
- **Memory optimization**: `npm run memory:clean`, `npm run memory:monitor`

## Project Structure

- `content/` - Markdown notes and content source (Obsidian knowledge base)
- `quartz/` - Core Quartz engine code
  - `quartz/plugins/` - Core plugin system (loader, pageTypes, emitters, filters)
  - `quartz/components/` - Structural Preact components + frames
  - `quartz/processors/` - Build pipeline processors (parse, filter, emit)
  - `quartz/util/` - Utility functions
  - `quartz/i18n/` - Internationalization (supports 20+ locales)
- `quartz.config.yaml` - **Main configuration** (configuration + plugins + layout)
- `quartz.ts` - Entry point that loads the YAML config
- `custom/` - **Fork-local plugins** (see below)

## Configuration (v5)

v5 unified configuration into a single **YAML** file (`quartz.config.yaml`), replacing v4's `quartz.config.ts` + `quartz.layout.ts`:

- **`configuration:`** — site-wide settings (pageTitle, locale, baseUrl, theme, analytics)
- **`plugins:`** — ordered list of `@quartz-community/*` npm plugins + fork-local `./custom/*` plugins. Each entry has `source`, `enabled`, `options`, `order`, and optional `layout` (position/priority/group).
- **`layout:`** — flex `groups` and per-page-type overrides (`byPageType`).

## Architecture Overview

### Build Pipeline

1. **Parse** (`quartz/processors/parse.ts`): Uses unified/remark/rehype to parse markdown files into AST
2. **Filter** (`quartz/processors/filter.ts`): Applies filters to determine what content to publish
3. **Emit** (`quartz/processors/emit.ts`): Runs emitters to generate output files

### Plugin System

- **Transformers**: Modify content during parsing (npm `@quartz-community/*` packages)
- **Filters**: Determine which content to publish (e.g., `remove-draft`)
- **Emitters**: Generate output files
- **PageTypes** (v5 new): Define how page categories render (content, folder, tag, 404)
- **Components**: Registered via plugin manifests, positioned by the `layout` section

### Page Layout

Layout is resolved from `quartz.config.yaml`'s `layout` section. Components are placed in slots: `head`, `header`, `beforeBody`, `pageBody`, `afterBody`, `left`, `right`, `footer`. Frame templates (`quartz/components/frames/`) control the outer HTML structure.

### Client-side

- Uses Preact for component rendering
- SPA routing via `spa.inline.ts` for fast navigation
- Interactive features: graph view, search, explorer, dark mode, reader mode

## Fork-Local Customizations

These are the project's customizations on top of upstream v5 (all under `custom/` unless noted):

### Local Plugins (`custom/`)
- **`custom/floating-nav/`** — Floating pill nav bar (博客/简历/关于我). Registered as a component-only plugin; positioned in `header`. Source is TSX + SCSS; **built to `dist/` by `npm run build:custom`** (Node cannot import raw .ts/.scss at runtime).
- **`custom/poetry/`** — Transformer that converts ````poetry fenced code blocks into `<pre class="poetry">` elements.

**Important**: When editing `custom/*/`, run `npm run build:custom` to regenerate `dist/` before building. The `dist/` directories are gitignored.

### Core File Modifications (fork-local patches)
- **`quartz/components/renderPage.tsx`** — Adds the `DappledLight` decorative background (rendered before `#quartz-root`). Re-apply on upstream updates.
- **`quartz/styles/custom.scss`** — Dappled light CSS system, fade-in animations, HR styling, homepage tweaks.
- **`quartz/plugins/loader/gitLoader.ts`** — Windows symlink fallback: local plugins are copied (not symlinked) when `fs.symlinkSync` throws EPERM, with a freshness stamp to skip re-copies.
- **`quartz/build.ts`** — Retries output-directory cleanup on Windows ENOTEMPTY.

## Key Configuration Files

- `quartz.config.yaml` - Site configuration + plugin setup + layout
- `quartz.ts` - Entry point (loads YAML config)
- `tsconfig.json` - TypeScript configuration
- `custom/build.mjs` - Builds fork-local plugins to `dist/`

## Environment Requirements

- Node.js >= 22.16
- pnpm >= 10 (monorepo uses pnpm 10.20)
- npm >= 10.9.2

---

For knowledge base methodology and note organization, see `content/00-META/本库指南.md`.
