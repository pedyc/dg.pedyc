---
title: Clickjacking
date-created: 2025-05-23
date-modified: 2025-05-26
---

## Clickjacking (点击劫持)

## 定义

Clickjacking 是一种恶意技术，攻击者通过在网页上覆盖一层透明的、不可见的 iframe，诱使用户点击他们本不打算点击的链接或按钮。用户以为自己在点击页面上的某个元素，实际上点击的是隐藏在下面的恶意链接，从而在不知情的情况下执行了攻击者预设的操作。

## 攻击原理

1. 攻击者创建一个恶意网页，该网页包含一个 iframe，iframe 加载目标网站的页面。
2. 攻击者将 iframe 设置为透明，并将其覆盖在恶意网页的其他元素之上。
3. 攻击者诱使用户点击恶意网页上的元素，实际上用户点击的是 iframe 中的目标网站的元素。
4. 由于用户已经登录了目标网站，所以点击操作会成功执行，从而达到攻击的目的。

## 示例

假设用户登录了社交网站 A，攻击者创建一个恶意网站 B，该网站 B 包含一个透明的 iframe，iframe 加载社交网站 A 的 " 喜欢 " 按钮。攻击者诱使用户点击恶意网站 B 上的某个元素，实际上用户点击的是社交网站 A 的 " 喜欢 " 按钮，从而在用户不知情的情况下，喜欢了某个内容。

## 防御手段

> 点击劫持依赖于将目标网站嵌入到攻击者的诱饵网站的 `<iframe>` 中。主要的防护措施是禁止或（至少）控制此功能。

- **X-Frame-Options**：设置 HTTP 响应头 `X-Frame-Options`，告诉浏览器不允许当前页面被嵌入到 iframe 中。
		- `DENY`：表示该页面不允许在任何 iframe 中展示。
		- `SAMEORIGIN`：表示该页面只能在相同域名的 iframe 中展示。
		- `ALLOW-FROM uri`：表示该页面可以在指定 uri 的 iframe 中展示（不推荐使用，因为兼容性问题）。
- **Content Security Policy (CSP)**：使用 CSP 的 `frame-ancestors` 指令，指定允许嵌入当前页面的域名。
- **JavaScript 防御**：使用 JavaScript 代码检测当前页面是否被嵌入到 iframe 中，如果是，则阻止页面的加载。

### 参考资料

- [MDN Web Security Clickjacking](https://developer.mozilla.org/zh-CN/docs/Web/Security/Attacks/Clickjacking)
- [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)]
