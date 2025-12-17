---
title: Service Worker API
date-created: 2025-05-30
date-modified: 2025-06-17
---

## 定义

Service Worker 是一种在浏览器后台运行的脚本，可以拦截和处理网络请求，实现离线访问、推送通知等功能。Service Worker 充当 Web 应用程序、浏览器和网络之间的代理服务器，可以拦截网络请求、缓存资源、推送通知等。

## 核心特点

- **离线访问**: Service Worker 可以缓存 Web 应用程序的资源，实现离线访问。
- **推送通知**: Service Worker 可以接收服务器推送的通知，并在浏览器中显示。
- **后台同步**: Service Worker 可以在后台同步数据，例如在网络连接恢复后自动上传用户数据。
- **拦截网络请求**: Service Worker 可以拦截 Web 应用程序的网络请求，并根据需要返回缓存的资源或向服务器发起请求。

## 分类

Service Worker 的生命周期包括以下阶段：
- **注册**: 注册 Service Worker，告诉浏览器要使用哪个脚本作为 Service Worker。
- **安装**: 安装 Service Worker，缓存 Web 应用程序的资源。
- **激活**: 激活 Service Worker，开始拦截网络请求。
- **运行**: Service Worker 在后台运行，拦截和处理网络请求。
- **更新**: 更新 Service Worker，重新安装和激活新的 Service Worker。

## 应用

Service Worker 广泛应用于各种 Web 应用程序中，例如：
- **离线应用**: 允许用户在没有网络连接的情况下访问 Web 应用程序。
- **渐进式 Web 应用 (PWA)**: 使用 Service Worker 实现离线访问、推送通知等功能，提供类似原生应用的体验。
- **缓存**: 缓存 Web 应用程序的资源，提高页面加载速度。
- **推送通知**: 向用户发送推送通知，提高用户参与度。

## 优缺点

- 优点:
	- **离线访问**: 允许用户在没有网络连接的情况下访问 Web 应用程序。
	- **提高性能**: 缓存 Web 应用程序的资源，提高页面加载速度。
	- **推送通知**: 向用户发送推送通知，提高用户参与度。
- 缺点:
	- **复杂性**: Service Worker 的生命周期和 API 相对复杂，需要一定的学习成本。
	- **调试困难**: Service Worker 在后台运行，调试相对困难。
	- **兼容性问题**: Service Worker 在一些旧版本的浏览器中可能不支持。

## 相关概念

- [[PWA (Progressive Web App)]]: 使用 Service Worker 实现离线访问、推送通知等功能，提供类似原生应用的体验。
- [[Cache API]]: 用于缓存 Web 应用程序的资源。
- [[Push API]]: 用于接收服务器推送的通知。
- [[Web Storage API]]

## 案例

> 参见：[[Service Worker前端案例]]

## 问答卡片

- Q1：Service Worker 如何实现离线访问？
- A：Service Worker 可以缓存 Web 应用程序的资源，当用户访问 Web 应用程序时，Service Worker 可以拦截网络请求，并从缓存中返回资源，实现离线访问。
- Q2：Service Worker 如何接收服务器推送的通知？
- A：Service Worker 可以使用 Push API 接收服务器推送的通知，并在浏览器中显示。服务器需要使用 Web Push 协议向浏览器发送推送通知。

## 参考资料

- [MDN Web 开发者指南 - Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [Google Developers - Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
