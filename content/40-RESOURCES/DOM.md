---
uid: '202605091600'
title: DOM
aliases: ["T-概念-DOM", "DOM", "文档对象模型"]
description: "DOM 是将 HTML/XML 文档解析为树状结构的数据模型"
tags: [前端开发/概念]
date-created: 2025-05-22
date-modified: 2026-05-11
status: cultivating
content-type: term
---

## 术语：DOM

> **领域**：#前端开发/概念

### 定义

DOM（Document Object Model，文档对象模型）是一种**树状数据结构**，用于表示 HTML/XML 文档的层次结构，将文档中的每个元素、属性、文本都解析为节点。

**与 HTML 的区别**：
- HTML：文档的标记语言（文本）
- DOM：浏览器解析后的树状数据结构（内存）

---

### 核心特点

| 特点 | 说明 |
|:---|:---|
| **树状结构** | 文档解析为节点树，根节点是 document |
| **节点类型** | Element、Text、Attribute、Comment 等 12 种节点类型 |
| **继承关系** | EventTarget → Node → Element/Text/… |
| **平台无关** | W3C 标准，浏览器统一实现 |
| **实时性** | 文档结构变化会立即反映在 DOM 树上 |

---

### 关键区别：DOM vs HTML

```bash
HTML（文本）:
<div><p>Hello</p></div>

DOM（树结构）:
document
└── div (Element)
    └── p (Element)
        └── "Hello" (Text)
```

---

### 核心 API

| 分类 | API | 说明 |
|:---|:---|:---|
| **查询** | `querySelector()` | 返回首个匹配元素 |
| **查询** | `querySelectorAll()` | 返回 NodeList |
| **查询** | `getElementById()` | ID 查询（最快） |
| **查询** | `getElementsByClassName()` | 类名查询 |
| **创建** | `createElement()` | 创建新元素 |
| **创建** | `createTextNode()` | 创建文本节点 |
| **插入** | `appendChild()` | 末尾插入 |
| **插入** | `insertBefore()` | 指定位置插入 |
| **删除** | `removeChild()` | 移除子节点 |
| **属性** | `setAttribute()` | 设置属性 |
| **属性** | `getAttribute()` | 获取属性 |
| **样式** | `classList.add/remove` | 增删类名 |
| **事件** | `addEventListener()` | 绑定事件 |
| **事件** | `removeEventListener()` | 解绑事件 |

---

### 跨学科含义

- **在浏览器中**：DOM 是页面渲染的基础，浏览器根据 DOM 计算布局和绘制
- **在 JavaScript 中**：JS 通过 DOM API 操作 DOM 树实现动态交互
- **在 SSR 中**：Node.js 用 jsdom、happy-dom 模拟 DOM 进行服务端测试

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **下位概念**：
	- [[DOM API]] — 操作 DOM 的 JavaScript 接口
	- [[Virtual DOM]] — DOM 的虚拟映射，React/Vue 的实现技术
	- [[Range API]] — 操作文档范围的 API
- **并列概念**：
	- [[BOM]] — 浏览器对象模型，操作用于 window/navigator/location
	- [[CSSOM]] — CSS 对象模型，样式计算的树结构
- **相关概念**：
	- [[HTML]] — DOM 的文本来源
	- [[浏览器渲染管线]] — DOM 是渲染管线的一环

---

### 参考延伸

- MDN: [DOM 介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)
- W3C: [DOM 标准](https://www.w3.org/DOM/)
