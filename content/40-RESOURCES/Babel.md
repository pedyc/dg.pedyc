---
uid: 202603160013
title: Babel
aliases:
  - Babel
  - T-Babel
description: JavaScript 编译器，用于将新版本语法转换为旧版本语法
tags:
  - 前端开发/工程化
date-created: 2026-03-16
date-modified: 2026-03-15
status: active
content-type: term
up: "[[前端工程化]]"
---

## 术语：Babel

> **别名**: Babel, Babel.js
> **领域**: #前端开发/工程化

### 定义

Babel 是一个 JavaScript 编译器，主要用于将 ES6+ 新语法转换为向后兼容的 ES5 代码，使代码可以在旧版浏览器或环境中运行。

### 工作流程

```mermaid
flowchart LR
    ES6[ES6+ 代码] -->|解析| Babel[Babel 编译器]
    Babel -->|转换| AST[AST]
    AST -->|插件处理| NewAST[新 AST]
    NewAST -->|生成| ES5[ES5 代码]
```

### 核心配置

| 配置项 | 说明 |
|--------|------|
| `presets` | 预设集合，如 `@babel/preset-env`、`@babel/preset-react` |
| `plugins` | 语法转换插件 |
| `targets` | 目标浏览器版本 |

### 锚点连接

- **属于**：[[前端工程化]]
- **相关概念**：[[抽象语法树]] [[Webpack]] [[Vite]]
- **相关工具**：ESLint、TypeScript
