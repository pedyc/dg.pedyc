---
uid: 202603240002
title: SameSite Cookie可以限制Cookie在跨站请求中的发送
aliases: []
description: 与 Token 思路相反：不加凭据，而是让浏览器在跨站时不带 Cookie
tags: [前端开发/安全]
date-created: 2026-03-24
date-modified: 2026-10-24
content-type: atomic
up: "[[CSRF]]"
noteId: 1792465709591
---

> SameSite 让浏览器在跨站请求中**不发送 Cookie**，等于直接抽掉 CSRF 依赖的那份凭证。它与 Token 是相反的两条路：Token 是「多带一个攻击者拿不到的凭据」，SameSite 是「干脆不带那个凭据」。

**边界**：它只挡 Cookie，不挡请求本身，且只在浏览器侧生效。也不是免费的——Strict 会让从外站跳回来的用户掉登录态；None 必须配合 `Secure`（仅 HTTPS）。

## 论据/示例

`SameSite=Lax` 是现在的浏览器默认值：放行导航类的安全请求（GET 链接、预加载），但拦掉跨站 POST 表单——挡住最典型的 CSRF 姿势，同时不至于「从外链跳回来就掉登录」。`Strict` 只认同站，最安全也最容易打断体验；`None` 完全放开，跨站场景不得不用它，代价是必须加 `Secure`。

三值的完整对照见 [[CSRF]] 的防御方法一节。

## 关联

- [[CSRF]] — 父级概念
- [[CSRF Token是防御CSRF的核心方法]] — 相反的思路：多带一个凭据
