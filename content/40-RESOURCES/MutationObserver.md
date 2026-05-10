---
uid: "202605091400"
title: MutationObserver
aliases: [T-浏览器API-MutationObserver, DOM变化监听, T-Web API-MutationObserver]
description: MutationObserver 是浏览器 API，用于监听 DOM 树的变化
tags: [前端开发/浏览器API]
date-created: 2026-05-09
date-modified: 2026-05-09
status: fleeting
content-type: term
---

## 术语：MutationObserver

> **领域**：#前端开发/浏览器 API

### 定义

MutationObserver 是浏览器提供的 API，用于监听 **DOM 树的变化**（节点添加、删除、属性修改、文本内容变化等），是 `MutationEvent` 的现代替代方案。

**核心 API**：

```javascript
// 创建观察者
const observer = new MutationObserver((mutations, observer) => {
  mutations.forEach(mutation => {
    switch(mutation.type) {
      case 'childList': // 子节点变化
        mutation.addedNodes.forEach(node => ...)
        mutation.removedNodes.forEach(node => ...)
        break
      case 'attributes': // 属性变化
        mutation.attributeName
        mutation.oldValue
        break
      case 'characterData': // 文本变化
        mutation.target
        mutation.oldValue
        break
    }
  })
})

// 配置观察选项
const config = {
  childList: true,      // 观察子节点增删
  subtree: true,       // 观察所有后代
  attributes: true,     // 观察属性变化
  attributeOldValue: true, // 记录属性旧值
  characterData: true,  // 观察文本变化
  characterDataOldValue: true // 记录文本旧值
}

// 开始观察
observer.observe(targetNode, config)

// 停止观察
observer.disconnect()
```

---

### 核心特点

| 特点 | 说明 |
|:---|:---|
| **异步回调** | 变化批量收集，在微任务中异步回调 |
| **低性能开销** | 不像 MutationEvent 阻塞浏览器 |
| **可配置** | 可选择观察的节点类型、属性、子树范围 |
| **已废弃 MutationEvent** | 现代浏览器推荐使用 MutationObserver |

---

### 跨学科含义

- **在框架中**：Vue、React 内部用 MutationObserver 监听响应式数据变化（部分实现）
- **在监控中**：前端监控 SDK 用它监听 DOM 变化实现埋点增强
- **在测试中**：Jest/Vitest 用它检测 DOM 变化的测试

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：
	- [[Web API]] — MutationObserver 归属的 API 分类
- **并列概念**：
	- [[IntersectionObserver]] — 监听元素可见性变化
	- [[ResizeObserver]] — 监听元素尺寸变化
	- [[MutationEvent]] — 已废弃的旧 API
- **相关概念**：
	- [[DOM API]] — DOM 操作相关 API
	- [[Virtual DOM|Virtual DOM]] — 虚拟 DOM 库常用变化监听

---

### 参考延伸

- MDN: [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
- Chrome DevTools: [DOM Breakpoints](https://developer.chrome.com/docs/devtools/dom/breakpoints/)
