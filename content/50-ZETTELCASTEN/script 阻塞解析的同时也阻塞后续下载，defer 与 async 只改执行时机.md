---
uid: 202603230016
title: script 阻塞解析的同时也阻塞后续下载，defer 与 async 只改执行时机
aliases: []
description: JavaScript 可能修改 DOM 或 CSSOM，因此渲染引擎在执行 JS 时会暂停 HTML 解析
tags:
  - 前端开发/浏览器
date-created: 2026-03-23
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[浏览器渲染流程]]"
noteId: 1792465707184
---

> JavaScript 可能修改 DOM 或 CSSOM，因此渲染引擎在执行 JavaScript 时会暂停~~HTML 解析~~，直到 JS 执行完成。

**边界**：阻塞的是解析，同时也就阻塞了后面资源的下载——普通 `<script>` 要等自己下载并执行完，解析才继续。但这只在脚本需要访问它后面的 DOM 时才成为问题：`defer` 与 `async` 的区别不在「是否阻塞下载」，而在「什么时候执行」。

## 论据/示例

**阻塞原因**：
- JS 可以通过 document.write() 修改 HTML
- JS 可以通过 getComputedStyle() 读取 CSSOM
- 为保证一致性，需要等待 JS 执行完成

**阻塞影响**：
- 白屏时间增加
- 首屏渲染延迟

**解决方案**：
1. 将 script 放在 body 底部
2. 使用 async 属性：异步下载，立即执行
3. 使用 defer 属性：异步下载，HTML 解析完成后执行

```html
<!-- 阻塞渲染 -->
<script src="app.js"></script>

<!-- 异步执行 -->
<script async src="app.js"></script>

<!-- 延迟执行 -->
<script defer src="app.js"></script>
```

## 关联

- [[浏览器渲染流程]] — 本观点的主题
- [[事件循环]] — JS 执行与渲染的协调机制
