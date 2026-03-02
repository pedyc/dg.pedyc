---
title: Web APIs
aliases: [Browser APIs, Web Interfaces]
tags: [领域/前端, 浏览器/API, 索引/MOC]
date-created: 2025-12-17
date-modified: 2025-12-25
status: 🟢 活跃
---

## 🧩 领域：Web APIs

### 🔎 核心定义

> [!abstract] 浏览器的超能力
> **Web API** 是浏览器（宿主环境）提供给 JavaScript 调用的接口。
> JavaScript 语言本身（ECMAScript）只规定了语法和标准库（Array, Object），而**操纵 DOM、发送网络请求、读取本地存储**等能力，全靠浏览器提供的 Web API 桥接实现。

```mermaid
graph LR    
    subgraph Browser [浏览器宿主能力]
        WebAPI --> DOM[DOM 渲染]
        WebAPI --> Net[网络线程]
        WebAPI --> GPU[图形渲染]
        WebAPI --> Disk[本地存储]
    end
````

---

### 🏗️ 原生能力导航 (Native Capabilities)

#### 1. 文档与视图 (Document & View)

_页面的骨架与窗口交互_

- **文档对象模型**：[[DOM API]] (节点操作, 事件委托) | [[Shadow DOM]] (组件隔离)
- **浏览器对象模型**：[[BOM API]] (`window`, `location`, `history`, `navigator`)
- **现代观察者**：
	- [[IntersectionObserver]] (懒加载/曝光埋点神器)
	- [[ResizeObserver]] (监听元素尺寸变化)
	- [[MutationObserver]] (监听 DOM 变动)

#### 2. 网络与通信 (Network)

_数据的获取与实时交换_

- **HTTP 请求**：
	- [[Fetch API]] (现代标准，Promise 风格)
	- [[XHR]] (XMLHttpRequest，旧标准，Axios 底层)
	- [[Beacon API]] (页面卸载时发送数据，用于埋点)
- **实时通信**：
	- [[WebSocket]] (全双工通信)
	- [[WebRTC]] (点对点音视频传输)
	- [[Server-Sent Events]] (SSE，服务端单向推送)

#### 3. 存储与缓存 (Storage & Cache)

_[[浏览器存储方案对比|数据持久化方案对比]]_

| **API**             | **特点**                                 | **典型场景**              |
| ------------------- | -------------------------------------- | --------------------- |
| [[Web Storage]] | `localStorage`/`sessionStorage`，同步，5MB | 简单的配置项、Token          |
| [[IndexedDB]]   | 异步，NoSQL 数据库，容量大                       | 复杂离线数据、富文本草稿          |
| [[Cookie]]      | 随请求发送，容量小 (4kb)                        | 身份认证 (Session ID)     |
| [[Cache API]]   | Request/Response 对象对缓存                 | Service Worker 离线资源缓存 |

#### 4. 性能与多线程 (Performance & Threads)

_突破 JS 单线程限制_

- **后台线程**：[[Web Worker]] (处理计算密集型任务)
- **离线与代理**：[[Service Worker]] (PWA 的核心，拦截网络请求)
- **页面性能**：[[Performance API]] (获取 FCP, LCP 等精确指标) | [[RequestAnimationFrame]] (流畅动画)

#### 5. 多媒体与图形 (Media & Graphics)

- **2D/3D 绘图**：[[Canvas API]] | [[WebGL]] / [[WebGPU]] (下一代图形标准)
- **矢量图**：[[SVG]] (基于 DOM 的图形)
- **音视频**：[[Web Audio API]] (音频处理) | [[HTMLMediaElement]] (`<video>`/`<audio>` 控制)

#### 6. 设备与系统能力 (Device Access)

_逐步缩短 Native 与 Web 的差距_

- **位置**：[[Geolocation API]]
- **文件操作**：[[File API]] | [[FileSystem Access API]] (读写本地文件)
- **剪贴板**：[[Clipboard API]]
- **通知**：[[Notification API]]

---

### 🔌 第三方生态 (Third-Party Ecosystem)

_利用外部服务扩展 Web 能力_

虽然这些不是浏览器标准，但前端开发常需集成：

- **地图/GIS**：Google Maps SDK, Mapbox GL JS, [[高德/百度地图API]]
- **认证/社交**：[[OAuth]] (Login with Google/GitHub/微信), Firebase Auth
- **支付**：Stripe SDK, PayPal, 微信/支付宝 H5 支付
- **数据分析**：Google Analytics, Sentry (监控 SDK)

---

### 📥 学习与待办 (Inbox)

- [ ] **面试必考**：[[LocalStorage与Cookie的区别]]
- [ ] **面试必考**：[[Fetch与Axios的区别]]
- [ ] **实战**：使用 `IntersectionObserver` 实现无限滚动列表。
- [ ] **前沿**：了解 `View Transitions API` (原生页面转场动画)。

### 📚 参考资料

- [[MDN Web APIs 索引]] - 权威字典
- [[Can I use]] - 兼容性查询
