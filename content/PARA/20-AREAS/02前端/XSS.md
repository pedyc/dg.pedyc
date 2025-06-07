---
title: XSS
date-created: 2025-05-23
date-modified: 2025-06-02
---

## 定义

XSS (Cross-Site Scripting，跨站脚本攻击) 是一种 Web 安全漏洞，攻击者通过在受信任的网站上注入恶意脚本，使得用户在浏览网页时，恶意脚本得以执行，从而窃取用户信息、篡改页面内容或进行其他恶意操作。

## 核心特点

- **注入恶意脚本**: 攻击者通过各种手段将恶意脚本注入到 Web 页面中。
- **客户端执行**: 恶意脚本在用户的浏览器上执行，而不是在服务器上执行。
- **跨域攻击**: 攻击者可以利用 XSS 漏洞跨域访问用户的敏感信息。

## 类型

1. [[存储型 XSS]]：攻击者将恶意脚本存储在服务器的数据库中。当用户访问包含此脚本的页面时，脚本会在用户的浏览器上执行。例如，在论坛的帖子中插入一段 JavaScript 代码。
2. [[反射型 XSS]]：攻击者通过 URL 参数将恶意脚本发送给服务器。服务器在响应中将脚本返回给用户，并在用户的浏览器上执行。例如，通过搜索框提交一段 JavaScript 代码。
3. [[DOM 型 XSS]]：攻击者通过修改页面的 DOM 结构来执行恶意脚本。例如，通过修改 URL 的 hash 值来触发 XSS。

## 危害

- **窃取用户信息**: 例如，获取用户的 Cookie、Session ID 等敏感信息。
- **篡改页面内容**: 例如，修改页面上的文字、图片等。
- **重定向用户**: 将用户重定向到恶意网站。
- **执行恶意操作**: 例如，发送垃圾邮件、发起 [[DDoS]] 攻击等。

## 防御手段

- **输入验证**: 对用户输入的数据进行严格的验证，过滤掉恶意字符。
- **输出编码**: 对输出到页面的数据进行编码，防止恶意脚本被执行。
- **使用 [[CSP]]**: 配置 Content Security Policy（CSP），限制浏览器可以加载的资源来源。
- **HttpOnly Cookie**: 设置 Cookie 的 HttpOnly 属性，防止 JavaScript 代码访问 Cookie。
- **使用 XSS 防护库**: 例如 DOMPurify。

## 示例 (前端)

```javascript
// 使用 DOMPurify 对用户输入的数据进行过滤
import DOMPurify from 'dompurify';

const userInput = '<img src="x" onerror="alert(\'XSS\')">';
const cleanInput = DOMPurify.sanitize(userInput);

document.getElementById('output').innerHTML = cleanInput;
```

## 相关概念

- [[CSRF]]: 跨站请求伪造，是一种利用用户已登录的身份，冒充用户发送恶意请求的攻击。
- [[SQL 注入]]: 是一种通过在用户输入中注入恶意 SQL 代码，从而篡改数据库的攻击。

## 案例

- **社交网站**: 攻击者在用户的个人资料中注入恶意脚本，当其他用户访问该用户的个人资料时，恶意脚本得以执行，从而窃取用户的 Cookie 或进行其他恶意操作。
- **电商网站**: 攻击者在商品评论中注入恶意脚本，当其他用户查看该商品评论时，恶意脚本得以执行，从而篡改页面内容或重定向用户。

## 问答卡片

- Q1：XSS 攻击有哪些类型？
- A：XSS 攻击主要有三种类型：存储型 XSS、反射型 XSS 和 DOM 型 XSS。
- Q2：如何防御 XSS 攻击？
- A：可以采取多种防御手段，包括输入验证、输出编码、使用 CSP、设置 HttpOnly Cookie 和使用 XSS 防护库等。

## 参考资料

- OWASP XSS (Cross Site Scripting): [https://owasp.org/www-project-site/top-ten/](https://owasp.org/www-project-site/top-ten/)
- MDN Web Security: [https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss)
- DOMPurify: [https://github.com/cure53/DOMPurify](https://github.com/cure53/DOMPurify)
