---
title: 48-How to make an AI rss feed Using the Five Top Theory@annote
alias: ["How to make an AI rss feed Using the Five Top Theory"]
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-12 07:49
type: Simpread
banner: "https://static.quickcreator.io/static/aaakawazfziwojfc/image/06efc3334faa4288a26b1bdf934dbc45.png "
banner_icon: 🔖
created-date: 2024-09-11T12:26:02+0800
idx: 48
tag: []
tags: 
---

## How to make an AI rss feed Using the Five Top Theory

> [!example]- [🧷内部链接](<http://localhost:7026/unread/48>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/48>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/48>)

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
>  **Description**:: Ever wondered how to make an rss feed that's tailored to your interests? I did, and I found the answe……
%%

> [!md] Metadata
> **标题**:: [How to make an AI rss feed Using the Five Top Theory](https://tidyread.ai/blog/how-to-make-an-ai-rss-feed-using-the-five-top-theory)
> **日期**:: [[2024-09-11]]
