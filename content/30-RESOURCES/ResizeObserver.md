---
uid: "202605091700"
title: ResizeObserver
aliases: [T-浏览器API-ResizeObserver, ResizeObserver, 元素尺寸监听, T-Web API-ResizeObserver]
description: ResizeObserver 是浏览器 API，用于监听元素尺寸变化
tags: [前端开发/浏览器API]
date-created: 2026-05-09
date-modified: 2026-05-09
status: fleeting
content-type: term
---

## 术语：ResizeObserver

> **领域**：#前端开发/浏览器 API

### 定义

ResizeObserver 是浏览器提供的 API，用于**监听元素尺寸变化**，当元素的内容或边框大小改变时触发回调。

**核心 API**：

```javascript
const observer = new ResizeObserver((entries, observer) => {
  entries.forEach(entry => {
    // entry.contentRect: 内容区域尺寸
    // entry.borderBoxSize: 边框区域尺寸
    // entry.devicePixelContentBoxSize: 设备像素尺寸
    console.log('尺寸变化:', entry.contentRect)
  })
})

// 开始观察
observer.observe(element)

// 停止观察
observer.unobserve(element)

// 断开所有观察
observer.disconnect()
```

---

### 核心特点

| 特点 | 说明 |
|:---|:---|
| **异步回调** | 尺寸变化在下一帧渲染前统一处理，不阻塞渲染 |
| **多元素监听** | 一个 Observer 可监听多个元素 |
| **尺寸类型** | 支持 contentRect、borderBoxSize、devicePixelContentBoxSize |
| **不泄漏** | 元素被移除时自动停止观察 |
| **替代方案** | 取代旧的 resize 事件（只能监听 window） |

---

### 跨学科含义

- **在图表中**：监听容器尺寸变化，自动调整图表大小
- **在响应式布局中**：替代 resize 事件，监听单个元素而非 window
- **在 iframe 中**：监听 iframe 尺寸变化，实现自适应嵌入

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：
	- [[Web API]] — ResizeObserver 归属的 API 分类
- **并列概念**：
	- [[IntersectionObserver]] — 监听元素可见性变化
	- [[MutationObserver]] — 监听 DOM 结构变化
- **相关概念**：
	- [[Web Animations API]] — 尺寸变化时的动画
	- [[响应式布局]] — 依赖尺寸监听的自适应设计

---

### 参考延伸

- MDN: [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)
- Chrome DevTools: [ResizeObserver 调试](https://developer.chrome.com/docs/devtools/)
