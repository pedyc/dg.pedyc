---
uid: 202603230023
title: Cookie 的特殊性在自动随请求发送，不在存储容量
aliases: []
description: Cookie 是存储在浏览器的小型文本数据，会随每次 HTTP 请求自动发送到服务器
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-10-28
content-type: atomic
up: "[[Cookie]]"
noteId: 1792465705883
---

> Cookie 是存储在浏览器的小型文本数据（~4KB），随每次 HTTP 请求~~自动发送~~到服务器，主要用于服务端识别用户和会话状态管理。

**边界**：这个定位依赖「浏览器自动携带」。`fetch` 跨源默认不带凭据、SameSite 会拦下跨站附带、原生 App 与 curl 根本没有 cookie jar——这些场景里 Cookie 退化成一个需要手动搬运的字符串，服务端「识别用户」这件事也就无从谈起。

## 论据/示例

它能同时服务通信与会话，是因为写入、存储、附带三步都不由页面脚本决定：服务端用 `Set-Cookie` 写，浏览器按 `(name, domain, path)` 存，请求时按域与路径匹配附加。

```http
Set-Cookie: session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

属性表、容量上限、跨站判定见 [[Cookie]]。

## 关联

- [[Cookie]] — 父级概念：写入、存储与附带的完整机制
- [[Web Storage]] — 另一类存法，区别在是否随请求发送
- [[CSRF]] — 靠「自动携带」才成立
