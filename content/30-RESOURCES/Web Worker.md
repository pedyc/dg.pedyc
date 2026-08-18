---
uid: 202605121200
title: Web Worker
aliases: [T-Web-Worker]
description: 浏览器后台运行的独立线程，用于处理耗时计算而不阻塞主线程
tags: []
date-created: 2026-05-12
date-modified: 2026-05-12
status: cultivating
content-type: term
---

## 术语：Web Worker

> **领域**：#前端/浏览器 API

### 定义

Web Worker 是浏览器提供的后台线程 API，允许 JavaScript 在独立线程中执行耗时计算，而不影响主线程的 UI 渲染和响应性能。

**核心特征**：
- **独立上下文**：Worker 有自己的全局作用域和事件循环，与主线程隔离
- **消息通信**：通过 `postMessage` 和 `onmessage` 进行双向异步通信
- **无法直接操作 DOM**：Worker 不能访问页面的 DOM 结构
- **同源限制**：Worker 脚本必须与主页面同源

**基本语法**：

```javascript
// 主线程
const worker = new Worker('worker.js')
worker.postMessage({ type: 'calc', data: [1, 2, 3] })
worker.onmessage = (e) => console.log('Result:', e.data)

// worker.js
self.onmessage = (e) => {
  const result = e.data.data.reduce((a, b) => a + b, 0)
  self.postMessage(result)
}
```

**类型**：
- **Dedicated Worker**：专用 Worker，仅能被创建它的页面使用
- **Shared Worker**：共享 Worker，可被同源的多个页面共享
- **[[Service Worker]]**：特殊 Worker，用于缓存和拦截网络请求（PWA 基础）

### 跨学科含义

- **在性能优化中**：将复杂计算移出主线程，避免 UI 卡顿
- **在异步编程中**：Worker 是另一种异步任务载体，与 Promise/async-await 不同
- **在多线程模型中**：Worker 是浏览器端的轻量级多线程，与 Node.js cluster 不同

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：[[JavaScript]] — Web Worker 是 JavaScript 的浏览器 API
- **并列概念**：
	- [[Promise]] — 另一种异步编程模式
	- [[setTimeout]] — 延时任务
- **相关概念**：
	- [[事件循环]] — 理解主线程与 Worker 的协作机制
	- [[前端性能优化]] — Web Worker 是性能优化的手段
	- [[Service Worker]] — 特殊的 Worker，用于 PWA 和缓存
