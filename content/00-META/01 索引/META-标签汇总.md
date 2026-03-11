---
uid: <% tp.file.creation_date("YYYYMMDDHHmm") %>
title: 标签汇总
description: 本知识库中所有标签的索引入口
tags: [meta/索引]
content-type: moc
status: active
date-created: 2025-02-24
date-modified: <% tp.date.now("YYYY-MM-DD") %>
related:
  - "[[00-本库指南]]"
---

```dataview
TABLE rows.file.link AS "文件"
FLATTEN tags AS tags
WHERE tags
GROUP BY tags
```
