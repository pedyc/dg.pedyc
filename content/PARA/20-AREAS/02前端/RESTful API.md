---
title: RESTful API
description: RESTful API 是一种设计风格，用于构建可扩展的 Web 服务。
tags: [前端, 后端, API, REST]
date-created: 2025-05-21
date-modified: 2025-05-21
content-type: concept
keywords: [RESTful API, REST, API, Web API]
para: area
zettel: literature
---

## 核心定义

RESTful API 是一种设计风格，用于构建可扩展的 Web 服务。 它基于 REST (Representational State Transfer) 架构风格，强调使用标准的 HTTP 方法对资源进行操作。

## 关键要点

- **资源 (Resource)：** RESTful API 的核心是资源，每个资源都应该有一个唯一的 URI (Uniform Resource Identifier)。
- **HTTP 方法 (HTTP Methods)：** RESTful API 使用标准的 HTTP 方法对资源进行操作，例如：
		- `GET`：获取资源。
		- `POST`：创建资源。
		- `PUT`：更新资源。
		- `DELETE`：删除资源。
- **表述 (Representation)：** 资源可以有多种表述形式，例如 JSON、XML 等。
- **无状态 (Stateless)：** RESTful API 是无状态的，服务器不应该保存客户端的状态信息。
- **统一接口 (Uniform Interface)：** RESTful API 应该提供统一的接口，方便客户端使用。

## 设计原则

- **客户端 - 服务器 (Client-Server)：** 客户端和服务器应该分离，客户端负责用户界面，服务器负责数据存储和处理。
- **无状态 (Stateless)：** 服务器不应该保存客户端的状态信息，每个请求都应该包含足够的信息，以便服务器能够处理。
- **可缓存 (Cacheable)：** 客户端可以缓存服务器的响应，提高性能。
- **分层系统 (Layered System)：** 客户端可以通过中间层与服务器通信，提高可扩展性。
- **按需代码 (Code on Demand)：** 服务器可以向客户端发送可执行代码，扩展客户端的功能（可选）。
- **统一接口 (Uniform Interface)：**
		- **资源识别 (Identification of Resources)：** 每个资源都应该有一个唯一的 URI。
		- **资源操作 (Manipulation of Resources Through Representations)：** 客户端通过表述来操作资源。
		- **自描述消息 (Self-Descriptive Messages)：** 每个消息都应该包含足够的信息，以便接收者能够处理。
		- **超媒体即应用状态引擎 (Hypermedia as the Engine of Application State, HATEOAS)：** 客户端通过服务器提供的超媒体链接来发现和操作资源。

## 优点

- **简单易用：** RESTful API 基于 HTTP 协议，易于理解和使用。
- **可扩展性：** RESTful API 是无状态的，易于扩展。
- **灵活性：** RESTful API 支持多种表述形式，可以满足不同的需求。
- **可缓存性：** RESTful API 可以利用 HTTP 缓存机制，提高性能。

## 缺点

- **过度获取 (Over-fetching)：** 客户端可能会获取到不需要的数据。
- **多次请求 (Multiple Roundtrips)：** 客户端可能需要发送多个请求才能获取所需的数据。
- **HATEOAS 的复杂性：** 实现 HATEOAS 比较复杂。

## 内部联系

- [[HTTP]]: RESTful API 基于 HTTP 协议。
- [[Web API]]: RESTful API 是一种 Web API 设计风格。
- [[GraphQL]]: GraphQL 是一种替代 RESTful API 的方案，可以解决 RESTful API 的一些问题。

## 后续优化建议

- 可以进一步介绍 RESTful API 的设计原则，例如 HATEOAS。
- 可以介绍 RESTful API 的安全性和版本控制。
- 可以介绍 RESTful API 的测试方法。
