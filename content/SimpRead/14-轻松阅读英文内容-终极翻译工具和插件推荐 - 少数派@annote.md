---
title: 14-轻松阅读英文内容-终极翻译工具和插件推荐 - 少数派@annote
alias: 14-轻松阅读英文内容-终极翻译工具和插件推荐 - 少数派@annote
uid: 
author: 
description: 
date-created: 2024-08-16 11:26
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/2023/12/25/e8c4027d4f8f0a39687c05476237f252.png "
banner_icon: 🔖
created-date: 2024-08-01T18:24:17+0800
idx: 14
tag: []
tags: 
---

## 轻松阅读英文内容 - 终极翻译工具和插件推荐 - 少数派

> [!example]- [🧷内部链接](<http://localhost:7026/unread/14>) [🌐外部链接](<https://neo-static.sspai.com/post/85318>)
> URI:: [🧷](<http://localhost:7026/unread/14>) [🌐](<https://neo-static.sspai.com/post/85318>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/14>)

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
>  **Description**:: 学会使用英语是必须要有的能力，这篇文章整理了我使用的一些英语学习插件或者工具。包括电脑端/手机端/网页翻译工具推荐，通过使用这些工具能够快速读懂英文内容，也可以通过看电影视频学习英语，借助 AI 对照翻译 …
%%

> [!md] Metadata
> **标题**:: [轻松阅读英文内容-终极翻译工具和插件推荐 - 少数派](https://neo-static.sspai.com/post/85318)
> **日期**:: [[2024-08-01]]
