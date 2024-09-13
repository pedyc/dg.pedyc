---
title: "Obsidian 插件：QuickAdd 自动化操作的编辑器"
alias: 33-Obsidian 插件：QuickAdd 自动化操作的编辑器@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "/img/pkmer-avatar.png "
banner_icon: 🔖
created-date: 2024-08-19T18:15:06+0800
idx: 33
tag: []
tags: 
---

## Obsidian 插件：QuickAdd 自动化操作的编辑器

> [!example]- [🧷内部链接](<http://localhost:7026/unread/33>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/33>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/33>)

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
>  **Description**:: Obsidian 插件：QuickAdd 自动化操作的编辑器——- Quickadd 结合 CSS 实现挖空复习 - Obsidian 最强插件：QuickAdd：新手友好的轻量级 Quickadd 教程 - Ca……
%%

> [!md] Metadata
> **标题**:: [Obsidian 插件：QuickAdd 自动化操作的编辑器](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/quickadd/)
> **日期**:: [[2024-08-19]]
