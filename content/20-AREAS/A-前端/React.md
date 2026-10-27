---
uid: 202505211000
title: React
aliases: [A-React, React.js, ReactJS]
description: 用于构建用户界面的 JavaScript 库，采用组件化和 Virtual DOM
tags: [前端开发/框架]
date-created: 2025-05-21
date-modified: 2026-10-27
content-type: area
up: "[[前端开发]]"
---

## Area: React

> 构建用户界面的视图库：组件化、单向数据流、Virtual DOM。

### 领域定义

- **核心范畴**：核心概念与 Hooks、渲染机制、并发模式、状态管理、生态（Router / Next.js / R3F）
- **不包括**：后端开发、移动端原生开发（React Native 属独立领域）
- **与相关领域的区别**：vs [[Vue]]——React 用 JSX 与单向数据流，Vue 用模板与双向绑定；vs [[Angular]]——React 只关注视图层，路由、表单、HTTP 都要自己配

### 里程碑

- **愿景**：深入掌握 React 生态，能独立构建中大型 React 应用
- **里程碑**：
	- [x] 阶段 1：核心概念与 Hooks
	- [x] 阶段 2：性能优化（useMemo / useCallback / React.memo）✅ 2026-04-28
	- [ ] 阶段 3：状态管理（Redux / Zustand / Jotai）
	- [ ] 阶段 4：源码与原理（Fiber / Reconciliation）
	- [ ] 阶段 5：Next.js 全栈

> 判据：阶段 4 的落点是「能讲清一次 setState 到 commit 的完整路径」，不是「读过源码」。原文的「掌握 / 深入」在勾选时没有讨论余地，等于不可验收。

### 专题导航

> 中观层：本领域是知识粒度的最小单元，没有独立 MOC，概念在此平铺。**未解析的链接不是错误，是尚未写下的洞**——排序见 [[知识缺口]]。

- **版本与题型** — [[React版本演进]] · [[React面试题]] · [[Zustand vs Redux]]
- **核心概念** — [[Hooks(React)]] · [[Refs(React)]] · [[useCallback]] · [[useMemo]] · [[React.memo]] · [[Fiber]]
- **渲染机制** — [[Virtual DOM|虚拟DOM]] · [[React重新渲染]] · [[React组件通信]] · [[Suspense]] · [[Server Components]]
- **并发模式** — [[useTransition]] · [[useDeferredValue]]
- **状态管理** — [[状态管理(React)]] · [[React Context]] · [[Zustand]] · [[Redux]]
- **路由与生态** — [[React Router]] · [[Next.js]] · [[R3F]]

### FAQ

- [[React面试题]] — 常见问题汇总
- [[JSX 是什么？如何被转换？React 渲染过程是怎样的？]]

### 执行系统

- **核心流程**
	- [[React最佳实践]] — 开发规范
	- [[React性能优化]] — 性能优化方法
	- [[使用Claude-Code开发React组件]] — 用 Claude Code 写组件的工作流
	- [[在React中实现文字故障效果]] — Glitch 文字动画
	- [[在React中实现ASCII动画]] — ASCII 动画
- **跨领域引用**
	- [[使用Claude-Code开发React组件]] 的工具侧归属 [[人工智能]]，React 侧的做法归本领域
	- [[React面试题]] 的组织方式沿用 [[前端面试真题库]] 的题集格式

### 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|---|
| 目标进展 | 🟡 | 5 个阶段勾了 2 个；状态管理与源码原理都没动 |
| 认知更新 | 🟡 | 导航 24 条里 11 条未解析；`up` 指向本领域的只有 5 篇，多数概念挂在别处 |
| 行动频率 | 🟢 | 5 条 SOP 全部建成，是框架类领域里实践沉淀最好的一支 |

### 附录：核心 API 速查

> 以下为原理层面常用 API，多见于面试。它们不属于任何一个 concept（没有需要论证的原理），也不适合放进 MOC（MOC 只索引不消化），因此留在这里。

- **创建元素**
	- `createElement()` — 手动创建 React 元素的底层方法
	- `cloneElement()` — 克隆并修改已有元素
	- `isValidElement()` — 判断是否为有效的 React 元素
- **组件基础**
	- `Component` — 类组件基类
	- `PureComponent` — 浅比较优化的类组件
	- `Fragment` — 片段组件，避免额外 DOM 节点
	- `StrictMode` — 严格模式，检测不安全的生命周期
- **渲染入口**
	- `ReactDOM.render()` — 经典入口，17 起不推荐
	- `createRoot()` — 18+ 并发模式根节点
	- `hydrateRoot()` — 服务端渲染水合
- **悬念与异步**
	- `Suspense` — 组件挂起与加载状态边界
	- `lazy()` — 代码分割与动态导入
	- `startTransition()` — 标记非紧急更新
- **上下文**
	- `createContext()` — 创建 Context 对象
	- `useContext()` — 消费 Context 值

### 领域知识图谱

```dataviewjs
// 领域页看板（逻辑在 _scripts/areaBacklinks.js）
await dv.view("_scripts/areaBacklinks")
```
