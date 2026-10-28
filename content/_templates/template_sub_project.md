---
uid: <% tp.file.creation_date("YYYYMMDDHHmmss") %>
title: template_sub_project
aliases:
  - "{{P-专项名称}}"
description: "{{一句话描述本专项的目标}}"
tags: []
content-type: project
consequence: 1
urgency: 1
area: []
expire: YYYY-MM-DD
up: "[[{{父级项目}}]]"
---

<!--
	本模板真值来源：[[笔记类型规范]]（project 的「专项」子模板，content-type 同为 project）

	与 template_project.md 的分工：专项只承载「一个目标 + 一份勾选清单」，
	不重复父项目的战略地图与复盘。专项的复盘写回父项目。进度由勾选数表达，不写百分比。
-->

## 目标

{{本专项要达成的具体目标，一句话；与父项目哪条 KR 对应}}

## 成功标准

> 勾掉即达成。这里就是验收，不再另起一节。

- [ ] {{可观察、可验证的成功标准1}}
- [ ] {{可观察、可验证的成功标准2}}

## 进展

**当前障碍**：

- {{障碍}}

**下一步**：

- {{下一行动}}
