---
uid: 202603271047
title: "will-change"
description: "CSS 属性，用于提示浏览器提前优化指定元素的渲染"
tags:
  - CSS/性能
content-type: term
status: active
date-created: 2026-03-27
date-modified: 2026-03-27
aliases:
  - T-will-change
---

## 术语：will-change

> **领域**：#CSS/渲染性能

### 定义

`will-change` 是 CSS 属性，用于告知浏览器某个元素即将发生变化，浏览器可以提前进行优化（如创建渲染层）。

```css
will-change: auto | transform | opacity | scroll-position;
```

**取值**：
- `auto`：浏览器默认行为
- `transform`：提示元素变换将发生变化
- `opacity`：提示元素透明度将发生变化
- `scroll-position`：提示滚动位置将变化

### 跨学科含义

- **在前端性能优化中**：避免使用会导致层爆炸，谨慎使用
- **在浏览器渲染中**：触发渲染层的创建，实现 GPU 加速

### 知识网络

- **父级概念**：[[CSS 硬件加速]] — will-change 是实现 GPU 加速的手段
- **相关概念**：[[渲染层合成]], [[requestAnimationFrame]], [[回流与重绘优化]]