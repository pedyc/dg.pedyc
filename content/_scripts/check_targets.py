"""批量检查候选 up 目标文件是否存在、在哪里、是什么 content-type。

用法: python _scripts/check_targets.py 名字1 名字2 ...
"""
import sys
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
SKIP = {".obsidian", ".trash", ".git", ".workbuddy", "node_modules"}


def find(name: str):
    hits = []
    for p in VAULT.rglob(f"{name}.md"):
        if any(part in SKIP for part in p.parts):
            continue
        hits.append(p)
    return hits


def ctype(path: Path) -> str:
    for line in path.read_text(encoding="utf-8", errors="ignore").split("\n")[:30]:
        if line.startswith("content-type:"):
            return line.split(":", 1)[1].strip()
    return "?"


def main() -> int:
    for name in sys.argv[1:]:
        hits = find(name)
        if not hits:
            print(f"✗ {name} —— 不存在")
        else:
            for h in hits:
                rel = h.relative_to(VAULT).as_posix()
                print(f"✓ {name} → {rel}  [{ctype(h)}]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
