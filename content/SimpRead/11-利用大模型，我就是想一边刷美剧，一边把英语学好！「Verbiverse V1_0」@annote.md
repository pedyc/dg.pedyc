---
title: 11-利用大模型，我就是想一边刷美剧，一边把英语学好！「Verbiverse V1_0」@annote
alias: 11-利用大模型，我就是想一边刷美剧，一边把英语学好！「Verbiverse V1_0」@annote
uid: 
author: 
description: 
date-created: 2023-12-31 18:01
date-modified: 2024-09-13 11:31
type: Simpread
aliases: 
banner: "https://cdnfile.sspai.com/2024/07/30/8ba63144ef309d6bbe36f83ad7d64e3a.png "
banner_icon: 🔖
banner_x: 0.48169
created-date: 2024-08-01T10:01:33+0800
idx: 11
tag: []
tags: 
---

## 11- 利用大模型，我就是想一边刷美剧，一边把英语学好！「Verbiverse V1_0」@annote

### 利用大模型，我就是想一边刷美剧，一边把英语学好！「Verbiverse V1_0」

> [!example]- [🧷内部链接](<http://localhost:7026/unread/11>) [🌐外部链接](<https://sspai.com/post/90975>)
> URI:: [🧷](<http://localhost:7026/unread/11>) [🌐](<https://sspai.com/post/90975>)
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
>  **Description**:: 前言上一篇文章向大家介绍了开发的一个小工具，最近又完善了下使用起来还是比较顺手的，今天就向大家正式介绍下 VerbiverseV1.0：方便、快捷的利用大模型帮助我们阅读外语文档与观看视频来提升语言能力 ……
%%

> [!md] Metadata
> **标题**:: [利用大模型，我就是想一边刷美剧，一边把英语学好！「Verbiverse V1_0」](https://sspai.com/post/90975)
> **日期**:: [[2024-08-01]]
