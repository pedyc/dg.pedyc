---
title: 响应式系统（Vue）
date-created: 2025-05-30
date-modified: 2025-06-16
---

## 背景

Vue 的响应式系统是 Vue.js 框架的核心组成部分，它使得数据变化能够自动驱动视图更新，极大地简化了前端开发。Vue 2 使用 Object.defineProperty() 实现响应式，Vue 3 使用 Proxy 实现响应式。

## 核心思想

当 Vue 组件中的数据发生变化时，视图能够自动更新，无需手动操作 DOM。

## 模型

Vue 2:
- **Observer**: 将数据对象转换为响应式对象，通过 Object.defineProperty() 劫持数据的 getter 和 setter。
- **Dep**: 依赖管理器，用于收集依赖于数据的 watcher。
- **Watcher**: 观察者，当数据发生变化时，通知相关的组件进行更新。

Vue 3:
- 使用 Proxy 替代 Object.defineProperty()，实现更高效和全面的响应式。

## 原理

Vue 2:
1. 当 Vue 实例创建时，Observer 遍历 data 中的所有属性，使用 Object.defineProperty() 将它们转换为 getter 和 setter。
2. 当组件渲染时，会访问到响应式数据，Dep 会收集当前组件的 watcher。
3. 当数据发生变化时，setter 会通知 Dep，Dep 会通知所有相关的 watcher 进行更新。

> 参见：[[Vue2 响应式实现示例]]

Vue 3:
1. 使用 Proxy 代理整个数据对象，可以监听更多的数据变化，例如新增属性和删除属性。
2. 使用 Reflect 反射 API，可以更方便地操作数据对象。

> 参见：[[Vue3 响应式实现示例]]

## 应用

- **数据绑定**: 将数据绑定到视图，当数据变化时，视图自动更新。
- **计算属性**: 根据响应式数据计算出新的数据，当依赖的数据变化时，计算属性自动更新。
- **侦听器**: 监听数据的变化，当数据变化时，执行自定义的回调函数。

## 优点

- 简化开发: 开发者无需手动操作 DOM，只需关注数据的变化。
- 提高性能: Vue 的响应式系统能够精确地追踪数据的变化，只更新需要更新的组件。
- 易于维护: 数据和视图分离，使得代码更易于维护和测试。

## 局限性

- Vue 2:
		- Object.defineProperty() 无法监听新增属性和删除属性。
		- 无法监听数组的变化。
- Vue 3:
		- Proxy 在旧版本浏览器中兼容性不好。

## 相关理论与概念

- [[Object.defineProperty()]]: JavaScript 中用于定义对象属性的 API，可以设置属性的 getter 和 setter。
- [[Proxy]]: JavaScript 中用于创建代理对象的 API，可以监听对象的所有操作。
- [[Reflect]]: JavaScript 中用于操作对象的 API，可以更方便地进行反射操作。

## 参考资料

- Vue 官方文档: [https://vuejs.org/](https://vuejs.org/)
- Vue 2 响应式原理: [https://v2.vuejs.org/v2/guide/reactivity.html](https://v2.vuejs.org/v2/guide/reactivity.html)
- Vue 3 响应式原理: [https://vuejs.org/guide/essentials/reactivity-in-depth.html](https://vuejs.org/guide/essentials/reactivity-in-depth.html)# 背景
