---
uid: 20261020142204
title: 浏览器与 Node.js 的事件循环实现存在差异
aliases: []
description: 浏览器与 Node.js 的事件循环各阶段顺序不同，Node.js 有特有的宏任务
tags:
  - 前端
  - JavaScript
  - 事件循环
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[事件循环]]"
noteId: 1792477451501
---

> 浏览器与 Node.js 的~~事件循环实现存在差异~~——各阶段顺序不同，Node.js 拥有浏览器没有的宏任务（如 `setImmediate`、`process.nextTick`）。

## 关联

- [[事件循环]]
