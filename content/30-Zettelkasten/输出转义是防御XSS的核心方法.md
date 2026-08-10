---
uid: 202603230002
title: 输出转义是防御XSS的核心方法
aliases: []
description: 将特殊字符转换为 HTML 实体，使脚本不会被执行
tags: [前端开发/安全/原子]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[XSS]]
---

> 输出转义是防御 XSS 的核心方法

将用户输入的特殊字符转换为 HTML 实体，使浏览器将其作为纯文本而非代码解析，从而防止脚本执行。

**常见转义规则**：

| 原字符 | 转义后 |
|:---|:---|
| < | &lt; |
| > | &gt; |
| " | &quot; |
| ' | &#x27; |
| & | &amp; |

**示例**：

```javascript
// 未转义（危险）
div.innerHTML = userInput; // <script>alert(1)</script> 会执行

// 转义后（安全）
div.textContent = userInput; // <script>alert(1)</script> 会作为纯文本显示
```

现代前端框架（React、Vue）默认使用转义处理，只有使用 `dangerouslySetInnerHTML`、`v-html` 等危险 API 时才需要手动处理。
