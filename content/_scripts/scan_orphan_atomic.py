"""列出 50-ZETTELCASTEN 里缺少 up（或 up 为空值）的 atomic。

输出：标题 | 首行正文（截断） | 关联里的链接
用于人工判断该挂哪个 concept。
"""
import re
import sys
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
ZET = VAULT / "50-ZETTELCASTEN"
FM = re.compile(r"^---\n(.*?)\n---\n", re.S)


def parse_frontmatter(text: str) -> dict:
    m = FM.match(text)
    if not m:
        return {}
    raw = m.group(1)
    up = None
    for line in raw.split("\n"):
        if re.match(r"^up\s*:", line):
            up = line.split(":", 1)[1].strip()
            break
    return {"up": up}


def main() -> int:
    rows = []
    for path in sorted(ZET.glob("*.md")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        fm = parse_frontmatter(text)
        up = (fm.get("up") or "").strip()
        if up in ("", "[]", '""', "''", "null", "~"):
            body = FM.sub("", text, count=1)
            # 取第一条非空、非标题的正文行
            first = ""
            for line in body.split("\n"):
                s = line.strip().lstrip(">-").strip()
                if s and not s.startswith("```"):
                    first = s
                    break
            links = re.findall(r"\[\[([^\]|]+)", body)
            rows.append((path.stem, first[:60], links[:6]))
    print(f"共 {len(rows)} 篇\n")
    for i, (title, first, links) in enumerate(rows, 1):
        print(f"{i:>3}. {title}")
        print(f"     正文：{first}")
        print(f"     链接：{', '.join(links) if links else '（无）'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
