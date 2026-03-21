---
content-type: atomic
title: Fetch API
date-created: 2025-05-19
date-modified: 2025-05-28
---

## Fetch API

### 定义

Fetch API 提供了一个获取资源的接口。 它提供了一种更强大、更灵活的方式来发送 HTTP 请求，替代了传统的 XMLHttpRequest。

### 核心概念

- **Request 对象**：表示一个 HTTP 请求。 可以通过 `new Request()` 构造函数创建 Request 对象。
- **Response 对象**：表示一个 HTTP 响应。 Fetch API 返回的 Promise 对象会 resolve 为一个 Response 对象。

### 接口和方法

- **fetch()**：发起一个 HTTP 请求。
		- 语法：`fetch(url, options)`
		- 参数：
				- `url`：请求的 URL。
				- `options`：可选的配置对象，包括 method、headers、body 等。
		- 返回值：一个 Promise 对象，resolve 为一个 Response 对象。
- **Response 对象的方法**：
		- `response.json()`：将响应体解析为 JSON 对象。
		- `response.text()`：将响应体解析为文本。
		- `response.blob()`：将响应体解析为 Blob 对象。
		- `response.formData()`：将响应体解析为 FormData 对象。
		- `response.arrayBuffer()`：将响应体解析为 ArrayBuffer 对象。
		- `response.clone()`：创建一个 Response 对象的副本。
		- `response.headers`：返回一个 Headers 对象，包含响应头信息。
		- `response.ok`：返回一个布尔值，表示响应是否成功（状态码在 200-299 之间）。
		- `response.redirected`：返回一个布尔值，表示响应是否被重定向。
		- `response.status`：返回响应的状态码。
		- `response.statusText`：返回响应的状态文本。
		- `response.type`：返回响应的类型（例如 basic、cors、default、opaque、opaqueredirect）。
		- `response.url`：返回响应的 URL。
- **Headers 对象**：表示 HTTP 头部。
		- `headers.append(name, value)`：添加一个头部。
		- `headers.delete(name)`：删除一个头部。
		- `headers.get(name)`：获取一个头部的值。
		- `headers.has(name)`：判断是否存在某个头部。
		- `headers.set(name, value)`：设置一个头部的值。
		- `headers.forEach(callback)`：遍历所有头部。

### 使用示例

#### 发送 GET 请求

```javascript
fetch('https://example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## 参考

👉[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
