---
uid: 202605061500
title: React Fiber 的时间切片基于优先级调度
aliases: []
description: React Fiber 通过优先级队列调度工作单元，高优先级可打断低优先级
tags: []
date-created: 2026-05-06
date-modified: 2026-10-27
status: fleeting
content-type: atomic
up: "[[Fiber]]"

noteId: 1792465708846
---

> React Fiber 的时间切片通过~~优先级调度~~实现，高优先级任务（如用户输入）可打断低优先级任务（如列表渲染）

**边界**：优先级只决定谁先跑，不减少总工作量。低优先级任务如果一直被打断会饿死，React 用过期的兜底机制强制推进。另外这套调度要到 React 18 的并发特性才真正对用户可见，普通 `setState` 仍是同步刷新。

## 论据/示例

调度器要回答的是「下一个该跑谁」，而不是「还能跑多久」。这是它与 `requestIdleCallback` 的根本差别：后者只有空闲 / 不空闲两态，永远排不出「点击优先于列表」。

优先级分层、`shouldYield` 的 5ms 切片、低优先级如何免于饿死，见 [[Fiber]]。

## 关联

- [[React]]
- [[Fiber]]
- [[React Fiber 采用链表结构代替递归]]
- [[React Fiber 是可中断的增量渲染架构]]
