---
uid: 202603200003
title: CSS Animation
aliases: [CSS Animation, C-CSS动画]
description: CSS 动画技术，通过 @keyframes 和 animation 属性创建网页动画
tags: [前端开发/动画]
date-created: 2026-03-20
date-modified: 2026-05-08
status: cultivating
content-type: concept
up: ["[[Web动画]]"]
---

## 概念：CSS Animation

> CSS Animation 是 CSS3 引入的动画技术，通过 @keyframes 规则定义动画关键帧，使用 animation 属性控制动画播放。

**解决的核心痛点**：无需 JavaScript 即可实现简单的网页动画，减少代码量并利用浏览器优化

---

### 核心命题

- [[CSS Animation 通过 @keyframes 定义关键帧实现动画]]
	- **原理**：在关键帧之间浏览器自动插值计算中间状态
- [[CSS Animation 支持丰富的播放控制]]
	- **原理**：animation-name、duration、timing-function、delay、iteration-count、direction、fill-mode、play-state
- [[CSS 动画性能取决于被动画的属性]]
	- **原理**：transform 和 opacity 不触发重排重绘，其他属性性能较差

---

### 运行机制

```mermaid
flowchart TB
    A[CSS Animation] --> B[@keyframes 定义]
    B --> C[animation 属性]
    C --> D{属性类型}
    D -->|transform/opacity| E[GPU 合成层]
    D -->|其他| F[CPU 重排/重绘]
    E --> G[流畅动画]
    F --> H[性能较差]
```

---

### 关键区别

| 维度 | CSS Animation | CSS Transition |
|:--- |:--- |:--- |
| **触发方式** | 自动播放或延迟触发 | 属性值变化时触发 |
| **控制** | 可设置播放次数、方向 | 只能触发一次 |
| **复杂度** | 支持多关键帧 | 仅支持起止状态 |
| **适用场景** | 循环动画、复杂序列 | 简单状态切换 |

---

### 应用场景

- ✅ **适用场景**
	- **加载动画**：旋转、脉冲、进度条
	- **悬停效果**：按钮放大、颜色渐变
	- **页面进入动画**：淡入、滑动
- ⛔ **误用**
	- **复杂交互**：需要程序控制时用 GSAP 或 WAAPI
	- **动画非 transform/opacity 属性**：会导致性能问题

#### SOP

- [[SOP-CSS实现文字横向滚动效果]]

---

### 知识图谱

- **父级概念**：[[Web动画]]
- **子集概念**：[[CSS Transition]]
- **并列概念**：
	- [[GSAP]]
	- [[Web Animations API]]
- **相关概念**：
	- [[合成层]]
	- [[T-帧动画]]
	- [[动效排版]]

---

### 参考延伸

- MDN: [CSS Animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- 性能最佳实践：只动画 transform 和 opacity
