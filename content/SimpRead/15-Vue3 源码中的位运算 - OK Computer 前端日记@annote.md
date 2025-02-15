---
title: 15-Vue3 源码中的位运算 - OK Computer 前端日记@annote
aliases: ["srAnnote@Vue3 源码中的位运算 - OK Computer 前端日记"]
uid: 
author: wumanho.cn
description: 位运算在实际工程中的妙用
date-created: 2024-11-03
date-modified: 2024-11-03
status: 
type: Simpread
tags: []
url: https://wumanho.cn/posts/vueshapeflags/
int_uil: http://localhost:7026/reading/15
---

> [!md] Metadata
> 🙇‍♂作者信息：wumanho.cn
> 🌱文档状态：YCTODO
> 📅创建日期：2024-11-03
> 🔗原文链接：https://wumanho.cn/posts/vueshapeflags/
> 🖋标签列表：

> [!summary] 描述
> 位运算在实际工程中的妙用

## Annotations

> [📌](<http://localhost:7026/reading/15#id=1730646080374>) <mark style="background-color: #ffeb3b">Highlight</mark>
> 定义了枚举类型 `shapeFlag`，就可以对之前的 `createVNode` 进行一些改造，创建 VNode 时将它标记为某种节点，这是为了对 `patch` 过程进行优化。
