---
uid: 202605061300
title: Fiber 的可中断只覆盖 render 阶段，commit 一旦开始就必须走完
description: React Fiber 通过拆分渲染任务实现可中断的增量渲染
tags: []
date-created: 2026-05-06
date-modified: 2026-10-28
content-type: atomic
up: "[[Fiber]]"
noteId: 1792465709002
---

> React Fiber是把渲染工作拆成小任务，利用浏览器空闲时间执行，实现~~可中断~~的~~增量渲染~~架构

**边界**：可中断的只有渲染阶段（render phase），commit 阶段一旦开始就不能中断，必须一次性把变更刷到 DOM。而且中断依赖调度器让出主线程——如果某个组件自己的渲染函数耗时过长，单个任务仍然会卡住。

## 论据/示例

「可中断」的收益取决于单个工作单元的耗时上限——一个组件自身的渲染函数要跑 50ms，切得再细也卡。真正被消除的是「一棵大树必须一口气画完」这个约束，不是「组件写得慢」。

工作单元如何划分、`workLoop` 如何让出、双缓存如何保证中断后回到一致状态，见 [[Fiber]]。

## 关联

- [[React]]
- [[Fiber|React Fiber]]
