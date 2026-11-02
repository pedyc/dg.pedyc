---
title: Cookie 有服务端可控的安全属性，而 WebStorage 没有
date-created: 2026-10-31
date-modified: 2026-10-31
uid: 20261031111901
tags: []
content-type: atomic
up: "[[Cookie]]"
---

> Cookie 有服务端可控的安全属性，而 WebStorage 没有

**边界**：`Secure`、`HttpOnly`、`SameSite` 约束的只是浏览器怎么对待这条 Cookie——发不发、能不能被脚本读到、跨站带不带，不是数据本身的安全：服务端照样能把它写成明文推给代理和日志，要保的是内容时，这三项一个也帮不上。也别反读成「WebStorage 不安全」：它同样受同源隔离，真正的差别在**谁有权改策略**——Cookie 的策略可由服务端按会话下发，WebStorage 的策略由浏览器定死，页面想补也补不出 `HttpOnly`，因为它必须对 JS 可读才用得上。

## 论据/示例

三条都由服务端写在 `Set-Cookie` 响应头里，浏览器照此执行：`Secure` 管这条值能不能走明文 HTTP，`HttpOnly` 管 `document.cookie` 里看不看得见它，`SameSite` 管跨站请求带不带它。执行点在页面脚本之上——`HttpOnly` 那条脚本读不到、也补设不了，`Secure` 与 `SameSite` 脚本只能给自己写的 Cookie 声明，改不了服务端已下发的那一条。WebStorage 的读写全由脚本发起，服务端没有任何可以下发策略的通道。
