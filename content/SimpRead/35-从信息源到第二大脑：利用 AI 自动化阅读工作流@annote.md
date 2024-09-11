---
title: "从信息源到第二大脑：利用 AI 自动化阅读工作流"
alias: 
  - "从信息源到第二大脑：利用 AI 自动化阅读工作流"
created-date: 2024-09-10T21:42:54+0800
type: Simpread
banner: "https://cdnfile.sspai.com/ "
banner_icon: 🔖
tag: 
idx: 35
---

# 从信息源到第二大脑：利用 AI 自动化阅读工作流

> [!example]- [🧷内部链接](<http://localhost:7026/unread/35>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/35>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/35>)

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
>  **Description**:: 想象一下，早上打开电脑，你的 PKM（PersonalKnowledgeManagement）知识库（第二大脑）中出现人工智能帮你总结的各种主题的文章。
%%

> [!md] Metadata  
> **标题**:: [从信息源到第二大脑：利用 AI 自动化阅读工作流](https://sspai.com/post/90792)  
> **日期**:: [[2024-09-10]]  

## Annotations


> [!srhl2] [[SR35@从信息源到第二大脑：利用 AI 自动化阅读工作流|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/35#id=1725975774710>) [🌐](<#id=1725975774710>)   
> Inoreader
> ^sran-1725975774710


