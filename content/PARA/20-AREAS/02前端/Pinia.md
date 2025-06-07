---
title: Pinia
date-created: 2025-06-02
date-modified: 2025-06-02
---

## 定义

Pinia 是一个为 Vue.js 设计的状态管理库，它可以让你跨组件或页面共享状态。如果你熟悉 Vuex，你会发现 Pinia 的概念非常相似。Pinia 最初是为了探索 Vuex 的下一个版本而创建的，它吸取了 Vuex 5 的许多想法，最终作者发现 Pinia 提供了 Vuex 5 中想要的大部分内容，并决定将其作为新的推荐方案。

## 核心特点

- **轻量级**: Pinia 的 API 设计非常简洁，易于学习和使用。
- **类型安全**: Pinia 使用 TypeScript 编写，提供了良好的类型支持。
- **模块化**: Pinia 的 store 可以按模块划分，方便管理大型应用的状态。
- **Composition API**: Pinia 与 Vue 3 的 Composition API 完美结合，使用起来非常自然。
- **Devtools 支持**: Pinia 提供了 Devtools 支持，方便调试和追踪状态变化。

## 核心概念

- **State**: 存储应用的状态数据。
- **Getter**: 从 state 中派生出的计算属性。
- **Action**: 用于修改 state 的方法。

## 应用

- **用户认证**: 管理用户的登录状态。
- **购物车**: 管理购物车中的商品信息。
- **表单**: 管理表单的输入数据。
- **UI 状态**: 管理 UI 组件的状态，例如弹窗的显示与隐藏。

## 优缺点

- 优点:
	- 易于学习和使用。
	- 类型安全。
	- 模块化。
	- 与 Composition API 完美结合。
	- Devtools 支持。
- 缺点:
	- 相对较新，社区生态不如 Vuex 完善。
	- 对于小型应用，可能过度设计。

## 相关概念

- [[Vuex]]: Vue.js 的官方状态管理库，与 Pinia 类似，但 API 略有不同。
- [[Composition API]]: Vue 3 中引入的一种新的 API 风格，用于组织组件的逻辑。

## 示例

```javascript
// 定义一个 store
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

// 在组件中使用 store
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

export default {
  setup() {
    const counterStore = useCounterStore()
    const { count, doubleCount } = storeToRefs(counterStore) // 使用 storeToRefs 保持状态的响应性

    return {
      count,
      doubleCount,
      increment: counterStore.increment,
    }
  },
}
```

## 参考资料

- Pinia 官方文档: [https://pinia.vuejs.org/](https://pinia.vuejs.org/zh/)
