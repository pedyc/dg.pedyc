---
title: 26-Angular：深入了解NgRx的优势@annote
alias: 26-Angular：深入了解NgRx的优势@annote
uid: 
author: 
description: 
date-created: 2024-08-13 10:01
date-modified: 2024-09-13 11:31
type: Simpread
aliases: 
created-date: 2024-08-13T18:00:46+0800
idx: 26
status: 
tag: []
tags: 
---

## Angular: 深入了解 NgRx 的优势

> [!example]- [🧷内部链接](<http://localhost:7026/unread/26>) [🌐外部链接](<https://limeii.github.io/2022/09/ngrx-introduction/>)
> URI:: [🧷](<http://localhost:7026/unread/26>) [🌐](<https://limeii.github.io/2022/09/ngrx-introduction/>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/26>)

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
>  **Description**:: 最近在项目组里做了一个 session 分享怎么用 NgRx，以及 NgRx 的优势是什么。大家反馈很不错，写篇文章记录下这次的分享内容。
%%

> [!md] Metadata
> **标题**:: [Angular:深入了解NgRx的优势](https://limeii.github.io/2022/09/ngrx-introduction/)
> **日期**:: [[2024-08-13]]
