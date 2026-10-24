"""统计单篇笔记的纯文字字数（剔除 frontmatter 与代码块）。

用法: python _scripts/count_words.py <文件路径或目录> [--top N]
"""
import re
import sys
from pathlib import Path

FM = re.compile(r"^---\n.*?\n---\n", re.S)
CODE = re.compile(r"```.*?```", re.S)


def pure_text(path: Path) -> int:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    body = FM.sub("", raw, count=1)
    body = CODE.sub("", body)
    # 剔除 mermaid 等内联标记与链接语法噪音，只留可见文字长度
    body = re.sub(r"\s+", "", body)
    return len(body)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    target = Path(sys.argv[1])
    top = None
    if "--top" in sys.argv:
        top = int(sys.argv[sys.argv.index("--top") + 1])
    files = [target] if target.is_file() else sorted(target.rglob("*.md"))
    rows = sorted(((pure_text(f), f) for f in files), reverse=True)
    if top:
        rows = rows[:top]
    for n, f in rows:
        print(f"{n:>5}  {f.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
