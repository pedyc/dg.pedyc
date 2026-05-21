---
name: wiki-sync-local
version: 1.0.0
description: |
  检测笔记变更并自动同步到 Wiki 层。创建/修改笔记后自动更新相关 concept/moc 索引、wiki-index 和 wiki-log。
  触发条件：创建或修改了任何笔记后被动触发。
argument-hint: "<create|update|delete> <笔记路径> [相关概念]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
---

# wiki-sync-local

笔记变更后被动触发的同步工作流，将变更同步到 Wiki 层。

## 触发场景

- 用户刚创建或修改了笔记
- LLM 判断需要更新 wiki 索引

## 工作流程

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

## 同步规则

| content-type | 同步到 | 更新内容 |
|-------------|--------|---------|
| atomic | 相关 concept/moc | 添加引用链接 + 核心观点 |
| concept | wiki-index | 检查分类位置 |
| moc | wiki-index | 检查索引完整性 |
| area | wiki-index | 检查领域分类 |
| term/comparison | wiki-index | 检查术语/对比分类 |

详见 `content/00-META/llm-wiki-schema.md` 第 2 节。

## 输出格式

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