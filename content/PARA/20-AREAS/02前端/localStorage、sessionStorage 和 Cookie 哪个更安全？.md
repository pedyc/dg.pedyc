---
title: localStorage、sessionStorage 和 Cookie 哪个更安全？
date-created: 2025-05-26
date-modified: 2025-05-26
---

httpOnly Cookie 最安全，不可被 JavaScript 访问，防止 XSS 泄露。localStorage 和 sessionStorage 容易被 XSS 攻击获取。推荐 Token 存储在 Cookie，并设置 httpOnly、Secure 和 SameSite 属性。
