---
uid: 202610201243
title: useState 的状态保存在 Fiber 节点的 Hook 链表中而非函数作用域
aliases: []
description: 函数组件每次渲染都重新执行，但状态由 Fiber 节点上的 Hook 链表持久保存，脱离函数作用域
tags:
  - 前端
  - React
  - Hooks
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[Hooks(React)]]"
noteId: 1792475169039
---

> useState 的状态由~~Fiber 节点的 Hook 链表~~持久保存，而非存放在函数作用域——这就是函数组件每次重新执行、状态却不会丢失的原因。

## 关联

- [[Hooks(React)]]
- [[函数组件每次渲染都重新执行，为什么 React 还能保留状态、函数引用？这些数据是怎么“记住”的？]]
