---
uid: '<% tp.file.creation_date("YYYYMMDDHHmm") %>'
topic: [个人成长/周报]
title: template_week
tags: [个人成长/weekly]
date-created: 2025-07-20
date-modified: 2026-03-04
---

## 📋 任务全景（本周任务追踪）

```dataviewjs

```

> [!NOTE] 周度战略复盘
> 本周整体评价：⭐️⭐️⭐️⭐️
> **任务完成率**：<% await tp.user.calculate_task_completion(tp, 7) %>%
> **核心洞察**：
> - TODO

## 🌌 星云集（本周碎片记录）

```dataview
LIST L.text
WHERE file.cday >= date(<% tp.date.now("YYYY-MM-DD", -6) %>)
AND file.day <= date(<% tp.date.now("YYYY-MM-DD") %>)
FLATTEN file.lists AS L
WHERE contains(L.tags, "#闪念")
```
