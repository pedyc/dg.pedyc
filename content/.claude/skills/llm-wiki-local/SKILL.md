---
name: llm-wiki-local
version: 1.0.0
description: |
  适配本库 PARA + Zettelkasten 三层架构的知识库工作流。
  触发条件：用户提到"知识库"、"wiki"，或要求"消化"/"查询"/"lint"。
argument-hint: "<ingest|query|lint|graph> [笔记标题或内容]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - Bash
---

# llm-wiki-local

执行前读取 `content/00-META/llm-wiki-schema.md` 获取完整工作流定义。

## 工作流路由

| 用户意图 | 工作流 |
|---------|--------|
| "消化"、"整理"、"添加笔记" | → ingest |
| "查询"、"关于 XX"、"XX 是什么" | → query |
| "检查知识库"、"健康检查"、"lint" | → lint |
| "画个图谱"、"看看关联" | → graph |

详细步骤见 `content/00-META/llm-wiki-schema.md`。
