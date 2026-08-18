---
uid: 202608161320
title: SSE比WebSocket只贵10%字节却换来免费的断线重连与续传
aliases: []
description: SSE 只比 WebSocket 贵约 10% 字节，但 EventSource 自动重连并回传 Last-Event-ID 续传
tags: [前端, 网络协议, 实时通信]
date-created: 2026-08-16
date-modified: 2026-08-16
status: fleeting
content-type: atomic
up: "[[WebSocket vs SSE vs Long Polling]]"
---

> SSE 比 WebSocket 只贵约 10% 字节，却换来浏览器自动的断线重连与续传

SSE 与 WebSocket 的字节差几乎可以忽略，但 SSE 的 `EventSource` 由 HTML 规范强制自动重连，并把上次收到的 `id` 作为 `Last-Event-ID` 请求头回传，让服务器从中断点续传。WebSocket 这些都得自己写——重连循环、退避、续传游标、去重，每次都要重写一遍。

## 论据/示例

- 实测 1000 事件：WebSocket 119,692 字节 vs SSE 131,596 字节（1.13×，即贵约 10%）
- `EventSource` 客户端无需写重连逻辑，浏览器自动重试；服务器读 `Last-Event-ID` 头即可续传

## 关联

- [[SSE]] — 本命题所属的技术
- [[WebSocket vs SSE vs Long Polling]] — 选型对比：默认单向推送先选 SSE 的依据
- [[WebSocket]] — 对比对象
