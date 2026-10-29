---
uid: "202604290001"
title: useRef 存的是可变值不是界面状态，它变了界面不会跟
aliases: []
description: useRef 变化不会触发重新渲染，可用于存储不需要渲染的可变值
tags: []
date-created: 2026-04-29
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[Refs(React)]]"
noteId: 1792465711305
---

> useRef 变化不会触发~~重新渲染~~，可用于存储不需要渲染的可变值

**边界**：不触发渲染意味着界面不会自己更新：把「该显示的值」放进 ref，就得另找时机把它带到界面上，否则数据变了 UI 不动。另外 ref 的初始化函数在 StrictMode 下会执行两次。

## 论据/示例

「不触发渲染」既是特性也是陷阱：数据与界面从此没有同步保证，必须由你在某个渲染时机手动把它带上。

合理用法都是「记录而不展示」——定时器 ID、上一次的值、DOM 节点，以及需要跨渲染保持不变的引用容器。与 `useState` 的分界见 [[Refs(React)]]。

## 关联

- [[Refs(React)]] — Ref 概念总览
- [[Ref 的 current 属性是响应式与非响应式的分界线]] — 来自 React Refs 的核心命题
- [[在React中有哪些更改数据不触发重新渲染的方式]]
