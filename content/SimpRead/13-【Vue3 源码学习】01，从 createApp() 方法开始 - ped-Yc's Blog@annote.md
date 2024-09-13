---
title: "13-【Vue3 源码学习】01，从 createApp() 方法开始 - ped-Yc's Blog@annote"
alias: "13-【Vue3 源码学习】01，从 createApp() 方法开始 - ped-Yc's Blog@annote"
uid: 
author: 
description: 
date-created: 2024-08-01 09:18
date-modified: 2024-09-13 11:31
type: Simpread
aliases: 
banner: "https://images.unsplash.com/photo-1722247478581-17f7d9ffb3a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHwxfHwxNzIyNTAzODc1fA&ixlib=rb-4.0.3&q=85&fit=crop&w=1284&max-h=540 "
banner_icon: 🔖
created-date: 2024-08-01T17:18:03+0800
idx: 13
status: 
tag: []
tags: 
---

## 【Vue3 源码学习】01，从 createApp() 方法开始 - ped-Yc's Blog

> [!example]- [🧷内部链接](<http://localhost:7026/unread/13>) [🌐外部链接](<https://ped-yc.github.io/2022/06/03/vueSourceCodeStudy01/>)
> URI:: [🧷](<http://localhost:7026/unread/13>) [🌐](<https://ped-yc.github.io/2022/06/03/vueSourceCodeStudy01/>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/13>)

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
>  **Description**::
%%

> [!md] Metadata
> **标题**:: [【Vue3 源码学习】01，从 createApp() 方法开始 - ped-Yc's Blog](https://ped-yc.github.io/2022/06/03/vueSourceCodeStudy01/)
> **日期**:: [[2024-08-01]]
