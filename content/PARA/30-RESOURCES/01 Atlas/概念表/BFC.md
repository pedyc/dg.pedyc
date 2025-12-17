---
title: BFC
description: BFC（块格式化上下文）是 CSS 视觉渲染的一部分，它决定了块级盒子的布局方式。
tags: [前端开发, CSS]
date-created: 2025-06-02
date-modified: 2025-06-02
content-type: concept
keywords: [BFC, Block Formatting Context]
para: AREA
related: ["[[CSS]]", "[[盒子模型]]"]
zettel: permanent
---

## 定义

BFC（Block Formatting Context，块格式化上下文）是 CSS 视觉渲染的一部分，它决定了块级盒子的布局方式。可以把 BFC 看作是一个独立的容器，容器里面的元素不会在布局上影响到外面的元素，反之也是如此。

## 核心特点

- 内部盒子垂直排列 ：BFC 内部的块级盒子会一个接一个地垂直排列。
- 外边距折叠 ：属于同一个 BFC 的两个相邻块级盒子的垂直外边距会发生折叠（除非其中一个被 BFC 包含）。
- 包含浮动元素 ：BFC 会包含其内部的所有浮动元素，防止浮动元素溢出到 BFC 外部。
- 阻止外边距折叠 ：不同 BFC 之间的外边距不会发生折叠。

## 如何创建 BFC？

以下 CSS 属性可以创建一个新的 BFC：

- 根元素 `<html>`
- `float` 属性不为 `none`
- `position` 属性为 `absolute` 或 `fixed`
- `display` 属性为 `inline-block`、`table-cell`、`table-caption`、`flex`、`inline-flex`、`grid` 或 `inline-grid`
- `overflow` 属性不为 `visible`

## 应用场景

1. **清除浮动：** 可以通过将父元素设置为 BFC 来清除子元素的浮动，防止父元素高度塌陷。
2. **防止外边距重叠：** 可以通过将元素设置为 BFC 来防止 margin 重叠，确保元素之间的间距符合预期。
3. **创建多栏布局：** 可以通过将元素设置为 BFC 来创建多栏布局，实现自适应的列宽。
4. **避免浮动元素覆盖：** 可以通过将元素设置为 BFC 来避免浮动元素覆盖其他元素。

## 示例

### 清除浮动

```html
<!-- 父元素高度塌陷 -->
<div style="border: 1px solid red;">
  <div style="float: left; width: 100px; height: 100px; background-color: lightblue;"></div>
  <div style="float: left; width: 100px; height: 100px; background-color: lightgreen;"></div>
</div>

<!-- 通过设置父元素overflow触发BFC -->
<div style="border: 1px solid blue; overflow: auto;">
  <div style="float: left; width: 100px; height: 100px; background-color: lightblue;"></div>
  <div style="float: left; width: 100px; height: 100px; background-color: lightgreen;"></div>
</div>
```

### 防止 margin 重叠

```html
<div style="margin-bottom: 20px;">First div</div>
<div style="margin-top: 30px;">Second div</div>

<div style="overflow: auto; margin-bottom: 20px;">First div</div>
<div style="overflow: auto; margin-top: 30px;">Second div</div>
```

## 注意事项

1. **过度使用：** 避免过度使用 BFC，只在必要时创建 BFC，否则可能会导致代码的复杂性增加。
2. **兼容性：** 不同的浏览器对 BFC 的支持可能存在差异，需要进行兼容性测试。
3. **理解原理：** 深入理解 BFC 的原理，才能更好地应用 BFC 解决实际问题。

## 问答卡片

- Q：什么是 BFC？有哪些触发方式？能解决哪些问题？
- A：BFC 是浏览器布局中的一个独立区域，它内部的元素垂直排列，且不会影响外部布局。常用来清除浮动、解决外边距合并以及实现复杂布局，比如三栏布局的中间自适应列。常通过 float、overflow、display 等属性触发。

## 参考资料

- MDN Web Docs: [https://developer.mozilla.org/](https://developer.mozilla.org/)
- CSS Tricks: [https://css-tricks.com/](https://css-tricks.com/)
