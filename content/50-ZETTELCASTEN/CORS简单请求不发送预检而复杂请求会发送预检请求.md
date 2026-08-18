---
uid: 202603240004
title: CORS简单请求不发送预检而复杂请求会发送预检请求
aliases: []
description: 浏览器根据请求条件决定是否先发送 OPTIONS 预检请求
tags: [前端开发/安全/原子]
date-created: 2026-03-24
date-modified: 2026-03-24
status: active
content-type: atomic
up: [[CORS]]
---

> CORS 简单请求不发送预检，而复杂请求会发送预检请求

浏览器根据请求条件判断是简单请求还是复杂请求（需预检）。

## 简单请求条件

**全部满足**：
- 请求方法：GET、HEAD、POST
- 请求头：只能是以下之一
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type（仅限 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`）

## 复杂请求（需预检）

**任一满足**：
- 使用 GET/POST/HEAD 以外的方法（DELETE、PUT 等）
- 使用自定义请求头（如 Authorization、X-Custom-Header）
- Content-Type 不是简单类型

## 预检请求

```http
OPTIONS /api/data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header

// 响应
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Max-Age: 86400
```

预检请求确认服务端允许后再发送实际请求。
