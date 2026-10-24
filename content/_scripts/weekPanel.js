// 周记面板（共享视图）
//
// 调用方式（周记正文首行，前面加异步等待前缀）：
//     dv.view("_scripts/weekPanel")
//
// 本文件取代原先内联在每篇周记里的 266 行代码。收口的同时修掉三处漂移：
//   1. 默认状态写的是 `cultivating` —— 该值 2026-10-23 已并入 active，不再合法
//   2. 日期取 `p['date-created'].toString()`，Date 对象会得到
//      "Fri Oct 23 2026 ..." 这种串，再交给日期库二次解析，不稳
//   3. 五段"标题 + 有则表格 / 无则提示"的代码逐段复制，改一次要改五处
//
// ⚠️ 只依赖 dv 与原生 Date，不依赖 moment / app：
//    dv.view 以 new Function("dv", "input", contents) 执行（dataview 0.5.68，
//    main.js:18974），作用域里只有全局变量与形参。ISO 周计算在此手写 12 行，
//    比引入日期库更可靠。
//
// ⚠️ 本文件刻意不含异步等待关键字：dataview 用纯字符串匹配检测，命中后整份
//    文件被包进 async IIFE，return 通道静默关闭。修改时勿引入。

const DAY = 86400000;

// ---------------- 工具 ----------------

function dateOf(val) {
  if (val == null) return null;
  let str;
  if (typeof val === "object") {
    str = val.path || val.fileName || (val.toISODate && val.toISODate()) || String(val);
  } else {
    str = String(val);
  }
  const m = str.match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
}

function isoOf(d) {
  return d.toISOString().slice(0, 10);
}

// ISO 周 → 该周的周一与周日（YYYY-MM-DD）
// 依据：ISO 8601 规定每年第 1 周是含 1 月 4 日的那一周
function isoWeekRange(year, week) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dowMon0 = (jan4.getUTCDay() + 6) % 7; // 周一记 0
  const week1Monday = new Date(jan4.getTime() - dowMon0 * DAY);
  const monday = new Date(week1Monday.getTime() + (week - 1) * 7 * DAY);
  const sunday = new Date(monday.getTime() + 6 * DAY);
  return [isoOf(monday), isoOf(sunday)];
}

// 笔记的"诞生日期"：frontmatter 优先，退回文件 cday
function bornOf(p) {
  const fromFm = dateOf(p["date-created"]);
  if (fromFm) return fromFm;
  if (p.file && p.file.cday) return isoOf(new Date(p.file.cday.ts));
  return null;
}

// 2026-10-24：原「状态」列已删。它取 status 字段，而该字段已废除；
// 且周记列的都是本周新建的笔记，status 恒为模板默认值，零信息。

// ---------------- 主逻辑 ----------------

const page = dv.current();
const title = page.title || (page.file && page.file.name) || "";
const wm = String(title).match(/(\d{4})-[wW](\d{1,2})/);

if (!wm) {
  dv.paragraph(
    "⚠️ **无法从标题解析周数**：请确保周记标题符合 `YYYY-Www` 格式（例如 `2026-W36`）"
  );
} else {
  const year = parseInt(wm[1], 10);
  const week = parseInt(wm[2], 10);
  const [monday, sunday] = isoWeekRange(year, week);

  dv.paragraph(
    `> 📅 **本周知识沉淀统计周期**：\`${monday}\` ～ \`${sunday}\` · 按 \`date-created\` 归周`
  );

  // 只统计可沉淀的知识类型（article/diary/project/area 不计入周沉淀）
  const KNOWLEDGE = ["atomic", "concept", "term", "question", "sop", "comparison", "record", "roadmap", "person", "moc"];

  const pages = Array.from(
    dv.pages('"50-ZETTELCASTEN" or "30-RESOURCES"').where((p) => {
      if (!KNOWLEDGE.includes(p["content-type"])) return false;
      const born = bornOf(p);
      if (!born) return false;
      return born >= monday && born <= sunday; // ISO 字符串字典序 = 日期序
    })
  ).sort((a, b) => (bornOf(b) || "").localeCompare(bornOf(a) || ""));

  const byType = {};
  for (const p of pages) {
    const t = p["content-type"];
    if (!byType[t]) byType[t] = [];
    byType[t].push(p);
  }
  const take = (t) => byType[t] || [];

  // 每段：标题 / 表头 / 行映射 / 空提示
  const SECTIONS = [
    {
      type: "atomic",
      title: "🧠 本周原子洞察",
      head: ["新增原子笔记（陈述句核心观点）", "挂载父级（Concept）", "创建日期"],
      row: (p) => [p.file.link, p.up || "-", bornOf(p) || "-"],
      empty: "本周暂无新增原子洞察",
    },
    {
      type: "concept",
      title: "📚 本周概念整合",
      head: ["新增概念笔记", "一句话定义", "挂载父级（Area）", "创建日期"],
      row: (p) => [p.file.link, p.description || "-", p.up || "-", bornOf(p) || "-"],
      empty: "本周暂无新增概念笔记",
    },
    {
      type: "question",
      title: "❓ 本周问题沉淀",
      head: ["问题", "关联主题", "创建日期"],
      row: (p) => [p.file.link, p.up || "-", bornOf(p) || "-"],
      empty: "本周暂无新增问题",
    },
    {
      type: "sop",
      title: "🛠️ 本周流程沉淀",
      head: ["SOP", "主题介绍", "关联问题", "创建日期"],
      row: (p) => [p.file.link, p.description || "-", p.up || "-", bornOf(p) || "-"],
      empty: "本周暂无新增 SOP",
    },
  ];

  for (const s of SECTIONS) {
    const rows = take(s.type);
    dv.header(4, `${s.title}（${s.type} · ${rows.length} 篇）`);
    if (rows.length > 0) dv.table(s.head, rows.map(s.row));
    else dv.paragraph(`*(${s.empty})*`);
  }

  // 其余知识类型合并成一段（保持原有归并逻辑：term/对比/记录/演进/人物/MOC）
  const OTHERS = ["term", "comparison", "record", "roadmap", "person", "moc"];
  const rest = OTHERS.flatMap((t) => take(t));

  dv.header(4, `🧩 本周其他知识沉淀（Term/对比/记录/演进/人物/MOC · ${rest.length} 篇）`);
  if (rest.length > 0) {
    dv.table(
      ["笔记", "类型", "描述", "创建日期"],
      rest.map((p) => [p.file.link, p["content-type"], p.description || "-", bornOf(p) || "-"])
    );
  } else {
    dv.paragraph("*(本周暂无其他类型知识沉淀)*");
  }
}
