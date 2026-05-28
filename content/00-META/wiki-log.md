---
uid: 202605201737
title: wiki-log
aliases: [wiki-log, wiki日志]
tags: [llm-wiki, 元数据]
date-created: 2026-05-20
date-modified: 2026-05-28
status: active
content-type: [article]
up: ["[[本库指南]]"]
---

## Wiki Log

本文件是知识库的 append-only 时间线，记录知识加工事件。格式：`## [日期] 操作类型 | 标题`。

**应记录的操作类型**：`ingest`、`inbox-review`、`lint`、`query`
**不应记录的操作**：`sync`、`update`、`create`（系统维护）

---

## 2026

### 2026-05

#### 2026-05-28

- [2026-05-28] ingest | 消化 5 个未引用的 atomic 笔记
	- 补充到对应 concept：作用域链、浏览器核心架构、事件循环、NextJS
	- 新增 atomic 引用：变量提升、浏览器渲染引擎与 JS 引擎分工、同步异步任务协调
	- 检查了全部 56 个 atomic，确认 wiki 层引用完整
- [2026-05-28] ingest | 补充 Wiki 层内联规则
	- 新增「Wiki 层内联规则」章节到 llm-wiki-schema.md
	- 补全 SOP/term/comparison/record/question/moc/diary 的定位和内联规则
	- 新增 content-type 定位速查表
	- 定义各类型在 wiki-index 的位置和引用来源
- [2026-05-28] ingest | 创建概念「本库子系统概述」
	- 位置：40-RESOURCES/本库子系统概述.md
	- content-type：concept，aliases：C-本库子系统概述
	- 内容：记录 9 个子系统及其关联关系
	- 更新 wiki-index 添加条目
- [2026-05-28] refactor | 解耦 llm-wiki-schema 为主索引 + 5 个子文档
	- llm-wiki-schema.md 降级为索引文件（~50 行）
	- 新增 _content-type-rules.md（~150 行）
	- 新增 _ingest-rules.md（~100 行）
	- 新增 _query-rules.md（~50 行）
	- 新增 _lint-rules.md（~100 行）
	- 新增 _sync-rules.md（~80 行）
	- LLM 可按需读取子文档，而非全量 400 行
	- 补充到对应 concept：作用域链、浏览器核心架构、事件循环、NextJS
	- 新增 atomic 引用：变量提升、浏览器渲染引擎与 JS 引擎分工、同步异步任务协调
	- 检查了全部 56 个 atomic，确认 wiki 层引用完整

#### 2026-05-27

- [2026-05-27] ingest | 创建了 SOP-Babel 使用指南
	- 位置：`40-RESOURCES/SOP-Babel使用指南.md`
	- content-type：sop
	- 内容：Babel 配置与使用流程、preset/plugin 配置、常见问题排查
- [2026-05-27] ingest | 创建了 ESLint 术语笔记
	- 位置：`40-RESOURCES/ESLint.md`
	- content-type：term，aliases：T-ESLint
	- 内容：JavaScript 静态代码分析、Rules/Config/Plugins/Extends

#### 2026-05-26

- [2026-05-26] inbox-review | 移动 4 个文章到 BLOGS
	- 教你如何构建自己的依赖注入工具.md → 60-BLOGS/
	- 新兴前端框架 Svelte 从入门到原理.md → 60-BLOGS/
	- 聊聊前端模块化.md → 60-BLOGS/
	- 聊聊网页断点调试及其扩展.md → 60-BLOGS/
	- 类型判断：均为 article（有 source、author、published）
- [2026-05-26] inbox-review | 添加 Inbox Review 工作流
	- llm-wiki-local SKILL.md 新增 review 路由
	- llm-wiki-schema.md 新增 Inbox Review 章节
	- 定义 content-type 判断规则和目标目录映射
- [2026-05-26] lint | full 健康检查
	- 检查范围：30-Zettelkasten、40-RESOURCES、20-AREAS
	- **矛盾**：0 个
	- **孤儿页面**：0 个
	- **概念缺口**：0 个（知识网络完整）
	- **过时断言**：0 个
	- **索引一致性**：通过

#### 2026-05-22

- [2026-05-22] ingest | 新增 comparison「Vue vs React」
	- 位置：`40-RESOURCES/Vue vs React.md`
	- 更新 [[wiki-index]] 添加 Comparisons 条目
- [2026-05-22] ingest | 新增 question「从输入 URL 到页面展示发生了什么？」
	- 位置：`40-RESOURCES/Q-从输入URL到页面展示发生了什么.md`
	- 已收录于 [[MOC-网络协议相关问题]] 索引

#### 2026-05-21

- [2026-05-21] ingest | 完善 Q-note「Vite HMR 原理与 Webpack 区别」
	- 内容：Vite HMR 基于原生 ESM 按需编译，Webpack HMR 需要重建依赖链
	- 核心区别：更新范围、编译时机、实现机制
	- 已收录于 [[MOC-Vite相关问题]] 索引
- [2026-05-21] ingest | 新增 concept「荣格心理学」
	- 位置：`40-RESOURCES/荣格心理学.md`
	- 更新 [[wiki-index]] 添加 Concepts 条目
- [2026-05-21] ingest | 重写 concept「存在主义」+ 新增 atomic「存在先于本质」
	- 位置：`40-RESOURCES/存在主义.md`
	- 新增 atomic：`30-ZETTELKASTEN/存在先于本质.md`
	- 更新 [[wiki-index]] 添加 Concepts 条目

#### 2026-05-20

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
- [2026-05-20] init | 初始化 LLM Wiki 系统
	- 创建 [[llm-wiki-schema]]
	- 创建 [[wiki-index]]
	- 创建 [[wiki-log]]

*Log 开始于 2026-05-20*
