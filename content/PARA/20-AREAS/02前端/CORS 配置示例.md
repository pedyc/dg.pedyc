---
title: CORS 配置示例
date-created: 2025-05-23
date-modified: 2025-05-23
---

## CORS 配置示例

## 记录内容

### 1. 简单请求的 CORS 配置

简单请求是指满足以下所有条件的请求：

- 请求方法是 `GET`、`HEAD` 或 `POST`。
- HTTP 头部的字段名只允许出现以下字段：
		- `Accept`
		- `Accept-Language`
		- `Content-Language`
		- `Content-Type` (只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`)
- 请求中的任意 `XMLHttpRequestUpload` 对象均没有注册任何事件监听器。
- 请求中没有使用 `ReadableStream` 对象。

**服务器端配置示例 (Node.js with Express):**

```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 允许所有域名跨域访问
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 允许的请求方法
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
  next();
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

**解释：**

- `Access-Control-Allow-Origin: *`：允许所有域名跨域访问。也可以指定具体的域名，例如 `https://example.com`。
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`：允许的请求方法。
- `Access-Control-Allow-Headers: Content-Type`：允许的请求头。

**适用场景：**

- 适用于简单的跨域请求，例如从一个域名下的网页请求另一个域名下的 API 接口。

**注意事项：**

- 在生产环境中，不建议使用 `Access-Control-Allow-Origin: *`，因为它会允许所有域名跨域访问，存在安全风险。
- 应该根据实际需求，精确地指定允许跨域访问的域名和请求方法。

### 2. 预检请求的 CORS 配置

预检请求 (Preflight Request) 是指在发送实际请求之前，浏览器会先发送一个 `OPTIONS` 请求到服务器，以确定服务器是否允许跨域请求。当请求不符合简单请求的条件时，浏览器会自动发送预检请求。

**服务器端配置示例 (Node.js with Express):**

```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com'); // 允许 https://example.com 跨域访问
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的请求方法
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头
  res.header('Access-Control-Allow-Credentials', 'true'); // 允许发送 Cookie
  res.header('Access-Control-Max-Age', '86400'); // 预检请求的缓存时间 (单位：秒)
  next();
});

app.options('/data', (req, res) => {
  res.sendStatus(200); // 响应 OPTIONS 请求
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

**解释：**

- `Access-Control-Allow-Origin: https://example.com`：允许 `https://example.com` 跨域访问。
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`：允许的请求方法，必须包含 `OPTIONS`。
- `Access-Control-Allow-Headers: Content-Type, Authorization`：允许的请求头。
- `Access-Control-Allow-Credentials: true`：允许发送 Cookie。
- `Access-Control-Max-Age: 86400`：预检请求的缓存时间，单位为秒。

**适用场景：**

- 适用于复杂的跨域请求，例如使用了自定义请求头、非简单请求方法或需要发送 Cookie 的请求。

**注意事项：**

- 需要处理 `OPTIONS` 请求，并返回 `200 OK` 状态码。
- `Access-Control-Allow-Credentials: true` 必须与客户端的 `withCredentials = true` 配合使用。
- `Access-Control-Allow-Origin` 不能设置为 `*`，如果 `Access-Control-Allow-Credentials` 设置为 `true`。

```bash
