---
uid: 202605270001
title: Babel 使用指南
aliases: [SOP-Babel使用指南, SOP-Babel]
description: Babel 编译器配置与使用流程，涵盖 preset/plugin 配置、AST 转换、常见问题排查
tags: [前端开发/工程化, SOP]
date-created: 2026-05-27
date-modified: 2026-05-27
status: cultivating
content-type: sop
up: "[[前端工程]]"
---

## SOP：Babel 使用指南

> 一句话描述：Babel 编译器配置与使用流程，用于将 ES6+ 语法转换为向后兼容的 ES5 代码

目标：配置 Babel 将新版本 JavaScript 语法转换为旧版本，使代码可以在旧版浏览器运行

实现：安装 @babel/core、@babel/preset-env，配置 .babelrc 或 babel.config.js

---

### 适用场景

- 场景 1：需要在新项目中使用 ES6+ 语法，但目标浏览器不支持
- 场景 2：需要将 TypeScript 或 JSX 代码转换为纯 JavaScript
- 场景 3：需要自定义语法转换插件，处理特殊业务需求

---

### 流程图解

```mermaid
flowchart LR
    A[ES6+ 代码] --> B[解析 Parse]
    B --> C[转换 Transform]
    C --> D[生成 Generate]
    D --> E[ES5 代码]
```

---

### 核心步骤

1. **安装依赖**：安装 @babel/core 和 @babel/cli
   - 注意：preset-env 会根据 targets 自动决定需要转换的语法
2. **安装 preset**：安装 @babel/preset-env（用于 ES6+ 转换）和 @babel/preset-react（用于 JSX）
   - 注意：每个 preset 都是预设的 plugin 集合
3. **创建配置文件**：创建 .babelrc 或 babel.config.js
   - 注意：.babelrc 用于单个项目，babel.config.js 用于 monorepo
4. **配置 preset**：在 preset-env 中设置 targets（目标浏览器）
   - 注意：不要同时使用 .babelrc 和 babel.config.js，会冲突
5. **执行编译**：使用 babel src -d dist 或在 webpack/vite 中集成

---

### 实践/示例

**基础 .babelrc 配置**：
```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions"]
      },
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

**使用 @babel/cli 编译**：
```bash
npx babel src --out-dir dist
```

**在 Webpack 中使用 babel-loader**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

---

### 常见坑点

- ⛔ **反模式**：不要在 .babelrc 中同时使用 @babel/preset-env 和 @babel/preset-typescript，应该用 @babel/preset-typescript 替代
- 🔧 **排查**：如果编译后语法未转换，检查 targets 是否正确覆盖了目标浏览器
- 🔧 **排查**：如果出现 `Cannot find module '@babel/core'` 错误，检查 @babel/core 是否正确安装
- ⛔ **反模式**：不要在 production 中使用 @babel/preset-react 的开发相关特性

---

### 知识图谱

- **相关概念**：
  - [[抽象语法树]] — Babel 工作流程中的中间表示
  - [[前端工程]] — Babel 属于前端工程化工具链
- **相关工具**：
  - [[Webpack]] — 使用 babel-loader 集成 Babel
  - [[Vite]] — 内置支持 Babel
  - [[ESLint]] — 代码质量检查