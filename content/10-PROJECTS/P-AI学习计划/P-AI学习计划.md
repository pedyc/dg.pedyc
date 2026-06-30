---
uid: "202605160001"
title: P-AI学习计划
aliases: [P-AI学习计划]
description: 前端工程师掌握 AI 能力的系统学习路径：提示词工程、Harness 工程、LLM 集成
date-created: 2026-05-16
date-modified: 2026-06-30
status: fleeting
area: ["[[人工智能|A-人工智能]]"]
consequence: 5
content-type: project
expire: 2026/12/31
urgency: 5
---

## 背景

作为前端开发工程师，目标不是转行 AI 研究员，而是掌握能落地到前端工作中的 AI 工程能力。核心方向：提示词工程、Harness 工程、LLM 集成、AI Agent 开发。

> **定位**：不做调参侠，做最懂 AI 工程化的前端。

---

## 核心目标

- [ ] 独立开发生产级 AI 前端功能（AI 搜索/对话/RAG 应用）
- [ ] 掌握 Harness 工程方法论，能构建可靠的 AI Agent 应用
- [ ] 将 AI 能力整合到日常工作流（代码生成、测试、审查）
- **成功标准**：交付 2 个以上可用 AI 应用 / 工具，且团队开始复用你的 AI 方案

---

## 执行计划（对应 KR）

### 阶段一：LLM 基础与提示词工程（现在 ~ 2026/07/31）

*对应 KR1：掌握 LLM 基础 + Prompt Engineering*

- [ ] [[LLM]] 工作原理（2 天）
	- 理解 Token、上下文窗口、温度、Top-P 等核心参数
	- 了解 [[Transformer基本架构]]（不需要数学推导）
- [ ] 提示词工程系统学习（2 周）
	- 结构化提示词：角色/任务/格式/约束/示例
	- 进阶技巧：思维链、Few-shot、思维树
	- 阅读 [[提示词工程]]
- [ ] LLM API 实践（1 周）
	- OpenAI / Anthropic API：Chat Completions、Streaming
	- Function Calling / Tool Use
	- Token 计算与成本优化
- [ ] 输出：整理自己的 Prompt 模板库 + SOP

### 阶段二：Harness 工程与 Agent 开发（2026/08/01 ~ 2026/09/30）

*对应 KR2：掌握 Harness 工程 + AI Agent*

- [ ] Harness 工程系统学习（2 周）
	- 阅读 [[Harness]]、[[Agent]]、[[LLM]]
	- 理解 Agent 循环：感知 → 推理 → 行动 → 观察
	- Tool Use / Function Calling 工程实现
	- Guardrails 与输出验证
- [ ] 主流框架实践（3 周）
	- LangChain / LangGraph：Chain、Agent、Tool
	- MCP（Model Context Protocol）理解与接入
	- Vercel AI SDK：前端 AI 集成的标准方案
- [ ] 输出：搭建 Agent 脚手架模板 + Harness 实践总结

### 阶段三：RAG 与知识检索（2026/10/01 ~ 2026/10/31）

*对应 KR3：掌握 RAG 工程*

- [ ] 向量数据库与 Embedding（1 周）
	- Embedding 模型选择（text-embedding-3-small, etc.）
	- Vector DB 实践（Chroma / pgvector / Milvus）
	- 相似度搜索与混合检索
- [ ] RAG 工程实践（2 周）
	- Chunking 策略 + 文档解析
	- 检索增强生成全链路
	- RAG 评估：命中率、忠实度、幻觉检测
- [ ] 输出：RAG 知识库问答 Demo

### 阶段四：前端 AI 特性实战（2026/11/01 ~ 2026/12/31）

*对应 KR4：交付生产级 AI 前端功能*

- [ ] AI 前端交互模式（2 周）
	- 流式渲染（Streaming UI）：SSE / WebSocket
	- Chat UI 架构：消息管理、状态持久化、中断恢复
	- AI 搜索结果展示（引用标注、置信度、来源）
- [ ] AI 工具链整合（2 周）
	- Claude Code / Cursor 高阶使用
	- AI 驱动测试生成与代码审查
	- 个人 AI 工作流搭建
- [ ] 综合项目（4 周）
	- 选择其一：AI 编程助手 / AI Chat 应用 / RAG 知识库
	- 从前端到后端的全栈 AI 应用
	- 部署与监控

---

## 资源

- **课程**：DeepLearning.AI《Building Systems with ChatGPT》、《LangChain for LLM App Development》、吴恩达《提示词工程》
- **文档**：Anthropic API Docs、OpenAI API Docs、Vercel AI SDK Docs、LangChain Docs
- **书籍**：《提示工程指南》、《LLM 应用开发实战》
- **工具**：Claude Code、Cursor、OpenAI API、LangChain、Chroma、Vercel AI SDK

---

## 关联领域

- [[A-人工智能]]
- [[A-前端]]
- [[Harness]]
- [[提示词工程]]
- [[Agent]]

---

## 交付物

- ⼝ Prompt 模板库（SOP）
- ⼝ Agent 脚手架模板（Harness 实践）
- ⼝ RAG 知识库 Demo
- ⼝ 生产级 AI 前端应用 x1
- ⼝ AI 工作流 SOP（代码生成 / 审查 / 测试）

---

## 复盘

**突破进展**：
**关键障碍**：
**策略调整**：
