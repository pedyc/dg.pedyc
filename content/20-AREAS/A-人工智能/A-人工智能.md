---
uid: 202603121028
title: A-人工智能
aliases: [A-人工智能]
description: 人工智能领域知识索引
tags: [area]
date-created: 2026-03-01
date-modified: 2026-03-12
status: cultivating
content-type: area
related: ["[[MOC-Agent]]", "[[A-前端开发]]", "[[A-常用工具]]"]
---

## 🗺️ 人工智能领域

**子领域**
- [[MOC-Agent]]

**相关项目**

```dataview
TABLE
  file.link as "项目",
  status,
  expire,
  date(expire) - date(today) as "剩余天数"
FROM "10-PROJECTS"
WHERE
  contains(area, this.file.link) AND
  status != "completed"
SORT
  choice(date(expire) < date(today), 0, 1) ASC,
  expire ASC
```

### 🎯 核心定义 (Scope & Definition)

> [!abstract]
> 本领域旨在系统性地理解和梳理人工智能技术，特别是大语言模型（LLM）与智能体（Agent）生态的核心原理、交互协议及工程化实践，并将其转化为实际开发与工作流中的生产力。

### 🧠 核心心智模型 (Atomic Principles)

- **理论基石**
	- [[LLM 基础工作原理]]
		- **洞见**：理解大语言模型如何通过预测下一个词来生成文本，是掌握其能力边界和局限性的基础。
	- [[Prompt Engineering (提示词工程) 是引导模型输出的关键]]
		- **洞见**：精心设计的提示词可以显著提升模型输出的质量和相关性，是高效利用 AI 的核心技能。
	- [[RAG (检索增强生成) 通过外部知识增强模型回答]]
		- **洞见**：将模型生成能力与外部知识库检索相结合，可以有效解决模型幻觉和知识过时问题。
- **思维模型**
	- [[AI Agent (智能体) 是具备感知、规划、行动能力的自主系统]]
		- **洞见**：智能体通过工具调用和任务分解，将大语言模型的能力扩展至复杂、多步骤的现实世界任务。
	- [[MCP (Model Context Protocol) 标准化了AI与本地资源的交互]]
		- **洞见**：统一的协议使得 AI 助手能够安全、一致地访问文件系统、数据库等本地资源，是构建本地化 AI 工作流的关键。

### 🛠️ 执行系统 (Actionable Workflows)

- **SOP (标准流程)**
	- [[SOP-配置基于 WSL 的本地 MCP Server]]：解决在 Windows 环境下安全、便捷地搭建 AI 本地上下文服务的问题。
	- [[SOP-在 Neovim 中集成并代理 AI 代码助手]]：解决在开发环境中无缝调用 AI 辅助编程的问题。
- **关键工具**
	- [[Claude Code]]: 运行在命令行的大模型工具
	- [[OpenClaw]]: 支持多款即时通讯软件的 AI 助手
	- [[Tool-MCP (Model Context Protocol)]]：实现 AI 与本地资源安全交互的核心协议与工具集。

### 🔗 知识网络 (Context)

- **上游学科**：[[机器学习]] (提供算法与模型的理论支撑)
- **协同领域**：[[A-前端开发]] (协同点：探索 AI 在 WebGL、Canvas 交互等前端场景中的应用)
- **对立/竞争概念**：[[传统规则引擎]] (冲突点：基于符号逻辑的确定性与基于概率的生成式 AI 的灵活性)

### 🧪 探索前沿 (The Frontier)

- [[Q-AI 如何辅助 WebGL / Three.js 渲染逻辑生成？]]
- [[Q-如何在 Canvas 交互中实现 AI 意图识别？]]

### 🎯 长期目标

- **目标 1**：建立完整的 AI 开发工具链和工作流，实现日常开发的 AI 辅助
- **目标 2**：深入理解 LLM 原理和提示词工程，提升 AI 使用效率
- **目标 3**：构建本地化的 AI 助手，结合私有知识库实现安全可控的 AI 应用

### 📊 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|:---|
| 项目进度 | 🟡 | 有相关项目进行中 |
| 知识更新 | 🟢 | 持续学习 AI 新技术 |
| 行动频率 | 🟢 | 日常使用 AI 辅助开发 |

### 📈 复盘记录

- **版本**：v1.0
- **待迭代**：
	- 补充 MCP 相关工具的详细配置
	- 完善 Agent 实践案例
