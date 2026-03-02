---
title: axios 和 fetch 的主要区别？
date-created: 2025-05-28
date-modified: 2025-05-28
---

- fetch 是浏览器原生 API，可以直接调用；axios 是第三方库，需要引入
- fetch 不能自动抛出 HTTP 错误，axios 可以
- axios 可以使用拦截器
- axios 支持取消请求（CancelToken）
