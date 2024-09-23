---
title: 4-从 Element UI 源码的构建流程来看前端 UI 库设计@annote
uid: 
author: 
description: 
date-created: 2024-09-16 10:59
date-modified: 2024-09-17 15:50
status: 
type: Simpread
tags: []
int_uri: http://localhost:7026/reading/4
---

## 从 Element UI 源码的构建流程来看前端 UI 库设计

> [!md] Metadata
> **标题**:: " 从 Element UI 源码的构建流程来看前端 UI 库设计 "
> **日期**:: [[2024-09-15]]
> **外部链接**:: [[4-从 Element UI 源码的构建流程来看前端 UI 库设计]]

> [!summary] 描述
> 由于业务需要，近期团队要搞一套自己的 UI 组件库，框架方面还是 Vue。而业界已经有比较成熟的一些 UI 库了，比如 ElementUI、AntDesign、Vant 等。 结合框架 Vue，我们选择在 ElementUI 基础上进行改造。但造轮子绝非易事，首先需要先去了解它整个但构建流程、目录…

### Annotations

> [📌](<http://localhost:7026/reading/4#id=1726414343523>) <mark style="background-color: #ffeb3b">Highlight</mark>
> 该指令主要用来自动化生成一些文件。
