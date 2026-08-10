---
title: LIST
date-created: 2026-03-10
date-modified: 2026-06-24
---

## PROJECTS

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
