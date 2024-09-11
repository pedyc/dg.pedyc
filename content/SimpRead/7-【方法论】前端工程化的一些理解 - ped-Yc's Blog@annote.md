---
title: "【方法论】前端工程化的一些理解 - ped-Yc's Blog"
alias: 
  - "【方法论】前端工程化的一些理解 - ped-Yc's Blog"
created-date: 2024-07-31T12:37:37+0800
type: Simpread
banner: "https://ped-yc.github.io/images/avatar.jpeg "
banner_icon: 🔖
tag: 
idx: 7
---

# 【方法论】前端工程化的一些理解 - ped-Yc's Blog

> [!example]- [🧷内部链接](<http://localhost:7026/unread/7>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/7>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/7>)

%%
> [!example]+ **Comments**  
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
>  **Description**:: 
%%

> [!md] Metadata  
> **标题**:: [【方法论】前端工程化的一些理解 - ped-Yc's Blog](https://ped-yc.github.io/2024/03/15/MethodologyFrontendEngineering/)  
> **日期**:: [[2024-07-31]]  

## Annotations


> [!srhl2] [[SR7@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/7#id=1722509302290>) [🌐](<#id=1722509302290>)   
> 1.2 前端工程化需要解决哪些问题
> ^sran-1722509302290

> [!srhl2] [[SR7@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/7#id=1722509028370>) [🌐](<#id=1722509028370>)   
> method is used?
> ^sran-1722509028370

> [!srhl2] [[SR7@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/7#id=1722509048773>) [🌐](<#id=1722509048773>)   
> According to the previous article, it is possible to know some of the problems faced in the design phase, so how to solve them?
> ^sran-1722509048773

> [!srhl2] [[SR7@【方法论】前端工程化的一些理解 - ped-Yc's Blog|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/7#id=1722509273710>) [🌐](<#id=1722509273710>)   
> 一般来说，前端项目选择的框架是 Vue、React、Angular 的一种，根据项目规模和团队技术栈选择其他的工具库、UI 库。
> ^sran-1722509273710


