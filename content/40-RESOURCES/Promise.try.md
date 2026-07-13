---
uid: 202607121910
title: Promise.try
aliases: ["T-Promise.try"]
description: "ES2025 新增的 Promise 静态方法，将任意函数包装为统一 Promise 链"
tags: ["#JavaScript/API", "#ECMAScript/ES2025"]
status: fleeting
content-type: term
up: [[ES2025]]
---

## 术语：Promise.try

> **主题**：#JavaScript/API

### 定义

`Promise.try(fn)` 是 ES2025 新增的静态方法，接收任意函数（同步或异步），返回一个 Promise。同步函数返回值被包装为 resolved Promise，同步抛出的异常被捕获为 rejected Promise。消除 `new Promise(resolve => resolve(fn()))` 的样板代码。

```js
const handle = (action) =>
  Promise.try(action)
    .then((r) => console.log(r))
    .catch((e) => console.error(e));

handle(() => "sync result");
// "sync result"

handle(() => { throw "error"; });
// "error"

handle(async () => "async result");
// "async result"
```

### 跨学科含义

- **在 JavaScript 异步编程中**：统一了同步/异步函数的调用接口，不再需要手动区分函数执行方式。替代了社区库 `p-try`
- **在函数式编程中**：类似于 `Either.try` / `Try.of` 模式——将可能抛出异常的操作安全地提升到 Promise 链中

### 知识网络

- **父级概念**：[[ES2025]] — 属于 ES2025 Promise 增强
- **相关概念**：[[Promise]], [[Promise.all() vs Array.fromAsync()]]
