# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Quartz v4 digital garden - a static site generator for publishing notes and digital gardens as websites. The project is a fork of the original Quartz project with customizations.

## Common Development Commands

- **Start development server**: `npm run start` or `npm run server`
- **Build for production**: `npm run build`
- **Check code quality**: `npm run check`
- **Format code**: `npm run format`
- **Run tests**: `npm run test`
- **Build documentation**: `npm run docs`
- **Profile build performance**: `npm run profile`

## Project Structure

- `content/` - All markdown notes and content
- `quartz/` - Core Quartz engine code
- `quartz.config.ts` - Main configuration file
- `quartz.layout.ts` - Page layout definitions
- `package.json` - Project dependencies and scripts
- `docs/` - Documentation for Quartz features

## Architecture Overview

Quartz is a static site generator with a plugin-based architecture:

1. **Content Processing Pipeline**:
   - Parse markdown files using unified/remark/rehype
   - Apply transformers (plugins that modify content)
   - Filter content (remove drafts, etc.)
   - Emit output files (HTML, RSS, sitemaps, etc.)

2. **Plugin System**:
   - Transformers: Modify content during parsing
   - Filters: Determine which content to publish
   - Emitters: Generate output files

3. **Build Process**:
   - Uses esbuild for fast TypeScript/SCSS compilation
   - Supports hot-reloading during development
   - Generates static assets in `public/` directory

4. **Client-side**:
   - Uses Preact for component rendering
   - Supports SPA routing for fast navigation
   - Includes graph view, search, and other interactive features

## Key Configuration Files

- `quartz.config.ts` - Main site configuration and plugin setup
- `quartz.layout.ts` - Page component layouts
- `tsconfig.json` - TypeScript configuration
- `esbuild.config.mjs` - Build tool configuration
