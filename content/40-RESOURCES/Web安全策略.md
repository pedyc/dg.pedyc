---
uid: 202605290003
title: Web安全策略
aliases: [C-Web安全策略]
description: 通过 HTTP 响应头声明式配置的安全策略，保护 Web 应用免受常见攻击
tags: [前端/安全/策略]
date-created: 2026-05-29
date-modified: 2026-05-29
status: cultivated
content-type: concept
---

## 概念：Web 安全策略

> **主题**：#前端/安全

### 核心命题

Web 安全策略是通过 HTTP 响应头声明式配置的安全机制，浏览器根据这些头部自动 enforcement 安全行为，无需前端代码介入。

### 运行机制

```bash
服务器配置安全响应头 → 浏览器解析并强制执行 → 防止特定 Web 攻击
```

### 关键策略

| 策略 | 响应头 | 作用 |
|------|--------|------|
| 强制 HTTPS | [[HSTS]]（Strict-Transport-Security） | 防止 HTTP 明文传输 |
| 内容安全 | [[CSP]]（Content-Security-Policy） | 限制资源加载来源 |
| 防点击劫持 | X-Frame-Options | 控制页面是否可被嵌入 iframe |
| 防 MIME 嗅探 | X-Content-Type-Options: nosniff | 强制浏览器遵循 Content-Type |
| 防引用泄漏 | Referrer-Policy | 控制 Referer 头部发送策略 |

### 知识图谱

- **子级概念**：
	- [[HSTS]] — 强制 HTTPS 策略
	- [[CSP]] — 内容安全策略
- **相关概念**：
	- [[Web安全]] — Web 安全的整体话题（待创建）
	- [[HTTPS]] — 安全传输协议基础
