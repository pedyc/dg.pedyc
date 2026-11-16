---
uid: '20261116111347'
title: Node IO 与并发
aliases: [MOC-NodeIO与并发, "MOC-Node I/O 与并发", NodeIO与并发, Node I/O 与并发]
description: Node I/O 专题 MOC：Buffer 与 Stream、背压，以及从线程池到多进程的四档扩展
tags: [前端开发/Node]
date-created: 2026-11-16
date-modified: 2026-11-16
content-type: moc
up: "[[Node.js]]"
---

## MOC：Node IO 与并发

> 本 MOC 只索引「数据如何进出、负载如何摊开」这一段：Buffer 与 Stream 的形态、背压为什么是流的核心、以及从线程池到多进程的四档扩展。
> 进程管理工具与部署不在本页，那一段等有真实线上产出再单独开。

### 核心原则

前半按**同一份数据被搬了几次**排：Buffer 是一次全量搬运，Stream 是分块搬运，背压是块与块之间的约束。后半按**绕过哪一层限制**排：线程池绕过的是 I/O 阻塞，worker_threads 绕过的是 CPU 阻塞，cluster 绕过的是单进程的内存与 CPU 上限。

### 数据的表示与搬运

- [[Buffer]]（待写）— 定长字节块，Node 里所有二进制数据的底座
- [[Stream]]（待写）— 分块读写，四种流（可读 / 可写 / 双工 / 转换）的组合

### 流的约束

- [[背压]]（待写）— 生产快于消费时由谁减速，以及不减速会怎样

### 扩展的四档

- [[Node 的并发模型]]（待写）— 事件循环 → libuv 线程池 → worker_threads → cluster，何时该上哪一档
- [[worker_threads]]（待写）— 同进程内共享内存的线程
- [[child_process]]（待写）— 独立进程，隔离强但通信要序列化
- [[cluster]]（待写）— 按核数复制进程，共享同一个监听端口

---

### 知识图谱

> 四桶：上位 / 并列 / 相关 / 外部资料。下位就是上面的分类节，不再重复进桶——判据见 [[知识图谱词表]]。

- **上位**：[[Node.js]] — 本领域三段里的第三段
- **并列**：
	- [[Node 运行时模型]] — 代码何时拿到控制权
	- [[Node 模块与包]] — 代码如何被加载
- **相关**：
	- [[Web Worker]] — 浏览器侧的同名能力，差别在于能否共享内存、能否访问文件
	- [[Edge Runtime]] — 没有文件系统与可用线程池的运行时，本段的多数手段在那里不可用
- **外部资料**
	- [Node.js: Stream](https://nodejs.org/api/stream.html) — 四种流与 `highWaterMark` 的官方定义
	- [Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams) — 背压的官方解释，本段缺口的首要信源

### 待探索

- [ ] `worker_threads` 与 `cluster` 的选择判据：共享内存与独立进程，哪一条先失效
- [ ] `highWaterMark` 如何决定背压触发的时机，默认值与实际吞吐的关系
- [ ] 流式处理一个超大文件时，内存占用曲线由哪些参数决定
