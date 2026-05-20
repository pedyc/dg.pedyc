---
uid: 202605201737
title: wiki-log
aliases: [wiki-log, wiki日志]
tags: [llm-wiki, 元数据]
date-created: 2026-05-20
date-modified: 2026-05-20
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

*Log 开始于 2026-05-20*
