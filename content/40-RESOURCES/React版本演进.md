---
uid: 202604141000
title: React版本演进
aliases: [R-React版本演进]
description: React 不同版本之间的核心差异与演进路线
tags: [前端开发/框架/React]
date-created: 2026-04-14
date-modified: 2026-04-14
status: cultivating
content-type: roadmap
related: "[[React]]"
---

## React 版本演进

> React 通过版本迭代逐步解决前端开发的核心痛点：从 Virtual DOM 优化到 Fiber 协调引擎，再到 Concurrent Mode 并发渲染。

**时间跨度**：React 15 (2016) → React 18 (2022) → React 19 (2024) → React 19.1 (2025)
**演进动力**：解决大型应用性能瓶颈、提升用户体验和开发体验

---

### 演进概览

![[React版本演进.excalidraw.svg]]
%%[[React版本演进.excalidraw.md|🖋 Edit in Excalidraw]]%%

---

### 阶段详情

#### React 15

- **时间**：2016 年 4 月
- **核心变化**：Virtual DOM + Stack Reconciler
- **解决的关键问题**：通过虚拟 DOM 减少直接 DOM 操作，提升开发体验
- **重要特性**：
	- **createClass**：使用 `React.createClass()` 方法创建组件类
	- **PropTypes**：组件 props 类型校验机制
	- **shouldComponentUpdate**：手动控制组件渲染，优化性能
	- **findDOMNode**：获取组件底层 DOM 节点（后续版本已废弃）
	- **render 支持 Null**：函数组件可返回 null
	- **Comment Nodes**：渲染 null 时使用注释节点替代空 div
- **相关概念**：[[虚拟DOM(React)]]

#### React 16

- **时间**：2017 年 9 月
- **核心变化**：Fiber Reconciler + 错误边界
- **解决的关键问题**：将协调过程拆分为可中断的单元，支持时间切片和优先级调度
- **重要特性**：
	- **Fiber 架构**：重写协调引擎，支持可中断渲染
	- **Fragment**：`<>…</>` 分组元素，避免多余 DOM 节点
	- **Portal**：`ReactDOM.createPortal()` 渲染到任意 DOM 节点
	- **错误边界**：捕获子组件渲染错误，防止整树崩溃
	- **render 新返回类型**：支持数组、字符串、数字、null、boolean
	- **Hooks**：新增 `useState` 等 Hooks API
	- **React.lazy + Suspense**：代码分割和加载状态
	- **memo / PureComponent**：组件记忆化优化
- **相关概念**：[[Fiber]]

#### React 17

- **时间**：2020 年 10 月
- **核心变化**：渐进式升级支持、新 JSX 转换
- **解决的关键问题**：不破坏性升级，支持多个 React 版本共存
- **重要特性**：
	- **新 JSX Transform**：JSX 转换不再需要引入 React（`React.Fragment` 可选）
	- **渐进式升级**：支持在同一页面共存多个 React 版本
	- **Event Delegation 改进**：事件委托到 root 元素而非 document
	- **新的 JSX 运行时**：基于 `jsx-runtime` 而非 `React.createElement`
- **相关概念**：[[JSX Transform]]

#### React 18

- **时间**：2022 年 3 月
- **核心变化**：Concurrent Mode + 自动批处理 + Suspense
- **解决的关键问题**：渲染可中断和恢复，提升复杂 UI 的响应性
- **重要特性**：
	- **Concurrent Mode**：并发渲染，可中断和恢复
	- **自动批处理**：所有状态更新（包括异步、原生事件）自动合并为单次渲染
	- **createRoot 新 API**：`ReactDOM.createRoot()` 取代 `ReactDOM.render()`
	- **useTransition**：标记低优先级更新，避免界面卡顿
	- **useDeferredValue**：延迟更新非关键 UI
	- **useSyncExternalStore**：订阅外部数据源，确保同步读取
	- **Suspense 增强**：支持服务端渲染 Suspense
	- **Server Components**：服务端组件概念
- **相关概念**：
	- [[Server Components]]
	- [[useTransition]]
	- [[Suspense]]

#### React 19

- **时间**：2024 年 12 月
- **核心变化**：Actions + useActionState + useFormStatus + Ref as Props + React DOM 静态 API
- **解决的关键问题**：简化异步操作和表单处理，提升开发者体验
- **重要特性**：
	- **Actions**：简化数据变更和表单提交的处理逻辑
	- **useActionState**：管理 Action 的待定状态、错误处理和乐观更新
	- **useFormStatus**：获取表单提交状态
	- **Ref as Props**：支持将 ref 作为 props 传递
	- **React DOM 静态 API**：改进 `renderToStaticMarkup` 等服务端 API
- **相关概念**：
	- [[useActionState]]
	- [[useFormStatus]]

---

### 关键转折点

| 时间点 | 转折内容 | 影响 |
|:---|:---|:---|
| React 16 | Stack → Fiber | 从同步到异步可中断的根本性架构变化 |
| React 18 | Concurrent Mode 正式发布 | 渲染可以被中断和恢复 |
| React 19 | Actions 抽象 | 简化异步操作和表单处理范式 |

---

### 未来展望

- **趋势**：React 20 预计继续深化 Server Components 集成与性能优化
- **待解决**：Suspense 服务端渲染的完善、React Compiler 稳定版
- **值得关注**：React Compiler（自动优化渲染）、进一步的前端框架融合

---

### 关联概念

- **父级领域**：[[React]]
- **相关概念**：
	- [[虚拟DOM(React)]] — Virtual DOM 原理
	- [[Fiber]] — Fiber 架构
	- [[Server Components]] — React 18+ 服务端组件
	- [[useTransition]] — React 18 并发模式 API
	- [[React.memo]] — 组件记忆化
	- [[useActionState]] — React 19 Action 状态管理
	- [[useFormStatus]] — React 19 表单状态
