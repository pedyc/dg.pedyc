---
uid: "202610232320"
title: QUIC的PacketNumber单调递增消除了重传歧义
aliases:
  - QUIC Packet Number
  - 重传歧义
description: "TCP 用同一个 Seq 同时承担位置与次序两个身份，重传时无法判定 ACK 对应初传还是重传；QUIC 把序号与位置解耦，重传不再污染 RTT 测量"
tags:
  - 计算机网络
  - QUIC
  - 传输层
date-created: 2026-10-23
date-modified: 2026-10-23
status: active
content-type: atomic
up: "[[QUIC]]"
---

## 命题：QUIC的PacketNumber单调递增消除了重传歧义

> **核心洞见**：TCP 的重传报文沿用原始 Seq 号，接收端无法区分一个 ACK 到底是确认初传还是确认重传，只能按 Karn 算法粗暴地不采样重传报文的 RTT；QUIC 为每个 Packet（**包括重传包**）分配严格单调递增的 ~~Packet Number~~，而把「这段数据在流中的位置」交给帧内独立的 Offset 字段承载——序号与位置从此解耦，重传不再污染 RTT 测量。

### 论据：一个字段背了两个身份

- TCP 的 `Seq` 同时表示「这条数据在流里的位置」和「这是第几次发送」。平时两者重合，重传时冲突：位置没变，但传输次序已经变了。
- 后果不是抽象的：RTT 样本被迫丢弃 → RTO 估算偏保守 → 超时被拉长；或者 ACK 归错对象 → 伪重传（spurious retransmission），白占带宽。
- QUIC 把两个身份拆开：`Packet Number` 只回答「这是第几次发送」，`Offset` 只回答「这段数据属于流的哪个位置」。重传是「新的一次发送、同一段位置」，两件事各归各的字段。

### 边界：解耦也有代价

- Packet Number 在头部只传差值（隐式编码）以省开销，代价是包乱序到达时可能无法立即解密后续包——头部保护依赖前序编号，缺包会导致「解密阻塞」。它不是队头阻塞，但同样是延迟来源。

### 关联

- 支撑概念：[[QUIC]]
- 同一篇拆出的相邻命题：[[HTTP3基于QUIC协议消除传输层队头阻塞]]
