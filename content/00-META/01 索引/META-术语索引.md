---
uid: <% tp.file.creation_date("YYYYMMDDHHmm") %>
title: 术语索引
description: 本知识库中术语的索引入口
tags: [meta/索引]
content-type: moc
status: active
date-created: 2025-05-06
date-modified: <% tp.date.now("YYYY-MM-DD") %>
related:
  - "[[00-本库指南]]"
---

## 本库术语索引

本页索引了本库中所有术语（content-type: term），方便快速查找。

```dataview
TABLE tags AS "标签"
FROM "30-ZETTELCASTEN"
WHERE content-type = "term"
SORT file.name ASC
```
