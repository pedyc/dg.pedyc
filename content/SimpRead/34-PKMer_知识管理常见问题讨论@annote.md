---
title: 34-PKMer_知识管理常见问题讨论@annote
alias: 34-PKMer_知识管理常见问题讨论@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-12 08:07
type: Simpread
aliases: [PKMer_知识管理常见问题讨论]
banner: "/img/pkmer-avatar.png"
banner_icon: 🔖
created-date: 2024-08-23T10:36:17+0800
idx: 34
tags: []
---

## PKMer_ 知识管理常见问题讨论

> [!example]- [🧷内部链接](<http://localhost:7026/unread/34>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/34>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/34>)

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
>  **Description**:: 知识管理常见问题讨论——Pkmer，打造东半球强大的知识管理社区！提供包括 Obsidian，Zotero 在内的知识管理工具、技巧和经验分享，文档完全开源免费，助您创造更高效、更智慧的知识管理体系。
%%

> [!md] Metadata
> **标题**:: [PKMer_知识管理常见问题讨论](https://pkmer.cn/Pkmer-Docs/02-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80/%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E5%8F%82%E8%80%83/)
> **日期**:: [[2024-08-23]]

### Annotations

> [!srhl2] [[SR34@PKMer_知识管理常见问题讨论|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/34#id=1724380577520>) [🌐](<#id=1724380577520>)
> 信息组织和信息检索领域有一条著名的规律：组织成本和检索成本成反比。也就是说，组织成本高了，检索时花费的成本就能低一些；组织的成本低了，检索时需要的成本就高一些。
> ^sran-1724380577520
