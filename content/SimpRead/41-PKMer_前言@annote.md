---
title: "PKMer_前言"
alias: 
  - "PKMer_前言"
created-date: 2024-09-10T23:36:49+0800
type: Simpread
banner: "/img/pkmer-avatar.png "
banner_icon: 🔖
tag: 
idx: 41
---

# PKMer_前言

> [!example]- [🧷内部链接](<http://localhost:7026/unread/41>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/41>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/41>)

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
>  **Description**:: PKMer 前言——- 建立个人知识管理体系者 - 做个人知识管理 - 提高工作效率 - 更好地组织个人信息资源 - 简简单单记录下自己的工作、学习、日常 - 基本的个人知识管理技巧和工具 -...
%%

> [!md] Metadata  
> **标题**:: [PKMer_前言](https://pkmer.cn/Pkmer-Docs/00-%E5%85%B3%E4%BA%8E/%E5%89%8D%E8%A8%80/)  
> **日期**:: [[2024-09-10]]  

## Annotations


> [!srhl2] [[SR41@PKMer_前言|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/41#id=1725982609616>) [🌐](<#id=1725982609616>)   
> 简简单单记录下自己的工作、学习、日常
> ^sran-1725982609616

> [!srhl2] [[SR41@PKMer_前言|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/41#id=1725984685991>) [🌐](<#id=1725984685991>)   
> 社区文档：包含了大家的知识管理技巧，方法论，以及具体的知识管理软件技巧，你可以在顶部导航【知识社区】中找到它们
> ^sran-1725984685991


