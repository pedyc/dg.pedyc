---
uid: 202505280001
title: Tree Shaking
aliases: ["T-Tree Shaking", "Tree-Shaking", "死代码消除"]
description: 利用 ES Module 静态分析移除未使用代码的优化技术
tags: [前端/构建工具]
date-created: 2025-05-28
date-modified: 2026-05-18
status: active
content-type: term
up: "[[Webpack]]"
---

## 术语：Tree Shaking

> **主题**：#前端/构建工具

### 定义

Tree Shaking 是一种通过**静态代码分析**移除 JavaScript 中未使用代码（死代码）的优化技术，最终减小打包体积、提升加载性能。

**核心前提**：ES Modules 的静态结构 —— `import`/`export` 在编译时确定，非运行时决定

**基本原理**：
1. 分析 AST 抽象语法树
2. 标记所有被引用的 export（" 存活 " 代码）
3. 移除未被标记的 export（死代码）
4. 压缩输出（结合 Terser 进一步精简）

```javascript
// math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const subtract = (a, b) => a - b;  // 未被使用
```

```javascript
// index.js
import { add } from './math.js';
console.log(add(1, 2));  // 只引用了 add
```

**Tree Shaking 后输出**：

```javascript
// multiply 和 subtract 已被移除
const add = (a, b) => a + b;
console.log(add(1, 2));
```

### 核心特点

| 特性 | 说明 |
|:---|:---|
| **静态分析** | 基于 ESM 编译时解析，不执行代码即可分析依赖 |
| **编译时优化** | 与运行时优化（如 JIT 编译）区分 |
| **必须 ESM** | CommonJS 的动态 `require()` 无法静态分析 |
| **依赖 `sideEffects`** | 需在 `package.json` 标记无副作用模块 |

### 应用

**Webpack 配置**：

| 配置项 | 作用 |
|:---|:---|
| `mode: 'production'` | 默认开启 Tree Shaking |
| `optimization.usedExports: true` | 标记被使用的 export |
| `optimization.sideEffects: true` | 识别 `package.json` 的 `sideEffects` |
| `sideEffects: false` | 标记模块无副作用，允许移除未使用 export |

**Rollup**：默认开启，效果优于 Webpack

**失效场景**：

| 场景 | 原因 |
|:---|:---|
| CommonJS 模块 | `require()` 动态解析，无法静态分析 |
| 动态 `import()` | 运行时加载，不在静态分析范围内 |
| 副作用代码 | 有副作用的代码（如修改全局变量）可能被误删，需 `sideEffects` 标记 |
| 循环依赖 | 依赖图复杂时分析不完整 |

### 知识网络

- **父级概念**：[[Webpack]] — Webpack 的核心优化手段
- **并列概念**：
	- [[Code Splitting]] — 代码分割，另一个重要优化手段
	- [[Minification]] — 代码压缩，配合 Tree Shaking 使用
- **相关概念**：
	- [[ESModule|ESM]] — Tree Shaking 的技术基础
	- [[Rollup]] — Tree Shaking 效果更好的打包工具
	- [[Tree Shaking 的本质是 ESM 静态分析]] — atomic 洞见
