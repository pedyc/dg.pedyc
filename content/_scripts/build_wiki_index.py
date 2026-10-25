#!/usr/bin/env python3
"""全量重建 01-META/Index/wiki-index.md

用法：
    python envs/default/Scripts/python.exe _scripts/build_wiki_index.py
    python ... build_wiki_index.py --note "补 10-25 之后新增的 12 篇"

规则来源：01-META/Specification/_wiki-index-format.md（分区顺序、条目格式、
计数口径、排序规则）。改格式先改那份规范，再改这里——不要反过来。

为什么需要这个脚本：wiki-index 是「每篇一条」的全量名册，靠人工增量维护必然
漏（2026-10-25 实测只覆盖 34%）。全量重建必须可复现，否则每次结果都不一样。

已知规范缺口（脚本里按「并入 Concepts」处理）：
    roadmap / article 在 _wiki-index-format 的分区表里没有位置。
    要分开就得先给规范加分区，再改 SECTION_OF。
"""

import argparse
import pathlib
import re
from collections import defaultdict

from pypinyin import lazy_pinyin

ROOT = pathlib.Path(__file__).resolve().parent.parent
IDX = ROOT / "01-META/Index/wiki-index.md"

SCOPE = ("30-RESOURCES", "20-AREAS")          # Wiki 层范围
SKIP_PARTS = {"_resources"}

SECTION_OF = {
    "area": "Areas (领域)",
    "moc": "MOCs (领域入口)",
    "concept": "Concepts (概念)",
    "term": "Terms (术语)",
    "sop": "SOPs (标准流程)",
    "comparison": "Comparisons (比较分析)",
    "question": "Questions (待探索)",
    "record": "Records (事件记录)",
    "roadmap": "Concepts (概念)",   # 规范无分区，暂并
    "article": "Concepts (概念)",   # 规范无分区，暂并
}

ORDER = [
    "Areas (领域)", "MOCs (领域入口)", "Concepts (概念)", "Terms (术语)",
    "SOPs (标准流程)", "Comparisons (比较分析)", "Questions (待探索)", "Records (事件记录)",
]

PUNCT = "，、；：,;:（("
DESC_MAX = 30


def sort_key(name):
    """中文按拼音、英文按字母（规范第 5 节）。"""
    return [p.lower() for p in lazy_pinyin(name)]


def clean_desc(d):
    d = d.strip().strip("\"'").replace("\n", " ")
    d = re.sub(r"\s+", " ", d).rstrip("。.；;，,")
    if len(d) <= DESC_MAX:
        return d
    cut = d[:DESC_MAX]
    for i in range(len(cut) - 1, 8, -1):
        if cut[i] in PUNCT:
            return cut[:i].rstrip()
    return cut


def grab(fm, key):
    m = re.search(rf"^{key}:[ \t]*(.*)$", fm, re.M)
    return m.group(1).strip() if m else ""


def collect():
    items, skipped = [], []
    for p in ROOT.rglob("*.md"):
        rel = p.relative_to(ROOT)
        if not rel.parts or rel.parts[0] not in SCOPE or SKIP_PARTS & set(rel.parts):
            continue
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        if not text.startswith("---"):
            continue
        end = text.find("\n---", 3)
        fm = text[3:end] if end != -1 else text[3:]

        ct = grab(fm, "content-type").strip("[]").strip().strip("\"'")
        title = grab(fm, "title").strip("\"'") or p.stem
        desc = grab(fm, "description")
        m_up = re.search(r"^up:[ \t]*(.*(?:\n[ \t]+-.*)*)", fm, re.M)
        ups = re.findall(r"\[\[([^\[\]|]+)", m_up.group(1)) if m_up else []

        if not ct:
            skipped.append(f"{p.stem}（无 content-type）")
            continue
        if ct == "person":
            if ups:
                items.append({"kind": "person", "parent": ups[0], "name": title,
                              "file": p.stem, "desc": clean_desc(desc)})
            continue
        sec = SECTION_OF.get(ct)
        if not sec:
            skipped.append(f"{p.stem}（{ct} 无对应分区）")
            continue
        items.append({"kind": "entry", "sec": sec, "name": title,
                      "file": p.stem, "desc": clean_desc(desc)})
    return items, skipped


def render(items, old_text, note):
    by_sec = defaultdict(list)
    for it in items:
        if it["kind"] == "entry":
            by_sec[it["sec"]].append(it)

    persons = [it for it in items if it["kind"] == "person"]
    for per in persons:
        for entries in by_sec.values():
            hit = next((e for e in entries if e["name"] == per["parent"]), None)
            if hit:
                hit.setdefault("children", []).append(per)
                break
        else:
            by_sec["Concepts (概念)"].append(per)

    for sec in by_sec:
        by_sec[sec].sort(key=lambda e: sort_key(e["name"]))

    def line(it, indent=""):
        link = (f"[[{it['file']}]]" if it["file"] == it["name"]
                else f"[[{it['file']}|{it['name']}]]")
        return f"{indent}- {link}" + (f" — {it['desc']}" if it["desc"] else "")

    # Meta 分区沿用现有内容（系统文档清单，不由本脚本决定）
    meta_part = old_text[old_text.find("## Meta (系统)"):].rstrip()

    blocks = [
        "## Wiki Index\n\n"
        "本文件是知识库的导航索引，每篇笔记一条，按标题拼音排序。"
        "格式规范见 [[_wiki-index-format]]，维护规则见 [[llm-wiki-schema]]。\n\n"
        f"**最后更新：{__import__('datetime').date.today().isoformat()}** — {note}"
    ]

    total = 0
    for sec in ORDER:
        entries = by_sec.get(sec, [])
        total += len(entries)
        lines = [f"## {sec} — {len(entries)} 个"]
        if not entries:
            lines.append("_暂无条目。_")
        else:
            for e in entries:
                lines.append(line(e))
                lines.extend(line(c, "\t") for c in e.get("children", []))
        blocks.append("\n".join(lines))

    blocks.append(meta_part)
    return "\n\n---\n\n".join(blocks), total, len(persons)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--note", default="全量重建")
    args = ap.parse_args()

    old_text = IDX.read_text(encoding="utf-8")
    fm_end = old_text.find("\n---", 3)
    frontmatter = old_text[:fm_end + 4]          # 保留原 frontmatter（uid 等）
    frontmatter = re.sub(r"^date-modified:.*$", "date-modified: "
                         + __import__("datetime").date.today().isoformat(),
                         frontmatter, flags=re.M)

    items, skipped = collect()
    body, total, persons = render(items, old_text, args.note)

    IDX.write_bytes((frontmatter + "\n\n" + body + "\n").encode("utf-8"))
    print(f"已重建 {IDX.relative_to(ROOT)}")
    print(f"  一级条目 {total} · person 子条目 {persons} · 跳过 {len(skipped)}")
    if skipped:
        print("  跳过明细：")
        for s in skipped:
            print(f"    - {s}")


if __name__ == "__main__":
    main()
