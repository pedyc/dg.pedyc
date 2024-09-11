---
title: "「浏览器工作原理」写给女友的秘籍 - 浏览器组成 & 网络请求篇（1_2W 字)"
alias: 
  - "「浏览器工作原理」写给女友的秘籍 - 浏览器组成 & 网络请求篇（1_2W 字)"
created-date: 2024-08-10T11:53:41+0800
type: Simpread
banner: "https://images.unsplash.com/photo-1721297015609-1374b1378d31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHwxfHwxNzIzMjYyMDA3fA&ixlib=rb-4.0.3&q=85&fit=crop&w=862&max-h=540 "
banner_icon: 🔖
tag: 
idx: 20
---

# 「浏览器工作原理」写给女友的秘籍 - 浏览器组成 & 网络请求篇（1_2W 字)

> [!example]- [🧷内部链接](<http://localhost:7026/unread/20>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/20>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/20>)

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
>  **Description**:: 想要成为一名合格的前端工程师，掌握相关浏览器的工作原理是必备的，这样子才会有一个完整知识体系，要是「能参透浏览器的工作原理，你就能解决80%的前端难题」。 要介绍进程与线程的话，需要先讲解下并行处理，了解了并行处理的概念，再理解进程和线程之间的关系就会变得轻松许多。 计算机中的…
%%

> [!md] Metadata  
> **标题**:: [「浏览器工作原理」写给女友的秘籍 - 浏览器组成 & 网络请求篇（1_2W 字)](https://juejin.cn/post/6846687590540640263)  
> **日期**:: [[2024-08-10]]  

## Annotations


> [!srhl2] [[SR20@「浏览器工作原理」写给女友的秘籍 - 浏览器组成 & 网络请求篇（1_2W 字)|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/20#id=1723302381529>) [🌐](<#id=1723302381529>)   
> 进程与线程
> ^sran-1723302381529


