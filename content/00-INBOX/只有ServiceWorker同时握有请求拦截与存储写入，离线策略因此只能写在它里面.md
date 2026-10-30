---
uid: 20261030112539
title: 只有ServiceWorker同时握有请求拦截与存储写入，离线策略因此只能写在它里面
tags: []
content-type: atomic
up: ["[[浏览器缓存与客户端存储体系]]"]
date-created: 2026-10-30
date-modified: 2026-10-30
---

> 只有ServiceWorker同时握有~~请求拦截与存储写入~~，离线策略因此只能写在它里面

**边界**：本观点强调的是ServiceWorker同时握有，并非只有ServiceWorker能够拦截请求或者写入存储。

## 论据/示例（可选）

<!-- 仅当洞见非显而易见、或需留存推理链时才写。否则留空，论证留给 concept -->

页面里的 JS 能写 IndexedDB / Cache API，但碰不到 `fetch`；CDN 与网关能拦请求，但碰不到浏览器存储。两侧各缺一半，只有 Service Worker 既能宿在独立线程监听 `fetch` 改写响应，又能调用 `Cache API` / `IndexedDB` 决定回本地副本还是透传网络。唯一性只限浏览器运行时——边缘函数不在此列。
