---
uid: 202608161310
title: WebSocket帧头相比HTTP头部大幅减少重复开销
aliases: []
description: 帧头仅 2-14 字节，相比 HTTP 每次重复发送的头部大幅省字节
tags: [前端, 网络协议]
date-created: 2026-08-16
date-modified: 2026-08-16
status: fleeting
content-type: atomic
up: "[[WebSocket]]"
---

> WebSocket 帧头仅 2-14 字节，相比 HTTP 每次重复发送的头部大幅减少开销

WebSocket 用紧凑的二进制帧头封装消息，服务端到客户端 ≤125 字节负载时帧头仅 2 字节，无状态行、无 Header、无 Cookie。HTTP 则每次请求-响应都携带完整头部（Cookie、User-Agent 等），重复发送。

## 论据/示例

- 实测 1000 个 ~117 字节事件：WebSocket 总线上开销 119,692 字节（1.02× 负载），单消息服务端→客户端帧头 2.1 字节
- 对比：长轮询每事件付 570 字节请求头 + 198 字节响应头，其中 Cookie 占比超过事件本身

## 关联

- [[WebSocket]] — 本命题所属的协议概念
- [[HTTP]] — 对比对象，HTTP/2 的 [[HPACK]] 用同样的「压缩重复头」思路补了这个短板
