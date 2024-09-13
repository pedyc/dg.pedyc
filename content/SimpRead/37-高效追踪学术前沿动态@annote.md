---
title: "高效追踪学术前沿动态"
alias: 37-高效追踪学术前沿动态@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/2023/11/17/4144f08a53132b08864579e714fff816.png "
banner_icon: 🔖
created-date: 2024-09-10T22:06:51+0800
idx: 37
tag: []
tags: 
---

## 高效追踪学术前沿动态

> [!example]- [🧷内部链接](<http://localhost:7026/unread/37>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/37>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/37>)

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
>  **Description**:: 这篇文章，我们聊聊如何做到不同来源学术前沿追踪的 All in One，在统一的入口内，集中地浏览学术资讯。
%%

> [!md] Metadata
> **标题**:: [高效追踪学术前沿动态](https://sspai.com/post/84478)
> **日期**:: [[2024-09-10]]

### Annotations

> [!srhl2] [[SR37@高效追踪学术前沿动态|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/37#id=1725978583730>) [🌐](<#id=1725978583730>)
> 相比之下，阅读微信公众号更加便捷。而我的老板和师兄弟间也经常分享公众号上的研究速递。我在《[家庭服务器 Home Server 实践](https://sspai.com/post/82512)》中提到过，我很讨厌在微信内阅读公众号：一是消息在时间排序上是乱序的；二是在内容上无法按照类别浏览，我无法让大脑做到在科研内容和娱乐内容间迅速切换；三是在浏览时会插播很多推荐内容，但我并不感兴趣；四是没有阅读记录，我无法判断哪些文章读过了，也无法标记稍后阅读，我的「文件传输助手」也就充当了「稍后阅读」的功能。
> ^sran-1725978583730
