---
title: "再次折腾 RSS 之搭建 FreshRSS 服务"
alias: 
  - "再次折腾 RSS 之搭建 FreshRSS 服务"
created-date: 2024-08-14T23:15:30+0800
type: Simpread
banner: "https://cdnfile.sspai.com/editor/u_nl6l6ykv/16092280976250.jpg "
banner_icon: 🔖
tag: 
idx: 28
---

# 再次折腾 RSS 之搭建 FreshRSS 服务

> [!example]- [🧷内部链接](<http://localhost:7026/unread/28>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/28>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/28>)

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
>  **Description**:: 为什么要自己搭建 RSS 服务在 2020 年的今天，各种推荐算法和信息流已经很完善了，而选择使用 RSS 这种获取信息的方式，一方面是为了不陷入推荐算法的信息茧房，另一个原因是为了能够无障碍获取到外文信息。
%%

> [!md] Metadata  
> **标题**:: [再次折腾 RSS 之搭建 FreshRSS 服务](https://sspai.com/post/64289#!)  
> **日期**:: [[2024-08-14]]  

## Annotations


> [!srhl2] [[SR28@再次折腾 RSS 之搭建 FreshRSS 服务|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/28#id=1723654268483>) [🌐](<#id=1723654268483>)   
> 因为目前使用的 RSS 阅读器是 Reeder，而 Reeder 支持的自建 RSS 服务只剩下了 FreshRSS 和 Google Reader API 以及 Fever（Reeder 不推荐），综合社区活跃度、第三方 App 支持程度、上手难度以及灵活性，最终选择了 FreshRSS。
> ^sran-1723654268483

> [!srhl2] [[SR28@再次折腾 RSS 之搭建 FreshRSS 服务|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/28#id=1723654279868>) [🌐](<#id=1723654279868>)   
> 点击右上角的齿轮图表进入`管理`-`系统设置`，可以进行更详细的配置：
> ^sran-1723654279868


