---
title: FAQ-JS&TS
tags: [算法题单]
date-created: 2025-04-10
date-modified: 2025-12-10
---

| 示例题目                                  | 模块      | 知识点说明                                                                                                       |
| ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| 解释 `<script>` 标签中 async 和 defer 的区别   | 页面加载流程  | `async`：异步加载脚本，加载完成立即执行，**不保证执行顺序**，可能阻塞渲染；`defer`：异步加载脚本，**DOM 解析完成后按顺序执行**，推荐用于布局脚本                       |
| 解释 JavaScript 的事件循环机制                 | 执行机制    | JS 单线程，执行顺序为：主线程同步 → 微任务队列清空 → 渲染 → 下一个宏任务 → 微任务 → 渲染 → …                                                   |
| 宏任务和微任务的区别？举例说明                       | 执行机制    | 宏任务由宿主环境调度，如 setTimeout、setInterval、MessageChannel；微任务由 JS 引擎调度，如 Promise.then、MutationObserver 等           |
| 常见的宏任务和微任务分别有哪些？                      | 执行机制    | **宏任务**：setTimeout、setInterval、I/O 回调、MessageChannel；**微任务**：Promise.then、queueMicrotask、MutationObserver 等 |
| 什么是闭包？闭包的典型使用场景有哪些？                   | 作用域     | 闭包是函数与其词法作用域的组合，用于：创建私有变量、函数工厂、柯里化、事件监听器绑定变量等                                                               |
| JavaScript 中 this 的绑定方式有哪些？           | this 指向 | 默认绑定、隐式绑定（对象方法）、显式绑定（call/apply/bind）、new 绑定、箭头函数绑定（基于词法作用域）                                                |
| 深拷贝与浅拷贝的区别？实现一个深拷贝函数                  | 内存管理    | 浅拷贝复制引用；深拷贝递归复制所有属性，可使用 structuredClone、lodash 的 cloneDeep 或手写递归版                                           |
| 解释 WeakMap、WeakSet 与 WeakRef 的区别与适用场景 | 内存管理    | Weak 系列仅接受对象为 key，弱引用不影响 GC 回收，适合存储临时缓存；WeakRef 提供弱引用对象的访问，可配合 FinalizationRegistry 使用                      |
