---
uid: 202603230005
title: HPACK
aliases: [T-HPACK, HPACK Header Compression]
description: HPACK是HTTP/2的头部压缩算法，通过静态表、动态表和哈夫曼编码减少头部传输开销
tags: [前端开发/网络协议]
date-created: 2026-03-23
date-modified: 2026-08-26
status: active
content-type: term
---

> **领域**：#前端开发/网络协议

## 定义

HPACK 是 HTTP/2 的头部压缩算法，专门设计用于高效压缩 HTTP 请求和响应头部。

**压缩机制**：
1. **静态表**：预定义了 61 个常用头部字段（如 `:method: GET`），传输时只需发送索引号
2. **动态表**：服务端与客户端协商的自定义头部字段表，后续请求如果遇到相同字段，只需发送索引
3. **哈夫曼编码**：对字符串进行不等长编码，高频字符用短码

## 知识网络

- **父级概念**：[[HTTP~2]] — HPACK 是 HTTP/2 的头部压缩机制
- **相关概念**：
	- [[HTTP~1.1]] — 无头部压缩
	- [[QPACK]] — HTTP/3 的头部压缩算法（HPACK 的改进版）
