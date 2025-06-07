---
title: CSRF
date-created: 2025-05-23
date-modified: 2025-06-02
---

## 定义

CSRF (Cross-Site Request Forgery，跨站请求伪造) 是一种 Web 安全漏洞，攻击者通过伪造用户的请求，以用户的身份执行非用户本意的操作。通常发生在用户已经登录受信任网站后，访问了攻击者构造的恶意页面，该页面利用用户的登录信息，向受信任网站发起请求，从而达到攻击的目的。

## 核心特点

- **伪造请求**: 攻击者伪造用户的请求，而不是直接窃取用户的密码或 Cookie。
- **利用用户身份**: 攻击者利用用户已登录的身份，冒充用户发送恶意请求。
- **跨站攻击**: 攻击发生在不同的站点之间，攻击者在恶意网站上构造请求，发送到受信任的网站。

## 攻击原理

1. 用户登录受信任的网站 A，并在本地生成 Cookie。
2. 用户在没有登出网站 A 的情况下，访问了恶意网站 B。
3. 网站 B 包含一些恶意代码，这些代码会自动向网站 A 发起请求。
4. 由于用户在网站 A 已经登录，所以请求会携带网站 A 的 Cookie。
5. 网站 A 在接收到请求后，会认为是用户发起的合法请求，从而执行相应的操作。

## 危害

- **账户被盗**: 攻击者可以利用 CSRF 漏洞盗取用户的账户。
- **信息泄露**: 攻击者可以利用 CSRF 漏洞获取用户的敏感信息。
- **恶意操作**: 攻击者可以利用 CSRF 漏洞执行非用户本意的操作，例如修改密码、发送邮件等。

## 防御手段

- **验证码**: 在执行敏感操作时，要求用户输入验证码，以确认是用户本人的操作。
- **Referer Check**: 检查请求的 Referer 字段，如果 Referer 不是来自受信任的域名，则拒绝请求。
- **Token 验证**: 在请求中添加一个随机的 Token，服务器在接收到请求后，验证 Token 是否合法。
- **SameSite Cookie**: 设置 Cookie 的 SameSite 属性，限制 Cookie 只能在同一站点中使用。

## 示例

假设用户登录了银行网站 A，并通过 GET 请求修改了用户的账户信息：

`https://bank.example.com/transfer?account=victim&amount=100`

攻击者可以在恶意网站 B 中构造一个相同的请求：

`<img src="https://bank.example.com/transfer?account=victim&amount=100">`

当用户访问恶意网站 B 时，浏览器会自动发起对银行网站 A 的请求，如果用户已经登录了银行网站 A，那么这个请求就会成功执行，从而导致用户的账户被盗。

## 防御手段示例 (Token 验证)

```html
<!-- HTML 表单 -->
<form action="https://bank.example.com/transfer" method="POST">
  <input type="hidden" name="account" value="victim">
  <input type="hidden" name="amount" value="100">
  <input type="hidden" name="csrf_token" value="随机生成的 Token">
  <button type="submit">转账</button>
</form>
```

```javascript
// JavaScript 生成 Token
function generateToken() {
  const token = Math.random().toString(36).substring(2);
  return token;
}

// 在请求中添加 Token
const form = document.querySelector('form');
const tokenInput = document.createElement('input');
tokenInput.type = 'hidden';
tokenInput.name = 'csrf_token';
tokenInput.value = generateToken();
form.appendChild(tokenInput);
```

## 相关概念

- [[XSS]]: 跨站脚本攻击，是一种通过在受信任的网站上注入恶意脚本，使得用户在浏览网页时，恶意脚本得以执行，从而窃取用户信息、篡改页面内容或进行其他恶意操作的攻击。
- [[Clickjacking]]：点击劫持，通过 iframe 诱导用户进行不期望的操作
- [[SQL 注入]]: 是一种通过在用户输入中注入恶意 SQL 代码，从而篡改数据库的攻击。
- [[Same-Origin Policy]]: 同源策略，是一种重要的浏览器安全策略，用于限制来自不同源的脚本对当前文档或数据的访问。

## 问答卡片

- Q1：CSRF 攻击的原理是什么？
- A：CSRF 攻击的原理是攻击者通过伪造用户的请求，利用用户已登录的身份，冒充用户发送恶意请求，从而达到攻击的目的。
- Q2：如何防御 CSRF 攻击？
- A：可以采取多种防御手段，包括验证码、Referer Check、Token 验证和 SameSite Cookie 等。

## 参考资料

- OWASP CSRF (Cross-Site Request Forgery): [https://owasp.org/www-project-site/top-ten/](https://owasp.org/www-project-site/top-ten/)
- MDN Web Security: [https://developer.mozilla.org/en-US/docs/Glossary/CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)
