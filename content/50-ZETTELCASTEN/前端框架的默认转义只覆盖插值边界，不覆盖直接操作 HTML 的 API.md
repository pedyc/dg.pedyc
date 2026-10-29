---
uid: 202603230003
title: 前端框架的默认转义只覆盖插值边界，不覆盖直接操作 HTML 的 API
aliases: [框架的默认转义不覆盖直接操作HTML的API]
description: React、Vue 的默认转义作用在插值边界上，一旦把字符串当 HTML 塞进 DOM，转义就绕过了
tags: [前端开发/安全]
date-created: 2026-03-23
date-modified: 2026-10-27
content-type: atomic
up: "[[XSS]]"
noteId: 1792465702663
---

> 框架的默认转义作用在**插值边界**上——`{}` 里、`{{ }}` 里。一旦用 `dangerouslySetInnerHTML` 或 `v-html` 把字符串当作 HTML 塞进 DOM，数据就不再经过那个边界，转义整条链路被绕过。

**边界**：反过来说，框架的转义也不能当成「安全已完成」。它只覆盖它自己控制的插入点：`href` 里放 `javascript:` 不会被拦，事件处理器里拼字符串不会被拦，`document.write` 更不在它的管辖范围。所以「用了 React」不等于「没有 XSS」，它只是把默认路径做对了。

## 论据/示例

| | 走转义 | 绕过转义 |
|:---|:---|:---|
| React | `{userInput}`、`props.children` | `dangerouslySetInnerHTML={{ __html }}` |
| Vue | `{{ userInput }}` | `v-html` |
| Angular | 插值 | `bypassSecurityTrustHtml` 系列 |

三个框架的命名方式不同，机制却一致：默认路径安全，绕过需要显式声明，而「显式声明」本身就是一次人工担保——担保错了，转义不会再来兜底。

绕过之后唯一可靠的做法是清洗而非转义：用 DOMPurify 之类按白名单过滤标签与属性，而不是把整段内容当可信输入。

## 关联

- [[XSS]] — 父级概念
- [[转义的作用点是把数据固定为文本而非代码]] — 转义本身的机制
