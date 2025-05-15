---
title: 首次输入延迟（First Input Delay，FID）
aliases: [FID]
description: 首次输入延迟（FID）是衡量用户首次与页面交互时，浏览器响应的延迟时间。它是评估页面交互性的关键指标。
tags: [Web性能, 用户体验, 性能指标]
date-created: 2025-05-06
date-modified: 2025-05-13
keywords: [FID, First Input Delay, 输入响应]
para: Resource
related: ["[[最大内容渲染时间（Largest Contentful Paint，LCP）]]", "[[累积布局偏移（Cumulative Layout Shift，CLS）]]"]
zettel: 性能优化
---

## 定义

首次输入延迟（First Input Delay，FID）是衡量用户首次与页面交互（例如点击链接、按钮或使用自定义 JavaScript 控件）时，浏览器响应的延迟时间。这个延迟是因为浏览器正忙于解析和执行主线程上的 JavaScript 代码，无法立即响应用户的输入。

## 为什么 FID 重要？

- **用户体验：** 高 FID 会导致用户感到页面反应迟钝，影响用户体验。
- **性能评估：** FID 是衡量页面交互性的关键指标，有助于开发者识别和解决性能瓶颈。
- **SEO：** 作为 Core Web Vitals 的一部分，FID 会影响搜索引擎排名。

## 如何优化 FID？

1. **减少 JavaScript 执行时间：**
	 - **代码拆分：** 将 JavaScript 代码拆分成更小的块，按需加载。
	 - **移除未使用的代码：** 删除页面上未使用的 JavaScript 代码。
	 - **延迟加载：** 将非关键的 JavaScript 代码延迟加载。

2. **优化第三方脚本：**
	 - **评估第三方脚本的影响：** 检查第三方脚本是否导致 FID 过高。
	 - **延迟加载第三方脚本：** 将不重要的第三方脚本延迟加载。

3. **减少主线程工作：**
	 - **避免长时间运行的任务：** 将长时间运行的任务分解成更小的任务。
	 - **使用 Web Workers：** 将一些任务转移到 Web Workers 中执行，避免阻塞主线程。

## 如何测量 FID？

- **Lighthouse：** 使用 Lighthouse 工具可以模拟用户交互，测量 FID。
- **Web Vitals 扩展：** 使用 Chrome Web Vitals 扩展可以实时测量 FID。
- **Real User Monitoring (RUM)：** 使用 RUM 工具可以收集真实用户的 FID 数据。

## 示例

假设用户首次点击页面上的一个按钮，浏览器需要 300 毫秒才能响应这个点击事件，那么 FID 就是 300 毫秒。

## 总结

首次输入延迟（FID）是评估网页交互性的重要指标。通过优化 JavaScript 执行、第三方脚本和主线程工作，可以显著降低 FID，提升用户体验。
