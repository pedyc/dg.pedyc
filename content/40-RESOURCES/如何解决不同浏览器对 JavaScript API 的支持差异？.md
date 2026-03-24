---
uid: 202506160002
title: 如何解决不同浏览器对 JavaScript API 的支持差异？
aliases: [Q-JS兼容性]
description: 解决不同浏览器对 JavaScript API 支持差异的方法
tags: [前端开发/浏览器]
date-created: 2025-06-16
date-modified: 2026-03-23
status: completed
content-type: question
---

> 如何解决不同浏览器对 JavaScript API 的支持差异？

---

## 问题背景

不同浏览器对 JavaScript 新 API（Promise、fetch、Map/Set、Array.prototype 方法等）的支持程度不同，需要兼容处理以确保代码在旧浏览器正常运行。

---

## 现有答案

### 1. Polyfill（推荐）

- **作用**：用 JavaScript 模拟浏览器不支持的 API
- **常用库**：
  - core-js：最完整的 ES polyfill
  - es5-shim/es5-sham：ES5 API
  - whatwg-fetch：fetch API

```javascript
// 检测并加载 polyfill
import 'core-js/stable';
import 'whatwg-fetch';
```

### 2. Babel 转译

- **作用**：将 ES6+ 语法转换为 ES5 语法
- **原理**：在构建时将新语法转换为旧语法

```javascript
// 输入（ES6）
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2);

// 输出（ES5）
var arr = [1, 2, 3];
var doubled = arr.map(function(x) {
  return x * 2;
});
```

### 3. Feature Detection

- **作用**：检测浏览器是否支持某个 API
- **实现**：`typeof` 或 `in` 运算符

```javascript
// 检测 fetch 支持
if ('fetch' in window) {
  // 使用 fetch
} else {
  // 使用 XMLHttpRequest 或 JSONP
}

// 检测 Promise 支持
if (typeof Promise !== 'undefined') {
  // 使用 Promise
} else {
  // 使用回调或 bluebird
}
```

### 4. 库/框架

- **作用**：封装了兼容性处理
- **示例**：jQuery、axios、bluebird

---

## 总结

| 方法 | 适用场景 | 推荐程度 |
|:--- |:--- |:--- |
| Babel | ES6+ 语法转译 | ⭐⭐⭐⭐⭐ |
| core-js | ES 标准库 polyfill | ⭐⭐⭐⭐⭐ |
| whatwg-fetch | fetch API polyfill | ⭐⭐⭐⭐ |
| Feature Detection | 运行时检测 | ⭐⭐⭐⭐ |

---

## 相关笔记

- [[浏览器兼容性]]
- [[Web标准]]
- [[Babel]]
- [[Polyfill]]
