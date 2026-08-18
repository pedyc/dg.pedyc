---
uid: 202603230009
title: QPACK
aliases: [T-QPACK, QPACK Header Compression]
description: QPACK是HTTP/3的头部压缩算法，是HPACK的改进版，支持动态表的无序解压缩
tags: [前端开发/网络协议]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: term
---

> **领域**：#前端开发/网络协议

### 定义

QPACK 是 HTTP/3 的头部压缩算法，是 HPACK 的改进版。

**与 HPACK 的区别**：
- HPACK（HTTP/2）：动态表必须按顺序解压缩 → 队头阻塞
- QPACK（HTTP/3）：使用流控制，允许无序解压缩 → 无队头阻塞

**压缩机制**：
1. **静态表**：与 HPACK 相同
2. **动态表**：通过 ACK 确认机制，支持流间引用
3. **哈夫曼编码**：与 HPACK 相同

### 知识网络

- **父级概念**：[[HTTP~3]] — QPACK 是 HTTP/3 的头部压缩算法
- **相关概念**：
	- [[HPACK]] — HTTP/2 的头部压缩算法
	- [[多路复用]] — QPACK 依赖多路复用实现无序解压缩
