---
title: "【方法论】JS 执行流程 - ped-Yc's Blog"
alias: "9-【方法论】JS 执行流程 - ped-Yc's Blog@annote"
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://ped-yc.github.io/images/avatar.jpeg "
banner_icon: 🔖
created-date: 2024-07-31T20:55:20+0800
idx: 9
tag: []
tags: 
---

## 【方法论】JS 执行流程 - ped-Yc's Blog

> [!example]- [🧷内部链接](<http://localhost:7026/unread/9>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/9>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/9>)

%%

> [!example]+ **Comments**
>
> ```dataview
> TABLE 
>     WITHOUT ID
>     link(Source, dateformat(date(Source), "yyyy-MM-dd")) as Date___, 
>     regexreplace(rows.Comments,"^@@\[\[.+?\]\]\s","") as "Comments"
> FROM "journals"
> WHERE  contains(cmnt, this.file.name)
> FLATTEN cmnt as Comments
> WHERE contains(Comments, this.file.name)
> GROUP BY file.link as Source
> SORT rows.file.day desc
> ```
>  **Description**:: 前言本文主要解释 JS 引擎在遇见 script 代码块时，从编译到执行具体经历了些什么？ 一些关于作用域与闭包还有 this 关键字的问题可能被解答： 为什么会产生变量提升？ 闭包的产生原理是什么？ 多个 script 代码块间是以什么顺序来执行的？ 为什么定义在不同代码块间的方法可以共通？通过本文都可以得到解答。
%%

> [!md] Metadata
> **标题**:: [【方法论】JS 执行流程 - ped-Yc's Blog](https://ped-yc.github.io/2023/02/21/MethodologyJSExcutionProcess/)
> **日期**:: [[2024-07-31]]

### Annotations

> [!srhl2] [[SR9@【方法论】JS 执行流程 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/9#id=1722430520345>) [🌐](<#id=1722430520345>)
> 多个 script 代码块间是以什么顺序来执行的？
> ^sran-1722430520345
