---
uid: 202608161305
title: WebSocket只需一次握手后续消息无需重复建立连接
aliases: []
description: 一次握手建立持久连接，后续消息复用同一条 TCP 连接
tags: [前端, 网络协议]
date-created: 2026-08-16
date-modified: 2026-08-27
status: fleeting
content-type: atomic
up: "[[WebSocket]]"
---

> WebSocket 只需一次握手，后续消息复用同一条连接，无需重复建立

HTTP 每次请求都要经历一次完整的 TCP 握手（即便 Keep-Alive 复用连接，也仍有请求-响应的往返语义开销）。WebSocket 通过一次 HTTP Upgrade 握手后，把连接升级为长期持有的 TCP 通道，之后所有消息都在这条连接上以帧的形式传输，不再重复「建连-拆连」。

## 论据/示例

- 握手流程：客户端发 `Upgrade: websocket` + `Sec-WebSocket-Key` → 服务器回 `101 Switching Protocols` → 升级完成

> Websocket 握手阶段，客户端发送的`Sec-WebSocket-Key` 与固定魔数拼接后，进行 SHA-1 加密并作 Base64编码 #card

- 实测：1000 个事件走 WebSocket 只建 1 条 TCP 连接、0 个额外 HTTP 请求；长轮询 HTTP/1.1 无 Keep-Alive 则要开 1000 条连接

## 关联

- [[WebSocket]] — 本命题所属的协议概念
- [[持久连接]] — HTTP 层的连接复用，与 WebSocket 的持久通道是同一思路
