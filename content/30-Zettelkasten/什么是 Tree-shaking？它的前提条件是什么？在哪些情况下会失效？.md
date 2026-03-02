---
title: 什么是 Tree-shaking？它的前提条件是什么？在哪些情况下会失效？
date-created: 2025-05-28
date-modified: 2025-06-16
---

- 什么是 [[Tree-shaking]]?

> Tree-shaking 是一种 **静态分析技术**，在打包阶段移除 **未被使用的 ES Module 导出内容**，减少最终构建体积。

- Tree-shaking 的前提条件是什么？

> 打包工具支持 Tree-shaking，并且使用 ES Module 的静态导出语法（import/export）

- Tree-shaking 在哪些情况下会失效？

> 1.使用动态导出语句 `import()`/`require()` 而不是静态导出语句
> 2.使用包含副作用的代码，例如注入 CSS（`import 'example.css'`）
> 3.被标记为有副作用的包，例如在 `package.json` 中设置 `sideEffects: true`
