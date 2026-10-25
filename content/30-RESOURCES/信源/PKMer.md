---
uid: 202610231755
title: PKMer
aliases:
  - R-PKMer
description: "中文 Obsidian 生态的第一手经验源，插件选型与踩坑经验可直接采信"
content-type: record
status: active
source_type: 社区
verify_status: 已验证
source_risk: 无
density: 4
timeliness: 4
depth: 4
uniqueness: 4
output_rate: 3
url: https://pkmer.cn/page/
scored_at: 2026-06-15
up: "[[经过验证的高信噪比信源]]"
date-created: 2026-10-23
date-modified: 2026-10-23
---

```dataviewjs
// 评分速览：逻辑在 _scripts/scorecard.js，改评分规则只改那一处
await dv.view("_scripts/scorecard")
```

## 类型

- 知识管理

## 评价

PKM 领域中文社区，五维都在 3 分以上，是本次盘点里最均衡的一个（19 分，B 级）。优势在**独家一手经验**：插件评测和真实工作流分享，是英文社区覆盖不到的部分——中文排版、中文字体、国内同步盘这些坑，只有这里有人踩过。

扣分在时效不是周更（4），以及产出率中等（3）。

## 采信边界

- ✅ **插件选型与踩坑经验可直接采信**：作者通常是真的在用，不是转述
- ✅ 中文 Obsidian 生态的第一手经验源
- ⚠️ 社区文章质量有方差，看作者而非看站。同一篇主题优先读有具体配置截图的
- ❌ 不要把它当"官方文档替代"——API 与语法细节仍以官方为准

## 消费证据 · 素材落地页

<!-- 这里列的是「消费」——链到本卡的全部 record，不是「产出」。
     产出挂在各篇素材的 ## 产出 段，要逐篇点进去数。 -->

```dataview
TABLE WITHOUT ID
  file.link AS 素材落地页,
  file.folder AS 目录,
  date-created AS 入箱
FROM [[]] AND -"01-META"
WHERE content-type = "record"
SORT date-created DESC
```

## 下一动作

- [ ] 无
