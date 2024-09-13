---
title: 11-Obsidian 搭配 Vim Mode，提升中文写作体验@annote
alias: 11-Obsidian 搭配 Vim Mode，提升中文写作体验@annote
uid: 
author: 
description: 
date-created: 2023-12-31 17:57
date-modified: 2024-09-13 11:31
type: Simpread
aliases: []
banner: "https://cdnfile.sspai.com/2023/01/31/5aa4c5b5aa860db4a9b99360b40aeb5e.png "
banner_icon: 🔖
created-date: 2024-08-01T09:57:05+0800
idx: 11
tags: []
---

## Obsidian 搭配 Vim Mode，提升中文写作体验

> [!example]- [🧷内部链接](<http://localhost:7026/unread/11>) [🌐外部链接](<https://sspai.com/post/78030>)
> URI:: [🧷](<http://localhost:7026/unread/11>) [🌐](<https://sspai.com/post/78030>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/11>)

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
>  **Description**:: Obsidian 经过 2 年多迭代和各类 Vim Mode 周边插件支持，目前支持的 Vim Mode 能力已经能够我满足日常笔记和写作的需要，这篇文章就总结一下目前我是如何在 Obsidian 配置和使用 Vim Mode 以及对其周边插件进行完善。
%%

> [!md] Metadata
> **标题**:: [Obsidian 搭配 Vim Mode，提升中文写作体验](https://sspai.com/post/78030)
> **日期**:: [[2024-08-01]]
