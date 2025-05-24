---
title: HTTP
date-created: 2025-05-16
date-modified: 2025-05-21
content-type: concept
zettel: permanent
---

## 定义

HTTP（Hypertext Transfer Protocol，超文本传输协议）是一种用于在 Web 服务器和客户端之间传输数据的协议 🌐。它是构建在 TCP/IP 协议之上的应用层协议。

## 核心特点

- 基于请求 - 响应模型：客户端发送请求，服务器返回响应 📤。
- 无状态：服务器不保存客户端的任何状态信息 🧑‍💻。
- 支持多种数据格式：可以传输文本、图像、音频、视频等多种类型的数据 📦。
- 使用 URI 定位资源：通过 URI（统一资源标识符）来标识和定位 Web 上的资源 📍。
- 支持持久连接（HTTP/1.1 及以上）：减少了 TCP 连接的开销，提高了性能。
- 支持内容协商：客户端和服务器可以协商使用哪种数据格式。

## 分类

- HTTP/0.9：只支持 GET 方法，不支持头部。
- HTTP/1.0：引入了头部、状态码等概念。
- [[HTTP/1.1]]：引入了持久连接、管道化等优化。
- [[HTTP/2]]：使用多路复用、头部压缩等技术，提高了性能。
- [[HTTP/3]]：基于 QUIC 协议，进一步提高了性能和安全性。

## 工作原理

1. 客户端发起 HTTP 请求，包括请求方法、URI、头部等信息。
2. 服务器接收到请求后，根据 URI 查找对应的资源。
3. 服务器处理请求，生成 HTTP 响应，包括状态码、头部和响应体。
4. 服务器将响应发送给客户端。
5. 客户端接收到响应后，解析响应内容并进行处理。

## 应用

- 网页浏览：通过浏览器访问 Web 页面 💻。
- API 通信：用于不同系统之间的接口调用 🤝。
- 文件传输：上传和下载文件 🗂️。
- 移动应用：为移动应用提供数据支持。
- 物联网：用于设备之间的数据交换。

## 优缺点

- 优点: 简单易用，应用广泛，跨平台 👍，易于扩展。
- 缺点: 无状态导致每次请求都需要传递身份验证信息，安全性相对较低 👎，头部信息冗余。

## 相关概念

- [[TCP/IP协议]]: HTTP 基于 TCP/IP 协议进行数据传输 📶。
- [[URI]]: 用于标识和定位 Web 上的资源 🔗。
- [[HTTPS]]: 通过 SSL/TLS 加密的 HTTP 协议，提供更安全的通信 🔐。
- [[RESTful API]]: 一种基于 HTTP 协议的 API 设计风格。
- [[WebSocket]]: 一种支持双向通信的协议，可以用于实时应用。

## 参考资料

- [HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) 📚
- [[22-Everything you need to know about HTTP|Everything you need to know about HTTP]]📖
- [RFC 2616 - Hypertext Transfer Protocol -- HTTP/1.1](https://www.rfc-editor.org/rfc/rfc2616) 📜
- [RFC 7540 - Hypertext Transfer Protocol Version 2 (HTTP/2)](https://www.rfc-editor.org/rfc/rfc7540)
