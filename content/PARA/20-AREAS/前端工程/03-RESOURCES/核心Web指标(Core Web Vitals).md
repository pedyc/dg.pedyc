---
title: 核心Web指标(Core Web Vitals)
description: "核心 Web 指标 (Core Web Vitals) 的详细介绍，包括指标定义、影响因素、优化方法和常用工具。"
tags: ["Core Web Vitals", "Web 指标", "性能优化", "用户体验", "前端优化"]
date-created: 2025-04-29
date-modified: 2025-04-29
keywords: [LCP, FID, CLS, Web 性能, 用户体验]
para: "Area"
related: ["[[Web 性能优化]]", "[[用户体验]]", "[[前端优化]]"]
---

## 什么是核心 Web 指标 (Core Web Vitals)？

核心 Web 指标 (Core Web Vitals) 是一组由 Google 提出的用于衡量网页用户体验的指标。这些指标关注网页的加载速度、交互性和视觉稳定性，旨在帮助开发者提升网页的用户体验。

## 核心 Web 指标

### 1. 最大内容渲染时间 (Largest Contentful Paint, LCP)

* **定义：** LCP 衡量的是在页面首次开始加载时，最大可见元素完成渲染的时间。
* **影响因素：**
		* 服务器响应时间
		* 渲染阻塞的 JavaScript 和 CSS
		* 资源加载时间
		* 客户端渲染
* **优化方法：**
		* 优化服务器响应时间
		* 优化 CSS 和 JavaScript
		* 优化图片
		* 使用 CDN
* **良好 LCP：** 2.5 秒以内

### 2. 首次输入延迟 (First Input Delay, FID)

* **定义：** FID 衡量的是用户首次与页面交互（例如点击链接、按钮等）到浏览器响应交互的时间。
* **影响因素：**
		* JavaScript 执行时间
		* 主线程阻塞
* **优化方法：**
		* 减少 JavaScript 执行时间
		* 避免长时间的任务
		* 使用 Web Workers
* **良好 FID：** 100 毫秒以内

### 3. 累计布局偏移 (Cumulative Layout Shift, CLS)

* **定义：** CLS 衡量的是页面在加载过程中发生的意外布局偏移的程度。
* **影响因素：**
		* 没有尺寸的图片或视频
		* 动态注入的内容
		* 字体加载
* **优化方法：**
		* 为图片和视频设置尺寸
		* 预留广告位
		* 避免在现有内容上方插入新内容
* **良好 CLS：** 0.1 以内

## 如何衡量核心 Web 指标？

* **Chrome DevTools：** 使用 Chrome DevTools 的 Lighthouse 工具进行测量。
* **PageSpeed Insights：** 使用 PageSpeed Insights 工具进行测量。
* **Web Vitals 扩展：** 使用 Web Vitals Chrome 扩展进行实时测量。
* **Google Search Console：** 在 Google Search Console 中查看核心 Web 指标报告。

## 总结

核心 Web 指标是衡量网页用户体验的重要指标。通过优化 LCP、FID 和 CLS，可以提升网页的加载速度、交互性和视觉稳定性，从而提升用户体验。
