// 信源评分速览表（共享视图）
//
// 调用方式：卡片正文写一个 dataviewjs 代码块，内容为
//     dv.view("_scripts/scorecard")
// （外层加异步等待，写法见任一信源卡）
//
// 全部数值由当前笔记的 frontmatter 实时计算，本文件不含任何手填数据。
// 改评分规则（阈值 / 满分 / 维度）只需改这一个文件，8 张卡 + MOC + 看板同时生效。
//
// ⚠️ 契约（来自 dataview 0.5.68 的 dv.view 实现，main.js:18953）：
//   1. 内容以 new Function("dv", "input", contents) 执行，故 dv 可用
//   2. dataview 用纯字符串匹配检测异步等待关键字；一旦出现，整个文件会被包进
//      async IIFE，此时任何 return 都会被吞掉。本文件刻意不含该关键字，
//      从而走同步路径、行为可预测。修改时请勿引入。
//   3. 直接调用 dv.xxx 渲染；不要 return 值（非空返回值会被二次渲染）

const f = dv.current();
const dims = [
  ["信息密度", "density"],
  ["时效性", "timeliness"],
  ["深度", "depth"],
  ["独特性", "uniqueness"],
  ["产出率", "output_rate"],
];

const pts = dims.map(([label, key]) => [label, f[key] == null ? null : Number(f[key])]);
const miss = pts.filter(([, v]) => v === null || Number.isNaN(v));

// 缺维一律不按 0 计入：number + null === number，静默当 0 会算出假总分。
// 注意与「用户手填 0」区分：填了 0 是真实评分（零产出），没填才是缺口。
const total = miss.length ? null : pts.map(([, v]) => v).reduce((a, b) => a + b, 0);
const grade =
  total == null ? "待评（五维未齐）"
  : total >= 20 ? "A 级 · 保留"
  : total >= 15 ? "B 级 · 观察"
  : total >= 10 ? "C 级 · 待砍"
  : "D 级 · 立即砍";

const rows = pts.map(([l, v]) => [l, v === null || Number.isNaN(v) ? "—（待补）" : String(v)]);
rows.push(["**综合**", total == null ? "**—**　" + grade : `**${total} / 25**　${grade}`]);
dv.table(["维度", "分值"], rows);

const d = f.scored_at ? String(f.scored_at).slice(0, 10) : "—";
dv.paragraph(`评分时间 **${d}** · 采信风险 **${f.source_risk ?? "—"}** · 状态 **${f.verify_status ?? "—"}**`);
