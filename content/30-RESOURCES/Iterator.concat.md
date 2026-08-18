---
uid: 202607121902
title: Iterator.concat
aliases: ["T-Iterator.concat", "T-Iterator-Sequencing"]
description: "ES2026 新增的迭代器串联方法，将多个迭代器顺序合并为一个"
tags: ["#JavaScript/API", "#ECMAScript/ES2026"]
status: fleeting
content-type: term
up: [[ES2026]]
---

## 术语：Iterator.concat (Iterator Sequencing)

> **主题**：#JavaScript/API

### 定义

`Iterator.concat(...iterators)` 是 ES2026 新增的静态方法，接收多个可迭代对象或迭代器，返回一个新的迭代器，按顺序依次 yield 每个参数的元素。类似 `yield*` 语法，但以函数调用形式提供，更简洁且支持直接插入普通值。

```js
const iOne = Iterator.from([2022, 2023]);
const iTwo = Iterator.from([2025, 2026]);

const combined = Iterator.concat(iOne, [2024], iTwo);
Array.from(combined);
// [2022, 2023, 2024, 2025, 2026]
```

### 跨学科含义

- **在 JavaScript 迭代器协议中**：填补了 Iterator Helper 提案中缺少的合并能力，与 `Iterator.from`、`map`、`filter` 等方法形成完整的迭代器工具链
- **在函数式编程中**：相当于序列的 append/concat 操作，将多个惰性序列合并为一个

### 知识网络

- **父级概念**：[[ES2026]] — 属于 ES2026 迭代器增强
- **相关概念**：Iterator Helper（ES2025 的 `Iterator.prototype.map/filter/take/drop` 等）
