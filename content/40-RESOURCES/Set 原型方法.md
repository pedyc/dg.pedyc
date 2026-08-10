---
uid: 202607121911
title: Set 原型方法
aliases: ["T-Set-methods", "T-ES2025-Set方法"]
description: "ES2025 为 Set 新增的集合操作方法：intersection、union、difference、symmetricDifference、isSubsetOf、isSupersetOf、isDisjointFrom"
tags: ["JavaScript/API", "数据结构"]
date-created: 2026-07-12
date-modified: 2026-07-12
status: fleeting
content-type: term
up: "[[ES2025]]"
---

## 术语：Set 原型方法

> **主题**：#JavaScript/API

### 定义

ES2025 为 `Set.prototype` 新增了 7 个集合操作方法，填补了 JavaScript Set 长期缺乏原生集合运算的空白：

- **`intersection(other)`** — 交集，返回同时存在于两个 Set 的元素
- **`union(other)`** — 并集，返回存在于任一 Set 的元素
- **`difference(other)`** — 差集，返回存在于当前但不在 other 中的元素
- **`symmetricDifference(other)`** — 对称差集，返回仅存在于其中一个 Set 的元素
- **`isSubsetOf(other)`** — 子集判断
- **`isSupersetOf(other)`** — 超集判断
- **`isDisjointFrom(other)`** — 不相交判断（无公共元素）

### 跨学科含义

- **在 JavaScript 数据结构中**：使 Set 成为一个完整的集合数据类型，无需手动实现集合运算
- **在数学/集合论中**：这些方法直接对应数学集合运算，使代码与数学概念对齐

### 知识网络

- **父级概念**：[[ES2025]] — 属于 ES2025 数据结构增强
- **相关概念**：`Set`
