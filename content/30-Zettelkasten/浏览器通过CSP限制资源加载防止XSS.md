---
uid: 202603230018
title: 浏览器通过 CSP 限制资源加载防止 XSS
aliases: []
description: CSP 是白名单机制，通过响应头告诉浏览器允许加载哪些资源
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[浏览器安全机制]]
---

> 浏览器通过 CSP（Content Security Policy，内容安全策略）限制资源加载和脚本执行，防止 XSS（跨站脚本攻击）。

### 论据/示例

**CSP 工作原理**：
- 服务器在响应头中添加 Content-Security-Policy
- 浏览器根据白名单决定是否加载资源
- 违规资源被阻止加载

**常见指令**：
```http
Content-Security-Policy:
    default-src 'self';  # 默认仅允许同源
    script-src 'self' https://trusted.com;  # 仅允许指定域名
    img-src *;  # 允许所有图片
    style-src 'self' 'unsafe-inline';  # 允许内联样式（不安全）
```

**XSS 防御**：
- 禁止加载外部脚本：`script-src 'self'`
- 禁止内联脚本：``script-src 'self'``
- 禁止 eval：`script-src 'self'`

### 关联

- [[浏览器安全机制]] — 本观点的主题
- [[CSP]] — CSP 的详细配置
- [[XSS]] — CSP 防御的目标攻击
