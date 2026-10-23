// 领域页「看板」：把反向链接按 content-type 分组
//
// 调用方式（领域页正文里，一行）：dv.view("_scripts/areaBacklinks")
//
// 为什么单独成文件：这份逻辑写在 template_area.md 里，意味着**每新建一个领域就
// 复制一份**。它和日记那种「历史遗留的重复」不同——日记的副本数已经封顶，
// 这份会随领域数量线性增长。三个领域时无所谓，十个领域时改排序规则要改十处。
//
// 与原先内联版的差异（数据来源不变，只改呈现）：
//   1. 分组顺序按知识粒度排，不按英文字母序。原先是 Object.keys().sort()，
//      于是 atomic 在前、question 在后——字母序对读者没有任何意义
//   2. 「未分类」置顶而不是垫底。它是待补的洞，需要有存在感
//   3. 顶部加一行总数，原先只有各组计数，看不出这个领域承载了多少篇
//   4. 空字符串的 content-type 也归入未分类。原先用 ?? 只兜 undefined，
//      值写成空串时会渲染出空标题
//
// 注意：脚本里不出现异步关键字——dataview 用纯字符串匹配检测它，命中后整份
// 文件被包进异步函数，渲染通道静默失效（注释里出现也算）。
//
// namesFrom: 反向链接的判定沿用 dv.pages(`[[名字]]`)，依赖 Obsidian 的解析结果
// （别名链接是否计入由 Obsidian 决定，本脚本不做二次处理）。

// 知识粒度顺序：从「领域级索引」到「时间序列」，越靠前越像地图，越靠后越像素材。
// 未在表内的 content-type 排在最后，不隐藏——新类型出现时应该被看见。
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

const self = dv.current();
const selfPath = self.file.path;

const pages = Array.from(dv.pages(`[[${self.file.name}]]`)).filter(
  (p) => p.file.path !== selfPath
);

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
  dv.paragraph(
    `共 **${pages.length}** 篇，${keys.length} 类`
  );
  for (const t of keys) {
    dv.header(4, `${t}（${groups[t].length}）`);
    dv.list(
      groups[t]
        .sort((a, b) => a.file.name.localeCompare(b.file.name, "zh"))
        .map((p) => p.file.link)
    );
  }
}
