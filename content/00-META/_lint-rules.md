---
uid: 202605201735e
title: _lint-rules
aliases: []
tags: [方法论, llm-wiki]
date-created: 2026-05-20
date-modified: 2026-05-28
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

**日志格式**：

```markdown
## Lint Report - [日期]

### 发现问题
- 矛盾：X 个
- 孤儿页面：Y 个
- 概念缺口：Z 个

### 建议
- [[页面A]]: xxx
```
