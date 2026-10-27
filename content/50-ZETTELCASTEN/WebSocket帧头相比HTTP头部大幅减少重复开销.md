---
uid: 202608161310
title: WebSocket帧头相比HTTP头部大幅减少重复开销
aliases: []
description: 帧头仅 2-14 字节，相比 HTTP 每次重复发送的头部大幅省字节
tags:
  - 前端
  - 网络协议
date-created: 2026-08-16
date-modified: 2026-10-27
status: fleeting
content-type: atomic
up: "[[WebSocket]]"
noteId: 1792465712434
---

> WebSocket~~帧头~~仅 2-14 字节，相比 HTTP 每次重复发送的头部大幅减少开销

WebSocket 用紧凑的二进制帧头封装消息，服务端到客户端 ≤125 字节负载时帧头仅 2 字节，无状态行、无 Header、无 Cookie。HTTP 则每次请求-响应都携带完整头部（Cookie、User-Agent 等），重复发送。

**边界**：这个优势只在高频小消息上成立。低频请求省下的头部还不够握手成本；而 HTTP/2 的 HPACK 已把重复头部压到几字节，HTTP/3 更进一步，差距大幅缩小。所以「帧头小」不是选 WebSocket 的理由，「双向主动推送」才是。

## 论据/示例

- 实测 1000 个 ~117 字节事件：WebSocket 总线上开销 119,692 字节（1.02× 负载），单消息服务端→客户端帧头 2.1 字节
- 对比：长轮询每事件付 570 字节请求头 + 198 字节响应头，其中 Cookie 占比超过事件本身

## 关联

- [[WebSocket]] — 本命题所属的协议概念
- [[HTTP]] — 对比对象，HTTP/2 的 [[HPACK]] 用同样的「压缩重复头」思路补了这个短板
