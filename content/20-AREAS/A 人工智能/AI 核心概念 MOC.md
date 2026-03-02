---
title: AI 核心概念 MOC
date-created: 2026-03-01
date-modified: 2026-03-01
---

## 🧠 AI 核心概念 MOC

> 这里的核心目标是：理解和梳理 AI 技术，并将其转化为实际开发与工作流中的生产力。

### 1. 🧭 核心索引 (按概念层级分类)

#### 基础与大语言模型 (LLM)

* [[LLM 基础工作原理]]
* [[Prompt Engineering (提示词工程)]]
* [[RAG (检索增强生成)]]

#### 智能体生态 (Agent Ecosystem)

* [[AI Agent (智能体)]] - 核心枢纽，具备感知、规划、行动能力。
* [[AI Skills (技能)]] - Agent 与外部世界交互的能力封装。
* [[Tool Use / Function Calling]] - 大模型调用工具的底层机制。

#### 通信与上下文 (Context & Protocol)

* [[MCP (Model Context Protocol)]] - 标准化 AI 与本地资源交互的协议。

### 2. 🛠️ 前端与工程化结合点 (交叉领域)

*记录 AI 如何与现有技术栈结合的卡片*
* [[AI 辅助 WebGL / Three.js 渲染逻辑生成]]
* [[Canvas 交互中的 AI 意图识别]]

### 3. 🎯 相关的 Projects (当前实践)

* [[P-配置基于 WSL 的本地 MCP Server]]
* [[P-在 Neovim 中集成并代理 AI 代码助手]]

### 4. 📥 收件箱与待处理资源

*利用 Dataview 插件自动汇总尚未整理的 AI 相关简悦剪藏*

```dataview
LIST file.cday 
FROM "40-RESOURCES/SimpRead"
WHERE contains(tags, "AI") OR contains(tags, "Agent")
SORT file.cday DESC
LIMIT 5
```
