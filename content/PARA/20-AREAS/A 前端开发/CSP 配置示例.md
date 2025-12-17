---
title: CSP 配置示例
date-created: 2025-05-23
date-modified: 2025-05-23
---

## CSP 配置示例

### 1. 通过 HTTP 响应头配置 CSP

服务器可以通过设置 `Content-Security-Policy` HTTP 响应头来启用 CSP。

**示例：**

```bash

Content-Security-Policy: default-src 'self'; 
script-src 'self' https://example.com; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data:;

```

**解释：**

- `default-src 'self'`：默认只允许加载来自相同域名的资源。
- `script-src 'self' https://example.com`：允许加载来自相同域名和 `https://example.com` 的 JavaScript 脚本。
- `style-src 'self' 'unsafe-inline'`：允许加载来自相同域名的 CSS 样式，并允许使用内联样式。
- `img-src 'self' data:`：允许加载来自相同域名的图片，并允许使用 data URI 格式的图片。

**适用场景：**

- 适用于所有 Web 应用，推荐使用此方法配置 CSP。

**注意事项：**

- 需要配置服务器来发送正确的 HTTP 响应头。
- 不同的浏览器对 CSP 的支持程度可能有所不同，需要进行兼容性测试。

#### 2. 通过 meta 标签配置 CSP

可以在 HTML 文档的 `<head>` 标签中使用 `<meta>` 标签来配置 CSP。

**示例：**

```html
<meta 
	http-equiv="Content-Security-Policy" 
	content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:">
```

**解释：**

与 HTTP 响应头配置方式相同，只是将配置信息放在 HTML 文档中。

**适用场景：**

- 适用于无法配置 HTTP 响应头的场景，例如静态 HTML 页面。

**注意事项：**

- 使用 meta 标签配置 CSP 时，`report-uri` 和 `sandbox` 指令无效。
- 建议使用 HTTP 响应头配置 CSP，因为 meta 标签配置方式的优先级较低。

## 3. report-uri 指令

`report-uri` 指令用于指定一个 URL，当 CSP 策略被违反时，浏览器会将违规报告发送到该 URL。

**示例：**

```bash
Content-Security-Policy: default-src 'self'; report-uri /csp-report;
```

**解释：**

当页面加载了不符合 CSP 策略的资源时，浏览器会将违规报告发送到 `/csp-report`。

**适用场景：**

- 用于监控 CSP 策略的执行情况，及时发现和修复安全问题。

**注意事项：**

- 需要配置服务器来接收和处理 CSP 违规报告。

## 4. sandbox 指令

`sandbox` 指令用于启用沙箱模式，限制网页的行为。

**示例：**

```bash
Content-Security-Policy: sandbox allow-forms allow-scripts;
```

**解释：**

启用沙箱模式，允许表单提交和脚本执行。

**适用场景：**

- 用于隔离不受信任的内容，例如用户上传的 HTML 代码。

**注意事项：**

- 沙箱模式会限制网页的行为，需要根据实际需求进行配置。

```bash
