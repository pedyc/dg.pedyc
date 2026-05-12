---
uid: 202605121500
title: MOC-前端缓存方案
aliases: [MOC-前端缓存方案]
description: 前端缓存方案的索引入口，涵盖浏览器缓存、运行时缓存、离线缓存三大方向
tags: []
date-created: 2026-05-12
date-modified: 2026-05-12
status: cultivating
content-type: moc
---

## MOC：前端缓存方案

> 前端缓存方案的索引入口，按缓存层级和用途分类

---

### 浏览器缓存

- [[BOM]] — 浏览器对象模型，localStorage/sessionStorage 所在
- [[Cache API]] — Service Worker 缓存资源的 API
- [[HTTP 缓存]] — 强缓存、协商缓存机制

---

### 运行时缓存

- [[内存缓存]] — 运行时变量、计算结果缓存
- [[V8 引擎]] — JIT 编译优化、隐藏类
- [[Web Worker]] — Worker 线程独立上下文

---

### 离线缓存

- [[Service Worker]] — 离线资源、后台同步
- [[PWA]] — 渐进式网页应用离线能力
- [[Speculation Rules API]] — 预测性预取/预渲染

---

### 性能优化

- [[前端性能优化]] — 缓存策略的终极目标
- [[SOP-调试JavaScript内存泄漏]] — 缓存导致的内存问题排查

---

### 待探索

- [ ] 浏览器缓存与 CDN 缓存的协同策略
- [ ] 离线数据的同步冲突处理
- [ ] 预测性缓存的机器学习应用
