// 领域页「看板」：把反向链接按 content-type 分组
//
// 调用方式（领域页正文里，一行）：dv.view("_scripts/areaBacklinks")
//
// 为什么单独成文件：这份逻辑写在 template_area.md 里，意味着**每新建一个领域就
// 复制一份**。它和日记那种「历史遗留的重复」不同——日记的副本数已经封顶，
// 这份会随领域数量线性增长。
//
// === 为什么不能只用 dv.pages("[[名字]]") ===
//
// 那样只认**用本名**建立的链接。本库的领域页都有形如 A-知识管理 的别名，而
// 领域页正文里的引用八成走的是别名（实测：知识管理 82 条引用里 54 条用别名）。
// 别名链接被 Obsidian 解析后，目标是文件的完整路径，跟「知识管理」这个名字
// 对不上，于是整批被静默丢掉——表现为「这个领域怎么只有二十几条」。
//
// 解法：改用 file.inlinks，它是 Obsidian 解析后的结果，别名链接同样落在目标
// 文件上。用路径精确比对即可覆盖两种写法。
//
// === 不排除任何目录 ===
//
// 40-ARCHIVE 里的引用也算（用户 2026-10-23 明确要求）。领域页要反映「全库有多
// 少东西指向这里」，不是「活跃区有多少」。归档是位置变化，不是关系消失。
//
// === 渲染规则 ===
//
//   1. 分组顺序按知识粒度排，不按英文字母序
//   2. 「未分类」置顶而不是垫底——它是待补的洞，需要有存在感
//   3. 未登记的 content-type 排在最后但**不隐藏**，新类型出现时应该被看见
//   4. 顶部一行总数，看出这个领域承载了多少篇
//
// 注意：脚本里不出现异步关键字——dataview 用纯字符串匹配检测它，命中后整份
// 文件被包进异步函数，渲染通道静默失效（注释里出现也算）。

// 知识粒度顺序：从「领域级索引」到「时间序列」，越靠前越像地图，越靠后越像素材。
const ORDER = [
  "moc",
  "area",
  "project",
  "concept",
  "comparison",
  "atomic",
  "term",
  "question",
  "sop",
  "roadmap",
  "person",
  "record",
  "article",
  "diary",
];
const UNCLASSIFIED = "未分类";

function normalize(raw) {
  if (raw === null || raw === undefined) return UNCLASSIFIED;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === null || v === undefined) return UNCLASSIFIED;
  const s = String(v).trim();
  return s === "" ? UNCLASSIFIED : s;
}

function rank(t) {
  if (t === UNCLASSIFIED) return -1; // 待补的洞置顶
  const i = ORDER.indexOf(t);
  return i === -1 ? ORDER.length : i;
}

// dataview 的 Link.path 与 file.path 都去掉了 .md，这里统一归一后再比，
// 免得一方带扩展名就全军覆没。
function barePath(v) {
  return String(v === null || v === undefined ? "" : v).replace(/\.md$/i, "");
}

const self = dv.current();
const selfPath = barePath(self.file.path);

const seen = new Set();
const pages = [];

function addPage(p) {
  const path = barePath(p.file.path);
  if (path === "" || path === selfPath) return;
  if (seen.has(path)) return;
  seen.add(path);
  pages.push(p);
}

// 通道 1：按本名反查。它漏别名，但成本低，留着当兜底——万一某天 inlinks 的
// 路径归一规则变了，本名直链这批至少还在。
for (const p of Array.from(dv.pages(`[[${self.file.name}]]`))) {
  addPage(p);
}

// 通道 2：遍历全库，用已解析的 inlinks 精确比对路径。别名引用靠这条。
for (const p of Array.from(dv.pages())) {
  const links = p.file.inlinks;
  if (links === null || links === undefined) continue;
  if (links.length === 0) continue;
  for (const l of Array.from(links)) {
    if (barePath(l && l.path) === selfPath) {
      addPage(p);
      break;
    }
  }
}

// ---- 分组 ----
const groups = {};
for (const p of pages) {
  const t = normalize(p["content-type"]);
  if (groups[t] === undefined) groups[t] = [];
  groups[t].push(p);
}

const keys = Object.keys(groups).sort(
  (a, b) => rank(a) - rank(b) || a.localeCompare(b, "zh")
);

if (pages.length === 0) {
  dv.paragraph("_还没有笔记引用这个领域。_");
} else {
  dv.paragraph(`共 **${pages.length}** 篇，${keys.length} 类`);
  for (const t of keys) {
    dv.header(4, `${t}（${groups[t].length}）`);
    dv.list(
      groups[t]
        .sort((a, b) => a.file.name.localeCompare(b.file.name, "zh"))
        .map((p) => p.file.link)
    );
  }
}
