---
title: "以防你不知道什么是 PDF 阅读的最佳工具"
alias: 47-以防你不知道什么是 PDF 阅读的最佳工具@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/ "
banner_icon: 🔖
created-date: 2024-09-11T00:00:31+0800
idx: 47
tag: []
tags: 
---

## 以防你不知道什么是 PDF 阅读的最佳工具

> [!example]- [🧷内部链接](<http://localhost:7026/unread/47>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/47>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/47>)

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
>  **Description**:: 我尝试过的 PDF 工具主要分为以下几类：PDF" 浏览器 "，其只提供基础的 PDF 阅读功能，如划线、高亮，部分浏览器甚至会提供一些备注功能。
%%

> [!md] Metadata
> **标题**:: [以防你不知道什么是 PDF 阅读的最佳工具](https://sspai.com/post/90415)
> **日期**:: [[2024-09-11]]

### Annotations

> [!srhl2] [[SR47@以防你不知道什么是 PDF 阅读的最佳工具|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/47#id=1725984060293>) [🌐](<#id=1725984060293>)
> PDF" 浏览器 "，其只提供基础的 PDF 阅读功能，如划线、高亮，部分浏览器甚至会提供一些备注功能。这一类主要包括 edge 等浏览器中自带的 PDF 阅读器功能、Adobe acrobat 等 PDF 编辑软件等。其主要目的是让用户能看到和快速浏览 PDF 的内容。
> ^sran-1725984060293

> [!srhl2] [[SR47@以防你不知道什么是 PDF 阅读的最佳工具|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/47#id=1725984582859>) [🌐](<#id=1725984582859>)
> 几乎所有的 PDF 阅读器都有摘录原文的功能，哪怕是 acrobat 也有画个框复制截图的功能，但很少有真正好用的。摘录原文的作用是提醒自己，而不是无效堆积。
> ^sran-1725984582859
