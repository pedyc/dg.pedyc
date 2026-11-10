"""判据登记条目的读取层。

两个消费者：
- sync_criteria.py  把条目投影成模板注释与《判据速查》
- check_criteria.py 把条目投影成可执行的检查项

契约：条目只登记，不写条文。本模块只读，不改文件。
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CRITERIA_DIR = ROOT / "01-META" / "Index" / "判据"
TEMPLATE_DIR = ROOT / "_templates"
SPEED_REF_PATH = ROOT / "01-META" / "Guide" / "Design" / "判据速查.md"

BEGIN = "<!-- 判据:begin"
END = "<!-- 判据:end -->"

# 模板键 = 模板文件名去掉 template_ 前缀与 .md 后缀。
# 不另立枚举：以目录里真实存在的文件为准，缺文件即报错。
TEMPLATE_KEYS = [
    "atomic", "concept", "term", "sop", "question", "comparison",
    "record", "roadmap", "moc", "area", "project", "article",
    "diary", "learning_project",
]

CONTENT_TYPE_OF = {
    "atomic": "atomic", "concept": "concept", "term": "term", "sop": "sop",
    "question": "question", "comparison": "comparison", "record": "record",
    "roadmap": "roadmap", "moc": "moc", "area": "area", "project": "project",
    "article": "article", "diary": "diary", "learning_project": "project",
}

# 子模板不映射独立 content-type，判据跟父模板走。
SUB_OF = {
    "person": "record",
    "source": "record",
    "sub_project": "project",
    "week": "diary",
}

# 文件名与模板键不一致的唯一一处：template_comp.md 对应 comparison。
FILE_ALIAS = {"comp": "comparison"}

LIST_FIELDS = {"applies"}


def _unquote(v):
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    return v


def parse_frontmatter(text):
    """只解析 `key: value` 单行与 `key: [a, b]`，够用即止。

    不引第三方 yaml：validate_meta.py 同样自带解析，保持一致。
    """
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    out = {}
    for line in text[3:end].splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        if key in LIST_FIELDS:
            inner = val.strip("[]").strip()
            if not inner:
                out[key] = []
            else:
                out[key] = [_unquote(x) for x in inner.split(",") if x.strip()]
        else:
            out[key] = _unquote(val)
    return out


def _seq_key(entry):
    try:
        return (int(entry.get("seq", 9999)), entry.get("criterion", ""))
    except ValueError:
        return (9999, entry.get("criterion", ""))


def load():
    """返回按 seq 排序的条目列表。"""
    if not CRITERIA_DIR.exists():
        raise SystemExit(f"✗ 找不到登记目录：{CRITERIA_DIR}")
    items = []
    for path in sorted(CRITERIA_DIR.glob("*.md")):
        fm = parse_frontmatter(path.read_text(encoding="utf-8"))
        if not fm.get("criterion"):
            continue
        fm["_path"] = path
        fm["_stem"] = path.stem
        items.append(fm)
    items.sort(key=_seq_key)
    return items


def by_applies(items):
    """模板键 → 该模板要引的条目（保持 seq 顺序）。"""
    out = {k: [] for k in TEMPLATE_KEYS}
    for it in items:
        for key in it.get("applies", []):
            if key not in out:
                raise SystemExit(
                    f"✗ {it['criterion']} 的 applies 值 `{key}` 不在模板键闭集内；"
                    f"合法值：{', '.join(TEMPLATE_KEYS)}"
                )
            out[key].append(it)
    return out


def orphan(items):
    """applies 为空 → 不进任何模板注释，只在 base 与通用节出现。"""
    return [it for it in items if not it.get("applies")]


def template_path(key):
    return TEMPLATE_DIR / f"template_{key}.md"
