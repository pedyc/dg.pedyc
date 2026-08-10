---
uid: 202605121300
title: Service Worker
aliases: [T-Service-Worker]
description: 运行在浏览器后台的脚本，独立于网页，作为代理服务器实现缓存和离线功能
tags: []
date-created: 2025-05-30
date-modified: 2026-05-12
status: cultivating
content-type: term
---

## 术语：Service Worker

> **领域**：#前端/浏览器 API

### 定义

Service Worker 是浏览器在后台运行的脚本，独立于网页，作为**代理服务器**拦截网络请求，实现缓存管理、离线支持和后台同步功能。

**核心特征**：
- **独立上下文**：运行在独立的全局作用域，不依赖网页
- **生命周期**：注册 → 安装 → 激活，生命周期与网页完全分离
- **拦截请求**：作为代理拦截页面的所有网络请求
- **无 DOM 访问**：无法直接访问页面的 DOM 结构
- **HTTPS 必需**：仅在 HTTPS 或 localhost 环境下可用

**基本生命周期**：

```javascript
// 注册
navigator.serviceWorker.register('/sw.js').then(reg => {
  console.log('Service Worker 注册成功')
})

// sw.js - 安装阶段
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/styles.css'
    ]))
  )
})

// sw.js - 激活阶段
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})

// sw.js - 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  )
})
```

**核心功能**：
- **缓存策略**：Cache-First、Network-First、Stale-While-Revalidate
- **离线支持**：断网时从缓存返回资源
- **后台同步**：网络恢复后执行挂起的后台任务
- **推送通知**：接收服务端推送消息

### 跨学科含义

- **在 PWA 中**：Service Worker 是 PWA（渐进式网页应用）的核心技术，实现类原生应用体验
- **在性能优化中**：通过缓存策略减少网络请求，加速页面加载
- **在前端监控中**：可拦截请求添加监控埋点，或实现离线数据暂存

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：[[Web Worker]] — Service Worker 是特殊的 Web Worker
- **并列概念**：
	- [[Web Worker]] — Dedicated/Shared Worker
	- [[Worklet]] — 轻量级 Worker
- **相关概念**：
	- [[PWA]] — Service Worker 是 PWA 的基础
	- [[前端性能优化]] — 通过缓存实现性能优化
	- [[前端监控]] — 可用于监控埋点和离线数据暂存
	- [[Service Worker前端案例]]
