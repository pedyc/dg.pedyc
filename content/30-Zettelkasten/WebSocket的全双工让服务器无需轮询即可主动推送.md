---
uid: 202608161300
title: WebSocket的全双工让服务器无需轮询即可主动推送
aliases: []
description: 全双工消除了 HTTP 请求-响应的单向约束，服务器可随时主动推送
tags: [前端, 网络协议]
date-created: 2026-08-16
date-modified: 2026-08-16
status: fleeting
content-type: atomic
up: "[[WebSocket]]"
---

> WebSocket 的全双工让服务器无需客户端轮询即可主动推送消息

HTTP 是请求-响应模型，只有客户端能主动发起请求，服务器只能被动应答；要实现「服务器推送」，只能靠客户端反复轮询。WebSocket 握手后把 HTTP 升级为对等的 TCP 连接，客户端和服务器地位平等，任何一方都可以随时发消息，从而根除了「被动等待」这个约束。

## 论据/示例

- HTTP：`fetch` 后服务器无法主动「找」客户端，实时性只能靠轮询间隔硬撑（间隔越短，请求越密集）
- WebSocket：`ws.send()` 双向可用，服务器 `connection` 事件拿到 socket 后随时 `ws.send()` 推送

## 关联

- [[WebSocket]] — 本命题所属的协议概念
- [[SSE]] — 另一种「服务器主动推送」方案，但只有单向（服务器→客户端）
