---
title: DOM
description: "DOM 是连接 JavaScript 和 HTML 的桥梁，允许 JavaScript 动态地访问和操作网页内容。是前端开发的核心技术之一。"
tags: ["前端", "JavaScript"]
date-created: 2025-05-22
date-modified: 2025-05-23
content-type: "concept"
keywords: [DOM, 文档对象模型, JavaScript, HTML, 动态网页]
para: "area"
related: ["[[HTML]]", "[[JavaScript]]", "[[BOM]]", "[[CSS]]", "[[DOM操作]]", "[[DOM事件处理]]", "[[DOM性能优化]]", "[[DOM安全]]"]
zettel: "permanent"
---

## 定义

文档对象模型 (DOM) 是一种用于 HTML 和 XML 文档的编程接口。它将网页表示为一个树状结构，其中每个节点代表文档的一部分（例如，元素、文本、属性）。通过 DOM，JavaScript 可以访问和修改网页的内容、结构和样式，从而实现动态网页效果。

## 核心特点

- **树状结构**: 将整个文档表示为一棵树，易于理解和操作。
- **动态性**: 允许 JavaScript 动态地修改网页内容，实现交互效果。
- **跨平台**: 可以在不同的浏览器和平台上使用。
- **事件驱动**: 允许开发者监听和响应用户在网页上的各种操作。

## 分类

- **核心 DOM**: 定义了所有文档类型（HTML 和 XML）的标准接口。
- **HTML DOM**: 扩展了核心 DOM，提供了特定于 HTML 文档的接口。
- **XML DOM**: 扩展了核心 DOM，提供了特定于 XML 文档的接口。

## 应用

- **动态修改网页内容**: 根据用户输入动态更新页面。
- **创建交互式网页**: 响应用户点击事件，显示或隐藏元素。
- **操作 CSS 样式**: 动态改变元素的颜色或大小。
- **表单验证**: 验证用户输入数据的有效性。
- **动画效果**: 创建各种动画效果，提升用户体验。
- **单页应用 (SPA)**: 构建现代 Web 应用。

## 优缺点

- **优点**:
		- 易于理解和使用
		- 强大的动态性和交互性
		- 跨平台兼容性
- **缺点**:
		- 性能问题：频繁操作 DOM 可能导致页面卡顿
		- 安全问题：不当的 DOM 操作可能导致 XSS 攻击

## 相关概念

- **[[BOM]]**: 浏览器对象模型，提供了访问浏览器功能的接口。
- **[[JavaScript]]**: 一种脚本语言，通常用于操作 DOM。
- **[[HTML]]**: 一种标记语言，用于定义网页的结构。
- **[[CSS]]**: 用于控制网页的样式和布局。

## DOM 数据类型

| 数据类型（接口）                                                                        | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)         | 当一个成员返回 `document` 对象（例如，元素的 `ownerDocument` 属性返回它所属的 `document`），这个对象就是 root `document` 对象本身。[DOM `document` 参考](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 一章对 `document` 对象进行了描述。                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [`Node`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)                 | 位于文档中的每个对象都是某种类型的节点。在一个 HTML 文档中，一个对象可以是一个元素节点，也可以是一个文本节点或属性节点。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)           | `element` 类型是基于 `node` 的。它指的是一个元素或一个由 DOM API 的成员返回的 `element` 类型的节点。例如，我们不说 [`document.createElement()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElement) 方法返回一个 `node` 的对象引用，而只是说这个方法返回刚刚在 DOM 中创建的 `element`。`element` 对象实现了 DOM 的 `Element` 接口和更基本的 `Node` 接口，这两个接口都包含在本参考中。在 HTML 文档中，元素通过 HTML DOM API 的 [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement) 接口以及其他描述特定种类元素能力的接口（例如用于 [`<table>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/table) 元素的 [`HTMLTableElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLTableElement) 接口）进一步强化。 |
| [`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)         | `nodeList` 是由元素组成的数组，如同 [`document.querySelectorAll()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll) 等方法返回的类型。`nodeList` 中的条目通过索引有两种方式进行访问：<br><br>list.item(1)<br>list[1]<br><br>两种方式是等价的，第一种方式中 `item()` 是 `nodeList` 对象中的单独方法。后面的方式则使用了经典的数组语法来获取列表中的第二个条目。                                                                                                                                                                                                                                                                                                                                               |
| [`Attr`](https://developer.mozilla.org/zh-CN/docs/Web/API/Attr)                 | 当 `attribute` 通过成员函数（例如通过 `createAttribute()` 方法）返回时，它是一个为属性暴露出专门接口的对象引用。DOM 中的属性也是节点，就像元素一样，只不过你可能会很少使用它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [`NamedNodeMap`](https://developer.mozilla.org/zh-CN/docs/Web/API/NamedNodeMap) | `namedNodeMap` 和数组类似，但是条目是由名称或索引访问的，虽然后一种方式仅仅是为了枚举方便，因为在 list 中本来就没有特定的顺序。出于这个目的， `namedNodeMap` 有一个 item() 方法，你也可以从 `namedNodeMap` 添加或移除条目。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## 参考资料

- [DOM 概述 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)
- [DOM 标准 - W3C](https://www.w3.org/DOM/)
