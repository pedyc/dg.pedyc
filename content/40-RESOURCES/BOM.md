---
uid: 202505020001
title: BOM
aliases: [T-BOM]
description: 浏览器对象模型，提供与浏览器窗口交互的 API
tags: []
date-created: 2025-06-02
date-modified: 2026-05-11
status: cultivating
content-type: term
up: ""
---

## 术语：BOM

> **领域**：#前端/浏览器

### 定义

BOM（Browser Object Model，浏览器对象模型）是一套 JavaScript API，用于与浏览器窗口进行交互。BOM 不是 W3C 标准化的规范，各浏览器实现略有差异。

**核心全局对象**：`window`

### 核心 API

| 对象                           | 作用                      |
|:--------------------------- |:---------------------- |
| `window`                     | 浏览器窗口全局对象               |
| `navigator`                  | 浏览器信息（UA、平台、语言）         |
| `location`                   | URL 信息与操作（href、reload）  |
| `history`                    | 浏览器历史记录（pushState、back） |
| `screen`                     | 屏幕信息（width、height）      |
| `localStorage`               | 本地存储（持久化）               |
| `sessionStorage`             | 会话存储（标签页关闭后清除）          |
| `fetch`                      | 网络请求                    |
| `setTimeout` / `setInterval` | 定时器                     |

### BOM vs DOM

| 维度 | BOM | DOM |
|:---|:---|:---|
| **全称** | Browser Object Model | Document Object Model |
| **操作对象** | 浏览器窗口 | 文档内容 |
| **标准化** | 无标准，各浏览器实现不同 | W3C 标准 |
| **示例** | `window.location` | `document.getElementById()` |

### 跨学科含义

- **在浏览器中**：`window` 是全局对象，`navigator` 提供浏览器信息，`location` 操作 URL
- **在 Node.js 中**：`global` 是全局对象，类似 BOM 的 `window`；`process` 提供浏览器 navigator 的功能
- **在 Electron 中**：`BrowserWindow` 是窗口对象，与 BOM 的 `window` 对应
- **在小程序中**：无 BOM 概念，使用 `wx` API（如 `wx.getSystemInfo`）替代

---

### 知识网络

- **父级概念**：浏览器
- **并列概念**：
	- [[DOM]] — 文档对象模型，操作页面内容
- **相关概念**：
	- [[History API]] — 操作浏览器历史
	- [[navigator]] — 浏览器信息
