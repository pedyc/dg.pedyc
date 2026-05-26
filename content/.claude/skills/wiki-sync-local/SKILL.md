---
name: wiki-sync-local
version: 2.0.0
description: |
  检测笔记变更并自动同步到 Wiki 层。创建/修改笔记后自动更新相关 concept/moc 索引、wiki-index 和 wiki-log。
  支持两种触发方式：1) 手动指定笔记路径；2) 自动检测 git 变更（无需指定路径）。
argument-hint: "<create|update|delete> <笔记路径> [相关概念]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - Bash
---

# wiki-sync-local

笔记变更后被动触发的同步工作流，将变更同步到 Wiki 层。

## 触发场景

- 用户刚创建或修改了笔记
- LLM 判断需要更新 wiki 索引
- 会话启动时自动检测 git 变更并同步

## 模式一：手动指定笔记

### 1. 检测变更类型

- **create**：新增笔记，需要在 wiki 中建立引用
- **update**：修改笔记，检查是否需要更新 wiki 索引
- **delete**：删除笔记，需要从 wiki 中移除引用

### 2. 确定关联页面

读取 `content/00-META/llm-wiki-schema.md` 第 2 节了解关联规则。

1. 根据笔记的 content-type 确定目标 wiki 页面类型
2. 在 wiki-index 中查找相关领域/concept
3. 读取相关 concept/moc 页面

### 3. 同步到 Wiki 层

**create / update 时**：
- 在相关 concept/moc 中追加或更新引用
- 如果是 atomic，确保被相关 concept 引用
- 更新 `[[up]]` 属性指向正确的父级

**delete 时**：
- 从相关 concept/moc 中移除引用
- 检查是否有孤儿链接

### 4. 更新索引（如需要）

- 新笔记类型未在 wiki-index 中出现 → 添加条目
- 笔记 content-type 变更 → 更新对应分类

### 5. 记录日志

在 `content/00-META/wiki-log.md` 追加变更记录：

```
- [日期] sync | 操作类型 | 笔记标题
  - 变更内容简述
  - 更新的 wiki 页面
```

## 模式二：自动检测 Git 变更（推荐）

当不带参数调用 skill 时，自动执行以下流程：

### 1. 读取同步状态

读取 `content/00-META/wiki-sync-state.json`，获取 `lastCommit`（上次同步的 commit hash）。

### 2. 检测变更文件

执行 git 命令获取自上次同步以来的所有变更：

```bash
git diff <lastCommit>..HEAD --name-status
```

过滤 `content/` 目录下的 `.md` 文件，排除 `.obsidian/` 和 `00-META/wiki-sync-state.json` 自身。

### 3. 对每个变更文件执行同步

根据 git status 确定操作类型：
- `A`（新增）→ create 操作
- `M`（修改）→ update 操作
- `D`（删除）→ delete 操作

对每个文件：
1. 读取文件 front matter 获取 content-type 和 aliases
2. 根据 content-type 确定同步目标（同「模式一」）
3. 执行相应的同步逻辑
4. 跳过 `00-META/wiki-log.md`、`wiki-index.md` 自身的变更（这些由 skill 内部维护）

### 4. 更新同步状态

将 `wiki-sync-state.json` 的 `lastCommit` 更新为当前 HEAD commit，`lastSyncTime` 更新为当前时间。

### 5. 汇总报告

输出本次同步的汇总信息：

```
Wiki 同步完成（自动检测）

检测到变更：N 个文件
- 新增：X 个
- 修改：Y 个
- 删除：Z 个
更新的 wiki 页面：
- {页面1}
- {页面2}
上次同步点：{lastCommit}
本次同步点：{currentCommit}
```

## 同步规则

| content-type | 同步到 | 更新内容 |
|-------------|--------|---------|
| atomic | 相关 concept/moc | 添加引用链接 + 核心观点 |
| concept | wiki-index | 检查分类位置 |
| moc | wiki-index | 检查索引完整性 |
| area | wiki-index | 检查领域分类 |
| term/comparison | wiki-index | 检查术语/对比分类 |

详见 `content/00-META/llm-wiki-schema.md` 第 2 节。

## 输出格式（手动模式）

```
Wiki 同步完成

笔记：{标题}
操作：{create|update|delete}
更新的 wiki 页面：
- {页面1}
- {页面2}
已更新索引：{是/否}
已记录日志：{是/否}
```