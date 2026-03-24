---
uid: 202505230002
title: CSP
aliases: [C-CSP, Content Security Policy, 内容安全策略]
description: CSP是一种通过白名单机制控制资源加载的安全策略，用于防止XSS等攻击
tags: [前端开发/安全]
date-created: 2025-05-23
date-modified: 2026-03-23
status: active
content-type: concept
up: [[浏览器安全机制]]
---

> CSP（Content Security Policy，内容安全策略）是一种通过白名单机制控制资源加载的安全策略，用于减少 XSS、数据注入等攻击风险。

**解决的核心痛点**：如何在允许资源加载的同时，防止恶意代码执行？

---

## 核心命题

- [[CSP通过白名单机制控制资源加载来源]]
	- **原理**：只允许从指定域名加载脚本，阻止未知来源的恶意脚本
- [[CSP可以防御XSS和点击劫持等多种攻击]]
	- **原理**：限制 script-src 防止 XSS，限制 frame-ancestors 防止点击劫持

---

## 主要指令

| 指令 | 作用 |
|:---|:---|
| default-src | 所有资源的默认策略 |
| script-src | JavaScript 来源 |
| style-src | CSS 样式来源 |
| img-src | 图片来源 |
| frame-src | iframe 来源 |
| connect-src | AJAX、WebSocket 来源 |

---

## 常见配置

```http
# 仅允许同源
Content-Security-Policy: default-src 'self'

# 允许特定域名
Content-Security-Policy: script-src 'self' https://trusted.com

# 禁止内联脚本（安全）
Content-Security-Policy: script-src 'self'
```

---

## 知识图谱

- **父级概念**：[[浏览器安全机制]] — CSP 是浏览器安全策略的一部分
- **相关概念**：
	- [[XSS]] — CSP 主要防御的攻击类型
	- [[点击劫持]] — CSP 的 frame-ancestors 可防御
