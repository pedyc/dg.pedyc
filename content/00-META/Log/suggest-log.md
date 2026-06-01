---
uid: 202506010000
title: suggest-log
aliases: [suggest-log, 行动建议日志]
tags: [llm-wiki, 元数据]
date-created: 2026-06-01
date-modified: 2026-06-01
status: active
content-type: [article]
up: ["[[本库指南]]"]
---

## Suggest Log

本文件是行动建议的 append-only 时间线，记录每次 `/action-suggest` 生成的建议及其上下文。

格式：`## [日期] 操作类型 | 标题`。

---

## 2026

### 2026-06

#### 2026-06-01

#### 2026-06-01

- [2026-06-01] suggest | 行动建议（v1.2 - 对接项目优先级字段）
	- **当前状态**
		- 活跃项目：2 个，培育中项目：4 个，待培育：2 个，已完成：2 个
		- 孤儿 MOC：5 个
	- [x] **P0 逾期归档** ✅ 2026-06-01
		- [x] [[P-学习OpenClaw]]（priority=10，expired 75d）— 已 done，建议移至 50-ARCHIVE ✅ 2026-06-01
		- [x] [[P-构建PKM系统]]（completed，39d）— 已 completed，建议移至 50-ARCHIVE ✅ 2026-06-01
	- **P1 紧急停滞**（停滞时长降序）
		- [[P-健康重启计划]]（cultivating，81d，priority=18）— 建议推进到 active 或归档
		- [[P-视觉化PKM]]（cultivating，81d，priority=4）— 建议补充内容或归档
		- [[P-构建一个智能体]]（fleeting，81d，priority=21）— 建议补充内容推进到 cultivating
	- **P2 重要继续**（priority 降序，取 top 3）
		- [[P-求职前端岗位]]（priority=90，expired）— 最高优先级，建议继续推进m
		- [[P-前端能力提升专项]]（priority=64，expired）— 次优先级
		- [[P-算法提升专项]]（priority=56，expired）— 第三优先级
	- **P3 维护**
		- 5 个孤儿 MOC（见上次 lint 报告）

*Log 开始于 2026-06-01*
