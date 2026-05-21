---
name: content-verifier-local
version: 1.0.0
description: |
  核查笔记内容质量，分层检查：模板完整 → 知识网络 → 逻辑正确 → 内容覆盖。
  触发条件：用户要求核查笔记质量、验证内容准确性、或检查笔记是否符合模板。
argument-hint: "<笔记路径> [light|full]"
allowed-tools:
  - Read
  - Grep
  - Glob
---

# content-verifier-local

分层检查体系详细定义见 `content/00-META/llm-wiki-schema.md` 第 3 节。

## 快速检查（light）

- frontmatter 必填字段
- 双向链接是否有效
- aliases 前缀是否正确

## 完整检查（full）

增加：
- 内容逻辑一致性
- 知识网络完整性
- 主题覆盖度