---
uid: 202605201735e
title: _lint-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-07-17
status: active
content-type: [article]
up: [["llm-wiki-schema"]]
---

## Lint 工作流

定期检查知识库健康度。执行频率：每周一次或每新增 10+ 篇笔记后。

### 检查清单

#### 1. 矛盾检测

- 搜索同一主题的多个 atomic 和 concept
- 标记相互矛盾的断言
- 在矛盾页面添加注解，注明分歧

#### 2. 孤儿页面

- 检查没有 inbound link 的 concept/moc/area
- 对孤儿页面：
	- 如有价值但缺少引用 → 补充相关页面的引用
	- 如已过时 → 移动到 `50-ARCHIVE/`
	- 如无价值 → 询问是否删除

#### 3. 概念缺口

- 扫描 atomic 中被多次提及但无专属页面的概念
- 建议创建新 concept 或补充现有 concept

#### 4. 过时断言

- 检查 status=archived 的笔记对应的 wiki 页面
- 标记被新知识 supersede 的断言

#### 5. 索引一致性

- 检查 `wiki-index.md` 是否与实际页面一致
- 检查 `wiki-log.md` 是否有遗漏的 ingest 记录

### Lint 输出格式

```markdown
## Lint Report - [日期]

### 矛盾
- [[页面A]] vs [[页面B]]: xxx

### 孤儿页面
- [[页面C]]: 无 inbound link，建议补充引用或归档

### 概念缺口
- "XXX" 被提及 5 次但无专属页面，建议创建 [[C-XXX]]

### 过时断言
- [[页面D]] 中的 xxx 已被 [[新笔记]] supersede
```

### 主动健康检查（定时任务）

每周自动执行一次健康检查，确保知识库保持健康状态。

**Cron 表达式**：`0 9 * * 1`（每周一 09:00）

**执行内容**：
1. 调用 `/content-evaluator-local full`
2. 检查结果追加到 `wiki-log.md`
3. 如发现问题，标记到日志并发出预警

**预警条件**：
- 矛盾 > 3 个
- 孤儿页面 > 5 个
- 概念缺口 > 5 个

---

### 分析脚本模板

以下 Python 脚本可在 lint 时直接运行，确保每次检查方法一致。

#### 1. 孤儿页面检测

```python
import os, re
from collections import defaultdict

CONTENT = "/mnt/d/Workspace/pedyc/site/apps/dg/content"
link_pattern = re.compile(r'\[\[([^\[\]]+)\]\]')
inbound = defaultdict(set)

for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != '_templates']
    for f in files:
        if not f.endswith('.md'): continue
        src = f[:-3]
        rel = os.path.relpath(os.path.join(root, f), CONTENT)
        try:
            with open(os.path.join(root, f), 'r') as fh:
                for m in link_pattern.finditer(fh.read()):
                    target = m.group(1).split('|')[0].split('#')[0].strip()
                    if target and target != src:
                        inbound[target].add(src)
        except: pass

orphans = []
for title, rel in {f[:-3]: os.path.relpath(os.path.join(r, f), CONTENT)
    for r, ds, fs in os.walk(CONTENT) for f in fs if f.endswith('.md')}.items():
    if '/40-RESOURCES/' in rel or '/20-AREAS/' in rel:
        real = {s for s in inbound.get(title, set()) if 'wiki-index' not in s}
        if len(real) == 0:
            orphans.append((title, rel))

print(f"孤儿页面: {len(orphans)}")
for t, r in sorted(orphans):
    print(f"  [[{t}]] ({r})")
```

#### 2. 概念缺口检测

```python
import os, re
from collections import defaultdict

CONTENT = "/mnt/d/Workspace/pedyc/site/apps/dg/content"
link_pattern = re.compile(r'\[\[([^\[\]]+)\]\]')

# 收集所有页面标题
all_titles = {}
for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != '_templates']
    for f in files:
        if f.endswith('.md'): all_titles[f[:-3]] = True

# 统计 atomic 中链接到不存在的页面
gaps = defaultdict(int)
for root, dirs, files in os.walk(os.path.join(CONTENT, '30-Zettelkasten')):
    for f in files:
        if not f.endswith('.md'): continue
        try:
            with open(os.path.join(root, f), 'r') as fh:
                for m in link_pattern.finditer(fh.read()):
                    target = m.group(1).split('|')[0].split('#')[0].strip()
                    if target and target not in all_titles:
                        gaps[target] += 1
        except: pass

real_gaps = [(t, c) for t, c in gaps.items() if c >= 2]
real_gaps.sort(key=lambda x: -x[1])
print(f"概念缺口 (atomic 中提及 2+ 次但无页面): {len(real_gaps)}")
for target, count in real_gaps:
    print(f'  "{target}" ({count}x)')
```

#### 3. 过期引用检测

```python
import os, re
from collections import defaultdict

CONTENT = "/mnt/d/Workspace/pedyc/site/apps/dg/content"
link_pattern = re.compile(r'\[\[([^\[\]]+)\]\]')
inbound = defaultdict(set)

for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    for f in files:
        if not f.endswith('.md'): continue
        src = f[:-3]
        rel = os.path.relpath(os.path.join(root, f), CONTENT)
        try:
            with open(os.path.join(root, f), 'r') as fh:
                for m in link_pattern.finditer(fh.read()):
                    target = m.group(1).split('|')[0].split('#')[0].strip()
                    if target and target != src:
                        inbound[target].add(src)
        except: pass

# 收集所有归档页面
archive = set()
store = {}
for root, dirs, files in os.walk(CONTENT):
    for f in files:
        if not f.endswith('.md'): continue
        t = f[:-3]; r = os.path.relpath(os.path.join(root, f), CONTENT)
        store[t] = r
        if '/50-ARCHIVE/' in r: archive.add(t)

print("归档仍被 wiki 层引用:")
for a in sorted(archive):
    refs = {s for s in inbound.get(a, set())
            if '/40-RESOURCES/' in store.get(s, '') or '/20-AREAS/' in store.get(s, '')}
    if refs:
        print(f"  [[{a}]] <- {list(refs)[:3]}")
```

#### 4. 索引一致性检查

```python
import os, re
CONTENT = "/mnt/d/Workspace/pedyc/site/apps/dg/content"
link_pattern = re.compile(r'\[\[([^\[\]]+)\]\]')

all_pages = {}
for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != '_templates']
    for f in files:
        if f.endswith('.md'): all_pages[f[:-3]] = True

# 检查 wiki-index 中的断裂链接
idx_path = os.path.join(CONTENT, "00-META/Index/wiki-index.md")
if os.path.exists(idx_path):
    with open(idx_path) as fh:
        for m in link_pattern.finditer(fh.read()):
            target = m.group(1).split('|')[0].split('#')[0].strip()
            if target and target not in all_pages:
                print(f"wiki-index 断裂链接: [[{target}]]")
```

---

### 执行步骤

```bash
# 完整 lint 运行
python3 lint_orphans.py    # 孤儿页面
python3 lint_gaps.py       # 概念缺口
python3 lint_stale.py      # 过期引用
python3 lint_index.py      # 索引一致性
```

---

### 日志格式
