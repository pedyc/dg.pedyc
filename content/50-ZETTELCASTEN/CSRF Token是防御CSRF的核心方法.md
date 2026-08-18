---
uid: 202603240001
title: CSRF Token是防御CSRF的核心方法
aliases: []
description: 攻击者无法读取页面中的 Token，无法伪造请求
tags: [前端开发/安全/原子]
date-created: 2026-03-24
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[CSRF]]
---

> CSRF Token 是防御 CSRF 的核心方法

攻击者无法读取目标页面的内容，因此无法获取页面中嵌入的 CSRF Token，从而无法伪造有效的请求。

## 工作原理

1. **服务端生成**：用户访问页面时，服务端生成一个随机 Token
2. **页面嵌入**：Token 嵌入到表单隐藏域或请求头
3. **请求携带**：用户提交请求时，Token 随请求一起发送
4. **服务端验证**：服务端验证 Token 是否匹配

## 实现方式

**表单隐藏域**：

```html
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="abc123...">
  <button>转账</button>
</form>
```

**请求头**：

```javascript
fetch('/api/delete', {
  method: 'POST',
  headers: { 'X-CSRF-Token': token }
})
```

## 为什么有效

- 攻击者的恶意页面无法读取目标网站的 DOM（同源策略）
- 攻击者无法获取 Cookie 以外的请求头（除非存在 CORS 漏洞）
- 每次请求 Token 应变化，防止暴力破解
