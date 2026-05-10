---
uid: "202605091300"
title: Web API
aliases: [MOC-Web API, Web API, Browser APIs, 浏览器API]
description: Web API 是浏览器提供给 JavaScript 调用的接口，用于操纵 DOM、网络请求、存储等能力
tags: [前端开发/浏览器API]
date-created: 2026-05-09
date-modified: 2026-05-09
status: cultivating
content-type: moc
---

## MOC：Web API

> Web API 是浏览器（宿主环境）提供给 JavaScript 调用的接口，用于操纵 DOM、网络请求、读取本地存储等浏览器原生能力

---

### 文档与视图

_页面的骨架与窗口交互_

- [[DOM API]] — 文档对象模型，节点操作、事件委托
- [[Shadow DOM]] — 组件隔离的 DOM 结构
- [[BOM API]] — 浏览器对象模型，window/location/history/navigator
- [[IntersectionObserver]] — 懒加载、曝光埋点
- [[ResizeObserver]] — 监听元素尺寸变化
- [[MutationObserver]] — 监听 DOM 变动

---

### 网络与通信

_数据的获取与实时交换_

- [[Fetch API]] — 现代 HTTP 请求，Promise 风格
- [[XHR]] — XMLHttpRequest，传统请求方式
- [[Beacon API]] — 页面卸载时发送数据，用于埋点
- [[WebSocket]] — 全双工实时通信
- [[WebRTC]] — 点对点音视频传输
- [[Server-Sent Events]] — SSE，服务端单向推送

---

### 存储与缓存

_数据持久化方案_

- [[Web Storage API]] — localStorage/sessionStorage，同步，5MB
- [[IndexedDB]] — 异步 NoSQL 数据库，容量大
- [[Cookie]] — 随请求发送，容量小，用于身份认证
- [[Cache API]] — Request/Response 对象对缓存，Service Worker 使用

---

### 性能与多线程

_突破 JS 单线程限制_

- [[Web Worker]] — 后台线程，处理计算密集型任务
- [[Service Worker]] — PWA 核心，拦截网络请求
- [[Performance API]] — 获取 FCP、LCP 等性能指标
- [[RequestAnimationFrame]] — 每帧渲染回调，流畅动画
- [[RequestIdleCallback]] — 空闲时执行低优先级任务
- [[Scheduler]] — 优先级任务调度 API

---

### 多媒体与图形

- [[Canvas API]] — 2D 绘图
- [[WebGL]] — 3D 图形渲染
- [[WebGPU]] — 下一代图形标准
- [[SVG]] — 矢量图形，基于 DOM
- [[Web Audio API]] — 音频处理
- [[HTMLMediaElement]] — video/audio 元素控制

---

### 设备与系统能力

_逐步缩短 Native 与 Web 的差距_

- [[Geolocation API]] — 获取地理位置
- [[File API]] — 文件读取
- [[FileSystem Access API]] — 读写本地文件
- [[Clipboard API]] — 剪贴板操作
- [[Notification API]] — 桌面通知

---

### 动画与交互

- [[Web Animations API]] — 浏览器原生动画 API，命令式控制
- [[CSS Animation]] — CSS 动画声明式方案
- [[GSAP]] — 高性能 JavaScript 动画库

---

### 待探索

- [ ] View Transitions API — 原生页面转场动画
- [ ] Calendar/Contacts API — 访问系统日历和联系人
- [ ] Web NFC API — 近场通信
- [ ] Web Bluetooth — 蓝牙设备通信
