---
title: CSS
aliases: [Cascading Style Sheets, 层叠样式表]
tags: ["前端开发/CSS"]
date-created: 2025-12-17
date-modified: 2026-03-12
status: 🟢 活跃
content-type: atomic
---

## 🗺️ 语言：CSS (Cascading Style Sheets)

### 🔎 核心定义

> [!abstract] 声明式样式语言
> **CSS** 是 Web 的**表现层** (Presentation Layer)。它通过**层叠 (Cascading)** 和**继承 (Inheritance)** 机制，决定了 HTML 文档在屏幕、打印等媒介上的渲染方式。
>
> *核心心智模型*：[[CSS盒模型]] | [[层叠上下文]] | [[格式化上下文(BFC)]]

---

### 🏗️ 知识体系导航 (The Stack)

#### 1. 核心机制 (Core Mechanics)

*面试常考的 " 硬核 " 原理*
- **规则与权重**：[[CSS选择器]] (Specificity) | [[层叠与继承]] | [[@layer (级联层)]]
- **空间模型**：[[CSS盒模型]] (Box Model) | [[外边距塌陷]] (Margin Collapse)
- **渲染原理**：[[重绘与回流]] (Repaint/Reflow) | [[CSS性能优化]]

#### 2. 布局系统 (Layout System)

*从宏观架构到微观对齐*
- **现代布局**：[[Flexbox]] (一维) | [[CSS Grid]] (二维)
- **传统/定位**：[[CSS定位]] (Positioning) | [[浮动与清除]] (Float)
- **响应式设计**：[[媒体查询]] (Media Queries) | [[容器查询]] (Container Queries) ✨

#### 3. 工程化与架构 (Architecture & Engineering)

*如何编写可维护、可扩展的 CSS*

| 类别 | 关键技术/方案 | 解决了什么问题？ |
|:--- |:--- |:--- |
| **预处理器** | [[Sass]] / [[Less]] | 变量、嵌套、Mixin，提升开发体验 |
| **后处理器** | [[PostCSS]] / [[Autoprefixer]] | 兼容性补全、语法降级 |
| **架构方法论** | [[BEM命名规范]] / [[OOCSS]] | 解决全局命名冲突，提升复用性 |
| **原子化/库** | [[Tailwind CSS]] / [[Atomic CSS]] | 减少样式体积，提升开发速度 |
| **模块化** | [[CSS Modules]] / [[CSS-in-JS]] | 组件级别的样式隔离 |

```mermaid
graph LR
    A[SCSS/Less 源码] -->|预处理| B(标准 CSS)
    B -->|PostCSS| C(兼容性 CSS)
    C -->|压缩/TreeShaking| D[生产环境 CSS]
````

#### 4. 视觉与交互 (Visual & Interaction)

- **动态效果**：[[CSS动画]] (Keyframes) | [[CSS过渡]] (Transition) | [[3D变换]]
- **美学细节**：[[CSS变量]] (Custom Properties) | [[字体排印]] | [[滤镜与混合模式]]

---

### 🔗 常用资源 (Resources)

- **参考手册**：
	- [[MDN Web Docs - CSS]] (权威指南)
	- [[CSS Triggers]] (查询属性是否触发重排/重绘)
	- [[Can I use]] (兼容性速查)
- **工具链**：
	- [CSS Gradient](https://cssgradient.io/) (渐变生成)
	- [Clippy](https://bennettfeely.com/clippy/) (clip-path 生成器)

### 📥 待整理 (Inbox)

- [ ] 学习 `content-visibility` 属性对性能的影响
- [ ] 整理 CSS 逻辑属性 (Logical Properties) 笔记
- [ ] 实践 Scroll-driven Animations (滚动驱动动画)

---

### ⚠️ 常见挑战 (Challenges)

- [[CSS优先级]] 混乱导致样式难以覆盖
- [[垂直居中]] 的 N 种方案总结
- [[移动端1px问题]] 与适配方案
