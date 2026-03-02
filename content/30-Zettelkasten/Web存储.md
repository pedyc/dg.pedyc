---
title: Web存储
date-created: 2025-06-15
date-modified: 2025-06-15
keywords: [Web API]
---

## 定义

Web 存储是指在客户端（通常是用户的浏览器）存储数据的各种技术的统称。这些技术允许 Web 应用程序在用户的设备上持久地存储数据，以便在后续会话中访问，从而提高性能和用户体验。

## 核心特点

- **持久性**: 数据可以长期存储在客户端，即使关闭浏览器或重新启动设备。
- **客户端存储**: 数据存储在用户的设备上，减轻服务器的负担。
- **多种存储方式**: 包括键值对存储、结构化数据存储等多种方式。

## 分类

- [[Web Storage API]]: 包括 localStorage 和 sessionStorage，用于存储简单的键值对数据。
	- localStorage: 数据长期存储，除非显式删除。
	- sessionStorage: 数据仅在当前会话中有效，关闭浏览器窗口或标签页后数据丢失。
- [[IndexedDB API]]: 用于存储大量的结构化数据，支持事务和索引。
- [[Cookie Storage API]]: 通过 HTTP Cookie 存储数据，主要用于存储用户会话信息和个性化设置。

## 应用

- **用户会话管理**: 存储用户的登录状态和会话信息。
- **离线应用**: 存储应用程序的资源和数据，使应用在离线状态下也能运行。
- **用户偏好设置**: 存储用户的个性化设置，如主题、语言等。
- **缓存数据**: 缓存 API 响应和静态资源，提高页面加载速度。

## 优缺点

- 优点:
	- **提高性能**: 减少服务器请求，加快页面加载速度。
	- **改善用户体验**: 支持离线访问和个性化设置。
	- **减轻服务器负担**: 将数据存储在客户端，减少服务器的存储和计算压力。
- 缺点:
	- **存储容量限制**: 客户端存储容量有限，不同浏览器和设备有所不同。
	- **安全性问题**: 存储在客户端的数据可能受到恶意攻击，需要采取安全措施。
	- **数据同步问题**: 当多个设备访问同一用户数据时，需要考虑数据同步问题。

## 相关概念

- [[Web Storage API]]: 用于存储简单的键值对数据。
- [[IndexedDB API]]: 用于存储大量的结构化数据，支持事务和索引。
- [[Cookie Storage API]]: 通过 HTTP Cookie 存储数据，主要用于存储用户会话信息和个性化设置。

## 案例

- **电商网站**: 使用 localStorage 存储用户的购物车信息，使用 IndexedDB 存储商品目录。
- **在线笔记应用**: 使用 localStorage 存储用户的笔记内容，支持离线编辑。
- **社交媒体网站**: 使用 Cookie 存储用户的登录状态和会话信息。

## 问答卡片

- Q1：Web Storage API 和 Cookie Storage API 有什么区别？
- A：Web Storage API（localStorage 和 sessionStorage）提供更大的存储容量和更好的性能，而 Cookie Storage API 主要用于存储会话信息和个性化设置，且大小限制较小。
- Q2：IndexedDB API 适用于哪些场景？
- A：IndexedDB API 适用于需要存储大量结构化数据的场景，如离线应用、大型数据集缓存等。

## 参考资料

- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
