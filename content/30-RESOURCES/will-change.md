---
uid: 202603301900
title: will-change
aliases: [T-will-change]
description: CSS 属性，用于告诉浏览器元素即将发生的变化，提前进行性能优化
tags: [term, 前端, 性能优化]
date-created: 2026-03-30
date-modified: 2026-08-02
status: active
content-type: term
---

## 术语：will-change

> **领域**：#前端/渲染性能

### 定义

`will-change` 是 CSS 属性，用于向浏览器提示元素即将发生的动画或渲染变化，使浏览器能够提前进行性能优化（如创建合成层）。

```css
.element {
  will-change: transform;
  will-change: opacity;
  will-change: transform, opacity;
}
```

### 核心机制

1. **触发合成层**：浏览器为元素创建独立的层（Layer），脱离主文档流
2. **GPU 加速**：层的合成和动画在 GPU 而非 CPU 完成
3. **减少重绘**：避免因其他元素的渲染导致的连锁重绘

### 适用场景

| 场景 | 适用属性 |
|:---|:---|
| **动画** | transform、opacity |
| **滚动优化** | transform（fixed 定位元素） |
| **状态切换** | opacity（淡入淡出） |

### 常见属性值

| 值 | 效果 |
|:---|:---|
| `auto` | 默认，浏览器决定 |
| `transform` | 变化 transform 属性时优化 |
| `opacity` | 变化 opacity 属性时优化 |
| `scroll-position` | 滚动位置即将改变 |
| `contents` | 内容即将改变 |

### 性能优化原理

```bash
未优化：主线程 → 重排/重绘 → 视觉更新
优化后：合成线程（独立层）→ GPU 合成 → 视觉更新
```

- **transform** 和 **opacity** 仅触发合成，不触发重排/重绘
- 浏览器为含 `will-change` 的元素创建新层
- 层与主文档层独立合成，互不阻塞

### 常见坑点

- ⛔ **滥用**：所有元素都加 `will-change` 会消耗大量 GPU 内存
- ⛔ **持续存在**：动画结束后应移除 `will-change`
- ⛔ **过早设置**：在变化前很久就设置会浪费资源

### 正确使用方式

```css
/* 动画开始前添加 */
.animating {
  will-change: transform;
}

/* 动画结束后移除 */
.animating.end {
  will-change: auto;
}
```

### 知识网络

- **父级概念**：[[回流和重绘]] — 性能优化原理
- **相关概念**：
	- [[合成层]] — will-change 的实现结果
	- [[CSS]] — 属性来源
	- [[transform]] — 最常配合使用的属性
- **关联笔记**：
	- [[实现磁吸式光标]] — 使用 will-change 的实践
