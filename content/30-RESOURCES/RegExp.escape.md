---
uid: 202607121912
title: RegExp.escape
aliases: ["T-RegExp.escape"]
description: "ES2025 新增的正则转义方法，安全地将字面量字符串用于正则表达式"
tags: ["#JavaScript/API", "#ECMAScript/ES2025"]
status: fleeting
content-type: term
up: "[[ES2025]]"
---

## 术语：RegExp.escape

> **主题**：#JavaScript/API

### 定义

`RegExp.escape(str)` 是 ES2025 新增的静态方法，将字符串中的正则特殊字符（如 `.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`, `}`, `^`, `$`, `|`, `\`）转义为字面量匹配形式。解决用户输入或外部字符串用于 `new RegExp()` 时的安全问题。

```js
const sentence = "He has two dogs. I have one dog.";

// 问题：. 作为正则特殊字符匹配任意字符
sentence.replace(/dog./, "cat.");
// "He has two cat.. I have one dog."

// 解决：RegExp.escape 转义特殊字符
const pattern = new RegExp(RegExp.escape("dog."));
sentence.replace(pattern, "cat.");
// "He has two dogs. I have one cat."
```

### 跨学科含义

- **在 JavaScript 正则处理中**：消除手动 `str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` 的样板代码，提升代码可读性和安全性
- **在安全编程中**：防止用户输入被注入为特殊正则表达式，是 OWASP 推荐的正则安全做法

### 知识网络

- **父级概念**：[[ES2025]] — 属于 ES2025 正则增强
- **相关概念**：正则表达式，Duplicate Named Capturing Groups（ES2025 另一个新特性）
