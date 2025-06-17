---
topic: 
uid: 202502251159
title: Intersection Observer API
aliases: [IO]
description: Intersection Observer API 提供了一种异步检测目标元素与祖先元素或 viewport 相交情况的方法。
tags: [前端开发, API, 性能优化]
date-created: 2025-05-18
date-modified: 2025-06-12
keywords: [Intersection Observer, 懒加载, 可视区域]
para: Resource
related: ["[[DOM]]", "[[性能优化]]"]
---

## 定义

Intersection Observer API 提供了一种异步检测目标元素与祖先元素或 viewport 相交情况的方法。通过该 API，可以监听元素是否进入或离开视口，从而实现懒加载、无限滚动等效果，而无需频繁地进行事件监听和计算。

## 核心特点

- **异步检测：** Intersection Observer API 使用异步方式进行检测，不会阻塞主线程，提高页面性能。
- **精确判断：** 可以精确判断元素与视口的相交情况，包括相交比例、相交区域等。
- **灵活配置：** 可以灵活配置监听的根元素、相交比例阈值等参数，满足不同的需求。
- **节省资源：** 相比于传统的事件监听和计算方式，Intersection Observer API 可以节省大量的 CPU 和内存资源。

## 如何使用 Intersection Observer？

1. **创建 Intersection Observer 对象：**

```javascript
const observer = new IntersectionObserver(callback, options);

```

- `callback`：当目标元素与视口相交情况发生变化时，会执行的回调函数。
- `options`：可选参数，用于配置监听的根元素、相交比例阈值等。

2. **指定监听的目标元素：**

```javascript
const target = document.querySelector('#target');
observer.observe(target);
```

- `target`：需要监听的目标元素。

3. **实现回调函数：**

```javascript
const callback = (entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			// 元素进入视口
			console.log('Element is visible');
		} else {
			// 元素离开视口
			console.log('Element is not visible');
		}
	});
};

```

- `entries`：一个数组，包含所有目标元素的 IntersectionObserverEntry 对象。
- `observer`：IntersectionObserver 对象本身。

## 应用场景

1. **懒加载：** 在图片或视频进入视口时才加载，减少页面初始加载时间。
2. **无限滚动：** 在滚动到页面底部时自动加载更多内容，提供更好的用户体验。
3. **广告曝光统计：** 统计广告在页面上的曝光情况，用于广告效果评估。
4. **元素动画：** 在元素进入视口时触发动画效果，增强页面的交互性。

## 示例

### 懒加载图片

```html
<img data-src="image.jpg" class="lazy-load">
```

```javascript
const images = document.querySelectorAll('.lazy-load');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img); // 停止监听已加载的图片
    }
  });
});

images.forEach(img => {
  observer.observe(img);
});
```

## 注意事项

1. **兼容性：** Intersection Observer API 在现代浏览器中得到了广泛支持，但在旧版本浏览器中可能需要使用 polyfill。
2. **性能：** 避免监听过多的元素，否则可能会影响页面性能。
3. **取消监听：** 在不需要监听时，及时取消监听，释放资源。

## 参考资料

- MDN Web Docs: [https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
- Google Developers: [https://developers.google.com/web/updates/2016/04/intersectionobserver](https://developers.google.com/web/updates/2016/04/intersectionobserver)
