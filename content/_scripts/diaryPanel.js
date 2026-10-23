// 日记面板（共享视图）
//
// 调用方式（在日记正文里，两块各一行，前面加异步等待前缀）：
//     dv.view("_scripts/diaryPanel", { part: "tasks" })      → 跬步：项目任务分发
//     dv.view("_scripts/diaryPanel", { part: "artifacts" })  → 温故：当日知识资产
//
// 为什么不写完整调用语句：本文件必须避开异步等待关键字（见文末契约），
// 所以示例里刻意省略前缀；照抄 diary 模板或任意一篇日记的正文即可。
//
// 为什么两块合并成一个文件：它们都要"提取当前日记的日期"。分开写会把同一段
// 日期提取逻辑再抄一遍——这正是本次收口要消灭的东西（原先 21 篇日记里该函数
// 存在 80+ 份副本，且两处实现已经漂移）。
//
// ⚠️ 只依赖 dv 与原生 Date。不依赖 moment，也不依赖 app：
//    契约来自 dataview 0.5.68 的 dv.view 实现（main.js:18974），它以
//    new Function("dv", "input", contents) 执行，作用域里只有全局变量与
//    两个形参，插件内部对象不保证可见。日期比较用 ISO 字符串字典序即可，
//    不需要日期库。
//
// ⚠️ 本文件刻意不含异步等待关键字：dataview 用纯字符串匹配检测它，一旦
//    出现就把整份文件包进 async IIFE，return 通道被静默关闭。修改时勿引入。

const part = (input && input.part) || "tasks";
const page = dv.current();
const DAY = 86400000;

// --- 唯一一份日期提取 ---

// 把任意值（Link 对象 / DateTime / 字符串）转成 YYYY-MM-DD
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

// 当前这篇日记的基准日期：标题 → 文件名 → date-created → 今天
function diaryDate() {
  const fromTitle = dateOf(page.title);
  if (fromTitle) return fromTitle;
  const fromName = dateOf(page.file && page.file.name);
  if (fromName) return fromName;
  const fromCreated = dateOf(page["date-created"]);
  if (fromCreated) return fromCreated;
  return isoToday();
}

function isoToday() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// 两个 ISO 日期相差天数（UTC 解析，避开时区偏移）
function daysBetween(fromISO, toISO) {
  return Math.round((new Date(toISO + "T00:00:00Z") - new Date(fromISO + "T00:00:00Z")) / DAY);
}

// ---------------------------- 跬步：项目任务 ----------------------------

if (part === "tasks") {
  const today = diaryDate();
  const projects = dv
    .pages('"10-PROJECTS"')
    .where((p) => {
      if (p["content-type"] !== "project") return false;
      const st = String(p.status || "").toLowerCase();
      if (st === "completed" || st === "archived") return false;
      if (!p.expire) return true; // 未设截止日期 → 留在行动池
      const exp = dateOf(p.expire);
      if (!exp) return true;
      return exp >= today; // ISO 字符串字典序 = 日期序
    })
    .sort((p) => (Number(p.urgency) || 0) + (Number(p.consequence) || 0), "desc");

  dv.paragraph(`> 🎯 **当前行动基准日**：\`${today}\` · 聚焦未逾期且活跃的项目任务`);

  dv.table(
    ["综合评分", "推进项目 (Project)", "状态", "关联领域", "截止日期", "工期状态"],
    projects.map((p) => {
      const score = (Number(p.urgency) || 0) + (Number(p.consequence) || 0);
      let left = "-";
      const exp = dateOf(p.expire);
      if (exp) {
        const diff = daysBetween(today, exp);
        if (diff === 0) left = "🔥 今天截止";
        else if (diff > 0) left = `⏳ 剩 ${diff} 天`;
        else left = `⚠️ 逾期 ${Math.abs(diff)} 天`;
      }
      return [`⭐ ${score}`, p.file.link, p.status || "active", p.area || p.up || "-", p.expire || "长期", left];
    })
  );
}

// ------------------------ 温故：当日知识资产沉淀 ------------------------

if (part === "artifacts") {
  const today = diaryDate();
  const selfPath = page.file && page.file.path;

  const touched = dv
    .pages('-"01-META" and -"_templates" and -"00-INBOX"')
    .where((p) => {
      if (p.file.path === selfPath) return false;

      // A. 创建日期：优先 frontmatter，其次文件 cday
      let created = dateOf(p["date-created"]);
      if (!created && p.file.cday) created = dateOf(new Date(p.file.cday.ts).toISOString());
      if (created === today) return true;

      // B. 修改日期：优先 frontmatter，其次文件 mtime
      let modified = dateOf(p["date-modified"]);
      if (!modified && p.file.mtime) modified = dateOf(new Date(p.file.mtime.ts).toISOString());
      return modified === today;
    })
    .sort((p) => (p.file.mtime ? p.file.mtime.ts : 0), "desc");

  dv.paragraph(`> 📅 **当日沉淀捕获基准**：\`${today}\` · 共筛选出 \`${touched.length}\` 篇相关资产`);

  dv.table(
    ["笔记资产", "类型 (content-type)", "状态", "所属目录", "最后更新时间"],
    touched.map((p) => {
      let hhmm = "-";
      if (p.file.mtime) {
        const d = new Date(p.file.mtime.ts);
        hhmm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      }
      return [p.file.link, p["content-type"] || "note", p.status || "-", p.file.folder, hhmm];
    })
  );
}
