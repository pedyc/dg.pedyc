---
uid: 202603082302
title: A-时间管理
aliases: [时间管理领域, 个人效能系统]
description: 时间管理领域知识索引
tags: [area]
date-created: 2026-03-08
date-modified: 2026-03-12
status: cultivating
content-type: [area]
related: ["[[精力成本]]", "[[四象限法则]]", "[[SOP-如何在四象限中应用精力成本]]"]
---

## 🗺️ A- 时间管理

```dataview
TABLE
  file.link as "项目",
  status,
  expire,
  date(expire) - date(today) as "剩余天数"
FROM "10-PROJECTS"
WHERE
  contains(area, this.file.link) AND
  status != "completed"
SORT
  choice(date(expire) < date(today), 0, 1) ASC,
  expire ASC
```

### 🧠 核心定义 (Scope & Definition)

> [!Abstract]
> 本领域涵盖如何有效管理时间、精力和注意力，以提升个人生产力和生活质量。核心关注点包括任务优先级排序、精力周期管理、习惯养成和工作流程优化。

### 🧠 核心心智模型 (Atomic Principles)

- **理论基石**
		- [[精力成本]]：将精力视为有限资源进行战略性分配
				- **洞见**：管理时间不如管理精力，将高认知负荷任务与高精力时段对齐
		- [[四象限法则]]：通过重要性和紧急性两个维度对任务进行分类
				- **洞见**：区分 " 重要 " 与 " 紧急 "，避免被紧急但不重要的事务牵着鼻子走
- **思维模型**
		- [[SOP-如何在四象限中应用精力成本]]：将任务优先级与个人精力周期进行匹配
				- **洞见**：实现 " 注意力 " 这一稀缺资源的双重优化管理

### 🛠️ 执行系统 (Actionable Workflows)

- **SOP (标准流程)**
		- [SOP-如何在四象限中应用精力成本](app://obsidian.md/SOP-%E5%A6%82%E4%BD%95%E5%9C%A8%E5%9B%9B%E8%B1%A1%E9%99%90%E4%B8%AD%E5%BA%94%E7%94%A8%E7%B2%BE%E5%8A%9B%E6%88%90%E6%9C%AC)：将任务优先级与个人精力周期进行匹配
- **关键工具**
		- [[番茄工作法]]：通过定时专注和休息提升工作效率
		- [[GTD]]：全面任务管理系统

### 🔗 知识网络 (Context)

- **上游学科**：[[认知心理学]] (提供注意力、记忆等理论支撑)
- **协同领域**：[[习惯养成]] (习惯是自动化的行为模式，减少决策消耗)
- **对立/竞争概念**：[[时间均等分配]] (假设所有时间价值相同)

### 🧪 探索前沿 (The Frontier)

- [[如何科学测量个人精力水平？]]
- [[如何准确判断任务的重要性？]]
