---
uid: 202603230023
title: Cookie 用于服务端通信和会话状态管理
aliases: []
description: Cookie 是存储在浏览器的小型文本数据，会随每次 HTTP 请求自动发送到服务器
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[Web存储]]
---

> Cookie 是存储在浏览器的小型文本数据（~4KB），随每次 HTTP 请求自动发送到服务器，主要用于服务端识别用户和会话状态管理。

### 论据/示例

**工作原理**：
1. 服务器通过 `Set-Cookie` 响应头设置 Cookie
2. 浏览器保存 Cookie
3. 后续请求自动携带 Cookie（通过 `Cookie` 请求头）

**服务端设置**：
```http
Set-Cookie: session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

**客户端读取**：
```javascript
document.cookie  // 读取所有可访问的 Cookie
```

**安全属性**：

| 属性 | 作用 |
|:---|:---|
| `HttpOnly` | 禁止 JavaScript 访问，防止 XSS 窃取 |
| `Secure` | 仅在 HTTPS 连接中发送 |
| `SameSite` | 限制跨站请求发送（Strict/Lax/None） |
| `Max-Age` | 过期时间（秒） |

**常见用途**：
- 用户登录会话标识
- 购物车数据
- 个性化设置偏好

### 关联

- [[Web存储]] — 本观点的主题
- [[Session]] — 服务端会话概念
- [[CSRF]] — Cookie 相关的安全攻击
