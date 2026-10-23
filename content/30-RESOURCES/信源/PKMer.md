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

## 下一动作

- [ ] 无
