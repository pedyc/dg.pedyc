---
uid: 202608262347
title: HTTP2 通过多路复用实现真正的并发请求
aliases:
  - HTTP/2 通过多路复用实现真正的并发请求
tags: []
date-created: 2026-08-26
date-modified: 2026-10-23
status: fleeting
content-type: atomic
up: "[[HTTP]]"

noteId: 1792475163142
---

> HTTP2 通过~~多路复用~~实现真正的并发请求

**边界**：多路复用解决的是连接数量，不是带宽。同一条 TCP 连接上一个分节丢失，所有流一起等——丢包率高的网络里，HTTP/2 的单连接可能比 HTTP/1.1 的多连接更慢。

## 论据/示例

HTTP2引入了二进制分帧机制，将应用层信息拆分为 Frame（帧）和 Stream（流），改用二进制编码传输。同一个TCP连接上支持~~并发交错传输~~多个具有独立 ID 的 Stream，客户端和服务端通过 Sream ID 重组消息，实现多路复用。

## 关联

- [[多路复用]]
