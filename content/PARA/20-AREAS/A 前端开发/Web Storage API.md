---
title: Web Storage API
aliases: [Web 存储]
date-created: 2025-05-21
date-modified: 2025-12-25
---

## Web Storage API

## 定义

Web Storage API 是一种在浏览器中存储键值对数据的机制，它提供了比 [[Cookie]] 更大、更灵活的存储空间，并且只能被客户端脚本访问，提高了安全性。Web Storage API 包括 `localStorage` 和 `sessionStorage` 两种方式。

## 核心特点

- **更大的存储空间**：Web Storage API 提供的存储空间比 Cookie 大得多，一般为 5MB 或 10MB。
- **只能被客户端脚本访问**：Web Storage API 存储的数据只能被客户端脚本访问，不能被服务器端访问，提高了安全性。
- **简单易用**：Web Storage API 提供了简单易用的 API，可以方便地存储和读取数据。

## 分类

- **`localStorage`**：
		- 用于持久化存储数据，数据在浏览器关闭后仍然存在。
		- 所有同源的窗口都可以访问 `localStorage` 中存储的数据。
		- 适合缓存页面状态、用户偏好等场景
		- 同步 API，读取大体积数据可能阻塞
- **`sessionStorage`**：
		- 用于临时存储数据，数据只在当前会话中有效，浏览器关闭后数据会被清除。
		- 只有创建 `sessionStorage` 的窗口可以访问其中存储的数据。

## 应用

- **存储用户偏好设置**：例如，主题颜色、字体大小等。
- **存储用户登录状态**：例如，用户名、Token 等。
- **存储购物车信息**：在用户未登录的情况下，存储购物车中的商品信息。
- **缓存 API 响应数据**：减少对服务器的请求，提高页面加载速度。

## 优缺点

- **优点**：
		- 更大的存储空间。
		- 只能被客户端脚本访问，提高了安全性。
		- 简单易用。
- **缺点**：
		- 存储的数据是字符串类型，需要进行序列化和反序列化。
		- 不支持过期时间，需要手动管理数据的过期。
		- 存在跨域访问的风险，需要注意安全问题。

## 相关概念

- [[Cookie Storage API]]: 4KB 大小限制，跟随请求一同发送
- [[IndexedDB API]]：存储结构化数据

## 案例（可选）

- **[[使用 localStorage 存储用户偏好设置]]**：展示如何使用 `localStorage` 存储用户选择的主题颜色。

## 参考资料

- MDN Web Storage API: [https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)
- Using the Web Storage API: [https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
