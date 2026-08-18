---
uid: 202603230008
title: QUIC
aliases: [T-QUIC, QUIC Protocol]
description: QUIC是基于UDP的安全传输协议，是HTTP/3的底层协议，解决了TCP的队头阻塞和连接迁移问题
tags: [前端开发/网络协议]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: term
---

> **领域**：#前端开发/网络协议

### 定义

QUIC（Quick UDP Internet Connections）是 Google 开发的基于 UDP 的安全传输协议，作为 HTTP/3 的底层协议。

**核心特性**：
1. **多路复用**：每个数据流独立传输，无队头阻塞
2. **内置 TLS 1.3**：加密与传输层整合
3. **0-RTT 连接**：缓存密钥，快速恢复连接
4. **连接迁移**：64 位连接 ID，网络切换无需重建

### 与 TCP 对比

| 维度 | QUIC | TCP |
|:--- |:--- |:--- |
| **传输层** | UDP | 自有 |
| **队头阻塞** | 无 | 有 |
| **连接迁移** | ✅ | ❌ |
| **0-RTT** | ✅ | ❌ |
| **TLS** | 内置 | 独立 |

### 知识网络

- **父级概念**：[[HTTP~3]] — QUIC 是 HTTP/3 的底层协议
- **相关概念**：
	- [[UDP]] — QUIC 基于 UDP
	- [[HTTP~2]] — TCP 协议，HTTP/3 的前身
	- [[队头阻塞]] — QUIC 解决了 TCP 的队头阻塞
	- [[TLS]] — QUIC 内置 TLS 1.3
