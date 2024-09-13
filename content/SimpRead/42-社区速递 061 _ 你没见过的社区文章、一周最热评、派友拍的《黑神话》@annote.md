---
title: "社区速递 061 _ 你没见过的社区文章、一周最热评、派友拍的《黑神话》"
alias: 42-社区速递 061 _ 你没见过的社区文章、一周最热评、派友拍的《黑神话》@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/9/10/2024/article/9b52f660-28d8-12eb-7eff-bd2d31dab769.png "
banner_icon: 🔖
created-date: 2024-09-10T23:38:26+0800
idx: 42
tag: []
tags: 
---

## 社区速递 061 _ 你没见过的社区文章、一周最热评、派友拍的《黑神话》

> [!example]- [🧷内部链接](<http://localhost:7026/unread/42>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/42>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/42>)

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
>  **Description**:: 除了首页时间流和侧栏的精选展位，少数派 Matrix 社区还有很多优秀内容因条件所限无法得到有效曝光，因此我们决定重启 Matrix 周报，并在此基础上添加更多社区内容、作者投稿新玩意呈现给大家。
%%

> [!md] Metadata
> **标题**:: [社区速递 061 _ 你没见过的社区文章、一周最热评、派友拍的《黑神话》](https://sspai.com/post/92190)
> **日期**:: [[2024-09-10]]

### Annotations

> [!srhl2] [[SR42@社区速递 061 _ 你没见过的社区文章、一周最热评、派友拍的《黑神话》|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/42#id=1725982719434>) [🌐](<#id=1725982719434>)
> **death13** (+2) 我对贾樟柯作品的评分基本上和含涛量负相关。在他生活化的电影中，一直面无表情端着的赵涛实在太出戏。
> ^sran-1725982719434
