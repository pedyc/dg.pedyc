---
uid: 20260317000014
title: transform 和 opacity 只触发合成不触发回流重绘
aliases: []
description: transform 和 opacity 由合成器处理，跳过布局与绘制阶段，动画性能最高
tags:
  - 前端
  - CSS
  - 性能
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[回流和重绘]]"
noteId: 1792475168298
---

> transform 和 opacity 只触发~~合成~~而不触发回流与重绘，因此是做高性能动画的首选属性。

## 关联

- [[回流和重绘]]
- [[合成层 vs 合成线程]]
