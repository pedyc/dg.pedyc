---
uid: '202609081206'
title: AI工具与提效生态地图
aliases:
  - MOC-AI工具与提效生态地图
  - MOC-AI效能地图
  - MOC-AI工程生态
description: "聚合 AI 生产力工具、提示词工程、MCP 协议、流式框架与 Agent 实践的综合索引地图"
tags:
  - 人工智能
  - AI工具
  - 提示词工程
  - MCP协议
  - Agent
  - MOC
date-created: 2026-09-08
date-modified: 2026-09-08
status: cultivating
content-type: moc
up: "[[人工智能|AI]]"
---

## MOC：AI 工具与提效生态地图

收录面向日常研发、Agent 协作与系统级集成的 AI 核心基础设施与高频资源，作为技术选型、上下文规约与效能落地的导航中枢[cite: 1, 2]。

---

### AI 研发工具与 Agent 客户端

* [[Claude Code]] — 命令行端自主 Agent 编程与系统级自动化协作工具
* [[Cursor]] — 基于 VS Code 内核深度集成的 AI 原生 IDE 与上下文补全环境
* [[Windsurf]] — 具备多文件协同感知与自动流程推演的 Agent 级编辑器
* [[v0]] — 基于自然语言生成高保真现代前端组件与页面的生成式 UI 工具

### 提示词工程与上下文规约（Prompt & Context）

* [[System Prompt 结构化设计范式]] — 基于角色定义、输入约束与边界防线的系统提示词构建方法
* [[Few-Shot 样本引导技巧]] — 通过少样本注入提高大模型输出格式确定性与逻辑一致性
* [[.cursorrules 与团队工程上下文规范]] — 规范 AI 遵循特定代码风格与架构模式的本地规约配置
* [[防御性提示词与防越狱机制]] — 抵御直接注入与非安全指令引导的设计原则

### MCP 协议与工具扩展（Model Context Protocol）

* [[MCP 协议原理与架构]] — Anthropic 推出的统一模型与本地/远端上下文数据连接标准[cite: 4]
* [[常用 MCP Server 集合]] — 覆盖本地文件系统（Filesystem）、GitHub、PostgreSQL/SQLite 的官方实现
* [[MCP 自定义工具开发流程]] — 基于 JSON-RPC 与 TS/Python SDK 封装业务工具调用规范

### 开发框架与全栈同构 SDK

* [[Vercel AI SDK]] — 专为 React/Next.js 设计的统一流式协议、Tool Calling 与 UI 水合工具包
* [[FastAPI]] — 支持高并发长流式 SSE 推送与原生 Pydantic 校验的异步后端框架
* [[LangGraph]] — 面向循环图、多 Agent 自主协作与状态持久化的 Python/TS 编排引擎
* [[LlamaIndex]] — 数据接入、解析分块与多模态 RAG 检索增强架构框架

### 端侧算力与轻量推理

* [[ONNX Runtime Web]] — 跨平台高效端侧模型推理引擎，支持 CPU 与 WebGL/WebGPU 硬件加速
* [[Transformers.js]] — 纯浏览器端运行 Hugging Face 模型的轻量化方案
* [[WebLLM]] — 基于 WebAssembly 与 WebGPU 驱动的浏览器纯离线大模型运行运行时

---

### 关联 SOP 与问题探索

* **SOP（已收敛标准流程）**：
	* [[SOP-构建高性能LLM流式打字机与增量渲染组件]] — 解决前端高频流式 chunk 掉帧与卡顿的标准流程
	* [[SOP-搭建基于Nextjs与FastAPI的流式AI全栈脚手架]] — 前后端异构分层的脚手架搭建规范
* **Question（待探索问题）**：
	* [[Q-大模型流式输出前端如何做到流畅防卡顿]] — 针对长文本与高频 SSE 的多维度优化策略
	* [[Q-AI全栈项目如何科学选型前后端框架]] — 全栈 TS vs 异构分层架构的选型决策矩阵

---

### 待探索

* [ ] 调研 MCP 协议在多客户端（Claude Desktop、Cursor 等）之间的鉴权与上下文共享机制
* [ ] 探索基于 WebGPU 的端侧模型在离线数据脱敏与首屏交互预判中的实际落地边界
* [ ] 评估生成式 UI（Generative UI / Dynamic Tool Invocation）在企业中后台动态表单中的可用性
