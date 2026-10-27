---
uid: 202604180002
title: useEffect的return语句在组件卸载和依赖变化时都会被调用
aliases:
  - A-useEffect-cleanup调用时机
description: useEffect 返回的 cleanup 函数在组件卸载和依赖变化时都会被调用，确保副作用被正确清理
tags:
  - 前端开发/框架/React
date-created: 2026-04-18
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[useEffect]]"
noteId: 1792465711055
---

> useEffect 返回的~~cleanup~~函数在组件卸载和依赖变化时都会被调用，确保副作用被正确清理。

**边界**：cleanup 的保证是「下一次 effect 执行前或卸载时」，不是「一定跑」。渲染被中断、组件被丢弃时可能一次都不跑；StrictMode 下开发环境会刻意多跑一轮，用来暴露没写 cleanup 的副作用。

## 论据/示例

cleanup 的语义是「与上一次 effect 配对的下半场」，不是「组件销毁钩子」。由此可以直接推出执行顺序：依赖变化时先跑上一次的 cleanup，再跑新的 effect——顺序若反过来，订阅就会叠成两份。

三种依赖数组各自在什么时机触发 cleanup，见 [[useEffect]]。

## 关联

- [[useEffect]] — 本笔记的上位概念
- [[React渲染后执行副作用]] — cleanup 执行的时机
- [[cleanup函数防止内存泄漏]] — cleanup 的核心作用
