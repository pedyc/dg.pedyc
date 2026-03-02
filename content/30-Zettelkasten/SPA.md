---
title: SPA
aliases: [Single Page Application]
description: 单页应用（Single Page Application, SPA）是一种Web应用程序或网站，它通过动态重写当前页面而不是从服务器加载整个新页面来与用户交互。
tags: [前端, Web开发, 架构]
date-created: 2025-07-24
date-modified: 2025-12-16
content-type: concept
keywords: [SPA, 单页应用, 前端框架, 用户体验]
para: area
related: ["[[多页应用 (MPA)]]", "[[前端路由]]", "[[Ajax]]"]
zettel: permanent
---

## 单页应用 (SPA)

### 定义

单页应用（Single Page Application, SPA）是一种 Web 应用程序或网站，它通过==动态重写当前页面而不是从服务器加载整个新页面来与用户交互==。这意味着在用户浏览过程中，页面不会进行整体刷新，而是通过 JavaScript 动态地更新内容。

### 核心特点

- **单 HTML 页面**: 整个应用只有一个 HTML 页面，所有内容和视图的切换都在这个页面内完成。
- **客户端渲染**: 大部分渲染工作在客户端（浏览器）完成，通过 JavaScript 操作 DOM 来更新 UI。
- **前后端分离**: 前端负责视图和交互，后端提供 API 接口，数据通过 Ajax 等异步请求获取。
- **路由管理**: 客户端通过前端路由（如 HTML5 History API 或 Hash 模式）来模拟多页面的 URL 跳转，实现无刷新导航。

### 优缺点

- **优点**:
	- **更好的用户体验**: 页面切换流畅，无需等待页面刷新，体验接近原生应用。
	- **更快的响应速度**: 首次加载后，后续数据交互只需请求数据，减少了服务器压力和网络传输量。
	- **前后端分离**: 有利于团队协作和项目维护，后端可以专注于提供 API。
	- **易于开发 API**: 只需要开发一套 API，可以供 Web、移动端等多个客户端使用。
- **缺点**:
	- **首次加载时间长**: 首次加载需要下载所有 HTML、CSS、JavaScript 资源，可能导致白屏时间较长。
	- **SEO 不友好**: 传统搜索引擎爬虫对 JavaScript 渲染的内容抓取不佳（虽然现代爬虫有所改进）。
	- **内存占用**: 长期运行可能导致浏览器内存占用较高。
	- **安全性问题**: 客户端逻辑复杂，更容易受到 XSS 等攻击。

### 应用场景

- **富交互性应用**: 如社交媒体、在线文档编辑、项目管理工具（Trello, Asana）。
- **数据可视化平台**: 需要频繁更新数据和图表的应用。
- **移动端 Web 应用**: 追求流畅体验的场景。
- **后台管理系统**: 内部使用，对 SEO 要求不高的系统。

### 示例

- **Gmail**: 典型的 SPA 应用，邮件切换无需刷新整个页面。
- **Google Maps**: 地图拖动、缩放等操作都是在不刷新页面的情况下完成。
- **React, Angular, Vue.js** 等现代前端框架是构建 SPA 的常用工具。

### 参考资料

- [MDN Web Docs: Single-page application](https://developer.mozilla.org/en-US/docs/Glossary/Single-page_application)
- [Wikipedia: Single-page application](https://en.wikipedia.org/wiki/Single-page_application)
