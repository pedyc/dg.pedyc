---
uid: 202603160008
title: ESModule
aliases: [T-ESModule, ESM]
description: ECMAScript 模块化标准，使用 import/export 语法实现模块导入导出
tags: [前端/JavaScript]
date-created: 2026-03-16
date-modified: 2026-08-27
status: active
content-type: term
up: "[[JavaScript]]"
---

## ESModule

> ESModule (ES Modules) 是 ECMAScript 2015 引入的官方模块化标准，使用 `import`/`export` 语法实现模块化。

### 语法

```javascript
// 导出
export const name = 'value';
export function foo() {}
export default function() {}

// 导入
import { name } from './module.js';
import defaultExport from './module.js';
```

### 核心特性

- **静态结构**：`import`/`export` 必须在模块顶层，不能在条件语句中
- **引用导出**：导入的是值的引用，而非拷贝
- **异步加载**：浏览器中异步加载模块，不阻塞渲染
- **严格模式**：自动启用严格模式

### 与 CommonJS 对比

| 特性 | ESModule | CommonJS |
|------|----------|----------|
| 语法 | `import`/`export` | `require`/`module.exports` |
| 加载 | 异步 | 同步 |
| 解析 | 静态 | 动态 |
| 运行环境 | 浏览器/Node.js | Node.js |

### 关联

- **父级**：[[JavaScript]]
- **相关**：[[Vite]]（利用 ESM 实现快速启动）
- **对比**：CommonJS
