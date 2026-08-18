---
uid: '202605091000'
title: requestIdleCallback
aliases: ["T-浏览器API-requestIdleCallback", "requestIdleCallback"]
description: "requestIdleCallback 是浏览器 API，在空闲时执行低优先级任务"
tags: [前端开发/浏览器API]
date-created: 2025-02-25
date-modified: 2026-05-09
status: cultivating
content-type: term
---

## 术语：requestIdleCallback

> **领域**：#前端开发/浏览器 API

### 定义

requestIdleCallback 是浏览器提供的 API，用于在**浏览器空闲时期**调度执行低优先级任务，避免阻塞主线程影响用户交互。

**签名**：

```javascript
requestIdleCallback(callback, options?)
// callback: (deadline: IdleDeadline) => void
// options: { timeout: number }

// 返回：handle（用于 cancelIdleCallback）
```

**IdleDeadline 对象**：

```javascript
{
  timeRemaining(): number  // 剩余空闲时间（毫秒）
  didTimeout: boolean      // 是否超时
}
```

**示例**：

```javascript
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && taskQueue.length > 0) {
    processTask(taskQueue.shift())
  }

  if (taskQueue.length > 0) {
    requestIdleCallback(arguments.callee)
  }
}, { timeout: 2000 })
```

---

### 核心特点

| 特点 | 说明 |
|:---|:---|
| **空闲时执行** | 浏览器渲染帧后、响应用户交互后的空闲期 |
| **时间预算** | 通过 `deadline.timeRemaining()` 获取可用时间 |
| **可超时** | `timeout` 参数确保任务在指定时间内必执行 |
| **后台任务** | 适合数据分析、预加载、索引等低优先级工作 |
| **兼容性** | 现代浏览器支持，需 polyfill 兼容旧版 |

---

### 跨学科含义

- **在 React 中**：React 早期曾尝试用 requestIdleCallback 实现时间切片，但最终自行实现了**优先级调度队列 React Fiber**，不依赖浏览器空闲期
- **在浏览器渲染中**：与 requestAnimationFrame 配合，==rAF 控制渲染帧，ric 控制后台任务==
- **在 Node.js 中**：无原生支持，类似 API 为 `setImmediate`

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：
	- [[Web Animations API]] — 浏览器渲染相关 API
	- [[浏览器渲染管线]] — requestIdleCallback 运行的上下文
- **相关概念**：
	- [[requestAnimationFrame]] — 每帧渲染回调，与 ric 配合使用
	- [[Fiber]] — React 的优先级调度，取代了 ric 的使用
	- [[事件循环]] — ric 运行的 JavaScript 执行环境

---

### 参考延伸

- MDN: [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)
- W3C: [Page Visibility Level 2](https://www.w3.org/TR/page-visibility/)
- React PR: [Why we removed requestIdleCallback](https://github.com/facebook/react/pull/13289)
