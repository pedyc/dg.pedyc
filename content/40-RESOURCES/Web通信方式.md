---
uid: 202506150002
title: Web通信方式
aliases: [C-Web通信方式]
description: Web通信方式包括HTTP请求、跨域通信、实时通信等多种方式
tags: [前端开发/网络]
date-created: 2025-06-15
date-modified: 2026-03-23
status: active
content-type: concept
up: [[前端开发]]
---

> Web 通信方式是前端与后端、客户端之间数据交换的各种方式。

**解决的核心痛点**：如何根据不同场景选择合适的通信方式？

---

## 核心命题

- HTTP 请求是 Web 通信的基础
- 跨域通信需要特殊处理
- 实时通信需要持久连接

---

## 通信方式分类

### HTTP 请求

| 方式 | 说明 |
|:---|:---|
| Fetch API | 现代浏览器标准，Promise 风格 |
| Axios | 第三方库，功能丰富 |
| XHR | 古老的 API |

### 跨域通信

| 方式 | 说明 |
|:---|:---|
| CORS | 服务端控制允许跨域 |
| JSONP | 利用 script 标签（仅 GET） |
| postMessage | iframe 窗口通信 |

### 实时通信

| 方式 | 说明 |
|:---|:---|
| WebSocket | 双向实时通信 |
| SSE | 服务器推送（单向） |
| HTTP/2 Server Push | 服务器推送资源 |

### 客户端内通信

| 方式 | 说明 |
|:---|:---|
| EventEmitter | 发布订阅模式 |
| CustomEvent | 原生 DOM 事件 |

---

## 知识图谱

- **父级概念**：[[前端开发]] — Web 通信是前端开发的核心技能
- **相关概念**：
	- [[HTTP]] — 应用层协议
	- [[WebSocket]] — 实时通信协议
	- [[同源策略]] — 跨域限制
	- [[CORS]] — 跨域解决方案
