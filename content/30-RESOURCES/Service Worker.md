---
uid: 202605121300
title: Service Worker
aliases: [T-Service-Worker]
description: 页面之外的一段可编程网络代理：拦截 fetch、托管生命周期，但没有 DOM
tags: []
date-created: 2025-05-30
date-modified: 2026-10-28
content-type: term
up: "[[Web API]]"
---

## 术语：Service Worker

> **主题**：#前端/浏览器 API

### 定义

Service Worker 是注册在某个源上、由浏览器在页面之外长期持有的一段脚本，作为**可编程的网络代理**拦截该源作用域内的 fetch。

规范给它的外延只有三件事：注册与生命周期、fetch 拦截、与受控页面的通信（`postMessage` 与 `clients`）。其余能力都以它为宿主，但不属于它。

**四条硬约束**（来自规范，不是最佳实践）：

- 独立全局作用域 `ServiceWorkerGlobalScope`：没有 `window`，没有 DOM，碰不到 `document`
- 只在安全上下文可用：HTTPS 或 localhost
- 生命周期由浏览器决定：页面关闭后仍可存活，空闲即被终止——所以不能靠它保存内存状态，要持久化只能写到外部存储
- 一个源只有一个注册位：作用域相同的再次 `register()` 是覆盖，不是新增

**生命周期**：注册 → 安装 → 激活 → 空闲终止 → 收到事件再唤醒。

```js
navigator.serviceWorker.register('/sw.js')

// sw.js
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(clients.claim()))
self.addEventListener('fetch', event => event.respondWith(fetch(event.request)))
```

### 边界：它不负责什么

越界几乎总是从下面这四行开始——把「以 SW 为宿主的能力」写成了 SW 的能力：

| 能力 | 实际归属 | 与 SW 的关系 |
|:---|:---|:---|
| 按 `Request → Response` 存取缓存 | [[Cache API]]（独立规范） | 只是调用它的宿主；`caches` 并不定义在 SW 规范里 |
| 服务端主动推送 | Push API | SW 提供 `push` 事件的接收点，订阅与消息格式归 Push |
| 断网后重放挂起的请求 | Background Synchronization API | SW 提供 `sync` 事件 |
| Cache-First / SWR 之类的缓存策略 | 工程约定，不是任何规范 | 由 fetch 事件的响应逻辑自己实现，写法见 [[Cache API]] |

所以它真正的价值不在「能缓存」，而在「请求可以被代码接管」。这条线一划，判据就出来了：凡是要讲缓存怎么存、策略怎么选、会不会过期，都不该落在这一篇。

### 跨学科含义

- **在 PWA 中**：可安装与离线可用都以它为前提
- **在性能优化中**：它把「资源从哪儿取」从服务端挪到了客户端，代价是版本与失效要自己管
- **在前端监控中**：fetch 事件是唯一能拿到全部请求的客户端钩子

### 知识图谱

- **上位**：[[Web Worker]] — 同样是独立全局作用域的后台脚本，SW 多了网络拦截与生命周期托管
- **并列**：[[Worklet]] — 同为独立脚本上下文，区别是 Worklet 只能进渲染管线，不能拦截网络
- **相关**：
	- [[Cache API]] — 离线能力的存储侧
	- [[PWA]] — 以它为前提
	- [[Service Worker前端案例]]
	- [[前端性能优化]]
