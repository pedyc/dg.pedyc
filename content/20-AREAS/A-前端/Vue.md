---
uid: 202505291000
title: Vue
aliases: [A-Vue, Vue.js, vue]
description: 用于构建用户界面的渐进式 JavaScript 框架，专注于数据驱动和组件化
tags: [前端开发/框架]
date-created: 2025-05-29
date-modified: 2026-04-14
status: cultivating
content-type: area
up: ["[[前端开发]]"]
---

## Area: Vue

> Vue 是一套用于构建用户界面的渐进式框架，采用数据驱动和组件化思想。

---

### 领域知识图谱

```mermaid
mindmap
    root((Vue))
        父级
            前端开发
        子级
            响应式系统
            模板编译
            组件系统
            路由与状态
        同级
            React
            Angular
        关联
            JavaScript
            TypeScript
            Vite
```

---

### 领域定义

- **核心范畴**：Vue 响应式系统、组合式 API、单文件组件、路由与状态管理
- **不包括**：服务端渲染（Nuxt 属于独立领域）、Node.js 后端开发
- **与相关领域的区别**：
	- vs React：Vue 更倾向约定优于配置，单文件组件更直观，响应式系统更自动
	- vs Angular：Vue 更轻量，学习曲线更平缓，无依赖注入等重型概念

---

### 长期目标

- **愿景**：掌握 Vue 3 生态，能够独立构建中大型 Vue 应用
- **里程碑**：
	- [x] 掌握 Vue 3 基础 + 组合式 API
	- [ ] 完成 Vue 3 + Vite + Pinia 项目实战
	- [ ] 深入响应式原理源码（Proxy / effect / reactive）
	- [ ] 掌握 Vue 编译器优化原理
	- [ ] 了解 Vue 未来方向（Vapor Mode）

---

### 关键领域

> 该领域的核心知识主题。链接指向尚未创建的 concept，表明尚未掌握。

- **响应式系统**
	- [[响应式原理(Vue3)]] — Vue 3 的 Proxy 响应式原理
	- [[Vue3 ref 和 reactive 的区别]] — 两种响应式引用的区别与适用场景
	- [[effect与reactive]] — 响应式系统分为 effect 和 reactive 两部分
- **模板编译**
	- [[模板编译(Vue3)]] — 模板到渲染函数的转换过程
	- [[Vue编译器优化]] — 编译器的静态分析与优化
- **组件系统**
	- [[生命周期(Vue3)]] — 组件生命周期钩子
	- [[组合式API]] — Composition API 的使用模式
	- [[Diff算法]] — Virtual DOM 的 Diff 算法
- **路由与状态**
	- [[Vue Router]] — 路由管理（独立领域）
	- [[Pinia]] — 状态管理（独立领域）
- **未来方向**
	- [[Vapor Mode]] — Vue 新的编译策略

---

### SOP

> 该领域的标准化操作流程

- [[SOP-Vue3项目搭建]] — 待创建：Vue 3 + Vite + Pinia 标准项目结构

---

### FAQ

> 该领域的常见问题

- [[MOC-Vue 面试题]] — Vue 常见面试问题汇总
- [[Q-Vue编译器如何优化]] — Vue 编译器的优化原理
- [[Q-Vapor Mode是什么]] — Vue 新的编译策略

---

### 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|:---|
| 目标进展 | 🟡 | 基础已掌握，响应式原理待深入 |
| 认知更新 | 🟢 | 持续补充 Vue 3 新特性 |
| 行动频率 | 🟡 | 需要更多项目实践 |
