---
title: fetch 和 XMLHttpRequest 有哪些主要区别？
date-created: 2025-05-28
date-modified: 2025-05-28
---

- fetch 基于 Promise，XHR 基于事件回调
- fetch 不会自动抛出 HTTP 错误（如 404，500）
- fetch 支持 AbortController，可以打断请求
- fetch 不支持进度监听（如下载、上传）
