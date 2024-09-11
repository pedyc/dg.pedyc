---
title: "Heptabase + Logseq + Readwise：我的知识管理与输出实践"
alias: 
  - "Heptabase + Logseq + Readwise：我的知识管理与输出实践"
created-date: 2024-09-10T23:09:35+0800
type: Simpread
banner: "https://cdnfile.sspai.com/2024/7/5/article/17b7199b-6d74-b209-65cc-32a898302ef3.jpeg "
banner_icon: 🔖
tag: 
idx: 39
---

# Heptabase + Logseq + Readwise：我的知识管理与输出实践

> [!example]- [🧷内部链接](<http://localhost:7026/unread/39>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/39>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/39>)

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
>  **Description**:: 这些系统或是工具软件其实终究只能辅助我们进行信息管理和输出，并不能代替我们思考，但构建知识管理系统在取悦自己的同时，也能够让思考变得更加高效，悦己才能达人，从而产出更有价值的输出。
%%

> [!md] Metadata  
> **标题**:: [Heptabase + Logseq + Readwise：我的知识管理与输出实践](https://sspai.com/post/90223)  
> **日期**:: [[2024-09-10]]  

## Annotations


> [!srhl2] [[SR39@Heptabase + Logseq + Readwise：我的知识管理与输出实践|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/39#id=1725980984071>) [🌐](<#id=1725980984071>)   
> 而随着自己接触和感兴趣的领域越来越多，信息不断积累，有时候仅仅是浏览和通读都已经有些超过了记忆负荷，并且这些信息常常也零散地留在我的笔记或是脑海的某个角落中，并没有成为内化的一部分，以后也很难记起或是检索，于是重新对自己的信息获取方式进行了梳理。
> ^sran-1725980984071


