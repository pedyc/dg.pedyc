---
title: "【方法论】前端工程化的一些理解 - ped-Yc's Blog"
alias: "8-【方法论】前端工程化的一些理解 - ped-Yc's Blog@annote"
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://ped-yc.github.io/2024/03/15/MethodologyFrontendEngineering/s0.png "
banner_icon: 🔖
created-date: 2024-07-31T16:22:21+0800
idx: 8
tag: []
tags: 
---

## 【方法论】前端工程化的一些理解 - ped-Yc's Blog

> [!example]- [🧷内部链接](<http://localhost:7026/unread/8>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/8>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/8>)

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
>  **Description**:: 前言在项目开发中常常听到前端工程化，那么什么是前端工程化，其要义在于何处，我想是值得了解的问题。
%%

> [!md] Metadata
> **标题**:: [【方法论】前端工程化的一些理解 - ped-Yc's Blog](https://ped-yc.github.io/2024/03/15/MethodologyFrontendEngineering/#%E4%B8%89%E3%80%81%E5%BC%80%E5%8F%91%E9%98%B6%E6%AE%B5-10)
> **日期**:: [[2024-07-31]]

### Annotations

> [!srhl2] [[SR8@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/8#id=1722414141140>) [🌐](<#id=1722414141140>)
> 提高效率、降低成本、质量保证
> ^sran-1722414141140

> [!srhl2] [[SR8@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/8#id=1722424934599>) [🌐](<#id=1722424934599>)
> 自建库抽离公共函数，避免重复造轮子，应约定尽量使用自建库的方法。
> ^sran-1722424934599

> [!srhl2] [[SR8@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/8#id=1722414478213>) [🌐](<#id=1722414478213>)
> 能够交给机器的事情就交给机器去做
> ^sran-1722414478213
