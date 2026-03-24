---
uid: 202603230003
title: 现代框架默认防御XSS但危险API仍需注意
aliases: []
description: React dangerouslySetInnerHTML、Vue v-html 等会绕过转义
tags: [前端开发/安全/原子]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[XSS]]
---

> 现代框架默认防御XSS，但危险API仍需注意

React、Vue 等现代前端框架默认对用户输入进行转义处理，但在某些场景下仍需谨慎：

**安全 API**：
- React：`props.children`、`textContent`
- Vue：`{{ }}` 插值（默认转义）

**危险 API（需手动确保安全）**：
- React：`dangerouslySetInnerHTML`
- Vue：`v-html` 指令

**示例**：
```jsx
// 安全
<div>{userInput}</div>

// 危险（需确保 userInput 已清洗）
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**最佳实践**：
1. 尽量避免使用危险 API
2. 如需使用富文本，必须使用 DOMPurify 等库进行清洗
3. 限制可使用的 HTML 标签和属性白名单
