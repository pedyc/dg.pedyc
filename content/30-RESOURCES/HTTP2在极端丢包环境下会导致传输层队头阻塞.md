---
uid: "202608262340"
title: HTTP2在极端丢包环境下会导致传输层队头阻塞
tags: ["网络协议"]
date-created: 2026-08-26
date-modified: 2026-08-26
status: fleeting
content-type: atomic
up: ["[[HTTP]]"]
---

> HTTP2的底层仍然基于TCP协议，若网络中发生单个数据包丢失，TCP的滑动窗口和确认重传机制会阻塞后续所有流的数据交付，导致传输层的队头阻塞。

## 论据/示例

- [[HTTP2在丢包环境下为什么会性能倒退]]

## 关联

- [[HTTP]]
- [[网络协议]]
