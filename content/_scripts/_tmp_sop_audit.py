import re
from pathlib import Path
from collections import defaultdict, Counter

V = Path(r"D:/Workspace/pedyc/dg,pedyc/content")
SKIP = {".obsidian", ".trash", ".git", ".workbuddy", "node_modules", ".smart-env",
        ".makemd", ".space", "40-ARCHIVE", "99-ASSETS"}

# 1) 收所有 md 的 basic
files = {}
for p in V.rglob("*.md"):
    rel = p.relative_to(V)
    if any(x in SKIP for x in rel.parts):
        continue
    if rel.parts[0] == ".claude":
        continue
    txt = p.read_text(encoding="utf-8", errors="ignore")
    m = re.match(r"^---\n(.*?)\n---\n", txt, re.S)
    fm = m.group(1) if m else ""
    body = txt[m.end():] if m else txt
    ct = re.search(r"^content-type:\s*[\"']?([\w-]+)", fm, re.M)
    files[p.stem] = dict(
        path=rel.as_posix(), ct=(ct.group(1) if ct else None),
        fm=fm, body=body, txt=txt,
    )

# 2) 反向链接计数：[[X]] 出现在哪些笔记里
inbound = defaultdict(list)
for stem, d in files.items():
    for tgt in re.findall(r"\[\[([^\]\|#]+)", d["txt"]):
        tgt = tgt.strip().split("/")[-1]
        if tgt != stem:
            inbound[tgt].append((stem, d["ct"]))

sops = {s: d for s, d in files.items() if d["ct"] == "sop" and not d["path"].startswith("_templates")}
print("SOP 总数:", len(sops))

# 3) 每篇逐项体检
rows = []
for s, d in sorted(sops.items()):
    fm, body = d["fm"], d["body"]
    has_source = bool(re.search(r"^source[s]?:", fm, re.M))
    has_output = "## 产出" in body
    has_example = bool(re.search(r"^### 实践|^### 示例|^### 实践/示例", body, re.M))
    # 段落名
    heads = re.findall(r"^###\s+(.+)$", body, re.M)
    # 入链的 diary 数（实证使用痕迹）
    diary_in = [x for x in inbound[s] if x[1] == "diary"]
    atomic_in = [x for x in inbound[s] if x[1] == "atomic"]
    proj_in = [x for x in inbound[s] if x[1] == "project"]
    rows.append(dict(stem=s, path=d["path"], has_source=has_source, has_output=has_output,
                     has_example=has_example, diary=len(diary_in), atomic=len(atomic_in),
                     proj=len(proj_in), total_in=len(inbound[s]), heads=len(heads),
                     body_len=len(body)))

# 4) 汇总
c = Counter()
for r in rows:
    c["有 source"] += r["has_source"]
    c["有 ## 产出"] += r["has_output"]
    c["有 实践/示例"] += r["has_example"]
    c["被 diary 引用"] += r["diary"] > 0
    c["被 atomic 引用"] += r["atomic"] > 0
    c["零入链"] += r["total_in"] == 0
print("\n=== 汇总（%d 篇） ===" % len(rows))
for k, v in c.items():
    print(f"  {k:<14} {v:>3}  ({v/len(rows)*100:.0f}%)")

print("\n=== 有 source 的 SOP ===")
for r in rows:
    if r["has_source"]:
        print("  ", r["stem"])
print("\n=== 有 ## 产出的 SOP ===")
for r in rows:
    if r["has_output"]:
        print("  ", r["stem"])

print("\n=== 零入链（无人引用） ===")
z = [r for r in rows if r["total_in"] == 0]
for r in z:
    print("  ", r["stem"])
print("  共", len(z))

print("\n=== 被 diary 引用（真有使用痕迹） ===")
for r in sorted(rows, key=lambda x: -x["diary"]):
    if r["diary"]:
        print(f"   {r['stem']:<34} diary={r['diary']} atomic={r['atomic']} proj={r['proj']}")

print("\n=== 三无（无 source / 无产出 / 无 diary 引用） ===")
n3 = [r for r in rows if not r["has_source"] and not r["has_output"] and not r["diary"]]
for r in n3:
    print(f"   {r['stem']:<38} 入链{r['total_in']:>2}  {r['body_len']:>5}字节")
print("  共", len(n3), "篇，占 %.0f%%" % (len(n3) / len(rows) * 100))

# 5) 段落名分布
print("\n=== 段落名分布（top 25） ===")
hc = Counter()
for s, d in sops.items():
    for h in re.findall(r"^###\s+(.+)$", d["body"], re.M):
        hc[h.strip()] += 1
for h, n in hc.most_common(25):
    print(f"   {n:>3}  {h}")
