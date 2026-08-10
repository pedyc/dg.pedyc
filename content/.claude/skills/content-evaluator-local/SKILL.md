---
name: content-evaluator-local
version: 1.2.0
description: |
  评估笔记在知识库中的健康度，对接 llm-wiki-schema.md 的 lint 工作流。
  支持按 content-type 对比模板结构完整性。
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
同时读取 `content/00-META/Specification/_笔记类型规范.md`（或兼容入口 `_content-type-rules.md`）获取 content-type 定义和模板对应关系。

详细评估维度见 `llm-wiki-schema.md` 第 4 节。

## 已知 content-type 与模板映射

评估时会根据笔记的 content-type 读取对应模板对比结构完整性：

| content-type | 模板 | 目录 |
|---|---|---|
| atomic | template_atomic.md | 30-ZETTELKASTEN/ |
| concept | template_concept.md | 40-RESOURCES/ |
| moc | template_moc.md | 40-RESOURCES/ |
| sop | template_sop.md | 40-RESOURCES/ |
| term | template_term.md | 40-RESOURCES/ |
| question | template_question.md | 40-RESOURCES/ |
| comparison | template_comp.md | 40-RESOURCES/ |
| record | template_record.md | 40-RESOURCES/ |
| roadmap | template_roadmap.md | 40-RESOURCES/ |
| person | template_person.md | 40-RESOURCES/ |
| area | template_area.md | 20-AREAS/ |
| project | template_project.md | 10-PROJECTS/ |
| article | template_article.md | 60-BLOGS/ |
| diary | template_diary.md | 90-DIARY/ |