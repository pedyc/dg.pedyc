"""把判据登记条目投影到两个使用位。

使用位一：18 个模板首部的注释块（`<!-- 判据:begin ... -->`）
使用位二：`Guide/Design/判据速查.md`（人写笔记时看的那一页）

两者都不含条文，只含编号 + 一句判据名 + 一句违反的代价。改判据改条目，重跑本脚本。

用法：
    python _scripts/sync_criteria.py            # 写入
    python _scripts/sync_criteria.py --check    # 只报告差异，不写
"""

import sys

import criteria_lib as lib

SPEED_UID = "20261110110000"
SNAPSHOT = "2026-11-10"


def block_for(key, items, sub_of):
    """生成一段带标记的 HTML 注释。"""
    if key in sub_of:
        parent = sub_of[key]
        rows = items.get(parent, [])
        head = f"\t子模板，不映射独立类型；判据随父模板 `template_{parent}` 走。"
        if not rows:
            head = f"\t子模板，父模板 `template_{parent}` 亦无专属判据（{SNAPSHOT} 实测）。"
    else:
        rows = items.get(key, [])
        head = f"\t本型判据 {len(rows)} 条（原文在条目，此处只引不抄）：" if rows \
            else f"\t本型无专属判据（{SNAPSHOT} 实测）。"

    lines = [f"{lib.BEGIN} 由 _scripts/sync_criteria.py 从登记条目生成，勿手改 -->", head]
    for it in rows:
        lines.append(f"\t- [[{it['_stem']}|{it['criterion']}]] {it['statement']}")
    if not rows:
        lines.append("\t判定与写法见 [[笔记类型规范]]；这一型还没有判据专为它而写，空位已登记在 [[判据总览]]。")
    lines.append("\t通用判据与写作速查见 [[判据速查]]。")
    lines.append(lib.END)
    return "\n".join(lines)


def splice(text, block):
    """返回 (新文本, 状态)。"""
    if lib.BEGIN in text:
        i = text.find(lib.BEGIN)
        j = text.find(lib.END, i)
        if j < 0:
            raise SystemExit("✗ 有 begin 标记但缺 end 标记")
        new = text[:i] + block + text[j + len(lib.END):]
        return new, "替换"

    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        raise SystemExit("✗ 模板没有 frontmatter，无法定位插入点")
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        raise SystemExit("✗ frontmatter 未闭合")
    head = "\n".join(lines[: end + 1])
    rest = "\n".join(lines[end + 1:]).lstrip("\n")
    return f"{head}\n\n{block}\n\n{rest}", "插入"


def speed_page(items, orphans):
    """按模板分组的速查页。有专属判据的逐型成节，其余集中成一张表。"""
    have = [k for k in lib.TEMPLATE_KEYS if items.get(k)]
    empty = [k for k in lib.TEMPLATE_KEYS if not items.get(k)]

    out = [
        "---",
        f"uid: {SPEED_UID}",
        "title: 判据速查",
        "aliases: [写作判据速查, 判据按类型, 写这篇守哪几条]",
        'description: "判据按笔记模板的投影：写某一型时该守哪几条。由脚本从登记条目生成，不手抄"',
        "tags: [META/判据]",
        "date-created: 2026-11-10",
        "date-modified: 2026-11-10",
        "content-type: article",
        'up: "[[判据总览]]"',
        "---",
        "",
        "> [!warning] 生成物，不要手改",
        "> 由 `_scripts/sync_criteria.py` 从 `01-META/Index/判据/` 的登记条目生成，重跑即覆盖。",
        "> 判据原文在 `01-META/Truth/` 与 `AGENTS.md`；本页只回答一件事：**写这一型时，哪几条会被撞上。**",
        "",
        "## 怎么用",
        "",
        "写某一篇之前，找到对应模板的那一节，扫一眼「违反的代价」列。判据不是逐条打勾的清单，它要你在写错的那一刻认得出这一条。",
        "",
        "模板注释里放的是同一份投影（给 agent 与改模板时读），本页是给人读的那一份。两处都由脚本生成，不要在任一处手改。",
        "",
        "## 有专属判据的模板",
        "",
    ]

    for key in have:
        ct = lib.CONTENT_TYPE_OF.get(key, key)
        out.append(f"### template_{key} · {ct}")
        out.append("")
        out.append("| 编号 | 判据 | 违反的代价 |")
        out.append("|:--|:--|:--|")
        for it in items[key]:
            out.append(
                f"| [[{it['_stem']}\\|{it['criterion']}]] | {it['statement']} | {it['purpose']} |"
            )
        out.append("")

    out += [
        "## 无专属判据的模板",
        "",
        "这些模板的结构约束由骨架本身承担，没有一条判据专为它而写。这不等于没问题，等于**尚未覆盖**：写的时候撞到不知道该怎么写的地方，记进 `判据总览` §冲突与空位，不要当场编一条。",
        "",
        "| 模板 | content-type |",
        "|:--|:--|",
    ]
    for key in empty:
        out.append(f"| template_{key} | {lib.CONTENT_TYPE_OF.get(key, key)} |")
    out += [
        "",
        "## 不进任何模板的判据",
        "",
        f"字段 / 链接 / 命名 / 维护 / 容器 / 全局六类，共 {len(orphans)} 条。它们约束 frontmatter 与目录，不约束正文，所以不进模板注释；全表见 [[判据.base]]。",
        "",
        "## 知识图谱",
        "",
        "- **上位**：[[判据总览]] — 判据为什么分预设与工程两类、按层怎么推出来",
        "- **并列**：[[判据.base]] — 同源数据的表格入口，可按层 / 类型 / 作用范围 / 模板四种切法读",
        "- **相关**：[[类型设计判据]] — 13 种形态各自凭什么存在；[[笔记类型规范]] — 枚举与写法",
    ]
    return "\n".join(out) + "\n"


def main():
    check_only = "--check" in sys.argv
    entries = lib.load()
    items = lib.by_applies(entries)
    orphans = lib.orphan(entries)

    report = []
    for path in sorted(lib.TEMPLATE_DIR.glob("template_*.md")):
        key = path.stem[len("template_"):]
        key = lib.FILE_ALIAS.get(key, key)
        text = path.read_text(encoding="utf-8")
        block = block_for(key, items, lib.SUB_OF)
        new, how = splice(text, block)
        changed = new != text
        report.append((key, how, len(items.get(lib.SUB_OF.get(key, key), [])), changed))
        if changed and not check_only:
            path.write_text(new, encoding="utf-8")

    page = speed_page(items, orphans)
    old_page = lib.SPEED_REF_PATH.read_text(encoding="utf-8") if lib.SPEED_REF_PATH.exists() else ""
    page_changed = page != old_page
    if page_changed and not check_only:
        lib.SPEED_REF_PATH.write_text(page, encoding="utf-8")

    print(f"判据条目 {len(entries)} 条 · 不进模板 {len(orphans)} 条 · 有专属判据的模板 {len([k for k in items if items[k]])} 个")
    print("")
    for key, how, n, changed in report:
        print(f"  {'改' if changed else '同'}  template_{key:<18} {how}  {n} 条")
    print("")
    print(f"  {'改' if page_changed else '同'}  {lib.SPEED_REF_PATH.relative_to(lib.ROOT)}")

    if check_only and (any(r[3] for r in report) or page_changed):
        print("\n有差异未写入（--check 模式）")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
