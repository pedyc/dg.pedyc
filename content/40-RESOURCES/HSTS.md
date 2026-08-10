---
uid: 202505260001
title: HSTS
aliases: [T-HSTS]
description: HTTP 严格传输安全——强制浏览器使用 HTTPS 访问站点的人工安全策略头
tags: [前端/安全/HSTS]
date-created: 2025-05-26
date-modified: 2026-05-29
status: cultivated
content-type: term
---

## 术语：HSTS（HTTP 严格传输安全）

> **主题**：#前端/安全

### 定义

**HSTS**（HTTP Strict Transport Security，HTTP 严格传输安全）是一种 Web 安全策略机制，通过 `Strict-Transport-Security` 响应头声明浏览器只能通过 HTTPS 连接访问当前站点，防止 HTTP 明文传输和 SSL Stripping 攻击。

### 核心头信息

```http
Strict-Transport-Security: max-age=<expireTime>; includeSubDomains; preload
```

| 参数 | 说明 |
|------|------|
| `max-age` | HSTS 策略有效期（秒），主流站点建议 ≥ 31536000（1 年） |
| `includeSubDomains` | 可选，声明策略适用于所有子域名 |
| `preload` | 可选，申请加入浏览器内置预加载列表 |

### 知识网络

- **父级概念**：[[Web安全策略]] — HSTS 是 Web 安全策略的一种
- **相关概念**：
	- [[CSP]] — 内容安全策略，限制资源加载
	- [[HTTPS]] — 安全传输协议，HSTS 的前提条件
	- [[SSL Stripping]] — HSTS 主要防御的攻击类型
