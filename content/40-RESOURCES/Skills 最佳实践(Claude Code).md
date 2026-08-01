---
uid: 20250519000001
title: Skills 最佳实践(Claude Code)
description: 使用 Claude Code Skill 的规范和原则
tags: ["AI/Claude"]
date-created: 2025-05-19
date-modified: 2026-03-25
status: cultivating
content-type: concept
up: "[[Claude Code]]"
---

## 概念：Claude Code Skills 最佳实践

> 使用 Claude Code Skill 的规范和原则

**解决的核心痛点**：帮助用户创建高效、可维护的 Claude Code Skills，确保与 Claude Code 生态最佳兼容。

---

### 核心命题

- [[Skill 应保持简洁，只包含执行步骤]]
	- **原理**：详细知识应放在知识库，Skill 只负责执行
- [[Skill Frontmatter 必须包含 name、description、argument-hint、allowed-tools]]
	- **原理**：这些字段是 Claude Code 识别和执行 Skill 的关键
- [[知识应外置到知识库，而非写在 Skill 中]]
	- **原理**：避免 Skill 变得臃肿，便于维护和复用

---

### 运行机制

```mermaid
graph LR
    A[用户调用 /skill] --> B[读取 SKILL.md]
    B --> C[解析 Frontmatter]
    C --> D[执行 allowed-tools]
    D --> E[返回结果]
```

---

### 关键区别

| 维度 | Claude Code Skills | 传统编程 |
|:--- |:--- |:--- |
| **核心逻辑** | 声明式配置 + 执行步骤 | 过程式代码 |
| **复杂度** | 轻量级指南 | 完整实现 |
| **维护** | 易于修改 | 需要测试部署 |

---

### 应用场景

- ✅ **适用场景**
	- **工作流自动化**：如代码审查、构建验证
	- **知识查询**：如检索知识库、回答领域问题
	- **内容生成**：如创建笔记、生成文档
- ⛔ **误用**
	- **作为知识库**：详细文档应放在外部目录
	- **过度复杂**：复杂逻辑应使用 Agent 或普通代码

---

### 知识图谱

- **父级概念**：[[Claude Code]]
- **关联概念**：[[Obsidian]]、[[Quartz]]

---

### 参考延伸

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Quartz 项目](https://quartz.jzhao.xyz/)
