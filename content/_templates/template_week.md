---
uid: <% tp.file.creation_date("YYYYMMDDHHmm") %>
title: <% tp.file.title %>
aliases:
  - <% tp.file.title %>
description: 周期性回顾与知识洞察流转图谱
tags:
  - 周回顾
  - weekly
  - diary
content-type: diary
up: "[[90-DIARY/]]"
---

```dataviewjs
// 周知识沉淀统计（逻辑在 _scripts/weekPanel.js）
await dv.view("_scripts/weekPanel")
```

<!-- 本模板真值来源：[[笔记类型规范]]（diary 的「周记」模板） -->
