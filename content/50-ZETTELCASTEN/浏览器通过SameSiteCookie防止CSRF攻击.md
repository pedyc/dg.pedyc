---
uid: 202603230019
title: 浏览器通过 SameSite Cookie 防止 CSRF 攻击
aliases: []
description: Cookie 的 SameSite 属性限制跨站请求时 Cookie 的发送
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[浏览器安全机制]]
---

> 浏览器通过 Cookie 的 SameSite 属性限制跨站请求时 Cookie 的发送，从而防止 CSRF（跨站请求伪造）攻击。

### 论据/示例

**SameSite 取值**：

| 值 | 行为 | 用途 |
|:---|:---|:---|
| `Strict` | 完全禁止跨站发送 | 高安全场景 |
| `Lax` | 导航请求允许（GET） | 默认值，平衡安全与体验 |
| `None` | 允许跨站发送 | 需要配合 Secure |

**示例**：
```http
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
```

**CSRF 防御原理**：
- 攻击者诱导用户访问恶意页面
- 恶意页面发起跨站请求（如 POST bank.com/transfer）
- 若 Cookie 无 SameSite 限制，请求会携带 Cookie
- SameSite=Lax/Strict 时，浏览器不发送 Cookie，请求被服务器拒绝

### 关联

- [[浏览器安全机制]] — 本观点的主题
- [[CSRF]] — SameSite 防御的目标攻击
- [[Cookie安全]] — Cookie 的其他安全属性
