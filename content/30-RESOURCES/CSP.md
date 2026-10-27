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
up: "[[Web安全策略]]"
---

> CSP（Content Security Policy，内容安全策略）是一种通过白名单机制控制资源加载的安全策略，用于减少 XSS、数据注入等攻击风险。

**解决的核心痛点**：如何在允许资源加载的同时，防止恶意代码执行？

---

## 核心命题

- [[CSP把资源加载从默认放行改为按策略判定]]
	- **原理**：在取 / 解析 / 执行三处插入判定点，依据预先声明的策略决定放行或拦截；判的是来源，不是行为
- 「开哪些指令、怎么灰度、报告怎么收」属于策略侧，归 [[Web安全策略]]；本页只给指令与配置的对照

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

## 配置示例

- [[CSP 配置示例]] — 各种场景下的 CSP 配置

## 知识图谱

- **上位**：[[浏览器安全机制]] — 判定机制上的认知上位。注意 `up` 挂的是 [[Web安全策略]]：本页正文讲指令与配置，存档位置在策略侧。两处不一致是分工使然，见 [[元数据规范]]
- **相关**：
	- [[XSS]] — CSP 主要防御的攻击类型
	- [[点击劫持]] — CSP 的 frame-ancestors 可防御
