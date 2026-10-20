---
uid: 202610201245
title: Hooks 必须在顶层调用因为 React 依赖调用顺序匹配 Hook
aliases: []
description: React 靠 Hooks 的调用顺序而非标识符来匹配对应的 Hook 节点，所以不能在条件或循环中调用
tags:
  - 前端
  - React
  - Hooks
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[Hooks(React)]]"
noteId: 1792475161328
---

> Hooks 必须在顶层调用，因为 React 依赖~~调用顺序~~而非名称来匹配对应的 Hook 节点——一旦在条件或循环中调用，顺序错位会导致状态错乱。

## 关联

- [[Hooks(React)]]
