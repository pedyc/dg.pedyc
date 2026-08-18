# CLAUDE.md

本 skill 适配本库的 PARA + Zettelkasten 三层架构。

## 核心文件

- `SKILL.md` — skill 定义和核心工作流
- schema: `content/00-META/llm-wiki-schema.md` — 详细工作流指南
- index: `content/00-META/wiki-index.md` — 知识库导航
- log: `content/00-META/wiki-log.md` — 时间线日志

## 目录结构

```
content/
├── 00-META/           # 系统元数据（schema、index、log）
├── 10-PROJECTS/       # 项目
├── 20-AREAS/          # 领域
├── 50-ZETTELCASTEN/   # 原子笔记（raw sources）
├── 30-RESOURCES/      # wiki 层（concept, moc, sop, term, comparison）
├── 40-ARCHIVE/         # 归档
├── 60-BLOGS/           # 博客文章
├── 90-DIARY/           # 日记
└── 99-ASSETS/          # 附件
```

## 关键约定

- **atomic 是 source of truth**，LLM 不修改
- **Wiki 层由 LLM 维护**，LLM 负责交叉引用和一致性
- **Schema 是作业指南**，`llm-wiki-schema.md` 定义了 ingest/query/lint 的详细步骤
