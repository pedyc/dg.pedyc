---
title: 6-从 Element UI 源码的构建流程来看前端 UI 库设计@annote
uid: 
aliases: 
author: juejin.cn
description: 由于业务需要，近期团队要搞一套自己的UI组件库，框架方面还是Vue。而业界已经有比较成熟的一些UI库了，比如ElementUI、AntDesign、Vant等。 结合框架Vue，我们选择在ElementUI基础上进行改造。但造轮子绝非易事，首先需要先去了解它整个但构建流程、目录…
tags: []
date-created: 2025-02-16
date-modified: 2025-02-17
status: 
alias: ["srAnnote@从 Element UI 源码的构建流程来看前端 UI 库设计"]
---

## 从 Element UI 源码的构建流程来看前端 UI 库设计

> [!md] Metadata
> **标题**:: " 从 Element UI 源码的构建流程来看前端 UI 库设计 "
> **日期**:: [[2025-02-16]]
> **原文链接**:: [原文链接](https://juejin.cn/post/6844904197863964685#heading-8)
> **内部链接**:: [内部链接](http://localhost:7026/reading/6)
> **外部链接**:: [外部链接](https://dg.ped-yc.site/Simpread/6- 从 Element UI 源码的构建流程来看前端 UI 库设计)

> [!summary] 描述
> 由于业务需要，近期团队要搞一套自己的 UI 组件库，框架方面还是 Vue。而业界已经有比较成熟的一些 UI 库了，比如 ElementUI、AntDesign、Vant 等。 结合框架 Vue，我们选择在 ElementUI 基础上进行改造。但造轮子绝非易事，首先需要先去了解它整个但构建流程、目录…

### Annotations
