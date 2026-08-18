---
uid: '202605091800'
title: IntersectionObserver
aliases: ["T-浏览器API-IntersectionObserver", "IntersectionObserver", "交叉观察者"]
description: "IntersectionObserver 是浏览器 API，用于异步监听元素与其祖先或视口交叉状态的变化"
tags: [前端开发/浏览器API]
date-created: 2026-05-09
date-modified: 2026-05-09
status: fleeting
content-type: term
---

## 术语：IntersectionObserver

> **领域**：#前端开发/浏览器 API

### 定义

IntersectionObserver 是浏览器提供的 API，用于**异步监听元素与其祖先或视口交叉状态的变化**，常用于实现懒加载、无限滚动、曝光埋点等功能。

**核心 API**：

```javascript
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // entry.isIntersecting: 是否进入视口
    // entry.intersectionRatio: 交叉比例
    // entry.boundingClientRect: 目标元素矩形
    // entry.intersectionRect: 交叉区域矩形
    // entry.rootBounds: 根元素矩形
    if (entry.isIntersecting) {
      console.log('元素进入视口')
    }
  })
}, {
  root: null,           // 根元素，默认视口
  rootMargin: '0px',    // 根元素外边距
  threshold: 0          // 触发回调的交叉比例阈值
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
| **异步执行** | 不绑定主线程，不影响滚动性能 |
| **无需定时器** | 取代 scroll 事件 + getBoundingClientRect 的轮询方案 |
| **可配置根元素** | 可监听与视口或特定祖先元素的交叉 |
| **阈值设置** | 可设置 0~1 之间的任意比例作为触发条件 |
| **批量检测** | 可同时观察多个元素的交叉状态 |

---

### 跨学科含义

- **在懒加载中**：图片进入视口时再加载真实图片
- **在无限滚动中**：底部元素出现时加载更多数据
- **在曝光埋点中**：元素被用户看到时触发埋点
- **在动画中**：元素进入视口时触发动画

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：
	- [[Web API]] — IntersectionObserver 归属的 API 分类
- **并列概念**：
	- [[ResizeObserver]] — 监听元素尺寸变化
	- [[MutationObserver]] — 监听 DOM 结构变化
- **相关概念**：
	- [[懒加载]] — 依赖交叉状态判断的加载策略
	- [[无限滚动]] — 依赖底部元素曝光的数据加载模式

---

### 参考延伸

- MDN: [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
- Google: [IntersectionObserver 使用指南](https://developers.google.com/web/updates/2016/04/intersectionobserver)
