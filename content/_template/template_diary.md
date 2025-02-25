---
uid: <% tp.file.creation_date("YYYYMMDDHHmm") %>
title: template_diary
aliases: 
author: 
description: 
tags:
  - 个人成长/diary
date-created: 2025-02-22
date-modified: 2025-02-23
status: 
topic:
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
    作者 = data.from_who === null ? ' 佚名 ' : data.from_who
})
-%>

> [!quote] 一言
 <% 一言 %> —— 《<% 来源 %>》 · <% 作者 %>


## 💡行云（闪念，突然想到了什么？）

- TODO
- TODO

## 🦶跬步（今日要做什么？）

- TODO
- TODO

## 🌞日新（今日状态如何？）

- 状态：:LiSmilePlus:

## 🌙温故（每日总结）

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "最后修改时间"
WHERE file.mtime >= date("{{date:YYYY-MM-DD}}") AND file.mtime < date("{{date:YYYY-MM-DD}}") + dur(1 day)
SORT file.mtime DESC
```

> [!NOTE] 今日复盘
> NOTE
