---
title: "WebCIA Weekly 第 05 期 - 实习奶爸"
alias: 24-WebCIA Weekly 第 05 期 - 实习奶爸@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://markyun.github.io/weekly/assets/WebCIA.svg "
banner_icon: 🔖
created-date: 2024-08-12T12:46:07+0800
idx: 24
tag: []
tags: 
---

## WebCIA Weekly 第 05 期 - 实习奶爸

> [!example]- [🧷内部链接](<http://localhost:7026/unread/24>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/24>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/24>)

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
>  **Description**:: 本期封面图来源于文章："work hard, play hard"。
%%

> [!md] Metadata
> **标题**:: [WebCIA Weekly 第 05 期 - 实习奶爸](https://markyun.github.io/weekly/posts/05-%E5%AE%9E%E4%B9%A0%E5%A5%B6%E7%88%B8/)
> **日期**:: [[2024-08-12]]
