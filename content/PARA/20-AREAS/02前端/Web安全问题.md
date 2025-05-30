---
title: Web安全问题
aliases: [7大Web核心安全问题]
date-created: 2025-05-26
date-modified: 2025-05-26
---

## 7 大 Web 核心安全问题

1. [[XSS]]（跨站脚本攻击）✅✅

> 攻击者向页面注入恶意 JavaScript 脚本

 🔥 前端如何防范

- 输出内容必须转义（尤其是 `innerHTML`）
- 使用可信模板引擎（React、Vue 默认防 XSS）
- 避免将用户输入插入到 DOM 中
- CSP（内容安全策略）限制脚本执行源
- 输入校验不是防 XSS 的核心，**输出才是重点**

 2. [[CSRF]]（跨站请求伪造） ✅✅

> 用户在已登录状态下，被恶意页面发起请求劫持

🔥 前端如何防范

- 对非 GET 请求使用 CSRF Token（由后端生成）
- 使用 `SameSite` Cookie 策略（建议设置为 `Strict` 或 `Lax`）
- 对关键操作使用验证码或双重确认

 3. [[Clickjacking]]（点击劫持） ✅

> 页面被恶意嵌入 iframe 中，诱导用户点击

🔥 前端如何防范

- 设置 HTTP 响应头：`X-Frame-Options: DENY` 或 `SAMEORIGIN`
- 或通过 CSP：`frame-ancestors 'none';`
- 在页面中检测自己是否在顶层（`window.top === window.self`）

 4. 开放重定向攻击 🔶

> 攻击者构造 URL，诱导用户跳转到恶意站点

🔥 前端如何防范

- 不信任 URL 参数中传入的跳转地址
- 限制可跳转的白名单域名（如只允许本站内跳转）
- 不将用户输入拼接到 `window.location.href`

 5. 敏感信息泄露 ✅

> 把 Token、密码、用户 ID 等信息暴露在浏览器端

🔥 前端如何防范

- 不在 URL 中暴露敏感信息（GET 请求参数会被浏览器记录）
- 不将 Token 存储在 `localStorage`（易被 XSS 获取）
- 避免控制台输出敏感数据
- 对调试接口做访问控制（禁用接口文档、GraphQL IDE 等）

 6. CORS 滥用与误解 ✅

> CORS 是浏览器的限制机制，不是安全机制本身

🔥 前端应该知道

- CORS 由服务端控制，不应认为配置 `Access-Control-Allow-Origin: *` 是安全的
- Credential 模式下 `Origin: *` 会失效
- 使用带认证的跨域请求需设置：
	- `withCredentials: true`
	- `Access-Control-Allow-Credentials: true`

 7. 依赖库中的漏洞

> 使用了含有安全漏洞的第三方库（如某版本 jQuery）

 🔥 前端该如何做

- 使用工具扫描依赖漏洞（如 npm audit、Snyk）
- 定期更新依赖
- 不使用不可信第三方脚本（如 CDN 脚本）
 1. [[XSS]]（跨站脚本攻击）✅✅

> 攻击者向页面注入恶意 JavaScript 脚本

 🔥 前端如何防范

- 输出内容必须转义（尤其是 `innerHTML`）
- 使用可信模板引擎（React、Vue 默认防 XSS）
- 避免将用户输入插入到 DOM 中
- CSP（内容安全策略）限制脚本执行源
- 输入校验不是防 XSS 的核心，**输出才是重点**

 2. [[CSRF]]（跨站请求伪造） ✅✅

> 用户在已登录状态下，被恶意页面发起请求劫持

🔥 前端如何防范

- 对非 GET 请求使用 CSRF Token（由后端生成）
- 使用 `SameSite` Cookie 策略（建议设置为 `Strict` 或 `Lax`）
- 对关键操作使用验证码或双重确认

 3. [[Clickjacking]]（点击劫持） ✅

> 页面被恶意嵌入 iframe 中，诱导用户点击

🔥 前端如何防范

- 设置 HTTP 响应头：`X-Frame-Options: DENY` 或 `SAMEORIGIN`
- 或通过 CSP：`frame-ancestors 'none';`
- 在页面中检测自己是否在顶层（`window.top === window.self`）

 4. 开放重定向攻击 🔶

> 攻击者构造 URL，诱导用户跳转到恶意站点

🔥 前端如何防范

- 不信任 URL 参数中传入的跳转地址
- 限制可跳转的白名单域名（如只允许本站内跳转）
- 不将用户输入拼接到 `window.location.href`

 5. 敏感信息泄露 ✅

> 把 Token、密码、用户 ID 等信息暴露在浏览器端

🔥 前端如何防范

- 不在 URL 中暴露敏感信息（GET 请求参数会被浏览器记录）
- 不将 Token 存储在 `localStorage`（易被 XSS 获取）
- 避免控制台输出敏感数据
- 对调试接口做访问控制（禁用接口文档、GraphQL IDE 等）

 6. CORS 滥用与误解 ✅

> CORS 是浏览器的限制机制，不是安全机制本身

🔥 前端应该知道

- CORS 由服务端控制，不应认为配置 `Access-Control-Allow-Origin: *` 是安全的
- Credential 模式下 `Origin: *` 会失效
- 使用带认证的跨域请求需设置：
	- `withCredentials: true`
	- `Access-Control-Allow-Credentials: true`

 7. 依赖库中的漏洞 🔥

> 使用了含有安全漏洞的第三方库（如某版本 jQuery）

 🔥 前端该如何做

- 使用工具扫描依赖漏洞（如 npm audit、Snyk）
- 定期更新依赖
- 不使用不可信第三方脚本（如 CDN 脚本）
