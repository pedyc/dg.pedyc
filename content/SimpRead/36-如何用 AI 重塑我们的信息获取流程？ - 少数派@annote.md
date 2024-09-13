---
title: "如何用 AI 重塑我们的信息获取流程？ - 少数派"
alias: 36-如何用 AI 重塑我们的信息获取流程？ - 少数派@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdnfile.sspai.com/2024/07/12/255ddbb2ead1104308d5a826a64be47a.png "
banner_icon: 🔖
created-date: 2024-09-10T22:05:36+0800
idx: 36
tag: []
tags: 
---

## 如何用 AI 重塑我们的信息获取流程？ - 少数派

> [!example]- [🧷内部链接](<http://localhost:7026/unread/36>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/36>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/36>)

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
>  **Description**:: 前言在这个数字时代，我们有很多信息来源：多媒体：新闻网站、Medium、电子书、研报、在线期刊社交媒体：Twitter、Instagram、Facebook、LinkedIn 流媒体：YouTube、T …
%%

> [!md] Metadata
> **标题**:: [如何用 AI 重塑我们的信息获取流程？ - 少数派](https://sspai.com/post/90423)
> **日期**:: [[2024-09-10]]

### Annotations

> [!srhl5] [[SR36@如何用 AI 重塑我们的信息获取流程？ - 少数派|📄]] <mark style="background-color: #a8ea68">Highlights</mark> [🧷](<http://localhost:7026/unread/36#id=1725981395072>) [🌐](<#id=1725981395072>)
> RSS 是一种不被广告和算法污染的信息聚合方式，可以在任何支持 RSS 订阅的产品中订阅和阅读。需要注意的是，没有广告和算法并非绝对，取决于源的提供方是否纯粹。这里有一篇 [RSS 介绍好文](https://sspai.com/link?target=https%3A%2F%2Fncase.me%2Frss%2F)。
> ^sran-1725981395072

> [!srhl2] [[SR36@如何用 AI 重塑我们的信息获取流程？ - 少数派|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/36#id=1726022217723>) [🌐](<#id=1726022217723>)
> RSS 订阅 => 略读，我使用的方案是：RSSHub + RSSHub Radar + FreshRSS + Fluent Reader + Unread。
> ^sran-1726022217723

> [!srhl2] [[SR36@如何用 AI 重塑我们的信息获取流程？ - 少数派|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/36#id=1725981380699>) [🌐](<#id=1725981380699>)
> 稍后阅读工具不便于检索。虽然叫稍后阅读，但阅读的时机可能是在未来某天解决特定问题时，然而此时往往难以通过想象的关键词检索到特定内容。
> ^sran-1725981380699

> [!srhl2] [[SR36@如何用 AI 重塑我们的信息获取流程？ - 少数派|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/36#id=1725980915351>) [🌐](<#id=1725980915351>)
> 同时，支持结构化阅读的工具如 [elmo](https://sspai.com/link?target=https%3A%2F%2Fwww.elmo.chat%2F)、[zKnown](https://sspai.com/link?target=https%3A%2F%2Freadknown.cn%2F)，可以输出思维导图、要点等信息，并可以进一步提问进行对话式阅读。
> ^sran-1725980915351

> [!srhl2] [[SR36@如何用 AI 重塑我们的信息获取流程？ - 少数派|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/36#id=1726022164027>) [🌐](<#id=1726022164027>)
> 信息获取流程变革为：信源订阅 => **信息整理** => 略读 => 稍后阅读 => **结构化 + 对话式阅读** => 原文阅读。并且各环节得到**优化和提效**。
> ^sran-1726022164027
