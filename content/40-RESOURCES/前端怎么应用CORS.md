---
uid: 202603240007
title: 前端怎么应用CORS
aliases: [Q-前端怎么应用CORS]
description: 前端开发者如何在实际项目中配置和使用CORS
tags: [前端开发/安全]
date-created: 2026-03-24
date-modified: 2026-03-23
status: active
content-type: question
---

> 前端怎么应用 CORS？

---

## 背景

CORS 是服务端控制的机制，前端无法直接 " 启用 "CORS，但需要理解如何在实际请求中正确配置。

---

## 现有答案

### 答案 1：前端不需要配置 CORS

**CORS 是服务端配置的**，前端开发者需要做的是：
1. 确认服务端已正确配置 CORS 响应头
2. 在前端代码中正确发送请求

### 答案 2：前端请求配置

**携带凭证**：

```javascript
fetch('https://api.example.com/data', {
  credentials: 'include'  // 发送 Cookie
})
```

**自定义请求头**：

```javascript
fetch('https://api.example.com/data', {
  headers: { 'X-Custom-Header': 'value' }
})
// 这会触发预检请求
```

### 答案 3：常见错误排查

| 错误 | 原因 | 解决 |
|:---|:---|:---|
| 跨域错误 | 服务端未配置 | 联系后端配置 |
| 凭证被拒绝 | 用了 * 但发送凭证 | 指定具体域名 |
| 预检失败 | 服务端未处理 OPTIONS | 后端配置允许 OPTIONS |

---

## 关联

- **相关概念**：[[CORS]]
- **相关概念**：[[同源策略]]
