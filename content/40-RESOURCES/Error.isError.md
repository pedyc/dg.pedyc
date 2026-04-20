---
uid: '202604180004'
title: Error.isError
aliases: ["T-Error.isError"]
description: "ES2026 引入的精确错误类型判断方法，解决跨 realm 错误识别问题"
tags: ["计算机科学", "前端开发", "JavaScript", "ECMAScript"]
date-created: 2026-04-18
date-modified: 2026-04-18
status: active
content-type: term
related: [["ES2026"]]
---

## 术语：Error.isError

> **领域**：#计算机科学/JavaScript

### 定义

`Error.isError()` 是 ES2026 引入的静态方法，用于精确判断任意值是否为 `Error` 对象，解决了 `instanceof Error` 无法跨 realm（iframe、Worker）识别错误的问题。

**核心语法**：

```javascript
// 传统方式（不准确）
value instanceof Error  // 在跨 realm 时返回 false

// ES2026 新方式（精确）
Error.isError(value)   // 无论 realm 都能正确判断
```

**解决的问题**：
- `instanceof Error` 依赖内部 `[[ErrorData]]` slot
- 不同 realm 的 Error 对象有不同的 prototype chain
- Worker 和 iframe 有独立的 JavaScript 执行环境

### 跨学科含义

- **在 Java 中**：`instanceof` 运算符可以正确识别类层次结构，不存在跨 ClassLoader 问题
- **在 Python 中**：`isinstance()` 同样存在跨解释器限制，但实际场景较少
- **在浏览器环境中**：iframe、Worker、Service Worker 都有独立的 realm
- **在 Node.js 中**：`vm.createContext()` 创建的 sandbox 也会产生独立的 realm

### 知识网络

- **父级概念**：[[ES2026]] — Error.isError 是 ES2026 的特性
- **相关概念**：
	- [[Promise]] — 错误通常通过 Promise rejection 传播
	- [[ECMAScript]] — realm 是 ECMAScript 规范概念
