---
title: MOC-Vue 面试题
date-created: 2026-03-15
date-modified: 2026-03-19
---

## MOC-Vue 面试题

- 基础

| 示例题目                                                  | 模块         | 知识点                                 |
| ----------------------------------------------------- | ---------- | ----------------------------------- |
| [[Vue2 是如何实现响应式的？Vue3 响应式的原理是？]]                      | Vue 响应式系统  | Object.defineProperty vs Proxy、依赖收集 |
| [[v-if 和 v-show 区别？v-model 原理是什么？]]                   | 模板语法 & 指令  | v-if、v-for、v-model、v-bind、v-on      |
| [[Vue3 生命周期有哪些？适合做哪些事情？]]                             | 生命周期       | 各个生命周期的作用                           |
| [[父子组件如何通信？跨层通信如何处理？]]                                | 组件通信       | props、emit、v-model、provide/inject   |
| [[computed 和 watch 有什么区别？使用场景？]]                      | 计算属性 & 侦听器 | computed vs watch                   |
| [[如何监听组件内部的自定义事件？.stop 和.prevent 区别？]]                | 事件机制       | 自定义事件、事件修饰符                         |
| [[在 Vue 组件中，模板是否必须有一个根节点包裹？Vue 2 和 Vue 3 在这方面有什么区别？]] | 渲染机制       | 模板渲染                                |
| [[watch 和 watchEffect 有什么区别？]]                        |            |                                     |

- 进阶

| 示例题目                                         | 模块              | 知识点                            |
| -------------------------------------------- | --------------- | ------------------------------ |
| [[ref 和 reactive 有什么区别？watchEffect 是怎么工作的？]] | Composition API | setup、ref、reactive、watchEffect |
| [[Vue 的 Diff 算法与 React 有哪些异同？]]              | Diff 算法         | Vue 如何高效更新 DOM？                |
| [[为什么 data 更新后视图没立即变化？]]                     | 异步更新机制          | nextTick 原理与作用                 |
| [[如何编写一个拖拽指令？]]                              | 自定义指令           | 生命周期钩子、钩子函数参数                  |
| [[如何实现一个通用布局组件使用插槽？]]                        | 插槽机制            | 默认插槽、具名插槽、作用域插槽                |
| [[如何在路由跳转前检查权限？]]                            | Vue Router      | 路由守卫、懒加载、动态路由                  |
| [[Vuex 的核心概念有哪些？Pinia 的优势？]]                 | Vuex / Pinia    | 状态管理原理、模块化、持久化                 |
| [[Vue SSR 的核心流程是什么？]]                        | SSR & Nuxt      | 同构渲染、hydrate、SEO               |
| [[如何优化 Vue 应用的性能？]]                          | 性能优化            | keep-alive、异步组件、v-onc
