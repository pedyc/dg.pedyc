---
uid: 202603240002
title: SameSite Cookie可以限制Cookie在跨站请求中的发送
aliases: []
description: Lax/Strict 模式下，浏览器不会在跨站请求中发送 Cookie
tags: [前端开发/安全/原子]
date-created: 2026-03-24
date-modified: 2026-08-27
status: active
content-type: atomic
up: "[[CSRF]]"
---

> SameSite Cookie 可以限制 Cookie 在跨站请求中的发送，在服务端进行设置

SameSite 是 Cookie 的一个属性，用于控制 Cookie 是否在跨站请求中被发送，从而有效防御 CSRF 攻击。

## 属性值

| 值 | 行为 | 安全性 |
|:---|:---|:---|
| Strict | 仅同站请求发送 | 最高 |
| Lax | 仅导航安全请求发送（GET 链接、预加载） | 中等 |
| None | 允许跨站发送 | 无保护 |

## 对比

**Strict（严格）**：

```http
Set-Cookie: session=abc; SameSite=Strict
```

- Cookie 只在同站请求中发送
- 用户体验差，跨站导航会被拦截
- 适合安全要求高的场景（如银行操作）

**Lax（宽松）**：

```http
Set-Cookie: session=abc; SameSite=Lax
```

- 允许导航安全请求（GET 链接、预加载）
- 阻止 POST 表单跨站请求
- 推荐默认值，平衡安全与体验

**None（无限制）**：

```http
Set-Cookie: session=abc; SameSite=None; Secure
```

- 允许跨站请求发送 Cookie
- 必须配合 Secure（仅 HTTPS）
- 用于需要跨站服务的场景

## CSRF 防御效果

- Lax 模式：阻止通过 POST 表单的 CSRF 攻击
- Strict 模式：完全阻止跨站 Cookie 发送
- 攻击者的恶意页面无法让浏览器发送目标网站的 Cookie
