---
uid: 202603240004
title: CORS简单请求不发送预检而复杂请求会发送预检请求
aliases: []
description: 浏览器按「方法 + 请求头」二分：简单请求直接发，复杂请求先发 OPTIONS 问一句
tags: [前端开发/安全]
date-created: 2026-03-24
date-modified: 2026-10-24
content-type: atomic
up: "[[CORS]]"
noteId: 1792465706102
---

> 浏览器按「方法 + 请求头」把跨域请求分成两类：简单请求直接发，复杂请求先发一次 OPTIONS 预检，确认服务端允许后才发真实请求。

**边界**：预检只是「先问一句」，它不是安全机制——放行与否仍由响应头决定。另外预检结果会被 `Access-Control-Max-Age` 缓存，调试时「没看到预检」往往只是缓存命中。

## 论据/示例

判据就两条：**方法**是 GET / HEAD / POST 之一，且**请求头**只用 Accept、Accept-Language、Content-Language 和三种简单 Content-Type（`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`）→ 简单请求；反过来，用了 DELETE / PUT 等方法，或带了自定义头（`Authorization`、`X-` 开头）→ 复杂请求，先发 OPTIONS 并带上 `Access-Control-Request-Method` 问一句。

完整对照见 [[CORS]] 的请求类型表。

## 关联

- [[CORS]] — 父级概念
- [[CORS的约束只在浏览器侧生效，服务端无法单方面实施]] — 无论预检与否，拦截都发生在浏览器侧
