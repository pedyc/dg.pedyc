---
title: 12-重新认识读书这件小事：谈我的「读书之道」@annote
uid: 
author: 
description: 
date-created: 2024-01-01 02:33
date-modified: 2024-08-19 18:45
type: Simpread
alias: ["重新认识读书这件小事：谈我的「读书之道」"]
aliases: 
banner: "https://cdnfile.sspai.com/2024/07/29/f41c4f727f51a2026db230acf3fdccef.png "
banner_icon: 🔖
created-date: 2024-08-01T10:33:00+0800
idx: 12
status: 
tag: []
tags: 
---

## 重新认识读书这件小事：谈我的「读书之道」 > [!example]- [🧷内部链接](<http://localhost:7026/unread/12>) [🌐外部链接](<https://sspai.com/post/90963>) > URI:: [🧷](<http://localhost:7026/unread/12>) [🌐](<https://sspai.com/post/90963>) > intURI:: [🧷内部链接](<http://localhost:7026/reading/12>)

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
>  **Description**:: 本文并非又一篇「如何把书读透」式的笔记或工具教程，这类优秀文章已经很多，《如何阅读一本书》我想大家也被安利过很多次了。
%%

> [!md] Metadata
> **标题**:: [重新认识读书这件小事：谈我的「读书之道」](https://sspai.com/post/90963)
> **日期**:: [[2024-08-01]]
