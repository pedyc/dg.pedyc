---
title: "部署在多个环境保护与行动。 --- Deploy on multiple env with GitHub Actions"
alias: 
  - "部署在多个环境保护与行动。 --- Deploy on multiple env with GitHub Actions"
created-date: 2024-08-01T19:14:29+0800
type: Simpread
banner: "https://limeii.github.io/assets/images/posts/github-actions/github-actions-workflow-deploy-on-multi-env.png "
banner_icon: 🔖
tag: 
idx: 15
---

# 部署在多个环境保护与行动。 --- Deploy on multiple env with GitHub Actions

> [!example]- [🧷内部链接](<http://localhost:7026/unread/15>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/15>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/15>)

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
>  **Description**:: This article is going to introduce:  Deploy on multiple environment with GitHub Actons  Add reviewers......
%%

> [!md] Metadata  
> **标题**:: [部署在多个环境保护与行动。 --- Deploy on multiple env with GitHub Actions](https://limeii.github.io/2022/11/deploy-on-multiple-environment-with-github-actions/)  
> **日期**:: [[2024-08-01]]  

