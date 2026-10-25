---
uid: <% tp.file.creation_date("YYYYMMDDHHmmss") %>
title: "{{信源名}}"
aliases:
  - R-{{信源名}}
description: ""
content-type: record
source_type: 
verify_status: 候选
source_risk: 
density: 
timeliness: 
depth: 
uniqueness: 
output_rate: 
scored_at: 
url: ""
up: "[[经过验证的高信噪比信源]]"
date-created: <% tp.file.creation_date("YYYY-MM-DD") %>
date-modified: <% tp.file.creation_date("YYYY-MM-DD") %>
---

<!--
	信源卡设计原则：

	1. 一个信源 = 一张卡，全部放在 30-RESOURCES/信源/
	2. 卡片只存「怎么用它」，不存「它讲了什么」——内容靠 ingest 迁出，卡片不抄正文
	3. 评分全部由 frontmatter 算出，正文连一个手填数字都不放
	4. 建卡时 verify_status 填「候选」，五维一律留空——没看过的源不该有分数

	字段说明：
	- source_type：YouTube / Bilibili / RSS / Newsletter / 社区 / 媒体
	- verify_status：候选 → 待验证 → 已验证 → 已弃。在看板里拖动切换，不手改
	- source_risk：无 / 推演型 / 立场型。不参与总分，回答的是「这条信息能拿来做什么」
	- 五维 1-5：density 密度 / timeliness 时效 / depth 深度 / uniqueness 独特性 / output_rate 产出率
	- output_rate 不设否决线：低产出 + 高总分 = 视野补充型，该留；低产出 + 低总分才退订

	本模板真值来源：[[经过验证的高信噪比信源]]、[[信源质量审计标准]]
-->

```dataviewjs
// 评分速览：逻辑在 _scripts/scorecard.js，改评分规则只改那一处
await dv.view("_scripts/scorecard")
```

## 类型

- {{内容领域，如：计算机技术 / 知识管理 / 社会纪实}}

## 评价

{{一两句话说清它在同类源里的位置：强在哪一维、弱在哪一维、为什么这么打分}}

{{对打分有争议的维度单独解释——尤其"时效低"这类体裁属性，别让人误以为是缺陷}}

## 采信边界

- ✅ **{{可用的部分}}**：{{为什么能直接用}}
- ⚠️ **{{有条件的部分}}**：{{用之前必须先做什么}}
- ❌ **{{不可用的部分}}**：{{什么场合绝对不能用它}}

## 下一动作

- [ ] 实测产出率：{{观察周期内}}读了几篇 → 实际落成几条笔记/几个判断，填 `output_rate` 后自动出评级
