---
uid: 202605180001
title: Webpack模块打包的本质是建立依赖图并生成优化后的资源集合
aliases: []
description: "Webpack 通过递归解析模块依赖构建依赖图，再生成优化后的资源集合"
tags: [前端/构建工具]
date-created: 2026-05-18
date-modified: 2026-05-18
status: active
content-type: atomic
up: "[[Webpack]]"
---

> Webpack 模块打包的本质是建立依赖图并生成优化后的资源集合。

## 论据/示例

**依赖图构建过程**：

```javascript
// 入口文件 src/index.js
import { foo } from './foo.js';
import styles from './styles.css';

console.log(foo);
```

```javascript
// foo.js
export const foo = 'hello';
```

Webpack 解析流程：
1. 从 `entry`（`src/index.js`）开始
2. 检测到 `import './foo.js'` → 将 foo.js 加入依赖图
3. 检测到 `import './styles.css'` → 调用 css-loader 处理
4. 递归解析所有模块，构建完整依赖图
5. 根据图关系，将相关模块打包到同一个 chunk

**构建后的依赖图**：

```mermaid
graph TD
    A[index.js<br/>入口] --> B[foo.js<br/>ES Module]
    A --> C[styles.css<br/>CSS Module]
    B --> D[bar.js<br/>深层依赖]
    D --> E[utils.js<br/>工具函数]
    F[bundle.js<br/>主 chunk] -.->|包含| A
    F -.->|包含| B
    F -.->|包含| C
    F -.->|包含| D
    F -.->|包含| E
    G[vendor.js<br/>公共依赖] -.->|共享| D
    G -.->|共享| E
```

**优化后的资源集合**：

| 优化手段 | 效果 |
|:---|:---|
| Tree Shaking | 移除未使用的 export |
| Code Splitting | 按需加载，减小首屏体积 |
| Minification | 压缩代码，移除空格注释 |
| Module Concatenation | 合并模块减少函数调用开销 |

## 关联

- [[Webpack]] — 本观点的上位概念
- [[Webpack配置流程]] — 配置 Webpack 的标准流程
