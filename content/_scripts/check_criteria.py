"""把判据投影成可执行的检查。

判据的价值不在被读过，而在被违反时有人出声。本脚本是「载体=脚本」那一类的实现，
每一条检查都标着它服务哪个判据编号；改判据时顺着编号能找到这里，改这里时也能
反查是哪条判据要求它。

与 validate_meta.py 的分工：
- validate_meta.py 管 frontmatter 的字段与写法（uid / up / content-type / 墓碑）
- 本脚本管正文与归属（写了几节、有没有挖空、目录收错了型、链接断没断）

用法：
    python _scripts/check_criteria.py                 # 全部检查，汇总
    python _scripts/check_criteria.py --detail E15    # 某条判据的明细
    python _scripts/check_criteria.py --only E15,E25  # 只跑某几条
    python _scripts/check_criteria.py --coverage      # 载体覆盖：哪些判据还没人查
"""

import re
import sys
from collections import defaultdict

import criteria_lib as lib

CONTENT_DIRS = [
    "00-INBOX", "10-PROJECTS", "20-AREAS", "30-RESOURCES",
    "40-ARCHIVE", "50-ZETTELCASTEN", "60-BLOGS", "90-DIARY",
]
ARCHIVE = "40-ARCHIVE"
# 收件箱是待消化的素材，不是笔记；判据约束的是笔记的写法。
JUDGED = [d for d in CONTENT_DIRS if d != "00-INBOX"]
MEDIA = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf", ".mp4", ".mp3", ".excalidraw")

# 六桶词表（知识图谱）。含 sop 的第六桶。
BUCKETS = {"上位", "下位", "并列", "相关", "外部资料", "问题来源"}
# 历史同义写法，2026-10-27 收口过一轮，不能长回来。
BUCKET_SYNONYMS = {
    "父级概念", "母领域", "关联概念", "参考来源", "相关笔记", "子概念",
    "同级概念", "上级", "下级", "参见", "延伸阅读",
}

PLACEHOLDER = re.compile(r"（?暂无|待补充|（待补|TODO|FIXME|\{\{[^}]*\}\}")
CLOZE = re.compile(r"~~[^~\n]+~~")
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
LABEL = re.compile(r"^\s*[-*]?\s*\*\*([^*]+)\*\*")
WIKILINK = re.compile(r"\[\[([^\]|#]+)")
FENCE = re.compile(r"```.*?```", re.S)
INLINE_CODE = re.compile(r"`[^`\n]*`")

notes = []          # [(relpath, fm, body, text)]
link_targets = set()   # 文件名与别名，用于判断链
results = defaultdict(list)   # criterion -> [(relpath, lineno, msg)]


def load_notes():
    root = lib.ROOT
    # 断链判断要能解析到全库任意一篇（含 01-META 的 Truth / Guide），
    # 只索引正文目录会把跨区链接全算成断链。
    for path in root.rglob("*.md"):
        rel = path.relative_to(root).as_posix()
        if rel.startswith((".obsidian/", ".claude/", ".workbuddy/", "99-ASSETS/copilot/")):
            continue
        link_targets.add(path.stem)
        fm = lib.parse_frontmatter(path.read_text(encoding="utf-8"))
        for a in str(fm.get("aliases", "")).strip("[]").split(","):
            a = a.strip().strip("\"'")
            if a:
                link_targets.add(a)

    for d in CONTENT_DIRS:
        base = root / d
        if not base.exists():
            continue
        for path in base.rglob("*.md"):
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            fm = lib.parse_frontmatter(text)
            body = text
            if text.startswith("---"):
                cut = text.find("\n---", 3)
                if cut > 0:
                    body = text[cut + 4:]
            notes.append((rel, fm, body, text))


def is_archive(rel):
    return rel.startswith(ARCHIVE + "/")


def add(cid, rel, lineno, msg):
    results[cid].append((rel, lineno, msg))


def lineno_of(body, needle):
    i = body.find(needle)
    if i < 0:
        return 0
    return body.count("\n", 0, i) + 1


# ---------- 检查项 ----------

def check_e15(rel, fm, body, text):
    """不挖空：正文不留占位，也不写 ~~cloze~~。

    代码块与行内代码里的 `{{ }}` 是模板语法示例，不是本笔记的占位，先剔掉。
    """
    prose = INLINE_CODE.sub("", FENCE.sub("", body))
    for m in CLOZE.finditer(prose):
        add("E15", rel, lineno_of(body, m.group(0)), f"挖空 `{m.group(0)[:24]}`")
    for m in PLACEHOLDER.finditer(prose):
        add("E15", rel, lineno_of(body, m.group(0)), f"占位 `{m.group(0)[:24]}`")


def check_e25(rel, fm, body, text):
    """不设「关联」节。"""
    for line in body.splitlines():
        m = HEADING.match(line)
        if m and m.group(2).strip() in {"关联", "相关笔记", "相关"}:
            add("E25", rel, lineno_of(body, line), f"设了 `{m.group(2)}` 节")


def check_e13(rel, fm, body, text):
    """atomic 边界必填。"""
    if fm.get("content-type") != "atomic":
        return
    if "边界" not in body:
        add("E13", rel, 0, "缺边界")


def check_e12(rel, fm, body, text):
    """atomic 正文三段：观点（引用行）+ 边界 + 可选论据。"""
    if fm.get("content-type") != "atomic":
        return
    head = body.split("\n## ", 1)[0]
    if not re.search(r"^\s*>\s*\S", head, re.M):
        add("E12", rel, 0, "缺一句话观点（`>` 引用行）")
    if re.search(r"^##\s*论据", body, re.M) and re.search(r"^###\s*论据", body, re.M):
        add("E12", rel, 0, "论据节下再开 `### 论据`，该瘦身")


def check_e11(rel, fm, body, text):
    """atomic 标题先主语、后可判断。"""
    if fm.get("content-type") != "atomic":
        return
    title = fm.get("title", "")
    if "？" in title or "?" in title:
        add("E11", rel, 0, f"标题是疑问句：{title[:30]}")


def check_e22(rel, fm, body, text):
    """六桶词表：知识图谱节只用词表里的桶。"""
    lines = body.splitlines()
    inside, level = False, 0
    for i, line in enumerate(lines, 1):
        m = HEADING.match(line)
        if m:
            if inside and len(m.group(1)) <= level:
                inside = False
            if "知识图谱" in m.group(2):
                inside, level = True, len(m.group(1))
            continue
        if not inside:
            continue
        lm = LABEL.match(line)
        if not lm:
            continue
        label = lm.group(1).strip().strip("：:")
        if label in BUCKETS:
            continue
        if label in BUCKET_SYNONYMS:
            add("E22", rel, i, f"同义桶 `{label}`")
        elif len(label) <= 8 and re.search(r"[\u4e00-\u9fa5]", label) and " " not in label:
            add("E22", rel, i, f"词表外的桶 `{label}`")


def check_e35(rel, fm, body, text):
    """不设 status / related / category。一篇只记一行，不按字段数重复计。"""
    bad = [k for k in ("status", "related", "category") if k in fm]
    if bad:
        add("E35", rel, 0, "frontmatter 有 " + " / ".join(f"`{b}`" for b in bad))


def check_e43(rel, fm, body, text):
    """学习专项不设「进展」节。"""
    if fm.get("content-type") != "project":
        return
    for line in body.splitlines():
        m = HEADING.match(line)
        if m and "进展" in m.group(2):
            add("E43", rel, lineno_of(body, line), f"设了 `{m.group(2)}` 节")


def check_e44(rel, fm, body, text):
    """不设知识点台账。"""
    for line in body.splitlines():
        m = HEADING.match(line)
        if m and "台账" in m.group(2):
            add("E44", rel, lineno_of(body, line), f"设了 `{m.group(2)}` 节")


def check_p12(rel, fm, body, text):
    """atomic 永不归档。"""
    if is_archive(rel) and fm.get("content-type") == "atomic":
        add("P12", rel, 0, "atomic 落在 40-ARCHIVE")


def check_e4(rel, fm, body, text):
    """单形态目录只收一种形态。"""
    rules = {
        "50-ZETTELCASTEN/": "atomic",
        "60-BLOGS/": "article",
        "90-DIARY/": "diary",
    }
    for prefix, ctype in rules.items():
        if rel.startswith(prefix):
            got = fm.get("content-type")
            if got != ctype:
                add("E4", rel, 0, f"{prefix.rstrip('/')} 只收 {ctype}，实为 `{got}`")


def check_e7(rel, fm, body, text):
    """归档只有一层。"""
    if not is_archive(rel):
        return
    depth = rel[len(ARCHIVE) + 1:].count("/")
    if depth > 1:
        add("E7", rel, 0, f"归档层数 {depth}，应为 1")


def check_e21(rel, fm, body, text):
    """断链 = 待提炼：不判错，只统计。"""
    for m in WIKILINK.finditer(FENCE.sub("", body)):
        target = m.group(1).strip().rsplit("/", 1)[-1]
        if not target or target.lower().endswith(MEDIA):
            continue
        if target not in link_targets:
            add("E21", rel, lineno_of(body, m.group(0)), f"断链 `{target}`")


# (编号, 判据名, 性质, 函数, 是否扫归档)
# 性质：硬 = 机制已被破坏（视图失效、内容放错区）；存量 = 写法债，E36 即用即改不清零；提示 = 只统计
CHECKS = [
    ("E4", "三个单形态目录", "硬", check_e4, False),
    ("E7", "归档只有一层", "硬", check_e7, True),
    ("P12", "atomic 永不归档", "硬", check_p12, True),
    ("E11", "atomic 标题先主语、后可判断", "存量", check_e11, False),
    ("E12", "atomic 正文三段", "存量", check_e12, False),
    ("E13", "边界必填", "存量", check_e13, False),
    ("E15", "新笔记不挖空", "存量", check_e15, False),
    ("E22", "六桶词表", "存量", check_e22, False),
    ("E25", "不设「关联」节", "存量", check_e25, False),
    ("E35", "不设 status / related / category", "存量", check_e35, False),
    ("E43", "学习专项不设「进展」节", "存量", check_e43, False),
    ("E44", "不设知识点台账", "存量", check_e44, False),
    ("E21", "断链 = 待提炼", "提示", check_e21, False),
]


def run(only=None):
    load_notes()
    for cid, name, level, fn, scan_archive in CHECKS:
        if only and cid not in only:
            continue
        for rel, fm, body, text in notes:
            if not any(rel.startswith(d + "/") for d in JUDGED):
                continue
            if not scan_archive and is_archive(rel):
                continue
            fn(rel, fm, body, text)


def summary():
    scanned = sum(1 for rel, *_ in notes if any(rel.startswith(d + "/") for d in JUDGED))
    print(f"判读 {scanned} 篇（00-INBOX 素材与 99-ASSETS 不在内；40-ARCHIVE 只查归档类判据）")
    print("")
    print(f"  {'编号':<6}{'判据':<36}{'性质':<6}{'命中':>5}")
    print(f"  {'-' * 5:<6}{'-' * 34:<36}{'-' * 4:<6}{'-' * 5:>5}")
    tally = defaultdict(int)
    for cid, name, level, fn, _ in CHECKS:
        hits = len(results.get(cid, []))
        tally[level] += hits
        print(f"  {cid:<6}{name:<36}{level:<6}{hits:>5}")
    print("")
    print(f"  硬 {tally['硬']} 处 · 存量 {tally['存量']} 处 · 提示 {tally['提示']} 处")
    print("")
    print("  「存量」不清零：E36 即用即改，只在改到某一篇时顺手修。命中数只说明这一类烂得最多，不是待办量。")
    print("  明细：--detail <编号>；只跑某几条：--only E15,E25")
    covered = {cid for cid, *_ in CHECKS}
    claimed = {it["criterion"] for it in lib.load() if "脚本" in it.get("carrier", "")}
    print("")
    print(f"  载体覆盖：登记表声称有脚本载体的 {len(claimed)} 条，本脚本实现 {len(claimed & covered)} 条")
    missing = sorted(claimed - covered, key=lambda x: (x[0], int(re.sub(r"\D", "", x) or 0)))
    if missing:
        print(f"  本脚本未实现：{', '.join(missing)}（E9/E28/E29/E32/E33 由 validate_meta.py 查，其余待核）")
    extra = sorted(covered - claimed)
    if extra:
        print(f"  本脚本在查但登记表没标脚本载体：{', '.join(extra)}")


def detail(cid):
    rows = results.get(cid, [])
    if not rows:
        print(f"{cid} 无命中")
        return
    print(f"{cid} 命中 {len(rows)} 处：")
    by_file = defaultdict(list)
    for rel, ln, msg in rows:
        by_file[rel].append((ln, msg))
    for rel in sorted(by_file)[:40]:
        for ln, msg in by_file[rel][:3]:
            loc = f"L{ln}" if ln else "全文"
            print(f"  {loc:<7} {msg:<40} {rel}")
    if len(by_file) > 40:
        print(f"  …… 其余 {len(by_file) - 40} 篇略")


def coverage():
    entries = lib.load()
    claimed = defaultdict(list)
    for it in entries:
        claimed[it.get("carrier", "无")].append(it["criterion"])
    print("判据载体分布：")
    for carrier, ids in sorted(claimed.items(), key=lambda kv: -len(kv[1])):
        print(f"  {carrier:<10}{len(ids):>3} 条  {' '.join(sorted(ids))}")
    print("")
    script_ids = {cid for cid, *_ in CHECKS}
    claimed_script = {it["criterion"] for it in entries if "脚本" in it.get("carrier", "")}
    done = sorted(claimed_script & script_ids)
    print(f"本脚本实现 {len(script_ids)} 条：{' '.join(sorted(script_ids))}")
    print(f"其中与登记表互认的 {len(done)} 条：{' '.join(done)}")
    print("")
    todo = sorted(claimed_script - script_ids, key=lambda x: (x[0], int(re.sub(r"\D", "", x) or 0)))
    print("登记表说「有脚本载体」但本脚本不查的（应由 validate_meta.py 兜，逐个核过再放心）：")
    print(f"  {' '.join(todo) if todo else '无'}")


def main():
    args = sys.argv[1:]
    if "--coverage" in args:
        coverage()
        return 0
    only = None
    if "--only" in args:
        only = set(args[args.index("--only") + 1].split(","))
    run(only)
    if "--detail" in args:
        for cid in args[args.index("--detail") + 1].split(","):
            detail(cid)
        return 0
    summary()
    return 0


if __name__ == "__main__":
    sys.exit(main())
