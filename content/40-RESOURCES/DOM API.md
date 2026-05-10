---
uid: '202605091500'
title: DOM API
aliases: ["T-浏览器API-DOM-API", "DOM API", "Document Object Model"]
description: "DOM API 是浏览器提供的用于操作 DOM 树的 JavaScript 接口"
tags: [前端开发/浏览器API]
date-created: 2026-05-09
date-modified: 2026-05-09
status: cultivating
content-type: term
---

## 术语：DOM API

> **领域**：#前端开发/浏览器 API

### 定义

DOM API 是浏览器提供的用于**操作 DOM 树**的 JavaScript 接口，通过这些 API 可以增删改查 DOM 节点、绑定事件、修改样式。

**与 DOM 的区别**：
- **DOM**：树状数据结构（概念）
- **DOM API**：操作这个树的 JavaScript 接口（方法）

---

### 核心接口

```javascript
// 获取元素
document.getElementById('id')
document.querySelector('.class')
document.querySelectorAll('div')

// 创建节点
document.createElement('div')
document.createTextNode('text')
document.createDocumentFragment()

// 操作节点
element.appendChild(child)
element.removeChild(child)
element.replaceChild(newChild, oldChild)
element.insertBefore(newNode, refNode)

// 修改内容
element.textContent = 'text'
element.innerHTML = '<span>html</span>'
element.setAttribute('attr', 'value')
element.removeAttribute('attr')

// 样式
element.style.color = 'red'
element.classList.add('active')

// 事件
element.addEventListener('click', handler)
element.removeEventListener('click', handler)
```

---

### 核心特点

| 特点 | 说明 |
|:---|:---|
| **同步操作** | DOM 操作立即生效，影响后续渲染 |
| **触发重排** | 增删节点、修改尺寸会触发重排，性能开销大 |
| **返回 Live Collection** | querySelectorAll 返回的是快照，非 live |
| **事件委托** | 利用事件冒泡，在父节点监听子节点事件 |

---

### 跨学科含义

- **在框架中**：Vue、React 内部通过 DOM API 操作真实 DOM（Vue）或虚拟 DOM（React）
- **在测试中**：Jest + jsdom 提供 DOM API 模拟，用于单元测试
- **在 SSR 中**：jsdom、happy-dom 在 Node.js 中模拟浏览器 DOM API

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：
	- [[Web API]] — DOM API 归属的 API 分类
- **相关概念**：
	- [[DOM]] — DOM API 操作的数据结构（树）
	- [[Virtual DOM|Virtual DOM]] — 虚拟 DOM，React 的实现技术
	- [[Shadow DOM]] — 组件隔离的 DOM 结构
	- [[MutationObserver]] — 监听 DOM 变化的 API

---

### 参考延伸

- MDN: [DOM API](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- W3C: [DOM Specification](https://www.w3.org/TR/dom/)
