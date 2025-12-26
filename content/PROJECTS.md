---
title: PROJECTS
date-created: 2025-12-04
date-modified: 2025-12-26
---

## 规划中的项目

```dataview
TABLE status, area, cycle
FROM "PARA/10-PROJECTS"
SORT file.name ASC
```

## 正在进行的项目

```dataview
TABLE status, area, cycle
FROM "PARA/10-PROJECTS"
WHERE status = "进行中"
SORT file.name ASC
```

## 已完成项目

```dataview
TABLE status, area, cycle
FROM "PARA/10-PROJECTS"
WHERE status = "已完成"
SORT file.name ASC
```
