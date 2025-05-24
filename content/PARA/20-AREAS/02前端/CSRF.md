---
title: CSRF
date-created: 2025-05-23
date-modified: 2025-05-23
---

## CSRF (Cross-Site Request Forgery，跨站请求伪造)

## 定义

CSRF 是一种 Web 安全漏洞，攻击者通过伪造用户的请求，以用户的身份执行非用户本意的操作。通常发生在用户已经登录受信任网站后，访问了攻击者构造的恶意页面，该页面利用用户的登录信息，向受信任网站发起请求，从而达到攻击的目的。

## 攻击原理

1. 用户登录受信任的网站 A，并在本地生成 Cookie。
2. 用户在没有登出网站 A 的情况下，访问了恶意网站 B。
3. 网站 B 包含一些恶意代码，这些代码会自动向网站 A 发起请求。
4. 由于用户在网站 A 已经登录，所以请求会携带网站 A 的 Cookie。
5. 网站 A 在接收到请求后，会认为是用户发起的合法请求，从而执行相应的操作。

## 示例

假设用户登录了银行网站 A，并通过 GET 请求修改了用户的账户信息：

`https://bank.example.com/transfer?account=victim&amount=100`

攻击者可以在恶意网站 B 中构造一个相同的请求：

`<img src="https://bank.example.com/transfer?account=victim&amount=100">`

当用户访问恶意网站 B 时，浏览器会自动发起对银行网站 A 的请求，如果用户已经登录了银行网站 A，那么这个请求就会成功执行，从而导致用户的账户被盗。

## 防御手段

- **验证码**：在执行敏感操作时，要求用户输入验证码，以确认是用户本人的操作。
- **Referer Check**：检查请求的 Referer 字段，如果 Referer 不是来自受信任的域名，则拒绝请求。
- **Token 验证**：在请求中添加一个随机的 Token，服务器在接收到请求后，验证 Token 是否合法。
- **SameSite Cookie**：设置 Cookie 的 SameSite 属性，限制 Cookie 只能在同一站点中使用。

## 参考资料

- OWASP CSRF (Cross-Site Request Forgery): [https://owasp.org/www-project-site/top-ten/](https://owasp.org/www-project-site/top-ten/)
- MDN Web Security: [https://developer.mozilla.org/en-US/docs/Glossary/CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)
