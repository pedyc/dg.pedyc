---
title: Web通信
description: 前端工程师需要掌握的各种 Web 通信方式，包括 HTTP 通信、跨域通信、持久连接、客户端内通信和服务端通信等。
tags: [前端, 网络, 通信]
date-created: 2025-05-19
date-modified: 2025-05-29
content-type: concept
keywords: [Web通信, HTTP, WebSocket, CORS]
para: AREA
zettel: permanent
---

## 🔎概述

前端开发工程师在现代 Web 应用中需要频繁与后端、第三方服务、甚至其他客户端通信，因此掌握各种通信方式是必不可少的技能之一。

## Web 通信方式

### 一、[[HTTP]] 通信方式（基础 & 常用）

 1. [[XHR]]（XMLHttpRequest）

- 描述： 古老但仍在使用的 API，尤其是在老项目中。
- 要点： 熟悉其回调地狱问题，有助于理解现代 API 的进化。

2. [[Fetch API]] ✅

- 描述： 现代浏览器标准，Promise 风格更优雅。
- 要点：
		- 支持 `AbortController` 中断请求。
		- 对错误处理要熟练掌握（HTTP 错误不会 throw）。

3. [[Axios]] (第三方库) ✅

- 描述： 基于 `XHR` 封装，提供更强的功能（拦截器、自动转换 JSON、取消请求等）。
- 要点： 项目中非常常用，很多公司默认用它。

### 二、[[CORS]] 通信 (CORS 关键词)

 1. [[同源策略]] & CORS ✅

- 描述： 理解浏览器为什么阻止跨域请求，掌握 CORS 的配置方式（尤其是前后端分离项目）。
- 要点： 掌握 CORS 的配置方式（尤其是前后端分离项目）。

2. JSONP (历史遗留) 🔧

- 描述： 只支持 `GET` 请求，几乎被淘汰，但面试可能问，理解其绕过同源策略的原理。
- 要点： 理解其绕过同源策略的原理。

3. iframe 通信：[[postMessage]] ✅

- 描述： 在不同源的 iframe 与主页面之间通信。
- 要点： 必须熟悉安全性（验证 origin）。

### 三、持久连接类 (实时通信场景)

1. [[WebSocket]] ✅✅

- 描述： 双向通信，适合聊天、游戏、股票行情等实时场景。
- 要点： 前端需掌握连接、断线重连、心跳检测等机制。

2. [[SSE]]（Server-Sent Event）

- 描述： 单向通信（服务器 -> 客户端）。
- 要点： 实现简单，但兼容性和灵活性不如 WebSocket。

3. [[HTTP/2]] Push (了解即可)

- 描述： 服务器主动推送资源，但前端控制能力有限，应用场景少。
- 要点： 了解即可。

### 四、客户端内通信 (页面内部模块通信)

 1. EventEmitter / 发布 - 订阅模式

- 描述： Vue、React 组件间通信时常用。
- 要点： 对状态管理方案有一定依赖。

 2. CustomEvent / dispatchEvent / addEventListener

- 描述： 原生 DOM 事件系统，组件或模块间的松耦合通信方式。
- 要点： 组件或模块间的松耦合通信方式。

### 五、服务端通信相关协议 (了解层面)

1. [[RESTful API]] ✅

- 描述： HTTP 动词语义明确，资源导向，是前端通信的主流方式。
- 要点： 是前端通信的主流方式。

 2. [[GraphQL]]

- 描述： 更灵活的数据查询方式。
- 要点： 需了解其请求结构和客户端库（如 Apollo Client）。

 3. gRPC (Web 支持中等)

- 描述： 基于 HTTP/2 的高效通信协议。
- 要点： 了解其与 REST/GraphQL 的差异，特别是在大型项目或与移动端协作中。

### 六、P2P 通信 (了解即可)

 1. WebRTC (音视频传输、文件分享)

- 描述： 前端实现音视频通话的核心技术。
- 要点： 涉及较多底层知识，如 STUN/TURN、ICE 等。

## 🎯 总结

### 前端优先级

| 通信方式          | 必须掌握 | 推荐掌握 | 了解即可 |
| ------------- | ---- | ---- | ---- |
| fetch / axios | ✅    |      |      |
| WebSocket     | ✅    |      |      |
| postMessage   | ✅    |      |      |
| CORS / 同源策略   | ✅    |      |      |
| REST API      | ✅    |      |      |
| GraphQL       |      | ✅    |      |
| JSONP         |      |      | ✅    |
| WebRTC        |      |      | ✅    |
| EventEmitter  | ✅    |      |      |
| CustomEvent   | ✅    |      |      |

i

## ❓问答卡片

![[FAQ-Web通信]]
