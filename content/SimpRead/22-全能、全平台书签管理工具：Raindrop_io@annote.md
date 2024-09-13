---
title: "全能、全平台书签管理工具：Raindrop_io"
alias: 22-全能、全平台书签管理工具：Raindrop_io@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/2020/10/18/9262241fd844fbac7cad2b28a3dc0467.png "
banner_icon: 🔖
created-date: 2024-08-11T23:18:51+0800
idx: 22
tag: []
tags: 
---

## 全能、全平台书签管理工具：Raindrop_io

> [!example]- [🧷内部链接](<http://localhost:7026/unread/22>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/22>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/22>)

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
>  **Description**:: Raindrop 拥有强大的管理能力，同时还支持稍后读、书签分享等功能，能够成为你的「新一代」书签工具。
%%

> [!md] Metadata
> **标题**:: [全能、全平台书签管理工具：Raindrop_io](https://sspai.com/post/63209#!)
> **日期**:: [[2024-08-11]]

### Annotations

> [!srhl2] [[SR22@全能、全平台书签管理工具：Raindrop_io|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/22#id=1725976593570>) [🌐](<#id=1725976593570>)
> Raindrop 的书签管理功能
> ^sran-1725976593570
