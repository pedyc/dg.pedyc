---
title: 累计布局偏移 (Cumulative Layout Shift, CLS)
description: "累计布局偏移（CLS）是衡量网页视觉稳定性的指标，用于量化页面上非预期布局偏移的程度。低CLS值表示更好的用户体验。"
tags: ["Web性能", "用户体验", "布局稳定性"]
date-created: 2025-05-06
date-modified: 2025-05-06
keywords: [CLS, Cumulative Layout Shift, 布局偏移]
para: "20-AREAS"
related: ["[[首次输入延迟（First Input Delay，FID）]]", "[[最大内容渲染时间（Largest Contentful Paint，LCP）]]"]
zettel: "前端性能优化"
---

## 定义

累计布局偏移（Cumulative Layout Shift，CLS）是衡量网页视觉稳定性的指标。它量化了页面上所有非预期布局偏移的总和。布局偏移是指页面上可见元素在渲染过程中位置发生变化，导致用户体验中断。

## 为什么 CLS 重要？

- **用户体验：** 高 CLS 会导致用户感到页面不稳定，影响用户体验。例如，用户在点击一个链接时，链接突然移动，导致点击失败。
- **性能评估：** CLS 是 Core Web Vitals 的一部分，用于评估页面的视觉稳定性。
- **SEO：** 作为 Core Web Vitals 的一部分，CLS 会影响搜索引擎排名。

## 如何优化 CLS？

1. **为图像和视频设置尺寸属性：**
	 - 在 `<img>` 和 `<video>` 标签中明确指定 `width` 和 `height` 属性，或者使用 CSS 的 `aspect-ratio` 属性，确保浏览器在加载内容之前预留足够的空间。

2. **为广告预留空间：**
	 - 避免在现有内容上方插入广告，导致布局偏移。可以预先为广告位设置固定大小的容器。

3. **避免在现有内容上方插入新内容：**
	 - 除非是用户交互触发的，否则不要在现有内容上方插入新内容。

4. **使用 `transform` 代替引起布局偏移的动画：**
	 - 使用 `transform: translate()` 和 `transform: scale()` 等属性进行动画，这些属性不会引起布局偏移。

## 如何测量 CLS？

- **Lighthouse：** 使用 Lighthouse 工具可以模拟用户交互，测量 CLS。
- **Web Vitals 扩展：** 使用 Chrome Web Vitals 扩展可以实时测量 CLS。
- **Real User Monitoring (RUM)：** 使用 RUM 工具可以收集真实用户的 CLS 数据。

## 示例

- **未优化：** 页面加载时，广告突然出现，将下方的内容向下推，导致用户在阅读时内容发生偏移。
- **已优化：** 页面为广告预留了固定大小的空间，广告加载时不会引起布局偏移。

## 总结

累计布局偏移（CLS）是评估网页视觉稳定性的重要指标。通过为图像和视频设置尺寸、为广告预留空间、避免在现有内容上方插入新内容以及使用 `transform` 进行动画，可以显著降低 CLS，提升用户体验。
