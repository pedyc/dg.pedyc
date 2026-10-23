// 断链医院（共享视图）
//
// 调用方式（在 01-META/Index/知识缺口.md 里，前面加异步等待前缀）：
//     dv.view("_scripts/brokenLinks", { minRefs: 2, limit: 60 })
//
// 目的不是"修断链"，而是回答一个问题：**2249 个未掌握的洞里，先补哪个**。
// 本库已定调「断链 ≠ 错误，是未掌握的知识」，所以这里不做修复建议，
// 只做排序——被引用 14 次的 [[Rollup]] 每出现一次都在提醒缺一块，却从没被写过，
// 它比被引用 1 次的洞更值得先写。
//
// ⚠️ 只依赖 dv 与原生 JS。不依赖 app / moment（dv.view 的执行环境是
//    new Function("dv","input",contents)，作用域里没有插件内部对象）。
//
// ⚠️ 本文件刻意不含异步等待关键字：dataview 用纯字符串匹配检测，命中后整份
//    文件被包进 async IIFE，return 通道静默关闭。修改时勿引入。

const cfg = input || {};
const MIN_REFS = Number(cfg.minRefs) >= 1 ? Number(cfg.minRefs) : 2;
const LIMIT = Number(cfg.limit) > 0 ? Number(cfg.limit) : 60;

// 不作为"来源"计入的目录：模板里的链接是占位符，归档区免维护
const EXCLUDE_SRC = ["_templates/", "40-ARCHIVE/", ".claude/", ".obsidian/", ".workbuddy/"];

// 附件不是"洞"，直接跳过
const SKIP_EXT = /\.(png|jpe?g|gif|svg|webp|avif|pdf|epub|mp3|mp4|mov|excalidraw|base|canvas|zip|json|csv)$/i;

const norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/\.md$/, "");

const pages = Array.from(dv.pages());

// --- 建索引：路径 / 文件名 / 别名 ---
const byPath = new Set();
const byName = new Set();
const byAlias = new Set();

for (const p of pages) {
  byPath.add(norm(p.file.path));
  byName.add(norm(p.file.name));
  const al = p.file.aliases;
  if (al) for (const a of al) byAlias.add(norm(a));
}

// --- 收集未解析链接 ---
const gaps = new Map(); // key -> { count, from: [page,...] }
let refTotal = 0;

for (const p of pages) {
  const src = p.file.path;
  if (EXCLUDE_SRC.some((d) => src.startsWith(d) || src.includes("/" + d))) continue;

  const out = p.file.outlinks;
  if (!out) continue;

  for (const l of out) {
    const raw = l && l.path;
    if (!raw) continue;

    // 噪音：模板占位符（{{父级}}）、代码里带引号的字符串
    if (raw.indexOf("{{") >= 0 || raw.indexOf("}}") >= 0 || raw.indexOf('"') >= 0) continue;
    if (SKIP_EXT.test(raw)) continue;

    const key = norm(raw);
    if (!key) continue;

    // 纯数字目标（[[42]] 这类）多半是代码或序列号残留，不是知识缺口
    if (/^\d+$/.test(key)) continue;

    const base = key.split("/").pop();
    if (byPath.has(key) || byName.has(base) || byAlias.has(key) || byAlias.has(base)) continue;

    refTotal += 1;
    if (!gaps.has(key)) gaps.set(key, { count: 0, from: [], label: raw });
    const g = gaps.get(key);
    g.count += 1;
    if (g.from.length < 2 && !g.from.includes(p)) g.from.push(p);
  }
}

// --- 排序与渲染 ---
const ranked = Array.from(gaps.entries())
  .map(([k, v]) => ({ name: v.label || k, count: v.count, from: v.from }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

const shown = ranked.filter((g) => g.count >= MIN_REFS).slice(0, LIMIT);
const singles = ranked.filter((g) => g.count < MIN_REFS).length;

dv.paragraph(
  `> 🕳️ 全库 **${ranked.length}** 个未解析链接目标，合计被引用 **${refTotal}** 次 · ` +
    `下表为被引 ≥ \`${MIN_REFS}\` 次的 **${shown.length}** 个（这是天然的补稿优先级）`
);

if (shown.length === 0) {
  dv.paragraph("*（没有达到阈值的目标）*");
} else {
  dv.table(
    ["缺口（待补）", "被引用", "出现在"],
    shown.map((g) => [g.name, String(g.count), g.from.map((p) => p.file.link)])
  );
}

if (singles > 0) {
  dv.paragraph(
    `> 另有 **${singles}** 个目标只被引用 1 次，未列出。它们多半是"顺口一提的术语"，` +
      `补它们的收益低于补上面这些——但如果你在一处反复遇到同一个单引用缺口，就把阈值调到 1。`
  );
}
