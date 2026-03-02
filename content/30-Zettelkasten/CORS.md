---
title: CORS
aliases: [跨域资源共享]
date-created: 2025-05-23
date-modified: 2025-07-24
---

## 跨域资源共享 (Cross-Origin Resource Sharing, CORS)

## 定义

跨域资源共享 (CORS) 是一种机制，它使用额外的 HTTP 响应头来告诉浏览器，允许哪些源可以访问服务器的资源，从而实现安全的跨域请求。CORS 是一种 W3C 标准，它允许浏览器向跨源服务器发出 XMLHttpRequest 或 Fetch 请求，克服了同源策略的限制。

## 核心特点

- **安全性**：通过 HTTP 响应头来控制跨域访问权限，防止恶意网站窃取用户数据。
- **灵活性**：允许服务器指定哪些域名可以跨域访问其资源。
- **标准化**：CORS 是一种 W3C 标准，具有良好的兼容性。

## 请求类型

- **简单请求 (Simple Request)**：
		- 请求方法是 `GET`、`HEAD` 或 `POST`。
		- HTTP 头部的字段名只允许出现以下字段：
				- `Accept`
				- `Accept-Language`
				- `Content-Language`
				- `Content-Type` (只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`)
- **预检请求 (Preflight Request)**：
		- 当请求不符合简单请求的条件时，浏览器会先发送一个 `OPTIONS` 请求到服务器，以确定服务器是否允许跨域请求。

## 配置方式

- **服务器端配置**：
		- 通过设置 HTTP 响应头来启用 CORS。

## HTTP 响应头

- **`Access-Control-Allow-Origin`**：
		- 指定允许跨域访问的域名。
		- 可以设置为 `*`，表示允许所有域名跨域访问。
		- 如果请求需要携带 Cookie，则不能设置为 `*`，必须指定具体的域名。
- **`Access-Control-Allow-Methods`**：
		- 指定允许的 HTTP 请求方法。
		- 例如，`GET, POST, PUT, DELETE, OPTIONS`。
- **`Access-Control-Allow-Headers`**：
		- 指定允许的 HTTP 请求头。
		- 例如，`Content-Type, Authorization`。
- **`Access-Control-Allow-Credentials`**：
		- 指定是否允许发送 Cookie。
		- 设置为 `true` 时，表示允许发送 Cookie。
- **`Access-Control-Max-Age`**：
		- 指定预检请求的缓存时间，单位为秒。

## 应用示例

- **允许所有域名跨域访问**：

	```bash
	Access-Control-Allow-Origin: *

	```

- **允许指定域名跨域访问**：

	```bash
	Access-Control-Allow-Origin: https://example.com

	```

- **允许发送 Cookie**：

	```bash
	Access-Control-Allow-Origin: https://example.com
	Access-Control-Allow-Credentials: true

	```

## 优缺点

- **优点**：
		- 实现安全的跨域请求。
		- 灵活性高，可以根据实际需求配置跨域访问权限。
		- 标准化，具有良好的兼容性。
- **缺点**：
		- 配置复杂，容易出错。
		- 需要服务器端支持。

## 相关概念

- [[同源策略]]: 简述同源策略的概念和作用。
- [[跨域]]: 简述跨域的概念和场景。

## 案例（可选）

- 参见👉[[跨域解决方案#1. CORS (跨域资源共享)]]

## 参考资料

- MDN Cross-Origin Resource Sharing (CORS): [https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- CORS: [https://enable-cors.org/](https://enable-cors.org/)
