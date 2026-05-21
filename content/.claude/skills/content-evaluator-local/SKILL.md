---
name: content-evaluator-local
version: 1.0.0
description: |
  评估笔记在知识库中的健康度，对接 llm-wiki-schema.md 的 lint 工作流。
  触发条件：用户要求评估笔记健康度、检查孤立笔记、或执行知识库健康检查。
argument-hint: "[笔记路径或范围] [light|full]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# content-evaluator-local

执行前读取 `content/00-META/llm-wiki-schema.md` 获取 lint 检查清单。

详细评估维度见 `llm-wiki-schema.md` 第 4 节。