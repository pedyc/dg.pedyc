---
uid: '<% tp.file.creation_date("YYYYMMDDHHmm") %>'
title: template_diary
tags: [个人成长/diary]
date-created: 2025-12-17
date-modified: 2026-03-08
---

<%*
let 一言 = ""
let 来源 = ""
let 作者 = ""

await fetch('https://v1.hitokoto.cn/?c=d&c=h&c=i&c=j')
.then(response => response.json())
.then(data => {
    一言 = data.hitokoto
    来源 = data.from
    作者 = data.from_who === null? ' 佚名 ': data.from_who
})
-%>

> [!quote] 一言
>  <% 一言 %> —— 《<% 来源 %>》 · <% 作者 %>

## ☁️行云（闪念笔记）

- TODO
- TODO

## 👣跬步（任务列表）

```dataview
TABLE 
	urgency + consequence AS "评分",
	status AS "状态", 
	area AS "领域", 
	expire AS "截止日期"
FROM "10-PROJECTS"
WHERE date(expire) >= date(this.file.frontmatter.title)
SORT urgency + consequence DESC
```

## 🌞日新（行动记录）

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "最后修改时间"
WHERE file.mtime >= date("{{date:YYYY-MM-DD}}") AND file.mtime < date("{{date:YYYY-MM-DD}}") + dur(1 day) OR file.ctime = date("{{date:YYYY-MM-DD}}")
SORT file.mtime DESC
```

## 🌙温故（每日总结）

> [!NOTE] 今日复盘
> - 今天最大的收获是什么？
> - 今天遇到的挑战是什么？
> - 明天可以改进的地方是什么？
