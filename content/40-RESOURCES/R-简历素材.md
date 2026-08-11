---
uid: 202608062305
title: R-简历素材
aliases: [R-简历素材]
description: 前端岗位简历信息素材：个人定位、技能清单、项目经历、AI 能力、技术写作
tags: [求职, 简历]
date-created: 2026-08-06
date-modified: 2026-08-11
status: cultivating
content-type: record
up: "[[求职]]"
---

> 基于知识库沉淀的前端岗位简历信息素材。核心差异化：AI 工程化能力——不只使用 AI，还能设计、封装、落地 AI 工作流。

收敛：[[我的简历]]

## 个人基本信息（脱敏）

- 完整个人信息（姓名 / 电话 / 邮箱 / 城市 / GitHub）见 [[我的简历]]（`80-PRIVATE/`，不发布）
- 博客：dg.pedyc.site

## 求职意向与个人定位

- **目标岗位**：前端开发工程师
- **定位**：「不做调参侠，做最懂 AI 工程化的前端」——既能独立负责前端项目，又能将 LLM/Agent 能力落地到产品与研发流程
- **愿景**：成为能够独立负责中大型前端项目的高级工程师 / AI-first 开发者

## 核心亮点

- 自研 AI 驱动的知识管理系统（llm-wiki）：6 个 Claude Code Skill，覆盖笔记创建、同步、健康评估、质量核查全链路，一键完成「创建 → 挂载 → 同步 → 评估 → 核查」
- 深度使用 AI 辅助开发：Claude Code 驱动编码、代码审查、测试生成、文档撰写；有清晰的「AI 时代前端竞争力」方法论
- 独立完成静态站点框架（Quartz v4）二次开发与部署上线，中文本地化 + 主题定制
- 累计内容输出 39 篇（技术写作 28+ 篇），覆盖 Vue 源码、TypeScript、ES 新特性、Svelte 与 AI 工程化
- 从零构建 PARA + Zettelkasten 个人知识库（970+ 笔记），沉淀可复制的方法论与自动化工作流

## 技能清单

### 前端核心

| 技能 | 熟练度 | 说明 |
|---|---|---|
| JavaScript | ★★★★☆ | 事件循环、原型链、闭包；手写防抖节流 / Promise.all / call-apply-bind / 深拷贝 |
| Vue / Vue3 | ★★★★☆ | 响应式原理（Proxy）、虚拟 DOM、Hooks、Pinia；产出源码解析博客 |
| Angular | ★★★★☆ | 技能矩阵自评；RxJS 学习中 |
| TypeScript | ★★☆☆☆ | 泛型与工具类型提升中（自评依据 [[技能矩阵]]） |
| React | ★★☆☆☆ | Hooks 原理、Concurrent Mode 理解中 |
| HTML / CSS | ★★★★☆ | 语义化、A11Y、BFC、布局 |

### 前端工程化

- Webpack / Vite 构建原理（HMR、Tree Shaking、代码分割）；ESM vs CommonJS
- GitHub Actions、Jest 单元测试、Docker 容器化
- 浏览器渲染流水线、Web 核心指标（LCP/FID/CLS）、性能定位工具
- HTTP/1.1~3、HTTPS、WebSocket；浏览器多进程与安全机制

### 后端（加分项，学习中）

- 方向：Node.js、Express/NestJS、MySQL、Redis、RESTful API、JWT、Docker
- 目标：具备独立开发轻量级后端服务能力（学习规划中，见 [[P-后端能力提升专项]]）

### AI 相关技能（核心差异化）

- LLM 原理：Token、上下文窗口、温度、Top-P、Transformer 基本架构（应用层理解）
- 提示词工程：结构化提示词、思维链、Few-shot、可复用 Prompt 模板库 ✅ 已落地（llm-wiki）
- Agent / Harness 工程：Agent 循环、Tool Use / Function Calling ✅ 已落地（llm-wiki）；Guardrails / 输出验证 🔄 学习中
- RAG：Embedding、向量检索（Chroma/pgvector）、Chunking、RAG 评估 🔄 规划中（2026Q4，见 [[P-AI学习计划]]）
- MCP 协议理解与接入 🔄 学习中
- AI 产品形态：流式渲染（SSE/WebSocket）、Chat UI 架构、AI 结果展示、AI 驱动测试与审查

## 项目经历

### llm-wiki — AI 驱动的知识管理系统 ⭐

- **技术栈**：Claude Code / Agent / 提示词工程 / Markdown
- 设计三层架构（创建层 / 元数据层 / 内容层），职责互不重叠
- 开发 6 个 Claude Skill：obsidian-note-local（一键创建笔记全流程）、wiki-sync-local（索引/日志/状态同步）、content-evaluator-local（健康度 lint）、content-verifier-local（质量核查）、llm-wiki-local（ingest/query/lint/graph）、action-suggest（行动建议）
- 实现「创建笔记 → 挂载父页面 → 同步 wiki-index/log → 评估健康度 → 核查质量」自动化链路
- 修复 126 个孤儿笔记，双向链接全面接入父级

### 个人数字花园 — Quartz v4 二次开发与部署

- **技术栈**：TypeScript / Preact / SCSS / esbuild / Quartz v4
- Fork Quartz v4 并二次开发：全站中文本地化（zh-CN）、LXGW WenKai 字体、自定义双主题
- 启用 SPA 路由、双向链接、Popover、Mermaid、LaTeX(katex)、代码高亮、FlexSearch 搜索
- 生产部署：dg.pedyc.site，4120+ 次 git 提交持续演进

### 个人知识库体系 — PARA + Zettelkasten

- **技术栈**：Obsidian / Markdown / 元数据规范
- 970+ 篇笔记三层架构（Raw → Wiki → Archive）
- content-type 分类、前缀命名规范（P-/A-/Q-/MOC-）、status 生命周期
- wiki-index / wiki-log / sync-state 自动化索引，与 git 联动

### NexLattice / 信息分片引擎（探索中）

- 个人开源方向探索：整合多种笔记工作流，按方法论生成符合规范的笔记结构
- 状态待确认：如有可用版本/Demo 再上简历

## 技术写作与内容输出

累计内容输出 39 篇（技术写作 28+ 篇 + 随笔）。

- **Vue/框架**：《Vue源码解析-基础篇》《Vue组合式API解析》《新兴前端框架 Svelte 从入门到原理》《教你如何构建自己的依赖注入工具》
- **JavaScript/TS**：《JavaScript模块化系统解析》《JS中的继承方式》《TypeScript装饰器解析》《前端开发中的位运算技巧》《What's new in ECMAScript 2025/2026》
- **算法**：《前端需要掌握的算法》《前端需要掌握的数据结构》
- **AI 方向**：《前端开发者应知的AI概念》《Claude Code 使用指南》《Claude Code 进阶使用》
- **趣味系列**：《前端有趣问题01-06》

## 工作经历

- **北京易诚互动网络技术有限公司** — 前端开发工程师（2019 ~ 2020）【岗位与业绩待补充】
- **北京中软国际股份有限公司** — 前端开发工程师（2021 ~ 2023）【岗位与业绩待补充】

## 待补充信息（知识库缺失）

- [x] 联系方式（电话 / 邮箱 / 城市 / GitHub）✅ 2026-08-06（存放于 [[我的简历]] 私密层）
- [x] 工作经历（公司 / 时间）✅ 2026-08-06
- [ ] 工作经历具体业绩 / 负责项目 / 岗位名称
- [ ] 教育背景（学校 / 专业 / 学历 / 时间）
- [ ] 到岗时间
- [ ] Cocos/Pixi 游戏项目证据（模拟面试中出现，需确认真实性）
- [ ] 在线作品链接（博客域名已确认 dg.pedyc.site；GitHub 待补充作品集仓库）

## 引申

### 面试话术：AI 时代如何保持竞争力

> 「AI 是强大的副驾驶，但驾驶员仍然是我。第一，理解底层原理——当 AI 生成的代码出现性能问题或内存泄漏时，我能基于对事件循环、渲染机制的理解快速定位并修复。第二，系统架构能力——AI 可以写函数，但写不出整个应用的状态管理方案和数据流向设计。第三，业务洞察与取舍——AI 不懂业务优先级。我把 AI 当作一个需要我指挥的超级实习生——我负责思考，它负责执行。」

### 关联笔记

- [[求职]] — 父级领域
- [[技能矩阵]] — 技能盘点来源
- [[腾讯音乐前端岗位模拟面试]] — 面试实战演练
- [[个人品牌构建概述]] — 简历之外的持续输出与影响力
