---
uid: 202603240001
title: CSRF Token是防御CSRF的核心方法
aliases: []
description: 攻击者能借浏览器自动带上的 Cookie，但读不到页面内容，因此拿不到 Token
tags: [前端开发/安全]
date-created: 2026-03-24
date-modified: 2026-10-24
content-type: atomic
up: "[[CSRF]]"
noteId: 1792465706475
---

> CSRF Token 之所以是核心手段：攻击者能借浏览器自动带上的 Cookie，却**读不到目标页面的内容**，因而拿不到嵌在页面里的 Token，伪造不出一个完整合法的请求。

**边界**：前提是 Token 不泄露。若存在 XSS，或把 Token 存进 Cookie（那就和 Cookie 一样被自动带上），整套防御失效。另外它防的是伪造，不防重放——同一 Token 可被重复使用，除非每次刷新。

## 论据/示例

**同源策略是它的地基**：恶意页面读不到目标站的 DOM，也读不到自定义请求头，能自动带上的只有 Cookie。所以只要存在一个「不在 Cookie 里、每次请求要显式带上」的值，服务端就能把「用户主动发的」与「攻击者伪造的」区分开——这正是 [[CSRF的本质是服务器无法区分请求是用户主动发送的还是攻击者伪造的]] 那条困境的解法。

## 关联

- [[CSRF]] — 父级概念
- [[SameSite Cookie可以限制Cookie在跨站请求中的发送]] — 另一条思路：干脆不让 Cookie 发出去
