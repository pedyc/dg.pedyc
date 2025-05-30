---
title: FAQ-Web安全
date-created: 2025-05-28
date-modified: 2025-05-30
---

| 示例题目                                             | 模块              | 知识点                                                   |
| ------------------------------------------------ | --------------- | ----------------------------------------------------- |
| [[什么是 CSRF 攻击？前端如何防止？]]                          | CSRF 与防护策略      | 攻击原理、同源策略限制、Token 验证、Referer 检查、SameSite 属性           |
| [[什么是 XSS 攻击？前端可以如何防御？]]                         | XSS 与防护策略       | 攻击类型（反射型、存储型、DOM 型）、防御策略（转义、白名单过滤、CSP）                |
| [[Cookie 的 HttpOnly、Secure、SameSite 属性分别有什么作用？]] | Cookie 安全属性     | 防止 XSS 窃取 Cookie、防止跨站传输、防止跨站请求伪造                      |
| [[Content Security Policy（CSP）是如何防止 XSS 的？]]     | CSP 策略配置        | 限制资源加载来源、默认阻止内联脚本、script-src 指令                       |
| [[JWT 的安全性问题有哪些？前端应该注意什么？]]                      | JWT 安全注意事项      | Token 泄露、有效期控制、不可存储在 localStorage、签名算法注意点             |
| [[OAuth2 登录流程中可能存在哪些前端安全问题？]]                    | OAuth2 协议安全     | Token 泄露、中间人攻击、重定向劫持、防止 CSRF                          |
| [[前端如何应对中间人攻击（MITM）？]]                           | HTTPS 与 MITM 防护 | 使用 HTTPS、校验证书、防止降级攻击                                  |
| [[如何防止第三方脚本注入攻击？]]                               | 资源安全策略          | 子资源完整性（SRI）、CSP、对第三方资源来源进行校验                          |
| [[前端如何防止点击劫持？]]                                  | 点击劫持防护策略        | 使用 `X-Frame-Options` 或 `frame-ancestors` 限制 iframe 嵌入 |
| [[浏览器中的同源策略限制了哪些行为？如何安全地实现跨域？]]                  | 同源策略与限制         | DOM 访问、Cookie 共享、AJAX 跨域、跨域通信方案（CORS、postMessage）     |
