---
uid: 202610231751
title: Zsolt
aliases:
  - R-Zsolt
description: "方法论可迁移，但手绘图不能照搬成索引——本库的索引是自动生成的"
content-type: record
status: active
source_type: YouTube
verify_status: 已验证
source_risk: 无
density: 5
timeliness: 3
depth: 5
uniqueness: 5
output_rate: 2
scored_at: 2026-06-15
url: https://www.youtube.com/@ZsoltViczián
up: "[[经过验证的高信噪比信源]]"
date-created: 2026-10-23
date-modified: 2026-10-23
---

```dataviewjs
// 评分速览：全部数值由 frontmatter 实时计算，本块不含任何手填数据
const f = dv.current();
const dims = [["信息密度","density"],["时效性","timeliness"],["深度","depth"],["独特性","uniqueness"],["产出率","output_rate"]];
const pts = dims.map(([label, key]) => [label, f[key] == null ? null : Number(f[key])]);
const miss = pts.filter(([, v]) => v === null || Number.isNaN(v));
const total = miss.length ? null : pts.map(([, v]) => v).reduce((a, b) => a + b, 0);
const grade = total == null ? "待评（五维未齐）" : total >= 20 ? "A 级 · 保留" : total >= 15 ? "B 级 · 观察" : total >= 10 ? "C 级 · 待砍" : "D 级 · 立即砍";
const rows = pts.map(([l, v]) => [l, v === null || Number.isNaN(v) ? "—（待补）" : String(v)]);
rows.push(["**综合**", total == null ? "**—**　" + grade : `**${total} / 25**　${grade}`]);
dv.table(["维度", "分值"], rows);
const d = f.scored_at ? String(f.scored_at).slice(0, 10) : "—";
dv.paragraph(`评分时间 **${d}** · 采信风险 **${f.source_risk ?? "—"}** · 状态 **${f.verify_status ?? "—"}**`);
```

## 评价

Obsidian 视觉化知识管理领域的天花板。核心不在"怎么用插件"，而在**用 Excalidraw 把思考过程外化**——他画图是为了想清楚，不是为了展示结果。这个区分是它区别于其他 PKM 频道的地方（独特性 5）。

深度 5、密度 5，篇篇有可迁移的方法论。扣分在两处：更新频率低（时效 3），且看完不容易立刻落成产出（产出率 2）。

## 采信边界

- ✅ **方法层可直接学**：思考脚手架、图与文的配合方式、渐进式结构化
- ⚠️ **工作流层要翻译再抄**：他的图承担了本库由 `base` + `dataview` 承担的索引职能。直接搬会造成重复建设——本库的索引是自动生成的，他的图是手工维护的。学他的"用什么形状想问题"，不要学他的"用手绘图当目录"
- ❌ 具体插件/版本操作可能过时，以官方文档为准

## 下一动作

- [ ] 提炼一条可迁移的"图 vs 文"分工原则，写入 atomic
