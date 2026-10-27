---
uid: 202512170005
title: CSRF
aliases: [C-CSRF, Cross-Site Request Forgery, 跨站请求伪造]
description: CSRF是一种利用用户已登录身份，诱导浏览器发送恶意请求的攻击方式
tags: [前端开发/安全]
date-created: 2025-12-17
date-modified: 2026-08-27
status: active
content-type: concept
up: "[[Web安全问题]]"
---

> CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种利用用户已登录身份的攻击。攻击者诱导用户访问恶意页面，浏览器会自动携带目标网站的 Cookie 向受信任网站发送恶意请求。

**解决的核心痛点**：如何在利用浏览器自动发送 Cookie 的同时，防止恶意请求？

---

## 核心命题

- [[CSRF的本质是服务器无法区分请求是用户主动发送的还是攻击者伪造的]]
	- **原理**：浏览器自动携带 Cookie，但服务器无法知道请求来源
- [[CSRF Token的有效性取决于攻击者读不到页面]]
	- **原理**：Token 嵌在页面里，攻击者读不到页面就伪造不出完整请求——同源策略是它的地基
- [[SameSite按站而非源判定是否附带Cookie]]
	- **原理**：判定单位是「站」而非「源」，跨站请求默认不带 Cookie；但同站不同源（如 `app.` 与 `api.` 两个子域）之间照带，所以它挡不住被攻陷的兄弟子域

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

前两条是相反的两条路：Token 是「多带一个攻击者拿不到的凭据」，SameSite 是「干脆不带那个凭据」。二者不互斥，通常一起上——Token 挡得住同站子域的攻击，SameSite 挡得住没做 Token 的老接口。

#### SameSite 的三个取值

| 值 | 行为 | 取舍 |
|:---|:---|:---|
| `Strict` | 仅同站请求发送 | 最安全，但从外站跳回来会掉登录态 |
| `Lax` | 放行导航类安全请求（GET 链接、预加载），拦掉跨站 POST | 浏览器默认值，安全与体验的平衡点 |
| `None` | 完全允许跨站发送 | 必须配合 `Secure`（仅 HTTPS） |

```http
Set-Cookie: session=abc; SameSite=Lax
```

---

## 知识图谱

- **上位**：[[Web安全问题]] — CSRF 是一种攻击类型，不是一个浏览器机制
- **相关**：
	- [[XSS]] — 另一种 Web 攻击
	- [[Cookie]] — CSRF 利用的凭证
	- [[点击劫持]] — 常与 CSRF 结合使用
	- [[SameSite按站而非源判定是否附带Cookie]] — 机制侧：为什么跨站不带 Cookie
	- [[浏览器安全机制]] — 机制侧的总入口
