---
title: "超详细的 Angular 国际化方案"
alias: 
  - "超详细的 Angular 国际化方案"
created-date: 2024-07-31T02:10:08+0800
type: Simpread
banner: "https://images.unsplash.com/photo-1721201342276-3edf188d1335?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHwxfHwxNzIyMzYzMDEwfA&ixlib=rb-4.0.3&q=85&fit=crop&w=509&max-h=540 "
banner_icon: 🔖
tag: 
idx: 5
---

# 超详细的 Angular 国际化方案

> [!example]- [🧷内部链接](<http://localhost:7026/unread/5>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/5>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/5>)

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
>  **Description**:: 第一次在 Angular 框架上落地国际化方案，全文有点长，但的确是干货，毕竟肝了几天，希望能帮到你~
%%

> [!md] Metadata  
> **标题**:: [超详细的 Angular 国际化方案](https://juejin.cn/post/7146490480287547405)  
> **日期**:: [[2024-07-31]]  

## Annotations


> [!srhl2] [[SR5@超详细的 Angular 国际化方案|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/5#id=1722363177701>) [🌐](<#id=1722363177701>)   
> API 切换语言包的时候再调用 OpenAPI 翻译当前页面，类似于 google 翻译。
> ^sran-1722363177701


