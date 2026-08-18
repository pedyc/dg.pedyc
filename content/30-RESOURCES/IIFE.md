---
uid: 20250519000002
title: IIFE
aliases: [立即调用函数表达式]
description: JavaScript 中立即执行的函数表达式
tags: [前端/JavaScript]
date-created: 2025-05-19
date-modified: 2026-03-16
status: fleeting
content-type: term
---

## 术语：IIFE

> **领域**：#前端/JavaScript

### 定义

IIFE（Immediately Invoked Function Expression，立即调用函数表达式）是一种在定义后立即执行的函数表达式，==用于创建独立的作用域，避免变量污染全局命名空间。==

```javascript
// Basic syntax
(function() {
  // 代码立即执行
})();

// 箭头函数版本
(() => {
  // 代码立即执行
})();
```

### 跨学科含义

- **在 JavaScript 中**：IIFE 用于模块化、闭包、变量隔离
- **在其他语言中**：类似概念（如 Python 的 lambda 表达式立即调用）

### 关联

- **属于**：[[JavaScript]]
- **引用**：[[闭包]]
