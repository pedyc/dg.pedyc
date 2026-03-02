---
title: 累积布局偏移（Cumulative Layout Shift，CLS）
aliases: [CLS]
description: 累积布局偏移（CLS）是衡量页面视觉稳定性的指标，用于量化页面上非预期布局偏移的程度。
tags: [Web性能, 用户体验, 性能指标]
date-created: 2025-05-06
date-modified: 2025-06-02
keywords: [CLS, Cumulative Layout Shift, 布局偏移]
para: Resource
related: ["[[首次输入延迟（First Input Delay，FID）]]", "[[最大内容渲染时间（Largest Contentful Paint，LCP）]]", "[[Web性能优化]]"]
zettel: 性能优化
---

## 定义

累积布局偏移（Cumulative Layout Shift，CLS）是衡量页面视觉稳定性的指标，用于量化页面上非预期布局偏移的程度。当页面上的元素在没有用户交互的情况下发生移动时，就会产生布局偏移。CLS 越高，页面的视觉体验越差。

## 为什么 CLS 重要？

- **用户体验：** 布局偏移会导致用户在阅读或操作页面时感到困惑和烦恼，影响用户体验。
- **性能评估：** CLS 是衡量页面视觉稳定性的关键指标，有助于开发者识别和解决布局偏移问题。
- **SEO：** 作为 Core Web Vitals 的一部分，CLS 会影响搜索引擎排名。

## 如何计算 CLS？

CLS 的计算公式如下：

```bash
CLS = impact fraction * distance fraction
```

- **impact fraction**：指布局偏移元素所影响的视口区域的比例。
- **distance fraction**：指布局偏移元素移动的最大距离（水平或垂直）与视口最大尺寸的比率。

## 如何优化 CLS？

1. **为图片和视频设置尺寸属性：**
		- 在 `<img>` 和 `<video>` 标签中明确指定 `width` 和 `height` 属性，或者使用 CSS 的 `aspect-ratio` 属性，确保浏览器在加载资源之前预留足够的空间。

2. **避免在现有内容上方插入新内容：**
		- 尽量避免在现有内容上方插入广告、嵌入内容或其他动态内容，除非是响应用户交互。

3. **谨慎使用动画效果：**
		- 使用 `transform` 属性来实现动画效果，而不是改变元素的 `width`、`height`、`top` 或 `left` 属性，因为 `transform` 不会触发布局偏移。

4. **预留广告位空间：**
		- 如果页面包含广告，预先为广告位预留足够的空间，避免广告加载后导致布局偏移。

## 如何测量 CLS？

- **Lighthouse：** 使用 Lighthouse 工具可以模拟用户交互，测量 CLS。
- **Web Vitals 扩展：** 使用 Chrome Web Vitals 扩展可以实时测量 CLS。
- **Real User Monitoring (RUM)：** 使用 RUM 工具可以收集真实用户的 CLS 数据。

## 示例

假设页面上一个按钮在加载过程中向下移动了 100 像素，影响了 50% 的视口区域，那么 CLS 的计算如下：

```bash
impact fraction = 0.5
distance fraction = 100 / 视口高度

CLS = 0.5 * (100 / 视口高度)
```

## 总结

累积布局偏移（CLS）是评估网页视觉稳定性的重要指标。通过优化图片和视频尺寸、避免插入新内容、谨慎使用动画效果等方法，可以显著降低 CLS，提升用户体验。

## 参考资料

- Web Vitals: [https://web.dev/cls/](https://web.dev/cls/)
- MDN Web Docs: [https://developer.mozilla.org/](https://developer.mozilla.org/)
