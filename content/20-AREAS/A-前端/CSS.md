---
uid: 202512170000
title: CSS
aliases: [Cascading Style Sheets, 层叠样式表]
description: Web 的表现层语言，通过层叠和继承机制决定 HTML 文档的渲染方式
tags: [前端开发/CSS]
date-created: 2025-12-17
date-modified: 2026-04-07
status: active
content-type: area
up: "[[前端开发]]"
---

## Area: CSS

> CSS (Cascading Style Sheets) 是 Web 的表现层语言，通过层叠和继承机制决定 HTML 文档在屏幕、打印等媒介上的渲染方式。

---

### 领域定义

- **核心范畴**：样式语言、布局系统、视觉特效、工程化
- **不包括**：JavaScript 逻辑、后端样式处理
- **与相关领域的区别**：
	- vs HTML：HTML 结构 vs CSS 样式
	- vs JavaScript：声明式 vs 过程式

---

### 长期目标

- **目标 1**：掌握核心 CSS 机制（盒模型、层叠上下文、BFC）
- **目标 2**：熟练使用 Flexbox 和 Grid 布局
- **目标 3**：了解 CSS 工程化工具和方法
- **里程碑**：
	- [x] 阶段 1：掌握基础选择器与权重 ✅ 2026-03-25
	- [ ] 阶段 2：掌握 Flexbox 和 Grid
	- [ ] 阶段 3：理解渲染性能优化
	- [ ] 阶段 4：掌握工程化工具链

---

### 关键领域

- **核心机制**
	- [[CSS盒模型]] — 盒子的组成
	- [[层叠上下文]] — z-index 层级
	- [[BFC]] — 块级格式化上下文
	- [[CSS选择器]] — 权重与 specificity
- **布局系统**
	- [[Flexbox]] — 一维布局
	- [[CSS Grid]] — 二维布局
	- [[CSS定位]] — Position 定位
- **工程化**
	- [[Sass]] — CSS 预处理器
	- [[Tailwind CSS]] — 原子化 CSS
	- [[CSS Modules]] — 模块化方案

---

### 知识网络

- **上游支撑**（理论基础）
	- [[HTML]]：样式承载的基础
- **下游应用**（实际使用）
	- [[前端开发]]：实际项目应用
- **协同领域**
	- [[JavaScript]]：动态样式操作

---

### FAQ

- [[MOC-CSS相关问题]]
- CSS 选择器优先级如何计算？
	- 内联 (1000) > ID(100) > 类 (10) > 标签 (1) > 通配 (0)
- Flex 和 Grid 有什么区别？
	- Flex 一维，Grid 二维
- 如何实现垂直居中？
	- Flex/Grid/定位等多种方案

---

### 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|:---|
| 目标进展 | 🟡 | 需按里程碑推进 |
| 认知更新 | 🟢 | 持续补充新特性 |
| 行动频率 | 🟢 | 日常开发使用 |
