---
title: Web通信
date-created: 2025-06-07
date-modified: 2025-06-15
---

## 定义

Web 通信是指 Web 应用程序与服务器、第三方服务或其他客户端之间进行数据交换的过程。前端工程师需要掌握各种 Web 通信方式，以实现动态和交互式的用户界面。

## 核心特点

- **多样性**: 存在多种 Web 通信方式，如 HTTP、WebSocket、CORS 等。
- **异步性**: 大部分 Web 通信是异步的，不会阻塞主线程。
- **跨域性**: 涉及到跨域通信时，需要考虑安全性和兼容性问题。

## 分类

- **HTTP 通信**:
	- `fetch`: 现代 Web API，用于发起 HTTP 请求。
	- `axios`: 基于 Promise 的 HTTP 客户端，支持更多高级特性。
	- `REST API`: 一种设计风格，用于构建可扩展的网络服务。
- **持久连接**:
	- `WebSocket`: 一种全双工通信协议，允许服务器主动向客户端推送数据。
	- `Server-Sent Events (SSE)`: 一种单向通信协议，允许服务器向客户端推送数据。
- **跨域通信**:
	- `CORS (Cross-Origin Resource Sharing)`: 一种安全机制，允许跨域请求。
	- `JSONP (JSON with Padding)`: 一种古老的跨域解决方案，利用 `<script>` 标签的跨域特性。
- **客户端内通信**:
	- `postMessage`: 允许不同源的窗口之间进行通信。
	- `Broadcast Channel API`: 允许同一浏览器的不同窗口或标签页之间进行通信。
	- `EventEmitter`: 一种发布/订阅模式的实现，用于组件之间的通信。
	- `CustomEvent`: 一种自定义事件，用于组件之间的通信。
- **服务端通信**:
	- `WebRTC (Web Real-Time Communication)`: 允许浏览器之间进行点对点通信。
	- `GraphQL`: 一种查询语言，用于从服务器获取数据。

> 参见：[[Web通信方式]]

## 应用

- **数据获取**: 从服务器获取数据，用于渲染页面或更新用户界面。
- **实时通信**: 实现实时聊天、在线游戏等功能。
- **跨域访问**: 访问第三方 API 或服务。
- **组件通信**: 在不同的组件之间传递数据或触发事件。

## 优缺点

- 优点:
	- **灵活性**: 多种 Web 通信方式可供选择，适用于不同的场景。
	- **可扩展性**: 可以构建可扩展的网络服务。
	- **实时性**: 可以实现实时通信功能。
- 缺点:
	- **复杂性**: 需要掌握多种 Web 通信方式的细节和用法。
	- **安全性**: 需要考虑跨域安全问题。
	- **兼容性**: 需要考虑不同浏览器的兼容性问题。

## 相关概念

- [[HTTP]]: 一种用于传输超文本的协议。
- [[WebSocket]]: 一种全双工通信协议。
- [[CORS]]: 一种安全机制，允许跨域请求。

## 案例

- **使用 `fetch` 获取用户数据**:

	```javascript
  fetch('/api/users')
    .then(response => response.json())
    .then(data => console.log(data));
  ```

- **使用 `WebSocket` 实现实时聊天**:

	```javascript
  const socket = new WebSocket('ws://example.com/chat');
  socket.addEventListener('message', event => {
    console.log('Message from server ', event.data);
  });
  ```

- **使用 `postMessage` 进行跨域通信**:

	```javascript
  // 在 A 页面中
  const otherWindow = document.getElementById('iframe').contentWindow;
  otherWindow.postMessage('Hello from A', 'http://example.com');

  // 在 B 页面中 (http://example.com)
  window.addEventListener('message', event => {
    if (event.origin !== 'http://example.com') return;
    console.log('Message from A: ', event.data);
  });
  ```

## 问答卡片

> 参见：[[FAQ-Web通信]]

- Q1：什么是 CORS？如何解决跨域问题？
- A：CORS (Cross-Origin Resource Sharing) 是一种安全机制，用于控制跨域请求。可以通过配置服务器的 HTTP 响应头来允许跨域请求。
- Q2：WebSocket 和 HTTP 有什么区别？
- A：HTTP 是一种请求/响应协议，客户端发起请求，服务器返回响应。WebSocket 是一种全双工通信协议，允许服务器主动向客户端推送数据。

## 参考资料

- [MDN Web 开发者指南 - Web 技术](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Web_Technology)
- [HTTP 协议](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [WebSocket 协议](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

## 前端优先级

| 通信方式          | 必须掌握 | 推荐掌握 | 了解即可 |
| ------------- | ---- | ---- | ---- |
| fetch / axios | ✅    |      |      |
| WebSocket     | ✅    |      |      |
| postMessage   | ✅    |      |      |
| CORS / 同源策略   | ✅    |      |      |
| REST API      | ✅    |      |      |
| GraphQL       |      | ✅    |      |
| JSONP         |      |      | ✅    |
| WebRTC        |      |      | ✅    |
| EventEmitter  | ✅    |      |      |
| CustomEvent   | ✅    |      |      |
