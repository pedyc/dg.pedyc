---
uid: 202605061400
title: React Fiber 采用链表结构代替递归
description: React Fiber 用链表代替递归树遍历，实现可中断的渲染
tags: []
date-created: 2026-05-06
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[Fiber]]"

noteId: 1792465708630
---

> React Fiber 用~~链表~~代替~~递归~~树遍历，使渲染过程可中断、可恢复

**边界**：链表化换来的是可中断，代价是丢掉递归自带的调用栈，必须自己维护遍历状态（`child` / `sibling` / `return` 三个指针）。这也是 Fiber 相关源码比递归版本难读的根源。它不改变渲染结果，只改变渲染过程的可控性。

## 论据/示例

递归把遍历位置存在调用栈里——栈归引擎管，无法保存，所以停下来就意味着从头再来。链表把同一份「我在哪」放回节点自身（`child` / `sibling` / `return`），随时可以停、随时可以捡起来。

代价是遍历逻辑得自己写。指针结构与遍历代码见 [[Fiber]]。

## 关联

- [[React]]
- [[React Fiber是可中断的增量渲染架构]]
