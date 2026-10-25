#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
元数据校验器 —— 检查模板与笔记的 frontmatter 是否符合 Truth/ 里的规范。

为什么需要它：改规范时必然漏改模板。2026-10-24 废除 status 字段时，
17 个模板要逐个删那一行；2026-10-23 把 status 从 5 值收窄到 3 值时改动了 8 个。
下次再改，靠人记是不可靠的。

用法（在 vault 根目录执行）：
    python _scripts/validate_meta.py            # 只校验模板
    python _scripts/validate_meta.py --all      # 同时统计全库脏值（只报数，不改）
    python _scripts/validate_meta.py --links    # 检查链接规范（别名引用 / 假前缀引用）
    python _scripts/validate_meta.py --fix      # 不做修改，见下方说明

设计约束：本脚本只报告，不自动修改。规范符合性是判断，不是计算——
「这个字段该不该留」需要人决定，脚本只负责把不一致摆出来。
退出码：0 = 全部通过，1 = 有问题。

字段清单与枚举值全部**从 Truth/ 现场解析**，不在此硬编码。规范改了，脚本自动跟随；
解析不到会明确报错，而不是静默放过。
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRUTH = ROOT / "01-META" / "Truth"
TEMPLATES = ROOT / "_templates"

# 已知的"扩展字段"：实践中长出来、尚未登记进 Truth 的字段。
# 列在这里是为了让输出区分「违规」与「待登记」，不是认可它们。
KNOWN_EXTENSIONS = {
    # 信源卡
    "source_type", "verify_status", "source_risk", "scored_at",
    "density", "timeliness", "depth", "uniqueness", "output_rate",
    # 收藏 / 台账类
    "play_status", "game_genre", "read_status", "book_genre", "book_format",
    "watch_status", "rating", "pdf", "interview_round", "play_status",
    # 日记 / 周记 / 其他
    "mood", "weather", "week", "noteId",
}


def read(path):
    return path.read_text(encoding="utf-8")


def parse_frontmatter(text):
    """返回 (字段名列表, {字段: 原始值})，解析失败返回 (None, None)。"""
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m:
        return None, None
    body = m.group(1)
    keys, vals = [], {}
    for line in body.splitlines():
        km = re.match(r"^([A-Za-z][\w\-]*):\s*(.*)$", line)
        if km:
            keys.append(km.group(1))
            vals[km.group(1)] = km.group(2).strip()
    return keys, vals


def norm_val(v):
    """规范化 YAML 标量，并报告是否用了引号/方括号写法。

    必须区分两件事：
      - 真脏值 —— 规范化之后仍然不在枚举内（YCTODO、已完成、🌰 seed）
      - 写法问题 —— 值本身合法，但写成了 ["article"] 或 "concept"
    后者在 Obsidian 里会被解析成数组，导致 `.base` 的 content-type 过滤失效，
    是真问题，但不是"非法值"，混在一起报会淹没真正要修的东西。
    """
    raw = (v or "").strip()
    style = False
    val = raw

    if val.startswith("[") and val.endswith("]"):
        style = True
        val = val[1:-1]
    # 注意：val 为空时 `val[:1] in "\"'"` 会返回 True（空串是任意串的子串），
    # 会把"没填值"误判成"写法不规范"。必须先判空。
    if val and (val[:1] in "\"'" or val[-1:] in "\"'"):
        style = True
        val = val.strip().strip("\"").strip("'")

    return val.strip(), style


def load_allowed_fields():
    """从 Truth/元数据规范.md 抓表格首列的 `字段名`。

    字段名允许下划线（source_type / output_rate 这类），早先只写了连字符，
    导致这批字段全部漏抓、被误报成"未登记"。
    """
    text = read(TRUTH / "元数据规范.md")
    fields = set(re.findall(r"^\|\s*`([a-z][a-z0-9_\-]*)`\s*\|", text, re.M))
    if not fields:
        sys.exit("✗ 无法从 Truth/元数据规范.md 解析字段表，请检查文件格式")
    return fields


def load_content_types():
    text = read(TRUTH / "笔记类型规范.md")
    # 总览表形如：| `atomic` | ... |
    vals = set(re.findall(r"^\|\s*`([a-z\-]+)`\s*\|", text, re.M))
    vals = {v for v in vals if v.islower() and len(v) > 2}
    if not vals:
        sys.exit("✗ 无法从 Truth/笔记类型规范.md 解析 content-type 枚举")
    return vals


def load_categories():
    text = read(TRUTH / "元数据规范.md")
    m = re.search(r"`category`\s*\|[^|]*\|([^|]+)\|", text)
    if not m:
        return None
    return {c.strip() for c in m.group(1).split("/") if c.strip()}


def check_links():
    """检查两类链接违规（Truth/文件名与别名规范：「前缀仅用于 aliases 检索，
    WikiLink 引用使用纯标题」）。

    A. 别名引用：[[C-闭包]] —— 用别名建立的链接。
       别名是检索标签，随时可能换成更贴切的词；一旦被链接依赖，改名就产生断链。
    B. 假前缀引用：[[A-宗教与神秘学]] —— 目标文件存在，但它的 aliases 里
       从未定义过这个前缀别名。写的人以为有，实际直接断链。

    排除：规范文档里的反例示例、AI 对话存档、配置示例、流水日志、围栏代码块。
    """
    link_re = re.compile(r"(!?\[\[)([^\]\n]+?)(\]\])")
    fence_re = re.compile(r"^\s*(```|~~~)")
    prefix_re = re.compile(r"^([A-Za-z]+|[\u4e00-\u9fa5]{1,4})[-－—](.+)$")
    skip_dirs = {".obsidian", ".trash", ".git", ".workbuddy"}
    # 反例示例所在文件：里面的 [[C-闭包]] 正在演示「不要这么写」
    exclude_files = {
        "01-META/Truth/文件名与别名规范.md",
        "01-META/Specification/_笔记类型规范.md",
        "01-META/Faq/本库常见问题解答汇总.md",
    }
    exclude_prefixes = ("99-ASSETS/copilot/", ".claude/", "01-META/Log/")

    files = [p for p in ROOT.rglob("*.md")
             if not any(part in skip_dirs for part in p.relative_to(ROOT).parts)]
    stems = {p.stem for p in files}
    paths = {p.relative_to(ROOT).as_posix()[:-3] for p in files}
    dup = {s for s, n in _count(p.stem for p in files).items() if n > 1}

    alias_map = {}
    for p in files:
        text = p.read_bytes().decode("utf-8", errors="ignore")
        m = re.match(r"^---\n(.*?)\n---", text, re.S)
        if not m:
            continue
        for a in _aliases_of(m.group(1)):
            if a in stems:      # 与某文件名同名时链接走文件名，不算别名引用
                continue
            alias_map.setdefault(a, []).append(p)

    bad_alias = {}
    bad_prefix = {}
    for p in files:
        rel = p.relative_to(ROOT).as_posix()
        if rel in exclude_files or any(rel.startswith(x) for x in exclude_prefixes):
            continue
        text = p.read_bytes().decode("utf-8", errors="ignore")
        inside, state = set(), False
        for i, line in enumerate(text.splitlines()):
            if fence_re.match(line):
                state = not state
                inside.add(i)
                continue
            if state:
                inside.add(i)
        line_starts = [0]
        for line in text.splitlines(keepends=True):
            line_starts.append(line_starts[-1] + len(line))

        def lineno(pos):
            lo, hi = 0, len(line_starts) - 1
            while lo < hi:
                mid = (lo + hi + 1) // 2
                if line_starts[mid] <= pos:
                    lo = mid
                else:
                    hi = mid - 1
            return lo

        for m in link_re.finditer(text):
            if lineno(m.start()) in inside:
                continue
            raw = m.group(0)
            target = m.group(2).split("|")[0].split("#")[0].strip()
            if not target:
                continue
            t2 = target[:-3] if target.lower().endswith(".md") else target
            if t2 in paths or t2 in stems or t2.split("/")[-1] in stems:
                continue        # 已能按文件名/路径解析
            if target in alias_map and len(alias_map[target]) == 1:
                bad_alias.setdefault(raw, []).append(rel)
                continue
            mm = prefix_re.match(target)
            if mm:
                rest = mm.group(2).strip()
                if rest in stems and rest not in dup:
                    bad_prefix.setdefault(raw, []).append(rel)

    print("\n== 链接规范（别名不用于链接） ==")
    if bad_alias:
        total = sum(len(v) for v in bad_alias.values())
        print(f"  别名引用 {total} 处 / {len(bad_alias)} 种写法：")
        for raw, ws in sorted(bad_alias.items(), key=lambda x: -len(x[1]))[:10]:
            print(f"    {len(ws):>3}x {raw}   例：{ws[0]}")
    else:
        print("  别名引用 0 处 ✓")

    if bad_prefix:
        total = sum(len(v) for v in bad_prefix.values())
        print(f"  假前缀引用 {total} 处 / {len(bad_prefix)} 种写法（目标存在但没定义该别名）：")
        for raw, ws in sorted(bad_prefix.items(), key=lambda x: -len(x[1]))[:10]:
            print(f"    {len(ws):>3}x {raw}   例：{ws[0]}")
    else:
        print("  假前缀引用 0 处 ✓")

    return len(bad_alias) + len(bad_prefix)


def _count(seq):
    out = {}
    for x in seq:
        out[x] = out.get(x, 0) + 1
    return out


def _aliases_of(fm_text):
    """从 frontmatter 文本里取 aliases，支持 [a, b] / 单行 / 多行列表。"""
    lines = fm_text.splitlines()
    for i, line in enumerate(lines):
        m = re.match(r"^aliases:\s*(.*)$", line)
        if not m:
            continue
        rest = m.group(1).strip()
        if rest.startswith("["):
            return [x.strip().strip("\"'").strip()
                    for x in rest.strip("[]").split(",") if x.strip().strip("\"'").strip()]
        if rest and not rest.startswith("#"):
            return [rest.strip("\"'").strip()]
        out = []
        for j in range(i + 1, len(lines)):
            lm = re.match(r"^\s+-\s*(.+)$", lines[j])
            if not lm:
                break
            v = lm.group(1).strip().strip("\"'").strip()
            if v:
                out.append(v)
        return out
    return []


def check_up_style():
    """检查 up 字段写法（真值见 Truth/元数据规范「up 的写法」）。

    合法只有两种：
        up: "[[概念]]"                      单一父级
        up: ["[[Agent]]", "[[LLM]]"]        多父级
    另允许留空（无父级）。

    非法：
        up: [[概念]]    YAML 解析成嵌套列表 [["概念"]]，dataview 拿不到链接
        up: 概念        解析成普通字符串，不是链接，反查失效
        up: [概念]      数组但元素没写成链接
        up: null / ""   空值的多余写法，噪音，应直接留空

    另查悬空：链接目标找不到对应文件（不虚构父级，但写错的要报）。
    """
    quoted_re = re.compile(r'^"\[\[[^\[\]]+\]\]"$')
    array_re = re.compile(r'^\[\s*(?:"\[\[[^\[\]]+\]\]"\s*,\s*)*"\[\[[^\[\]]+\]\]"\s*\]$')
    inner_re = re.compile(r"\[\[([^\[\]]+?)\]\]")
    # 40-ARCHIVE 是免维护区（真值见目录结构规范）：归档只管往里丢，不规整格式
    skip_dirs = {".obsidian", ".trash", ".git", ".workbuddy", "40-ARCHIVE"}

    files = [p for p in ROOT.rglob("*.md")
             if not any(part in skip_dirs for part in p.relative_to(ROOT).parts)]
    stems = {p.stem for p in files}
    paths = {p.relative_to(ROOT).as_posix()[:-3] for p in files}

    bad_style = []      # (文件, 原值, 原因)
    dangling = []       # (文件, 目标)

    for p in files:
        rel = p.relative_to(ROOT).as_posix()
        text = p.read_bytes().decode("utf-8", errors="ignore")
        m = re.match(r"^---\n(.*?)\n---", text, re.S)
        if not m:
            continue
        hit = re.search(r"^up\s*:(.*)$", m.group(1), re.M)
        if not hit:
            continue
        val = hit.group(1).strip()

        if val == "":
            continue                       # 留空是合法的「无父级」
        if val == "null" or val in ('""', "''") or re.fullmatch(r"\[\s*\]", val):
            bad_style.append((rel, val, "空值应直接留空，不写 null/\"\"/[]"))
            continue
        if quoted_re.match(val):
            pass
        elif array_re.match(val):
            pass
        else:
            if re.match(r"^\[\[", val):
                why = "裸链接会解析成嵌套列表，需加双引号"
            elif val.startswith("["):
                why = "数组元素未写成 [[链接]]"
            else:
                why = "裸值不是链接，需写成 \"[[目标]]\""
            bad_style.append((rel, val, why))

        # 悬空检查：模板里的 {{父级}} 是占位符，不算
        if rel.startswith("_templates/"):
            continue
        for t in inner_re.findall(val):
            target = t.split("|")[0].split("#")[0].strip()
            if not target or "{{" in target:
                continue
            t2 = target[:-3] if target.lower().endswith(".md") else target
            if t2 in paths or t2 in stems or t2.split("/")[-1] in stems:
                continue
            dangling.append((rel, target))

    print("\n== up 字段写法 ==")
    if bad_style:
        print(f"  {len(bad_style)} 处写法非法：")
        for rel, val, why in bad_style[:12]:
            print(f"    {rel}")
            print(f"      up: {val}   <- {why}")
    else:
        print("  写法 0 处非法 ✓")

    if dangling:
        print(f"  待补父级 {len(dangling)} 处（up 指向的概念还没建）—— 这是知识缺口，不是违规：")
        for rel, t in dangling:
            print(f"    {rel}  ->  [[{t}]]")
    else:
        print("  待补父级 0 处 ✓")

    # 悬空不计入 problems：本库的立场是「断链 = 引用了但还没提炼」，是待办而非错误。
    # 它值得被看见（所以要打印），但不该让校验器常红，否则会被习惯性忽略。
    return len(bad_style)


def main():
    args = set(sys.argv[1:])
    allowed = load_allowed_fields()
    ctypes = load_content_types()
    cats = load_categories()
    # yaml 里允许出现但不属于"元数据字段"的（模板占位等）
    allowed |= {"publish", "permalink", "draft"}

    print(f"真值来源：{TRUTH.relative_to(ROOT)}")
    print(f"  合法字段 {len(allowed)} 个 · content-type {len(ctypes)} 种")
    if cats:
        print(f"  category {len(cats)} 值：{' / '.join(sorted(cats))}")
    print()

    problems = 0
    unregistered = {}

    # ---------- 1. 模板校验 ----------
    print("== 模板校验 ==")
    tpls = sorted(TEMPLATES.glob("template_*.md"))
    if not tpls:
        print("  （未找到模板）")
    for p in tpls:
        keys, vals = parse_frontmatter(read(p))
        issues = []
        if keys is None:
            issues.append("无法解析 frontmatter（缺 --- 定界或无内容）")
        else:
            for k in keys:
                if k not in allowed and k not in KNOWN_EXTENSIONS:
                    issues.append(f"字段 `{k}` 不在 Truth/元数据规范 的合法字段集内")
                elif k in KNOWN_EXTENSIONS and k not in allowed:
                    unregistered.setdefault(k, []).append(p.name)

            ct, ct_style = norm_val(vals.get("content-type", ""))
            if ct and "<%" not in ct and ct not in ctypes:
                issues.append(f"content-type 值 `{ct}` 非法")
            elif ct_style:
                issues.append(f"content-type 写法不规范：`{vals.get('content-type')}` 应写成纯字符串")

            ca, ca_style = norm_val(vals.get("category", ""))
            if ca and cats and "<%" not in ca and ca not in cats:
                issues.append(f"category 值 `{ca}` 非法（合法：{' / '.join(sorted(cats))}）")

            # status 已于 2026-10-24 废除：模板里若又出现，视为「把废弃字段加回来了」
            if "status" in keys:
                issues.append("status 字段已于 2026-10-24 废除，模板不应再生成（见 Truth/元数据规范）")

            for need in ("uid", "title", "content-type"):
                if need not in keys:
                    issues.append(f"缺必填字段 `{need}`")

        if issues:
            problems += len(issues)
            print(f"  ✗ {p.name}")
            for i in issues:
                print(f"      - {i}")
    if problems == 0:
        print(f"  ✓ {len(tpls)} 个模板全部通过")

    # ---------- 2. 全库脏值统计 ----------
    if "--all" in args:
        print("\n== 全库脏值（只报数，不改） ==")
        # 40-ARCHIVE 按免维护原则不参与治理，旧值保留
        skip_dirs = {".obsidian", ".trash", ".workbuddy", ".git", ".claude", "_templates", "40-ARCHIVE"}
        dirty_type = {}
        style_type = []
        list_style_type = []
        legacy_status = 0
        legacy_related = 0
        miss_uid = 0
        total = 0
        for p in ROOT.rglob("*.md"):
            if any(part in skip_dirs for part in p.parts):
                continue
            text = read(p)
            keys, vals = parse_frontmatter(text)
            if keys is None:
                continue
            total += 1
            # status / related 均已废除：只数存量，不比合法性、不计入 problems
            if norm_val(vals.get("status", ""))[0]:
                legacy_status += 1
            if "related" in keys:
                legacy_related += 1
            if "uid" not in keys:
                miss_uid += 1
            ct, ct_style = norm_val(vals.get("content-type", ""))
            if ct and ct not in ctypes and "<%" not in ct:
                dirty_type.setdefault(ct, []).append(p.name)
            elif ct_style:
                style_type.append(p.name)
            # 多行列表形式：`content-type:` 换行后跟 `  - xxx`。
            # parse_frontmatter 按行取值，这种写法解析成空串，会静默通过前两条判断，
            # 但它在 Obsidian 里是数组，`.base` 的 content-type == "x" 会恒假。
            # 99-ASSETS/copilot 是对话存档，改了等于篡改历史，不参与检查。
            if "copilot" not in str(p) and re.search(
                r"^content-type:[ \t]*\n[ \t]+-[ \t]+\S", text, re.M
            ):
                list_style_type.append(p.name)

        print(f"  扫描 {total} 篇（已排除 01-META/_templates/40-ARCHIVE/.claude 等）")
        print(f"  缺 uid：{miss_uid} 篇")
        print(f"  存量 status：{legacy_status} 篇 · 存量 related：{legacy_related} 篇"
              f"（两字段均已废除，仅计数、不报错，见 Truth/元数据规范 字段墓碑）")

        if dirty_type:
            print("\n  content-type 真脏值：")
            for k, v in sorted(dirty_type.items(), key=lambda x: -len(x[1])):
                print(f"    `{k}` × {len(v)}  例：{', '.join(v[:3])}")
            problems += sum(len(v) for v in dirty_type.values())
        else:
            print("  content-type 无脏值 ✓")

        if style_type:
            print("\n  写法不规范（值合法但用了引号/方括号，会让 .base 过滤失效）：")
            print(f"    content-type × {len(style_type)}  例：{', '.join(style_type[:3])}")

        if list_style_type:
            print("\n  content-type 写成多行列表（YAML 解析为数组，.base 过滤静默失效）：")
            print(f"    × {len(list_style_type)}  例：{', '.join(list_style_type[:3])}")
            problems += len(list_style_type)

    # ---------- 3. 链接规范 ----------
    if "--links" in args:
        problems += check_links()
        problems += check_up_style()

    # ---------- 4. 待登记字段 ----------
    if unregistered:
        print("\n== 扩展字段（模板在用，但 Truth/元数据规范 未登记） ==")
        for k, v in sorted(unregistered.items()):
            print(f"  `{k}` ← {', '.join(sorted(set(v)))}")
        print("  提示：这些是实践中长出来的字段。若确认长期保留，应登记进 Truth/元数据规范，")
        print("        否则下一个读规范的人不会知道它们存在。")

    print()
    if problems:
        print(f"✗ 共 {problems} 处问题")
        return 1
    print("✓ 校验通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
