---
uid: 202505211000
title: React
aliases: [A-React, React.js, ReactJS]
description: 用于构建用户界面的 JavaScript 库，采用组件化和 Virtual DOM
tags: [前端开发/框架]
date-created: 2025-05-21
date-modified: 2026-04-20
status: cultivating
content-type: area
up: "[[前端开发]]"
---

## Area: React

> 用于构建用户界面的 JavaScript 库，由 Facebook 开发和维护，采用组件化和 Virtual DOM。

---

### 领域知识图谱

```mermaid
mindmap
    root((React))
        父级
            前端开发
        子级
            核心概念
            渲染机制
            状态管理
            路由与生态
        同级
            Vue
            Angular
        关联
            JavaScript
            TypeScript
            ThreeJS
```

---

### 领域定义

- **核心范畴**：React 核心概念、组件开发、Hooks、状态管理、生态工具
- **不包括**：后端开发、移动端原生开发（React Native 除外）
- **与相关领域的区别**：
	- vs Vue：React 使用 JSX 和单向数据流，Vue 使用模板和双向绑定
	- vs Angular：React 更轻量，只关注视图层，不含完整框架功能

---

### 长期目标

- **愿景**：深入掌握 React 生态，能够独立构建中大型 React 应用
- **里程碑**：
	- [x] 掌握 React 核心概念和 Hooks
	- [ ] 掌握状态管理（Redux / Zustand / Jotai）
	- [ ] 掌握性能优化（useMemo / useCallback / React.memo）
	- [ ] 深入 React 源码和原理（Fiber / Reconciliation）
	- [ ] 掌握 Next.js 全栈开发

---

### 关键领域

> 该领域的核心知识主题。链接指向尚未创建的 concept，表明尚未掌握。

- **核心概念**
	- [[React版本演进]] — 各版本核心差异与演进路线
	- [[虚拟DOM(React)]] — Virtual DOM 的原理与 Diff 算法
	- [[Fiber架构(React)]] — React 16+ 的协调引擎
	- [[Hooks (React)]] — useState / useEffect / useRef 等
	- [[useCallback]] — 回调函数缓存
	- [[useMemo]] — 计算结果缓存
	- [[React.memo]] — 组件级别的记忆化
- **渲染机制**
	- [[React重新渲染]] — 重新渲染的触发条件与优化
	- [[React组件通信]] — Props / Context / 状态提升 / 事件总线
	- [[Suspense]] — 异步加载与错误边界
	- [[Server Components]] — React 18+ 服务端组件
- **并发模式**
	- [[useTransition]] — 并发模式下的状态过渡
	- [[useDeferredValue]] — 延迟值更新
- **状态管理**
	- [[状态管理(React)]] — Redux / Zustand / Jotai / Recoil
	- [[React Context]] — 跨层级数据传递
- **路由与生态**
	- [[React Router]] — 路由管理
	- [[Next.js]] — React 全栈框架
	- [[R3F]] — React + Three.js
	- [[Zustand]]、[[Redux]] — React 状态管理库
		- 👉[[Zustand vs Redux]]
---

### SOP

> 该领域的标准化操作流程

- [[SOP-使用Claude-Code开发React组件]] — Claude Code 开发 React 组件的工作流
- [[SOP-在React中实现文字故障效果]] — React 中的 Glitch 文字动画
- [[SOP-在React中实现ASCII动画]] — React 中的 ASCII 动画效果

---

### FAQ

> 该领域的常见问题

- [[MOC-React面试题]] — React 常见面试问题汇总
- [[Q-React状态管理怎么选]] — Redux vs Zustand vs Jotai 选型
- [[Q-Hook使用规则为什么必须遵守]] — Hooks 调用顺序的原理

---

### 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|:---|
| 目标进展 | 🟡 | 核心 Hooks 已掌握，状态管理待深入 |
| 认知更新 | 🟢 | 持续补充新特性和最佳实践 |
| 行动频率 | 🟢 | 日常开发中使用 |
