---
uid: 202506070001
title: Web通信
aliases: [MOC-Web通信, Web通信方式]
description: Web通信专题 MOC：聚合 HTTP 协议族、实时通信、跨域通信与客户端通信方式
tags: [前端开发/网络]
date-created: 2025-06-07
date-modified: 2026-08-18
status: active
content-type: moc
up: [[前端开发]]
---

## MOC：Web通信

> Web 通信专题入口：聚合 Web 应用与服务器、第三方服务或其他客户端之间进行数据交换的各种方式。中观层专题，研究边界为「前端如何完成通信」，攻关粒度 5~20 篇高价值资料。

**核心特点**：
- **多样性**：HTTP、WebSocket、CORS 等多种通信方式
- **异步性**：大部分 Web 通信是异步的，不阻塞主线程
- **跨域性**：跨域通信需考虑安全性与兼容性

---

### 分类索引

- **HTTP 通信**
	- [[Fetch API]] — 现代 Web API，用于发起 HTTP 请求
	- [[Axios]] — 基于 Promise 的 HTTP 客户端
	- [[RESTful API]] — 一种设计风格，构建可扩展网络服务
	- **XHR**（XMLHttpRequest）— 古老的 HTTP 请求 API
- **持久连接与实时通信**
	- [[WebSocket]] — 全双工通信协议，允许服务器主动推送
	- [[SSE]]（Server-Sent Events）— 单向服务器推送
	- **Long Polling**（长轮询）— 请求挂起直到有数据，HTTP/2 下成本可控
	- **HTTP/2 Server Push** — 服务器主动推送资源
	- [[WebSocket vs SSE vs Long Polling]] — 三方案实测成本对比
- **跨域通信**
	- [[CORS]] — 跨域安全机制
	- [[JSONP]] — 利用 `<script>` 标签跨域特性
	- [[同源策略]] — 跨域限制的基础机制
- **客户端内通信**
	- [[postMessage]] — 跨源窗口通信
	- [[Broadcast Channel API]] — 同浏览器跨窗口/标签页通信
	- [[EventEmitter]] — 发布/订阅模式实现
	- [[CustomEvent]] — 自定义事件
- **服务端通信**
	- [[WebRTC]] — 浏览器间点对点通信
	- [[GraphQL]] — 查询语言，从服务器获取数据

---

### 协议基础

- [[HTTP]] — 用于传输超文本的应用层协议
- [[HTTP~1.1]] — 持久连接、管道化
- [[HTTP~2]] — 多路复用、头部压缩
- [[HTTP~3]] — QUIC 协议
- [[HTTPS]] — 安全传输
- [[AJAX]] — 异步通信技术

---

### 应用场景

- **数据获取**：从服务器获取数据，渲染页面或更新 UI
- **实时通信**：实时聊天、在线游戏
- **跨域访问**：访问第三方 API
- **组件通信**：组件间传递数据或触发事件

---

### 选型优先级

| 通信方式 | 必须掌握 | 推荐掌握 | 了解即可 |
|:--- |:---: |:---: |:---: |
| fetch / axios | ✅ | | |
| WebSocket | ✅ | | |
| postMessage | ✅ | | |
| CORS / 同源策略 | ✅ | | |
| REST API | ✅ | | |
| GraphQL | | ✅ | |
| JSONP | | | ✅ |
| WebRTC | | | ✅ |
| EventEmitter | ✅ | | |
| CustomEvent | ✅ | | |

---

### 知识网络

- **父级**：[[前端开发]] — 前端领域顶层 area
- **相关**：[[网络协议相关问题]] — 网络协议问题汇总；[[Web安全]] — 跨域安全机制

---

### 待探索

- [ ] 补齐持久连接各方案（WebSocket / SSE / Long Polling）的选型决策树
- [ ] 案例代码沉淀为 SOP（如「使用 WebSocket 实现实时双向通信」）
- [ ] 补齐客户端内通信与服务端通信概念页：[[Axios]] · [[postMessage]] · [[Broadcast Channel API]] · [[EventEmitter]] · [[CustomEvent]] · [[WebRTC]] · [[GraphQL]]
- [ ] 重建或移除 [[JSONP]]（当前指向 40-ARCHIVE 已归档笔记）
- [ ] 收集 5~20 篇高价值 Web 通信资料，对接 NotebookLM 专题研究
