---
uid: 202610201247
title: 微任务在每个宏任务后清空从而保证 Promise 执行的确定性
aliases: []
description: 事件循环中微任务队列会在当前宏任务结束后一次性清空，使 Promise 回调的时机可预测
tags:
  - 前端
  - JavaScript
  - 事件循环
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[事件循环]]"
noteId: 1792475154478
---

> 微任务队列在每个~~宏任务~~结束后被一次性清空，这保证了 Promise 等异步操作的执行时机是可预测的。

## 关联

- [[事件循环]]
- [[浏览器通过事件循环机制处理异步任务]]
