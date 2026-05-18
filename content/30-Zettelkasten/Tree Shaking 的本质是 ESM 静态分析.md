---
uid: 202605180002
title: Tree Shaking 的本质是 ESM 静态分析
aliases: []
description: "Tree Shaking 利用 ES Module 的静态结构在打包阶段移除未使用的导出"
tags: [前端/构建工具]
date-created: 2026-05-18
date-modified: 2026-05-18
status: active
content-type: atomic
up: "[[Webpack]]"
---

> Tree Shaking 的本质是 ESM 静态分析。

## 论据/示例

**ESM 静态结构**：

```javascript
// ES Module 的 import 是编译时确定，非运行时
import { foo, bar } from './module';  // 编译时解析
import * as utils from './utils';      // 编译时解析

// 静态结构意味着：
// 1. import 语句必须在模块顶层
// 2. import 不可在条件语句中（如 if、try）
// 3. 编译器可在不执行代码的情况下分析依赖关系
```

**对比 CommonJS**：

```javascript
// CommonJS 是运行时解析
const utils = require('./utils');  // 运行时才能确定

// 无法静态分析的原因：
// 1. require 可在任意位置（条件语句、函数内）
// 2. 模块身份可能是变量
// 3. require() 返回的对象结构不可预测
```

**Webpack Tree Shaking 示例**：

```javascript
// math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const subtract = (a, b) => a - b;  // 未被使用
```

```javascript
// index.js
import { add, multiply } from './math.js';

console.log(add(1, 2));  // multiply 未使用，Tree Shaking 移除
```

**Tree Shaking 后输出的 bundle**：

```javascript
// 大致等效输出（经过 Terser 等压缩）
const add = (a, b) => a + b;
console.log(add(1, 2));  // multiply、subtract 已移除
```

**配置要求**：

| 配置项 | 作用 |
|:---|:---|
| `sideEffects: false` | 标记文件无副作用，允许移除未使用的 export |
| `usedExports: true` | 标记已使用的 export，配合 minimize 使用 |
| `optimization.usedExports` | 启用标记未使用 export 的优化 |

## 关联

- [[Webpack]] — Tree Shaking 是 Webpack 的核心优化手段
- [[Webpack配置流程]] — 配置 Tree Shaking 的标准流程
