---
uid: 202506010000
title: suggest-log
aliases: [suggest-log, 行动建议日志]
tags: [llm-wiki, 元数据]
date-created: 2026-06-01
date-modified: 2026-06-12
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

- [2026-06-01] suggest | 行动建议（v1.3 - 时间衰减 + Q1升权 + 阶段感知）
	- [x] **P0 逾期归档** ✅ 2026-06-01
		- [x] [[P-学习OpenClaw]]（priority=10，expired 75d）— 已 done，建议移至 50-ARCHIVE ✅ 2026-06-01
		- [x] [[P-构建PKM系统]]（completed，39d）— 已 completed，建议移至 50-ARCHIVE ✅ 2026-06-01
	- **P1 紧急停滞**（停滞时长降序）
		- [x] [[P-健康重启计划]]（expired 62d，cultivating 81d）— 建议归档 ✅ 2026-06-01
		- [x] [[P-视觉化PKM]]（expired 62d，priority=4）— 建议归档 ✅ 2026-06-01
		- [ ] [[P-构建一个智能体]]（expired 62d，fleeting 81d）— 建议补充项目目标和 KR，推进到 cultivating
		- [ ] [[P-AI学习计划]]（fleeting 396d，未过期）— 建议重新评估，补充内容或归档
	- **P2 重要继续**（final_priority × Q1 boost，取 top 3）
		- [ ] [[P-算法提升专项]]（final_priority=84，Q1，expired 62d）— 当前阶段：攻坚期，建议完成二叉树模块 10 道题
		- [ ] [[P-求职前端岗位]]（final_priority=135，Q1，expired 32d）— 当前阶段：面试冲刺，建议更新 [[投递记录表]]
		- [ ] [[P-前端能力提升专项]]（final_priority=64，expired 42d）— 建议完成 React 面试题复习
	- **P3 维护**
		- 5 个孤儿 MOC（见上次 lint 报告）
		- ![[wiki-log#2026-06-01]]

*Log 开始于 2026-06-01*
