---
uid: 202605060800
title: NextJS 的本质是 React 框架与服务端能力的深度融合
aliases: []
description: NextJS 的本质是 React 框架与 Node.js 服务端能力的深度融合
tags: []
date-created: 2026-05-06
date-modified: 2026-10-27
status: fleeting
content-type: atomic
up: "[[NextJS]]"

noteId: 1792465707572
---

> NextJS 的本质是 React 框架与 Node.js 服务端能力的~~深度融合~~

**边界**：这个说法在 App Router 之后已经不够准。Server Components 让「服务端」不再是外挂的一层渲染（SSR），而是组件本身的另一类运行环境——数据和 UI 的边界被重新划过。用「React + Node」理解 Pages Router 够用，理解 App Router 会漏掉最关键的部分。

## 论据/示例

三件事共用同一个前提——React 能在服务端跑；差别只在执行粒度：页面级（SSR）、接口级（API Routes）、组件级（RSC）。粒度越细，省掉的样板越多，但「哪段代码在哪一侧执行」就越需要显式声明。

三种能力的对比与代价，见 [[NextJS]] 的「三种服务端能力的边界」。

## 关联

- [[React]]
- [[NodeJS]]
- [[SSR]]
