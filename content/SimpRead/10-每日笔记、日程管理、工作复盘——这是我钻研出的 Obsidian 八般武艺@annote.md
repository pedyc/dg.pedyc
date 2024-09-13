---
title: "每日笔记、日程管理、工作复盘——这是我钻研出的 Obsidian 八般武艺"
alias: 10-每日笔记、日程管理、工作复盘——这是我钻研出的 Obsidian 八般武艺@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/article/83235488-4ef6-d807-cfdc-740e9ab90232.jpeg "
banner_icon: 🔖
created-date: 2024-08-01T09:30:51+0800
idx: 10
tag: []
tags: 
---

## 每日笔记、日程管理、工作复盘——这是我钻研出的 Obsidian 八般武艺

> [!example]- [🧷内部链接](<http://localhost:7026/unread/10>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/10>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/10>)

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
>  **Description**:: 按：本文系根据作者发表在 Bilibili 的如下视频作品改编和扩展而成，截至本文发出时，视频已经获得超过 20 万播放量。
%%

> [!md] Metadata
> **标题**:: [每日笔记、日程管理、工作复盘——这是我钻研出的 Obsidian 八般武艺](https://sspai.com/post/72385)
> **日期**:: [[2024-08-01]]
