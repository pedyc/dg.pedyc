---
title: DOM
description: "DOM 是连接 JavaScript 和 HTML 的桥梁，允许 JavaScript 动态地访问和操作网页内容。是前端开发的核心技术之一。"
tags: ["前端", "JavaScript"]
date-created: 2025-05-22
date-modified: 2025-06-02
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

## DOM 数据类型

- **[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)**: `document` 对象是 root `document` 对象本身。
- **[`Node`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)**: 位于文档中的每个对象都是某种类型的节点。
- **[`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)**: `element` 类型是基于 `node` 的，指的是一个元素或一个由 DOM API 的成员返回的 `element` 类型的节点。
- **[`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)**: `nodeList` 是由元素组成的数组，如同 `document.querySelectorAll()` 等方法返回的类型。
- **[`Attr`](https://developer.mozilla.org/zh-CN/docs/Web/API/Attr)**: `attribute` 通过成员函数返回时，它是一个为属性暴露出专门接口的对象引用。
- **[`NamedNodeMap`](https://developer.mozilla.org/zh-CN/docs/Web/API/NamedNodeMap)**: `namedNodeMap` 和数组类似，但是条目是由名称或索引访问的。

## 核心 API

- [[DocumentFragment]]：创建一个虚拟 DOM 节点，结合 `appendChild` 方法批量更新 DOM 元素
- [[AbortController API]]：创建一个控制器对象，用于终止 Web 请求
- [[TreeWalker API]]：用于高效遍历指定 DOM 子树
- [[Range API]]：
- [[MutationObserver]]
- [[Intersection Observer API]]：用于异步观察目标元素与其祖先元素或者视口的交叉状态

## 相关概念

- **[[BOM]]**: 浏览器对象模型，提供了访问浏览器功能的接口。
- **[[JavaScript]]**: 一种脚本语言，通常用于操作 DOM。
- **[[HTML]]**: 一种标记语言，用于定义网页的结构。
- **[[CSS]]**: 用于控制网页的样式和布局。

## 参考资料

- [DOM 概述 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)
- [DOM 标准 - W3C](https://www.w3.org/DOM/)
