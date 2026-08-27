---
uid: 202603240005
title: CORS凭证与跨域
aliases: []
description: 携带凭证时不能使用通配符，必须指定具体 origin
tags: [前端开发/安全/原子]
date-created: 2026-03-24
date-modified: 2026-08-27
status: active
content-type: [term]
up: "[[CORS]]"
---

> CORS 凭证与跨域

当请求需要携带 Cookie 或 Authorization 时，CORS 有特殊限制。

## 关键规则

1. **Access-Control-Allow-Credentials: true** — 允许发送凭证
2. **Access-Control-Allow-Origin 不能是 \*** — 必须指定具体域名

## 示例

**前端请求**：

```javascript
fetch('https://api.example.com/data', {
  credentials: 'include'  // 携带 Cookie
})
```

**服务端响应（正确）**：

```http
Access-Control-Allow-Origin: https://example.com  # 不能是 *
Access-Control-Allow-Credentials: true
```

**服务端响应（错误）**：

```http
Access-Control-Allow-Origin: *  # ❌ 携带凭证时不能使用通配符
Access-Control-Allow-Credentials: true
```

## 为什么不能使用 *

如果允许所有源（*）并携带凭证，恶意网站也能获取用户凭证，存在安全风险。

## 前端设置

- `credentials: 'include'` — 发送所有凭证
- `credentials: 'same-origin'` — 仅同站发送
- `credentials: 'omit'` — 不发送凭证
