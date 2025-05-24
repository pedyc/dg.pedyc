---
title: Web安全
date-created: 2025-05-19
date-modified: 2025-05-23
---

> [!hint] Web 安全不是后端的专利，前端工程师必须具备扎实的安全意识。即使不涉及具体的加密算法实现，也需要理解攻击原理、常见防御手段、浏览器安全机制，才能写出「不作死」的代码。

## 🧠 一、核心理念：安全不是加功能，而是加限制

前端安全的目标不是 " 让代码能跑 "，而是 " 让代码跑得受控 "。常见问题恰恰出在「开放得太多、信任得太早」。

## 🚨 二、7 大核心安全问题（前端角度）

 1. [[XSS]]（跨站脚本攻击）**✅✅

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

## 🔒 三、浏览器安全机制（了解 & 利用）

|机制|简述|前端能做什么|
|---|---|---|
|同源策略|限制不同源之间的 JS、Cookie、DOM 访问|理解其限制，有助于跨域设计|
|CSP（内容安全策略）|限制页面能执行哪些脚本、加载哪些资源|可配置 headers，防 XSS|
|HSTS|强制 HTTPS|虽后端配置，但前端应测试覆盖|
|XSS Auditor（已废弃）|Chrome 曾用来拦截 XSS|了解即可，不再依赖|
|Cookie 的 SameSite 属性|限制第三方请求携带 Cookie|设置 `SameSite=Strict` 加强 CSRF 防护|

👉参见 [[浏览器安全机制]]

## 🧩 四、补充：前端开发实践中的安全建议

- 避免 eval、new Function、with 等危险语法
- 对所有输入进行**白名单校验**
- 上传文件时检查 MIME 类型和后缀
- 表单中隐藏字段不可作为安全依据
- 使用 HTTPS，避免明文传输 Cookie、Token

## 📌 总结：前端必备安全知识清单

| 安全类型         | 前端是否负责  | 是否面试常考 | 是否必须掌握 |
| ------------ | ------- | ------ | ------ |
| XSS          | ✅ 主动防御  | ✅ 高频   | ✅ 必须   |
| CSRF         | ⚠️协作防御  | ✅ 高频   | ✅ 必须   |
| Clickjacking | ⚠️ 配合设置 | ⛔️ 低频  | ✅ 必须   |
| 依赖漏洞         | ✅ 维护更新  | ⛔️ 低频  | ✅ 必须   |
| CORS 理解      | ✅ 主动掌握  | ✅ 常考   | ✅ 必须   |
| URL 重定向      | ✅ 主动验证  | ⛔️ 较少  | 🔶 推荐  |
| Token 存储安全   | ✅ 主动设计  | ✅ 高频   | ✅ 必须   |
| 浏览器安全机制      | ✅ 理解为主  | ✅ 高频   | ✅ 必须   |

## 🔎参考

- https://developer.mozilla.org/zh-CN/docs/Web/Security
