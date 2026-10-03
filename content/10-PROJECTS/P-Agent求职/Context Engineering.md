---
title: Context Engineering
aliases:
  - 上下文工程
  - C-Context Engineering
date-created: 2026-10-02
date-modified: 2026-10-03
up: ["[[Agent]]"]
---

## 什么是 Context Engineering

> Context Engineering 是围绕 LLM 当前推理需求，对 Context 进行选择、组织、压缩、更新和注入的工程。

对于Agent来说，LLM每轮推理时看到的输入，通常可能包含：
![[#Context Components ：上下文组成与构建流程]]

### 关键区别

| 概念              | 作用               |
| --------------- | ---------------- |
| **Context**     | LLM 当前这一轮能够看到的信息 |
| **Memory**      | 跨时间保存的信息         |
| **Environment** | Agent 实际工作的外部世界  |

Agent与普通Chatbot的核心区别在于：

- Agent需要**多轮自主决策**
- 每轮决策依赖**历史行为、环境状态、工具返回结果**
- LLM的上下文窗口有限，**不能无脑塞入所有信息**

因此，Context Engineering的本质是：**在有限窗口内，动态选择、组织、压缩、格式化信息，让LLM在每一步都拿到"恰到好处"的上下文。**

### 质量指标

![[#Context Quality ：上下文质量]]
据此可以[[构建高质量上下文]]

## 为什么需要 Context Engineering

LLM本身并不清楚整个项目的真实状态

例如用户说：

> "修复登录页面的 Bug。"

LLM并不知道：

```bash
项目是什么？
↓
登录页面在哪里？
↓
相关代码是什么？
↓
Bug 是什么？
↓
项目使用 React 还是 Vue？
↓
有哪些约束？
↓
之前做了什么？
↓
测试结果是什么？
```

因此Runtime Agent需要不断收集信息：

```bash
User Request
     ↓
Context
     ↓
LLM
     ↓
ToolCall
     ↓
Runtime 执行
     ↓
ToolResult
     ↓
更新 Context
     ↓
LLM
     ↓
…
```

## 核心概念

### [[上下文窗口|Context Window]]：上下文窗口

- LLM单次推理能接受的最大token数
- 是Context Engineering的**硬约束**
- 需要区分：系统提示、对话历史、工具输出、检索内容、当前任务描述等各占多少

### [[Context Components]]：上下文组成与构建流程

一个Agent的上下文通常包含以下几类：

| 类型                   | 说明          | 示例            |
| -------------------- | ----------- | ------------- |
| System Prompt        | 角色、规则、约束    | "你是一个谨慎的研究助手" |
| Task/Goal            | 当前任务描述      | "帮我查一下XX并总结"  |
| Memory               | 长期/短期记忆     | 用户偏好、历史结论     |
| Conversation History | 多轮对话        | 之前的问答         |
| Tool Definitions     | 可用工具及schema | 搜索、计算器、代码执行   |
| Tool Results         | 工具返回结果      | API返回的JSON    |
| Retrieved Knowledge  | RAG检索内容     | 文档片段          |
| Scratchpad/Reasoning | 中间推理过程      | CoT、ReAct轨迹   |
| State                | 环境/任务状态     | 当前步骤、已完成子任务   |

### [[Context Selection]]：上下文选择

- **不是所有信息都该放进上下文**
- 需要根据当前子任务，选择最相关的信息
- 常见策略：相关性过滤、时间衰减、重要性评分、去重

### [[Context Compression]]：上下文压缩

当信息量超过窗口时：

- **摘要压缩**：把长历史总结成短摘要
- **结构化压缩**：把对话转为状态表/JSON
- **选择性丢弃**：保留关键决策点，丢弃冗余
- **递归摘要**：分层总结（如MemGPT思路）

### [[Context Ordering & Formatting]]：顺序与格式

- LLM对**位置敏感**（Lost in the Middle现象）
- 关键信息应放在**开头或结尾** #why
- 格式要清晰：用XML标签、Markdown、JSON schema等
- 不同模型对格式敏感度不同（如Claude偏好XML标签）

### [[Context Isolation]]：上下文隔离

- 不同子Agent/子任务使用**独立上下文**
- 避免污染：工具返回的原始数据不应直接进入主上下文
- 常见做法：Sub-agent只返回摘要给主Agent

### [[Dynamic Context]]：动态注入

- 不预先塞入所有信息，而是**在需要时动态注入**
- 例如：Agent决定调用某工具后，才把工具schema放入上下文
- 与"静态prompt"相对，更接近真实Agent工作方式

### [[Memory Management]]：记忆管理

- **短期记忆**：当前会话的对话历史
- **长期记忆**：跨会话的用户偏好、知识
- **工作记忆**：当前任务的中间状态
- 核心问题：何时写入、何时读取、何时遗忘

### [[Context Rot]]：上下文腐化

- 随着轮次增加，上下文被无关信息污染
- 导致LLM注意力分散、幻觉增加
- 解决：定期清理、摘要、重启上下文

### [[Token Budgeting]]：Token预算

- 为每类上下文分配token配额
- 例如：System 10%、Memory 20%、Tools 30%、History 40%
- 超预算时触发压缩或丢弃策略

### [[Context Quality]]：上下文质量

可以把上下文质量指标抽象为：

```bash
Context Quality = 
Relevant Information + 
Sufficient Information - 
Irrelevant Information
```

## FAQ

## SOP

- [[构建高质量上下文]]
