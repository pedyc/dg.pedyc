#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本库统计快照 —— 生成 01-META/Log/本库统计.md。

为什么需要它：ROI 这类笔记要引用「原子笔记 220 / 全部 1214」这种数字，而数字每次
ingest 都会变。散落在各篇手写，半年后没人知道哪个是对的、哪句说的是什么时候。
所以把口径收在一处、数字由脚本算、笔记只引用结论并带上日期。

用法（在 vault 根目录执行）：
    python _scripts/stats.py              # 重新生成统计页
    python _scripts/stats.py --dry-run    # 只打印，不写文件

口径（与 dataviewjs 活查询块保持同一规则）：
    原子笔记 = 50-ZETTELCASTEN/ 下全部笔记。
        按目录判而非按 content-type 判，因为该目录是单形态容器，里面有 2 篇
        content-type 留空的照样是原子笔记；按字段判会静默漏掉它们。
    全部笔记 = 库内 md − 40-ARCHIVE − _templates − _scripts − _resources
                      − 99-ASSETS − .trash − 根目录 CLAUDE.md

设计约束：只统计，不判断。content-type 出现非法值（method / tool / 空值）时如实
列出——本页同时也是脏数据的体检表，但它不负责修，修是 validate_meta.py + 人的事。
"""

import argparse
import datetime
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "01-META" / "Log" / "本库统计.md"

ATOM_DIR = "50-ZETTELCASTEN/"

# 这些是文件，但不是"笔记"——算进分母只会稀释比值
EXCLUDE = [
    ("40-ARCHIVE/", "归档"),
    ("_templates/", "模板"),
    ("_scripts/", "脚本"),
    ("_resources/", "画布源文件"),
    ("99-ASSETS/", "系统资产"),
    (".trash/", "回收站"),
]
SKIP_PARTS = {".obsidian", ".git", ".claude", ".workbuddy"}
# 本页自己也是 md，但它不承载知识、只是测量工具——算进分母会让每次重跑都把分母顶高一篇
SKIP_FILES = {"CLAUDE.md", "01-META/Log/本库统计.md"}

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---", re.S)
CT_RE = re.compile(r"^content-type:[ \t]*(.*)$", re.M)
UID_RE = re.compile(r"^uid:[ \t]*(.*)$", re.M)
CREATED_RE = re.compile(r"^date-created:[ \t]*(.*)$", re.M)
HIST_HEAD = "### 历史快照"
HIST_ROW = re.compile(r"^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([\d.]+)%")


def frontmatter(path):
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""
    m = FM_RE.match(text)
    return m.group(1) if m else ""


def content_type(fm):
    """返回展示用类型名。区分「缺字段」与「字段为空」——后者是脏数据，前者是老笔记。"""
    m = CT_RE.search(fm)
    if not m:
        return "（未标注）"
    v = m.group(1).strip().strip('"').strip("'").strip()
    return v if v else "（空值）"


def cell(text):
    """表格单元格自净：竖线会撑坏 markdown 表，脏值里真出现过 'project | area | ...'"""
    return str(text).replace("|", "/").strip()


def scan():
    total = 0
    atoms = 0
    by_ct = Counter()
    by_dir = Counter()
    excluded = Counter()
    strays = []
    stat = {label: 0 for _, label in EXCLUDE}
    stat["根目录 CLAUDE.md"] = 0

    for path in ROOT.rglob("*.md"):
        if any(p in SKIP_PARTS for p in path.parts):
            continue
        rel = path.relative_to(ROOT).as_posix()

        hit = next((label for pre, label in EXCLUDE if rel.startswith(pre)), None)
        if hit:
            excluded[hit] += 1
            stat[hit] += 1
            continue
        if rel in SKIP_FILES:
            label = "本页自身（统计页）" if rel == "01-META/Log/本库统计.md" else "根目录 CLAUDE.md"
            stat[label] = stat.get(label, 0) + 1
            continue

        fm = frontmatter(path)
        ct = content_type(fm)
        total += 1
        by_ct[ct] += 1
        by_dir[rel.split("/")[0] + "/" if "/" in rel else "（根目录）"] += 1
        if rel.startswith(ATOM_DIR):
            atoms += 1
        elif ct == "atomic":
            strays.append(path.stem)

    return {
        "total": total,
        "atoms": atoms,
        "by_ct": by_ct,
        "by_dir": by_dir,
        "excluded": stat,
        "strays": strays,
    }


def load_history(text):
    """从已有页面里捞历史行。同日重跑要覆盖而不是重复追加。"""
    rows = {}
    if HIST_HEAD in text:
        for line in text.split(HIST_HEAD, 1)[1].splitlines():
            m = HIST_ROW.match(line.strip())
            if m:
                rows[m.group(1)] = (m.group(2), m.group(3), m.group(4))
    return rows


def pct(a, b):
    return f"{a / b * 100:.1f}" if b else "0.0"


def build(data, history, today, uid, created):
    total, atoms = data["total"], data["atoms"]
    n = len(history) + 1 if today not in history else len(history)
    prev = next((v for k, v in sorted(history.items()) if k < today), None)

    lines = []
    add = lines.append

    add("---")
    add(f'uid: "{uid}"')
    add("title: 本库统计")
    add('aliases: ["库统计", "本库指标", "统计快照"]')
    add('description: "本库规模与形态分布的时点快照，供 ROI 类笔记引用数字"')
    add("tags: [llm-wiki, 元数据]")
    add(f"date-created: {created}")
    add(f"date-modified: {today}")
    add("content-type: record")
    add('up: "[[本库指南]]"')
    add("---")
    add("")
    add("## 本库统计")
    add("")
    add("本页是**时点快照**，不是实时值：数字由 `_scripts/stats.py` 算出，重跑会覆盖「当前基线」并把这次结果追到底部「历史快照」。引用本页数字时请连日期一起写——「截至 2026-XX-XX，原子笔记 XXX 篇」——否则半年后没人知道你引的是哪一代数字。")
    add("")
    add("### 当前基线")
    add("")
    add(f"> 生成于 {today}，重跑 `stats.py` 后自动更新。别处可直接 `![[本库统计#当前基线]]` 嵌入这张表。")
    add("")
    add("| 指标 | 数值 |")
    add("|:--|--:|")
    add(f"| 全部笔记（不含归档） | {total} |")
    add(f"| 原子笔记 | {atoms} |")
    add(f"| **原子笔记占比** | **{pct(atoms, total)}%** |")
    if atoms:
        add(f"| 平均多少篇笔记出 1 篇原子 | {total / atoms:.1f} |")
    if data["strays"]:
        add(f"| 标了 atomic 但不在原子目录 | {len(data['strays'])} |")
    add(f"| 被排除的非知识工件 | {sum(data['excluded'].values())} |")
    if prev:
        d_total = total - int(prev[0])
        d_atom = atoms - int(prev[1])
        sign = lambda x: f"+{x}" if x > 0 else str(x)
        add(f"| 较上次（{sorted(history)[-1]}） | 全部 {sign(d_total)} ／ 原子 {sign(d_atom)} |")
    add("")
    add("### 形态分布")
    add("")
    add("| content-type | 数量 | 占全部 |")
    add("|:--|--:|--:|")
    for ct, c in data["by_ct"].most_common():
        add(f"| {cell(ct)} | {c} | {pct(c, total)}% |")
    add("")
    add("> `（未标注）` 是老笔记还没补字段，`（空值）` 是写了 `content-type:` 但值丢了；出现 14 种合法值以外的类型名说明有笔记写错。这些不在这里修，交给 `python _scripts/validate_meta.py --all`。")
    ct_atomic = data["by_ct"].get("atomic", 0)
    if ct_atomic != atoms:
        delta = ct_atomic - atoms
        word = f"多 {delta} 篇" if delta > 0 else f"少 {-delta} 篇"
        add(">")
        add(f"> 表里的 `atomic`（{ct_atomic} 篇）是**字段口径**，比基线表的原子笔记（{atoms} 篇，**目录口径**）{word}。差异只来自两处：目录内字段留空的、目录外标了 atomic 的。基线表用目录口径——「原子笔记在哪儿」由目录决定，字段写漏了也不改变它是一篇原子笔记。")
    add("")
    add("### 目录分布")
    add("")
    add("| 目录 | 笔记数 | 占全部 |")
    add("|:--|--:|--:|")
    for d, c in data["by_dir"].most_common():
        add(f"| {d} | {c} | {pct(c, total)}% |")
    add("")
    add("### 口径")
    add("")
    add("- **原子笔记** = `50-ZETTELCASTEN/` 下全部笔记。按目录判而非按 `content-type` 判：该目录是单形态容器，里面有字段留空的照样是原子笔记，按字段判会静默漏掉。")
    cut_text = "、".join(f"{label} {c}" for label, c in data["excluded"].items() if c)
    add(f"- **全部笔记** = 库内 md 减去「是文件但不是笔记」的工件（基线表末行可核对）：{cut_text}。口径要变应该改本脚本的 `EXCLUDE`，而不是在某篇笔记里另算一遍。")
    if data["strays"]:
        add("- **散落原子笔记**：下列笔记标了 `content-type: atomic` 但不在原子目录，未计入分子。INBOX 里的属「待迁出」，日记里的其实是日记正文中的观点。")
        add("")
        for s in sorted(data["strays"]):
            add(f"  - {s}")
        add("")
    add("### 引用本页")
    add("")
    add("四种粒度，按需要选。引用数字时把日期一起带上，否则半年后没人知道是哪一代。")
    add("")
    add("**① 句子里嵌一个数（现算）**——实时计算、不带日期。本库已开内联 dataviewjs（`enableInlineDataviewJs`），把这行直接写进正文：")
    add("")
    add("```markdown")
    add("这库有 `$= dv.pages('\"50-ZETTELCASTEN\"').length` 篇原子笔记。")
    add("```")
    add("")
    add("注意这是**引用处自己算一遍**，口径与快照未必相同（这一行只按目录数，没有减去模板与系统资产）。要严格同源就用 ③。")
    add("")
    add("**② 单独一段嵌一个指标**——取快照值，带生成日期。下面三段带块 ID，重跑后 ID 不变，别处写 `![[本库统计#^atom-count]]` 就只嵌这一段，不牵动整页：")
    add("")
    add(f"原子笔记 [atom_count:: {atoms}] 篇 ^atom-count")
    add("")
    add(f"全部笔记 [total_count:: {total}] 篇 ^total-count")
    add("")
    add(f"原子笔记占比 [atom_ratio:: {pct(atoms, total)}]% ^atom-ratio")
    add("")
    add("**③ 当字段读**——上面三段不是纯文本，是 dataview 的 inline field（`[atom_count:: 226]`，渲染时只显示数字）。所以任意笔记都能直接取这个数，全库只有本页一个来源：")
    add("")
    add("```markdown")
    add('这库有 `$= dv.page("01-META/Log/本库统计").atom_count` 篇原子笔记，占比 `$= dv.page("01-META/Log/本库统计").atom_ratio`%。')
    add("```")
    add("")
    add("**④ 整张基线表**——六个指标一起，仍然不是整页：`![[本库统计#当前基线]]`")
    add("")
    add("### 重新生成")
    add("")
    add("```bash")
    add("python _scripts/stats.py            # 覆盖基线 + 追加历史")
    add("python _scripts/stats.py --dry-run  # 只看数字，不写文件")
    add("```")
    add("")
    add("### 历史快照")
    add("")
    add("| 日期 | 全部笔记 | 原子笔记 | 占比 |")
    add("|:--|--:|--:|--:|")
    for day in sorted(history):
        h_total, h_atom, h_pct = history[day]
        bold = "**" if day == today else ""
        add(f"| {bold}{day}{bold} | {bold}{h_total}{bold} | {bold}{h_atom}{bold} | {bold}{h_pct}%{bold} |")
    add("")
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    today = datetime.date.today().isoformat()
    old_text = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    history = load_history(old_text)

    data = scan()
    history[today] = (str(data["total"]), str(data["atoms"]), pct(data["atoms"], data["total"]))

    uid_m = UID_RE.search(old_text) if old_text else None
    uid = (uid_m.group(1).strip().strip('"') if uid_m else "") or datetime.datetime.now().strftime("%Y%m%d%H%M")
    created_m = CREATED_RE.search(old_text) if old_text else None
    created = (created_m.group(1).strip() if created_m else "") or today

    md = build(data, history, today, uid, created)

    if args.dry_run:
        print(md)
        return 0

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(md.replace("\r\n", "\n").encode("utf-8"))
    print(f"已写入 {OUT.relative_to(ROOT)}")
    print(f"  全部笔记 {data['total']} ／ 原子笔记 {data['atoms']} ＝ {pct(data['atoms'], data['total'])}%")
    print(f"  排除工件 {sum(data['excluded'].values())} 篇；散落 atomic {len(data['strays'])} 篇")
    return 0


if __name__ == "__main__":
    sys.exit(main())
