---
uid: "202604300001"
title: React.memo通过浅比较props决定是否重新渲染
aliases: []
description: React.memo 通过浅比较 props 决定是否重新渲染
tags: []
date-created: 2026-04-30
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[React性能优化]]"

noteId: 1792465709381
---

> React.memo 通过~~浅比较~~props 决定是否重新渲染

**边界**：浅比较只比一层，props 里嵌套对象的内部变化会被判为「没变」。而且它只挡父组件重渲染的传播，组件自身 state 或 context 变化照旧渲染。

## 论据/示例

memo 省下的是「同等输入下的重复计算」，收益正比于「渲染成本 ÷ 比较成本」。渲染 3ms、props 有五个字段的组件值得包；只返回 `<div>{name}</div>` 的组件，包了反而更慢。

浅比较的两处失效条件与自定义比较函数，见 [[React性能优化]] 的 1.1 节。

## 关联

- [[Refs(React)|React Refs]] — Ref 概念总览
- [[React性能优化]] — 性能优化 SOP
