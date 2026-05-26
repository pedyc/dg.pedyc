---
uid: 202605201737
title: wiki-log
aliases: [wiki-log, wiki日志]
tags: [llm-wiki, 元数据]
date-created: 2026-05-20
date-modified: 2026-05-26
status: active
content-type: [article]
up: ["[[本库指南]]"]
---

## Wiki Log

本文件是知识库的 append-only 时间线，记录所有 ingest、query、lint 操作。格式：`## [日期] 操作类型 | 标题`。

---

## 2026

### 2026-05

- [2026-05-20] update | 更新 Skills 适配新方法论
	- 创建 `llm-wiki-local` — 适配本库三层架构，引用 llm-wiki-schema.md
	- 创建 `content-evaluator-local` — 对接 lint 工作流（矛盾/孤儿/概念缺口）
	- 创建 `content-verifier-local` — 双层验证（atomic + wiki 一致性）
	- 创建 `obsidian-note-local` — 对接 aliases 前缀规则和 content-type 模板
	- 原版 skills 保留不动（全局共享）
- [2026-05-26] update | wiki-sync-local 增加主动 commit 机制
	- 修改 SKILL.md：sync 完成后主动 commit wiki-sync-state.json 和 wiki-log.md
	- 修改 llm-wiki-schema.md：明确说明状态更新后会立即 commit
	- 解决 lastCommit 窗口期不一致问题
- [2026-05-26] sync | auto | 批量变更检测
	- 检测到 5 个文件变更（不含 Inbox 和资源文件）
	- 更新的 wiki 页面：Svelte.md（去除尾随空格，补充参考标记）
	- 更新的索引：wiki-index.md、llm-wiki-schema.md
	- 上次同步点：a74391a2
	- 本次同步点：ba806ff0
- [2026-05-26] sync | create | Svelte
	- 新建 concept: [[Svelte]] — 编译时优化框架
	- 更新 wiki-index — 添加 Svelte 到前端分类和 Comparisons 分类
	- 关联 [[前端框架]] — 补充 Svelte 到框架对比表
- [2026-05-26] sync | create | Svelte 无需虚拟 DOM，编译时直接生成 DOM 操作代码
	- 新建 atomic: [[Svelte 无需虚拟 DOM，编译时直接生成 DOM 操作代码]]
	- 已由 [[Svelte]] 在 核心命题 中引用
- [2026-05-20] ingest | 批量导入所有 MOC/Area/SOP/Term/Comparison/Record 到 Wiki
	- 扫描了所有 content-type 为 moc、area、sop、term、comparison、record 的页面
	- 统计：
		- Areas：22 个（前端、AI、个人成长、政治经济等）
		- MOCs：35 个（前端工程、算法、PWA、浏览器等）
		- SOPs：44 个（开发流程、React、ThreeJS、Canvas 等）
		- Terms：60 个（前端、HTTP、TypeScript、设计模式等）
		- Comparisons：9 个（Webpack vs Vite、React 对比、状态管理等）
		- Records：4 个（俄乌冲突、美以袭击伊朗）
	- 更新了 [[wiki-index]] 全量内容
- [2026-05-20] init | 初始化 LLM Wiki 系统
	- 创建 [[llm-wiki-schema]]
	- 创建 [[wiki-index]]
	- 创建 [[wiki-log]]
- [2026-05-20] ingest | 视觉思维领域试点
	- 领域：[[A-视觉思维]]
	- 核心 concept：
		- [[双重编码理论]] — 更新了知识图谱和 FAQ
		- [[认知负荷]] — 更新了应用场景
		- [[Gestalt视觉法则]] — 从 atomic 升级为完整 concept 结构
	- 更新了 [[wiki-index]] 中的 Areas 和 Concepts 分类
- [2026-05-20] ingest | 知识管理领域纳入 Wiki
	- 领域：[[A-知识管理]]
	- 核心 concept：
		- [[知识地图]] — 领域知识的结构化视图
		- [[PARA笔记法]] — 按项目 - 领域 - 资源 - 归档分类
		- [[卡片盒笔记法]] — 原子笔记和双向链接
		- [[费曼技巧]] — 通过教学加深理解
		- [[认知负荷]] — 已有，复用
	- 核心 SOP：
		- [[SOP-CODE知识全生命周期工作流]] — Capture, Organize, Distill, Express
	- 更新了 [[wiki-index]] 中的 Areas、Concepts、SOPs 分类

---

---

## 2026-05

### 2026-05-22

- [2026-05-22] ingest | 新增 comparison「Vue vs React」
	- 位置：`40-RESOURCES/Vue vs React.md`
	- 更新 [[wiki-index]] 添加 Comparisons 条目
- [2026-05-22] ingest | 新增 question「从输入 URL 到页面展示发生了什么？」
	- 位置：`40-RESOURCES/Q-从输入URL到页面展示发生了什么.md`
	- 已收录于 [[MOC-网络协议相关问题]] 索引

### 2026-05-21

- [2026-05-21] ingest | 完善 Q-note「Vite HMR 原理与 Webpack 区别」
	- 内容：Vite HMR 基于原生 ESM 按需编译，Webpack HMR 需要重建依赖链
	- 核心区别：更新范围、编译时机、实现机制
	- 已收录于 [[MOC-Vite相关问题]] 索引
- [2026-05-21] sync | 新增 concept「荣格心理学」
	- 位置：`40-RESOURCES/荣格心理学.md`
	- 更新 [[wiki-index]] 添加 Concepts 条目
- [2026-05-21] sync | 重写 concept「存在主义」+ 新增 atomic「存在先于本质」
	- 位置：`40-RESOURCES/存在主义.md`
	- 新增 atomic：`30-ZETTELKASTEN/存在先于本质.md`
	- 更新 [[wiki-index]] 添加 Concepts 条目

---

*Log 开始于 2026-05-20*

- [2026-05-20] lint | 知识库健康检查报告
	- 检查范围：wiki-index.md 中 152 个链接
	- 发现断链 2 个（已修复）：
		- 帧动画 → T- 帧动画（文件存在，标题不同）
		- 广义货币供应量 → 广义货币供应量（Broad measure of money supply）（文件存在，标题不同）
	- 索引一致性：152/152 链接有效
	- 孤儿页面：待进一步检查（需要扫描所有页面的 inbound links）
	- 矛盾检测：未发现明显矛盾
	- 概念缺口：待检查
- [2026-05-20] update | 更新本库指南，加入 LLM Wiki 系统说明
	- 在工具链后新增 "LLM Wiki 系统 " 章节
	- 描述三层架构（atomic/wiki/archive）
	- 说明 ingest/query/lint 工作流
	- 更新 date-modified 至 2026-05-20
