---
name: obsidian-note-local
version: 3.3.0
description: |
  创建/更新笔记全流程：读取模板 → 生成/修改笔记 → 更新父级引用 → 同步 wiki 元数据 → 评估健康度 → 核查内容质量。
  **一条命令完成从创建/更新到知识网络挂载的全链路，无需再单独调用其他 skill。**
  支持所有 content-type 包括 roadmap 和 person。
argument-hint: "<create|update> <content-type> <标题/路径> [内容]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Agent
---

# obsidian-note-local v3.3

## 模式选择

根据第一个参数决定操作类型：
- `create` — 新建笔记（默认流程）
- `update` — 重写/修改已有笔记

---

## 模式一：create（新建）

### 步骤 1：读取模板

根据 content-type 读取 `content/_templates/` 下对应模板：
- atomic → `template_atomic.md`
- concept → `template_concept.md`
- moc → `template_moc.md`
- sop → `template_sop.md`
- term → `template_term.md`
- question → `template_question.md`
- area → `template_area.md`
- project → `template_project.md`
- article → `template_article.md`
- comparison → `template_comp.md`
- diary → `template_diary.md`
- roadmap → `template_roadmap.md`
- person → `template_person.md`

### 步骤 2：创建笔记

按模板生成文件（填充 uid、标题、aliases、日期、描述、tags 等），写入对应目录。

目录对应关系：
- atomic → `50-ZETTELCASTEN/`
- concept/moc/sop/term/comparison/question → `30-RESOURCES/`
- area → `20-AREAS/`
- project → `10-PROJECTS/`
- article → `60-BLOGS/`
- diary → `90-DIARY/`
- record → `30-RESOURCES/`
- roadmap → `30-RESOURCES/`
- person → `30-RESOURCES/`

### 步骤 3：更新父页面引用

读取 frontmatter 的 `up` 字段，确定父页面，在父页面对应章节追加引用：

| 新建类型 | 父类型 | 更新位置 | 插入方式 |
|---|---|---|---|
| moc | Area | FAQ 章节 | `- [[MOC-X]] — 描述` |
| concept | Area | 关键领域章节 | 按子分类插入 |
| sop | Area | SOP 章节 | `- [[SOP-X]] — 描述` |
| question | Area | FAQ 章节 | `- [[Q-X]] — 描述` |
| term | Area | 关键领域（如适用） | 或直接由 wiki-index 管理 |
| atomic | concept | 相关原子笔记章节 | `- [[atomic-title]]` |
| moc | MOC | 列表末尾 | `- [[MOC-X]]` |
| concept/question | MOC | 列表末尾 | `- [[笔记]]` |
| person | MOC | 列表末尾 | `- [[{{人名}}]] — 描述`（无对应 MOC 时挂 Area 人物小节） |

---

## 模式二：update（更新）

### 步骤 1：读取现有笔记

读取要修改的笔记文件，获取当前 frontmatter（uid、title、aliases、up、date-created 等）。

如果 content-type 变更，读取新模板进行对比。

### 步骤 2：应用修改

使用 Edit/Write 修改笔记内容。保留 uid 和 date-created 不变，更新 date-modified。
如果 content-type 或目录变更，移动文件到新目录。

### 步骤 3：更新父页面引用

检查 `up` 字段是否变化：
- **未变** → 跳过
- **变了** → 从旧父页面移除引用，在新父页面添加引用（格式同 create 步骤 3）

---

## 步骤 4：同步与核查（subagent）

创建或更新完成后，启动 subagent 依次执行以下任务：

1. **wiki-sync-local** — 更新 wiki-index、wiki-log、sync-state
2. **content-evaluator-local** — 评估笔记健康度（模板结构对比）
3. **content-verifier-local** — 核查内容质量（create 用 light，update 用 full）

subagent 关闭时自动清理上下文，不污染主会话。

---

### 目录对应关系速查

| content-type | 目标目录 | aliases 前缀 |
|---|---|---|
| atomic | `50-ZETTELCASTEN/` | 无 |
| concept | `30-RESOURCES/` | `C-` |
| moc | `30-RESOURCES/` | `MOC-` |
| sop | `30-RESOURCES/` | `SOP-` |
| term | `30-RESOURCES/` | `T-` |
| question | `30-RESOURCES/` | `Q-` |
| comparison | `30-RESOURCES/` | 无 |
| area | `20-AREAS/` | `A-` |
| project | `10-PROJECTS/` | `P-` |
| article | `60-BLOGS/` | 无 |
| diary | `90-DIARY/` | 无 |
| roadmap | `30-RESOURCES/` | `R-`（同 record 共享） |
| person | `30-RESOURCES/` | `R-`（同 record/roadmap 共享） |
