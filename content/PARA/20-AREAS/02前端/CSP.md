---
title: CSP
aliases: [内容安全策略]
date-created: 2025-05-23
date-modified: 2025-05-23
---

## 内容安全策略 (Content Security Policy, CSP)

### 定义

内容安全策略 (CSP) 是一种附加的安全层，用于检测并缓解某些类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击。CSP 通过允许网站管理员控制浏览器可以加载的资源来源，从而减少 XSS 攻击的风险。

### 核心特点

- **白名单机制**：CSP 采用白名单机制，只允许加载指定来源的资源，阻止加载其他来源的资源。
- **细粒度控制**：CSP 提供了丰富的指令，可以对不同类型的资源进行细粒度控制。
- **兼容性**：CSP 具有良好的兼容性，可以兼容各种浏览器。

### 分类

- **`Content-Security-Policy`**：标准的 CSP 响应头。
- **`Content-Security-Policy-Report-Only`**：只报告模式，不会阻止资源的加载，只会在控制台输出警告信息。

### 配置方式

- **HTTP 响应头**：通过设置 `Content-Security-Policy` 或 `Content-Security-Policy-Report-Only` HTTP 响应头来启用 CSP。
- **`meta` 标签**：可以在 HTML 文档的 `<head>` 标签中使用 `<meta>` 标签来配置 CSP。

### 指令详解

- **`default-src`**：设置所有类型资源的默认加载策略。
- **`script-src`**：设置 JavaScript 脚本的加载策略。
- **`style-src`**：设置 CSS 样式的加载策略。
- **`img-src`**：设置图片的加载策略。
- **`font-src`**：设置字体的加载策略。
- **`media-src`**：设置媒体文件的加载策略。
- **`object-src`**：设置 Flash 和其他插件的加载策略。
- **`frame-src`**：设置嵌入的 frame 的加载策略。
- **`connect-src`**：设置 XMLHttpRequest、WebSocket 和 EventSource 的加载策略。
- **`base-uri`**：设置 `<base>` 标签的 URL。
- **`form-action`**：设置 `<form>` 标签的 action URL。
- **`report-uri`**：设置 CSP 违规报告的 URL。
- **`sandbox`**：为请求的资源启用沙箱。

### 应用示例

- **禁止加载外部脚本**：

	```bash
	Content-Security-Policy: script-src 'self'

	```

- **允许加载来自指定域名的脚本**：

	```bash
	Content-Security-Policy: script-src 'self' https://example.com

	```

- **允许加载内联脚本**：

	```bash
	Content-Security-Policy: script-src 'self' 'unsafe-inline'

	```

- **允许加载使用 `eval()` 函数的脚本**：

	```bash
	Content-Security-Policy: script-src 'self' 'unsafe-eval'

	```

- **只报告模式**：

	```bash
	Content-Security-Policy-Report-Only: script-src 'self' https://example.com; report-uri /csp-report

	```

### 优缺点

- **优点**：
		- 减少 XSS 攻击的风险。
		- 提高 Web 应用的安全性。
		- 细粒度控制资源加载策略。
- **缺点**：
		- 配置复杂，容易出错。
		- 可能影响 Web 应用的性能。
		- 需要进行兼容性测试。

### 相关概念

- [[XSS]]: 简述 XSS 攻击的概念和原理。
- [[同源策略]]: 简述同源策略的概念和作用。

### 案例（可选）

- **配置 CSP 防御 XSS 攻击**：展示如何配置 CSP 来防御 XSS 攻击。
- **使用 CSP Report-Only 模式监控 Web 应用**：展示如何使用 CSP Report-Only 模式来监控 Web 应用的安全问题。

### 参考资料

- MDN Content Security Policy (CSP): [https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- Content Security Policy Reference: [https://content-security-policy.com/](https://content-security-policy.com/)# 内容安全策略 (Content Security Policy, CSP)

### 定义

内容安全策略 (CSP) 是一种附加的安全层，用于检测并缓解某些类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击。CSP 通过允许网站管理员控制浏览器可以加载的资源来源，从而减少 XSS 攻击的风险。

### 核心特点

- **白名单机制**：CSP 采用白名单机制，只允许加载指定来源的资源，阻止加载其他来源的资源。
- **细粒度控制**：CSP 提供了丰富的指令，可以对不同类型的资源进行细粒度控制。
- **兼容性**：CSP 具有良好的兼容性，可以兼容各种浏览器。

### 分类

- **`Content-Security-Policy`**：标准的 CSP 响应头。
- **`Content-Security-Policy-Report-Only`**：只报告模式，不会阻止资源的加载，只会在控制台输出警告信息。

### 配置方式

- **HTTP 响应头**：通过设置 `Content-Security-Policy` 或 `Content-Security-Policy-Report-Only` HTTP 响应头来启用 CSP。
- **`meta` 标签**：可以在 HTML 文档的 `<head>` 标签中使用 `<meta>` 标签来配置 CSP。

### 指令详解

- **`default-src`**：设置所有类型资源的默认加载策略。
- **`script-src`**：设置 JavaScript 脚本的加载策略。
- **`style-src`**：设置 CSS 样式的加载策略。
- **`img-src`**：设置图片的加载策略。
- **`font-src`**：设置字体的加载策略。
- **`media-src`**：设置媒体文件的加载策略。
- **`object-src`**：设置 Flash 和其他插件的加载策略。
- **`frame-src`**：设置嵌入的 frame 的加载策略。
- **`connect-src`**：设置 XMLHttpRequest、WebSocket 和 EventSource 的加载策略。
- **`base-uri`**：设置 `<base>` 标签的 URL。
- **`form-action`**：设置 `<form>` 标签的 action URL。
- **`report-uri`**：设置 CSP 违规报告的 URL。
- **`sandbox`**：为请求的资源启用沙箱。

### 应用示例

- **禁止加载外部脚本**：
		```bash
		Content-Security-Policy: script-src 'self'

		```bash

- **允许加载来自指定域名的脚本**：
		```bash
		Content-Security-Policy: script-src 'self' https://example.com

		```bash

- **允许加载内联脚本**：
		```bash
		Content-Security-Policy: script-src 'self' 'unsafe-inline'

		```bash

- **允许加载使用 `eval()` 函数的脚本**：
		```bash
		Content-Security-Policy: script-src 'self' 'unsafe-eval'

		```bash

- **只报告模式**：
		```bash
		Content-Security-Policy-Report-Only: script-src 'self' https://example.com; report-uri /csp-report

		```bash

### 优缺点

- **优点**：
		- 减少 XSS 攻击的风险。
		- 提高 Web 应用的安全性。
		- 细粒度控制资源加载策略。
- **缺点**：
		- 配置复杂，容易出错。
		- 可能影响 Web 应用的性能。
		- 需要进行兼容性测试。

### 相关概念

- [[XSS]]: 简述 XSS 攻击的概念和原理。
- [[同源策略]]: 简述同源策略的概念和作用。

### 案例（可选）

- **配置 CSP 防御 XSS 攻击**：展示如何配置 CSP 来防御 XSS 攻击。
- **使用 CSP Report-Only 模式监控 Web 应用**：展示如何使用 CSP Report-Only 模式来监控 Web 应用的安全问题。

### 参考资料

- MDN Content Security Policy (CSP): [https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- Content Security Policy Reference: [https://content-security-policy.com/](https://content-security-policy.com/)
