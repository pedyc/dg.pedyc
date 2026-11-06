---
name: wiki-sync-local
version: 3.2.0
description: |
  维护系统元数据层：更新 wiki-index、同步 wiki-sync-state、维护 suggest-log。
  **职责边界：只碰 01-META/ 下的系统文件。不碰内容页（20-AREAS/ / 50-ZETTELCASTEN/ / 30-RESOURCES/ / 60-BLOGS/）。**
  **wiki-index 格式一律遵守 [[_wiki-index-format]] 规范（分区顺序/条目格式/缩进/计数/更新标记）。**
  **不写 wiki-log**：该文件冻结于 2026-10-27，变更与决策记录改记库根 `.workbuddy/memory/YYYY-MM-DD.md`。
**维护清单**：wiki-index.md、wiki-sync-state.json、**suggest-log.md**
  手动触发：创建/删除笔记后补充 wiki-index。
  自动触发：会话启动时检测 git 变更，同步状态文件。
argument-hint: "[create|update|delete <笔记路径>]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - Bash
---

# wiki-sync-local

## 触发场景

- 用户创建笔记后，补充 wiki-index 条目
- 用户删除笔记后，从 wiki-index 移除条目
- 会话启动时自动检测 git 变更并更新状态

> **格式约束**：wiki-index 的更新必须遵守 `01-META/Specification/_wiki-index-format.md`（单一可信源）。本 skill 只定义同步流程，格式细节以该规范为准。

## 模式一：手动触发（由 obsidian-note-local 或用户调用）

在笔记创建/删除后调用，只处理元数据层（index + state），不修改笔记内容，不写 wiki-log。

### 1. 读取笔记信息

读取笔记 frontmatter，提取：
- `title` / `aliases` — 页面标题
- `content-type` — 类型（moc/concept/sop/atomic...）
- `up` — 父页面
- `description` — 一句话描述（用于 wiki-index 条目）
- `date-created` — 创建日期

### 2. 更新 wiki-index

按 `_wiki-index-format.md` 规范处理。读取 `01-META/Index/wiki-index.md`，按操作类型处理：

**create**：
- 根据 content-type 和 up 字段找到对应分类
- 在父条目下添加 `	- [[新笔记]] — {{description}}`
- 如果父条目不存在，在对应区域分类下添加完整条目

**delete**：
- 在 wiki-index 中搜索并移除对该页面的引用
- 清除所有子条目

### 3. wiki-log 不归本 skill（已停用）

`01-META/Log/wiki-log.md` 冻结于 2026-10-27，本 skill 不再向它追加任何条目。

知识加工事件（ingest / inbox-review / lint / refactor）的叙事与决策理由，改记库根 `.workbuddy/memory/YYYY-MM-DD.md`：append-only、按天分文件、不需要维护日期骨架。格式见 `AGENTS.md` 入口表「查某处改动、设计取舍的历史理由」一行。

不再为 wiki-log 补「遗漏记录」——该文件只作考古，补记等于制造一段从未真实发生过的时间线。

### 4. 更新同步状态

更新 `wiki-sync-state.json`：
- `lastSyncTime` → 当前时间
- `lastCommit` → HEAD commit hash

### 5. 提交状态变更

```bash
git add content/01-META/wiki-sync-state.json content/01-META/Index/wiki-index.md
git commit -m "sync: update wiki-sync-state"
```

## 模式二：自动检测 Git 变更（会话启动时）

### 1. 读取同步状态

读取 `content/01-META/wiki-sync-state.json`，获取 `lastCommit`（上次同步的 commit hash）。

### 2. 检测变更文件

```bash
git diff <lastCommit>..HEAD --name-status
```

过滤 `content/` 目录下的 `.md` 文件，排除：
- `.obsidian/` 目录
- `01-META/wiki-sync-state.json` 自身
- `01-META/Log/wiki-log.md` 自身
- `01-META/Index/wiki-index.md` 自身
- `00-INBOX/` 目录

### 3. 变更分类处理

根据 git status 归类，只在汇总报告里列出，**不落盘**（原「记录到日志」已随 wiki-log 停用一并取消）：
- `A`（新增）→ 标记为「待 ingest」
- `M`（修改）→ 标记为「索引条目可能已过期」
- `D`（删除）→ 标记为「需从索引移除」

不读取或修改变更文件内容，只分类。

### 4. 更新同步状态

将 `wiki-sync-state.json` 的 `lastCommit` 更新为当前 HEAD commit，`lastSyncTime` 更新为当前时间。

### 5. 提交状态变更

```bash
git add content/01-META/wiki-sync-state.json
git commit -m "sync: update wiki-sync-state"
```

### 6. 汇总报告

```
Wiki 同步完成

检测到变更：N 个文件
- 新增：X 个
- 修改：Y 个
- 删除：Z 个
上次同步点：{lastCommit}
本次同步点：{currentCommit}
```