---
uid: 202605201735d
title: _sync-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-07-17
status: active
content-type: article
up: [["llm-wiki-schema"]]
---

## Sync 工作流

当笔记发生创建、修改、删除时，被动触发同步到 Wiki 层。

### 职责边界

**Sync 只负责系统文件维护**，不处理 content 变更：
- 更新 `wiki-sync-state.json`
- **不记录 wiki-log**（这是系统维护，不是知识加工）
- 维护 `wiki-index.md`（仅系统条目）

**Content 变更由 ingest 工作流处理**：sync 检测到变更后，由 ingest 工作流决定如何整合并记录到 wiki-log。

### 触发条件

- 用户或 LLM 创建了新笔记
- 用户或 LLM 修改了现有笔记
- 用户或 LLM 删除了笔记
- 手动调用 `/wiki-sync-local` 时，通过 git diff 自动检测所有变更（无需手动告知）

### 状态文件

同步状态记录在 `content/00-META/wiki-sync-state.json`：

```json
{
  "lastCommit": "a74391a2",
  "lastSyncTime": "2026-05-26T11:00:00Z"
}
```

**重要**：sync 完成后会主动 commit 状态文件的变更（`git add` + `git commit`），确保 lastCommit 立即更新，不再依赖外部 vault backup。

### 同步规则（简化版）

| 操作 | Sync 处理 | Ingest 处理 |
|------|----------|-------------|
| 新增笔记 | 更新 sync-state | 整合到 wiki 层 |
| 修改笔记 | 更新 sync-state | 更新 wiki 引用 |
| 删除笔记 | 更新 sync-state | 从 wiki 移除引用 |

**原则**：sync 检测变更、记录事件；ingest 分析内容、执行整合。

### 工作流程（简化版）

#### 自动检测 Git 变更

1. 读取 `wiki-sync-state.json` 获取 `lastCommit`
2. 执行 `git diff <lastCommit>..HEAD --name-status` 获取变更文件
3. 过滤 `content/` 下 `.md` 文件（排除系统文件和 Inbox）
4. 根据 git status（A/M/D）确定操作类型
5. **不记录 wiki-log**（变更检测是系统维护，不属于知识加工事件）
6. 更新 `wiki-sync-state.json` 为当前 HEAD commit
7. 主动 commit 状态变更

#### 手动指定笔记（如需要）

- **create/update/delete**：只更新 sync-state，不处理 content
- 具体 content 处理由 ingest 工作流负责
