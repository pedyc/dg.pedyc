---
title: 5-大前端：如何突破动态化容器的天花板？ - 美团技术团队@annote
uid: 
aliases: 
author: soulteary@gmail.com
description: 长久以来，容器要实现动态化和双端复用，难免要牺牲掉一些性能。有没有办法让动态化容器的性能尽可能接近原生？美团金服大前端团队给出了一种解决方案，尝试突破动态化容器的天花板。
tags: []
date-created: 2025-02-12
date-modified: 2025-02-16
status: 
alias: ["srAnnote@大前端：如何突破动态化容器的天花板？ - 美团技术团队"]
---

## 大前端：如何突破动态化容器的天花板？ - 美团技术团队

> [!md] Metadata
> **标题**:: " 大前端：如何突破动态化容器的天花板？ - 美团技术团队 "
> **日期**:: [[2025-02-12]]
> **原文链接**:: [原文链接](https://tech.meituan.com/2024/10/18/recce-in-meituan.html)
> **内部链接**:: [内部链接](http://localhost:7026/reading/5)
> **外部链接**:: [外部链接](https://dg.ped-yc.site/Simpread/5- 大前端：如何突破动态化容器的天花板？ - 美团技术团队)

> [!summary] 描述
> 长久以来，容器要实现动态化和双端复用，难免要牺牲掉一些性能。有没有办法让动态化容器的性能尽可能接近原生？美团金服大前端团队给出了一种解决方案，尝试突破动态化容器的天花板。

### Annotations

> [📌](<http://localhost:7026/reading/5#id=1739341902250>) <mark style="background-color: #ffeb3b">Highlight</mark>
> 然后，剩下的问题就是设置属性、传递属性等成本，它们在实践的过程中，通常会成为页面渲染的一个瓶颈，事实上 React Native 也正在解决这个问题。基于此，我们决定保留下来 React Native 的 UIManager 的增、删、改等概念，以及 Yoga 布局，还有视图组件的封装，我们将这些保留了下来。后面，我们还会再讨论为什么没有使用 React Native 当前的属性转换的方式，这里不再展开讨论。
