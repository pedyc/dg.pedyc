---
uid: "202604201200"
title: Angular
aliases: [A-Angular]
description: Angular 是 Google 维护的 TypeScript 优先企业级前端框架，提供完整的前端解决方案
tags: [angular, 前端开发/框架]
date-created: 2026-04-20
date-modified: 2026-10-26
content-type: area
up: "[[前端开发]]"
---

## Area: Angular

> Google 维护的 TypeScript 优先企业级前端框架，自带路由、表单、HTTP 与依赖注入。

### 领域定义

- **核心范畴**：TypeScript 优先的企业级应用开发、完整应用架构（模块化 / 依赖注入 / 路由 / 表单 / HTTP）、响应式编程（RxJS）、跨平台（Web / 移动 / 桌面）
- **不包括**：原生 JavaScript / TypeScript 基础（属 [[JavaScript]] / [[TypeScript]]）、UI 组件库本身（属 [[Angular Material]]）、后端开发
- **与相关领域的区别**：vs [[React]]——Angular 是完整框架（内置路由、表单、HTTP），React 是视图库需自行搭配；vs [[Vue]]——Angular 强制 TypeScript 与装饰器语法，Vue 更灵活；vs [[Svelte]]——两者编译期都复杂，但 Svelte 是零运行时

### 里程碑

- **愿景**：深入掌握 Angular 企业级开发，能独立构建高性能、可维护的大型 Angular 应用
- **里程碑**：
	- [x] 阶段 1：核心概念（组件 / 服务 / 模块 / 依赖注入）✅ 2026-06-16
	- [ ] 阶段 2：响应式与状态——RxJS、变更检测、NgRx
	- [ ] 阶段 3：应用骨架——路由与守卫、懒加载、表单、Http
	- [ ] 阶段 4：交付质量——性能优化（OnPush / 虚拟滚动）、测试、PWA 与 SSR、部署

> 判据：每阶段以「能不能不看文档搭出来」验收，不以「学过」验收。原文把 8 个学习阶段平铺成 8 个勾选框，勾选框本身变成了任务清单；合并成 4 个阶段后，`任务总览` 里本领域从 8 条降到 4 条，阶段内部的具体主题在下方「专题导航」里逐条列着。

### 专题导航

> 中观层：本领域是知识粒度的最小单元，没有独立 MOC，概念在此平铺。**未解析的链接不是错误，是尚未写下的洞**——排序见 [[知识缺口]]。

- **版本与选型** — [[Angular版本演进]] · [[Angular vs React]] · [[Svelte]]
- **核心概念** — [[Signal(Angular)|Angular Signal]] · [[Angular依赖注入]] · [[Angular变更检测]] · [[Zoneless变更检测]] · [[Angular Component]] · [[Angular Module]] · [[Angular Service]]
- **路由与表单** — [[Angular路由]] · [[Angular路由动画]] · [[Angular表单]] · [[表单验证]]
- **HTTP 与状态** — [[Angular Http]] · [[Angular状态管理]] · [[RxJS]] · [[Angular RxJS模式]] · [[NgRx]] · [[NgRx ComponentStore]]
- **性能与工程化** — [[Angular性能优化]] · [[Angular测试]] · [[Angular CLI]] · [[Angular CDK]] · [[Nx]] · [[Augury]]
- **生态** — [[Angular Material]] · [[PrimeNG]] · [[NG-ZORRO]] · [[Angular Fire]] · [[Angular Universal]] · [[Angular PWA]] · [[Angular动画]]

> 导航 34 条，其中 25 条未解析。本领域是全库「洞」最密的地方——一个用了两年的框架，概念层几乎是空的。

### FAQ

> 本领域没有单篇 question 笔记。题都在 [[Angular面试题]] 里。

### 执行系统

- **核心流程**（7 条全部未写）
	- [[SOP-Angular项目创建]] — 用 CLI 起项目
	- [[SOP-Angular组件开发]] — 组件、传参、事件
	- [[SOP-Angular服务开发]] — 服务、依赖注入、HTTP
	- [[SOP-Angular路由配置]] — 路由、懒加载、守卫
	- [[SOP-Angular表单开发]] — 响应式与模板驱动
	- [[SOP-Angular测试]] — 单元测试与服务测试
	- [[SOP-Angular部署]] — 构建优化与部署
- **跨领域引用**
	- [[Angular vs React]] — 对比内容的判断标准归属 [[前端框架]]

### 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|---|
| 目标进展 | 🟡 | 4 个阶段勾了 1 个（核心概念），响应式、骨架、交付质量全空 |
| 认知更新 | 🔴 | 概念层 30 个洞里只填了 5 个；`up` 指向本领域的只有 4 篇，其中 1 篇是路线图 |
| 行动频率 | 🔴 | 7 条 SOP 一条都没写——说明这个框架在用、但没沉淀成可复用的流程 |

### 领域知识图谱

```dataviewjs
// 领域页看板（逻辑在 _scripts/areaBacklinks.js）
await dv.view("_scripts/areaBacklinks")
```
