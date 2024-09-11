---
title: 27-How does the Internet Work？ - cs_fyi@annote
alias: ["How does the Internet Work？ - cs_fyi"]
uid: 
author: 
description: 
date-created: 2024-08-14 02:47
date-modified: 2024-09-10 22:48
type: Simpread
aliases: 
banner: "https://images.unsplash.com/photo-1721504483802-6503a4ba6eeb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHwxfHwxNzIzNjAzNDI4fA&ixlib=rb-4.0.3&q=85&fit=crop&w=823&max-h=540 "
banner_icon: 🔖
created-date: 2024-08-14T10:47:20+0800
idx: 27
status: 
tag: []
tags: 
---

## How does the Internet Work？ - cs_fyi

> [!example]- [🧷内部链接](<http://localhost:7026/unread/27>) [🌐外部链接](<https://cs.fyi/guide/how-does-internet-work>)
> URI:: [🧷](<http://localhost:7026/unread/27>) [🌐](<https://cs.fyi/guide/how-does-internet-work>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/27>)

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
>  **Description**:: Learn what the Internet is, how it works, and how it's different from the World Wide Web.
%%

> [!md] Metadata
> **标题**:: [How does the Internet Work？ - cs_fyi](https://cs.fyi/guide/how-does-internet-work)
> **日期**:: [[2024-08-14]]
