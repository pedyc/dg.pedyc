---
uid: 202505230003
title: CORS
aliases: [C-CORS, 跨域资源共享]
description: CORS是一种机制，允许服务端通过HTTP响应头控制跨域访问
tags: [前端开发/安全]
date-created: 2025-05-23
date-modified: 2026-06-15
status: active
content-type: concept
up: [[浏览器安全机制]]
---

> CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种机制，允许服务端通过 HTTP 响应头声明允许哪些源访问资源，浏览器根据响应头决定是否放行跨域请求。

**解决的核心痛点**：如何在保持同源策略安全性的同时，允许受控的跨域访问？

---

## 核心命题

- [[CORS是浏览器允许服务端控制跨域访问的机制]]
	- **原理**：服务端通过响应头声明允许的 origin，浏览器强制执行
- [[CORS简单请求不发送预检而复杂请求会发送预检请求]]
	- **原理**：浏览器根据请求方法/头判断，复杂请求先发 OPTIONS 确认
- [[CORS凭证与跨域]]
	- **原理**：携带凭证时不能使用通配符，必须指定具体 origin

---

## 请求类型

| 类型 | 条件 | 行为 |
|:---|:---|:---|
| 简单请求 | GET/POST/HEAD + 简单头 | 直接发送 |
| 复杂请求 | 其他方法/自定义头 | 先发预检 |

---

## 核心响应头

| 响应头 | 作用 |
|:---|:---|
| Access-Control-Allow-Origin | 允许的域名（* 或具体域名） |
| Access-Control-Allow-Methods | 允许的方法 |
| Access-Control-Allow-Headers | 允许的请求头 |
| Access-Control-Allow-Credentials | 是否允许携带凭证 |
| Access-Control-Max-Age | 预检结果缓存时间 |

---

## 知识图谱

- **父级概念**：[[浏览器安全机制]] — CORS 是同源策略的安全扩展
- **相关概念**：
	- [[同源策略]] — CORS 的基础安全策略
	- [[CSRF]] — CORS 配置不当可能导致的安全问题
	- [[JSONP]] — 另一种跨域方案（已过时）→ 参见 [[50-ARCHIVE/JSONP]]

## FAQ

- [[前端怎么应用CORS|Q-前端怎么应用CORS]]
