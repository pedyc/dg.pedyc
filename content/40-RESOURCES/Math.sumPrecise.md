---
uid: 202607121900
title: Math.sumPrecise
aliases: ["T-Math.sumPrecise"]
description: "ES2026 新增的精确浮点数求和函数，替代 reduce 累加"
tags: ["#JavaScript/API", "#ECMAScript/ES2026"]
status: fleeting
content-type: term
up: [[ES2026]]
---

## 术语：Math.sumPrecise

> **主题**：#JavaScript/API

### 定义

`Math.sumPrecise(items)` 是 ES2026 新增的静态方法，接收一个可迭代对象，返回所有数值的和。与 `reduce` 累加相比，它对浮点数求和具有更好的精度。

```js
const values = [1e20, 0.1, -1e20];

values.reduce((a, b) => a + b, 0);
// 0 —— 浮点数抵消导致精度丢失

Math.sumPrecise(values);
// 0.1 —— 更精确的求和算法
```

### 跨学科含义

- **在 JavaScript 数值计算中**：替代 `Array.reduce((a,b) => a+b, 0)` 模式，提供更精确的浮点数求和结果，避免大数与小数的抵消问题
- **在工程实践中**：适用于需要累加大量浮点数的场景（如统计计算、数据分析），减少因浮点误差导致的 bug

### 知识网络

- **父级概念**：[[ES2026]] — 属于 ES2026 数学增强
- **相关概念**：[[T-ES2025-Iterator辅助方法]], [[Promise.all() vs Array.fromAsync()]]
