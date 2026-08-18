---
uid: 202603240003
title: CORS是浏览器允许服务端控制跨域访问的机制
aliases: []
description: 服务端通过响应头声明允许哪些源访问，浏览器执行控制
tags: [前端开发/安全/原子]
date-created: 2026-03-24
date-modified: 2026-03-24
status: active
content-type: atomic
up: [[CORS]]
---

> CORS 是浏览器允许服务端控制跨域访问的机制

CORS（Cross-Origin Resource Sharing，跨域资源共享）让服务端通过 HTTP 响应头声明允许哪些源（origin）访问资源，浏览器根据这些响应头决定是否允许跨域请求。

## 工作原理

1. **浏览器发送请求**：前端发起跨域 Fetch/Ajax 请求
2. **浏览器检查响应头**：浏览器检查响应中是否有 `Access-Control-Allow-Origin`
3. **决定是否放行**：匹配则允许访问，不匹配则拒绝

## 关键响应头

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

## 为什么需要 CORS

- 同源策略限制跨域读取
- 服务端需要显式声明允许跨域
- 浏览器强制执行，服务端无法绕过
