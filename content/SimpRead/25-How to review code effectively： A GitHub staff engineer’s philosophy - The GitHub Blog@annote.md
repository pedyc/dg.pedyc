---
title: 25-How to review code effectively： A GitHub staff engineer’s philosophy - The GitHub Blog@annote
alias: 25-How to review code effectively： A GitHub staff engineer’s philosophy - The GitHub Blog@annote
uid: 
author: 
description: 
date-created: 2024-08-13 22:16
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://github.blog/wp-content/uploads/2024/05/Collaboration-LightMode-2-1.png "
banner_icon: 🔖
banner_x: 0.5
banner_y: 0.544
created-date: 2024-08-13T17:49:00+0800
idx: 25
tag: []
tags: 
---

## How to review code effectively: A GitHub staff engineer's philosophy - The GitHub Blog

> [!example]- [🧷内部链接](<http://localhost:7026/unread/25>) [🌐外部链接](<https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/>)
> URI:: [🧷](<http://localhost:7026/unread/25>) [🌐](<https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/25>)

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
>  **Description**:: GitHub Staff Engineer Sarah Vessels discusses her philosophy of code review, what separates good code review from bad, her strategy for finding and reviewing code, and how to get the most from reviews of her own code.
%%

> [!md] Metadata
> **标题**:: [How to review code effectively: A GitHub staff engineer’s philosophy - The GitHub Blog](https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/)
> **日期**:: [[2024-08-13]]
