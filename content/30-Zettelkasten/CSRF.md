---
title: CSRF
aliases: [Cross-Site Request Forgery, 跨站请求伪造]
tags: [领域/安全, 核心概念, 面试/高频]
date-created: 2025-12-17
date-modified: 2025-12-26
related: ["[[XSS]]", "[[Cookie安全]]", "[[同源策略]]"]
type: concept
---

## 🛡️ 核心概念：CSRF (跨站请求伪造)

### 🔎 核心定义

> [!abstract] " 借刀杀人 "
> **CSRF (Cross-Site Request Forgery)** 是一种利用用户**已登录身份**的攻击。
> 攻击者无法直接获取用户的 Cookie 或密码，而是利用浏览器**会自动携带 Cookie** 的机制，诱导用户的浏览器向受信任网站发送恶意请求（如转账、改密）。
>
> *一句话总结*：**服务器分不清请求是用户想发的，还是攻击者替用户发的。**

---

### 🎭 攻击剧本 (The Scenario)

```mermaid
graph TD
    User((🤦‍♂️ 用户))
    Bank["🏦 银行网站 (A)<br>已登录状态"]
    Hacker["🏴‍☠️ 恶意网站 (B)<br>埋藏攻击代码"]

    %% 步骤
    User -->|1. 正常登录| Bank
    Bank -->|2. 下发 Cookie (Session)| User
    User -->|3. 不慎访问| Hacker
    Hacker -->|4. 自动触发请求<br>(隐藏表单/图片)| Bank
    
    %% 关键点
    User -- "5. 浏览器自动携带 Cookie" --> Bank
    Bank -->|6. 验证 Cookie 成功<br>执行转账| Bank

    linkStyle 4 stroke:red,stroke-width:2px;
```

#### 攻击成立的三个条件

1. **登录状态**：用户在目标网站 A 登录，且 Cookie 未过期。
2. **访问陷阱**：用户访问了攻击者构造的网站 B。
3. **隐式凭证**：浏览器在跨域请求时，默认自动携带了网站 A 的 Cookie。

---

### 🛡️ 防御体系 (Defense Strategy)

防御 CSRF 的核心思路是：**让服务器能够区分 " 请求来源 "**。

#### 1. 核心防御：CSRF Token 🔥

这是最通用的防御手段（Synchronizer Token Pattern）。

- **原理**：

	1. 服务器在渲染页面或登录时，下发一个随机且加密的 `_csrf` Token（不存 Cookie，或存在 HTTPOnly Cookie 中）。
	2. 前端在发起请求（POST/PUT/DELETE）时，**手动**将该 Token 放入 Request Header 或 Body 中。
	3. 服务器验证：Cookie 里的 Session ID 对不对 + **手动传来的 Token 对不对**。
				
- **为什么能防**：攻击者虽然能利用浏览器自动发 Cookie，但它**读不到**页面里的 Token，也无法伪造这个随机值。

#### 2. 浏览器原生防御：SameSite Cookie

- **设置**：`Set-Cookie: key=value; SameSite=Strict`
- **作用**：
	- `Strict`：完全禁止第三方 Cookie（体验较差，点击外链进网站也是未登录）。
	- `Lax`：(现代浏览器默认) 允许导航栏跳转携带，但禁止 POST/图片/Iframe 等跨站请求携带 Cookie。
- **局限**：依赖浏览器版本，老旧浏览器不支持。

#### 3. 辅助防御：同源检测

- **Origin Header**：检查请求来源域名。
- **Referer Header**：检查请求来源页面。
- **注意**：Referer 可能被伪造或被隐私插件屏蔽，只能作为辅助。

---

### 💻 前端开发实战 (Implementation)

> [!warning] 修正误区
>
> 前端不能自己生成 CSRF Token（如用 Math.random），那是毫无意义的。Token 必须由服务端生成并给到前端。

#### 场景：如何在 Axios 中配置 CSRF Token？

通常服务端会将 Token 放在 `meta` 标签中，或者通过 API 返回。

JavaScript

```javascript
import axios from 'axios';

// 1. 获取 Token (假设服务端渲染在 meta 标签中)
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// 2. 配置 Axios 全局拦截器
const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use(config => {
  // 只对修改数据的请求添加 Token
  if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
    // 约定 Header Key，如 'X-CSRF-TOKEN' 或 'X-XSRF-TOKEN'
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// 或者：如果服务端将 Token 放在 Cookie 中（非 HttpOnly），Axios 有自动提取功能
// axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
// axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
```

---

### 🆚 核心辨析：CSRF vs XSS

这是面试中最容易混淆的两个概念：

|**维度**|**CSRF (跨站请求伪造)**|**XSS (跨站脚本攻击)**|
|---|---|---|
|**攻击原理**|**借用**用户的权限 (偷懒)|**盗取**用户的权限 (硬核)|
|**核心手段**|诱导浏览器自动发请求|注入恶意 JS 代码运行|
|**能否拿到数据**|**不能** (只能执行动作，如转账)|**能** (能读取页面内容、Cookie)|
|**防御核心**|Token / SameSite / Referer|转义输出 / CSP / HttpOnly|

---

### 📝 自检清单 (Checklist)

- [ ] **代码审查**：所有涉及状态改变（增删改）的 API，是否强制要求 `POST` 方法？（GET 请求极易被 CSRF 利用，如 `<img src="…">`）。
- [ ] **配置检查**：Set-Cookie 时是否默认开启了 `SameSite=Lax`？
- [ ] **架构设计**：如果是前后端分离项目，是否约定了 CSRF Token 的传递机制（Header 还是 Cookie）？
- [ ] **面试题**：Token 放在 Cookie 里安全吗？

	- *答案*：如果是为了防 CSRF，Token **不能只**放在 Cookie 里让浏览器自动发（那样就失效了）。通常是 " 双重 Cookie 验证 " 模式：Cookie 存一份，Header 手动取出来发一份，服务端比对两者是否一致。

### 📚 参考资料

- [[MDN Web Security]]
- [[OWASP Top 10]]
