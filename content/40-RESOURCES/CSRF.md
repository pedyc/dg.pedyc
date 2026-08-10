---
uid: 202512170005
title: CSRF
aliases: [C-CSRF, Cross-Site Request Forgery, 跨站请求伪造]
description: CSRF是一种利用用户已登录身份，诱导浏览器发送恶意请求的攻击方式
tags: [前端开发/安全]
date-created: 2025-12-17
date-modified: 2026-03-23
status: active
content-type: concept
up: [[浏览器安全机制]]
---

> CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种利用用户已登录身份的攻击。攻击者诱导用户访问恶意页面，浏览器会自动携带目标网站的 Cookie 向受信任网站发送恶意请求。

**解决的核心痛点**：如何在利用浏览器自动发送 Cookie 的同时，防止恶意请求？

---

## 核心命题

- [[CSRF的本质是服务器无法区分请求是用户主动发送的还是攻击者伪造的]]
	- **原理**：浏览器自动携带 Cookie，但服务器无法知道请求来源
- [[CSRF Token是防御CSRF的核心方法]]
	- **原理**：攻击者无法读取页面中的 Token，无法伪造请求
- [[SameSite Cookie可以限制Cookie在跨站请求中的发送]]
	- **原理**：Lax/Strict 模式下，浏览器不会在跨站请求中发送 Cookie

---

## 攻击条件

1. 用户已登录目标网站且 Cookie 未过期
2. 用户访问了攻击者构造的恶意网站
3. 浏览器自动携带目标网站的 Cookie

---

## 防御方法

| 方法 | 说明 |
|:---|:---|
| CSRF Token | 服务端生成 Token，前端手动添加到请求头 |
| SameSite Cookie | 限制 Cookie 在跨站请求中的发送 |
| Origin/Referer 检测 | 检查请求来源 |

---

## 知识图谱

- **父级概念**：[[浏览器安全机制]] — CSRF 是 Web 安全攻击类型之一
- **相关概念**：
	- [[XSS]] — 另一种 Web 攻击
	- [[Cookie]] — CSRF 利用的凭证
	- [[点击劫持]] — 常与 CSRF 结合使用
