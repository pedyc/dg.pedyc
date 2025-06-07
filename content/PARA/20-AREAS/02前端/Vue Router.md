---
title: Vue Router
date-created: 2025-06-02
date-modified: 2025-06-02
---

## 定义

Vue Router 是 Vue.js 的官方路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。

## 核心特点

- **组件化**: 将路由映射到组件，使得路由配置更加清晰和易于维护。
- **动态路由**: 支持动态路由参数，方便构建灵活的路由结构。
- **嵌套路由**: 支持嵌套路由，方便构建复杂的页面结构。
- **命名路由**: 支持命名路由，方便在代码中引用路由。
- **路由守卫**: 支持路由守卫，可以在路由跳转前后进行权限验证和数据处理。
- **多种 History 模式**: 支持 Hash 模式和 HTML5 History 模式，可以根据需求选择不同的模式。

## 应用

- **单页面应用 (SPA)**: 使用 Vue Router 构建 SPA。
- **多页面应用 (MPA)**: 也可以在 MPA 中使用 Vue Router 进行页面跳转。
- **大型应用**: 使用 Vue Router 管理应用的路由结构。

## 优缺点

- 优点:
		- 易于使用。
		- 功能强大。
		- 与 Vue.js 深度集成。
		- 社区支持良好。
- 缺点:
		- 对于小型应用，可能过度设计。
		- 需要学习和理解 Vue Router 的 API。

## 相关概念

- [[动态路由]]: 带有动态参数的路由，例如 `/user/:id`。
- [[嵌套路由]]: 在一个路由组件中渲染另一个路由组件，例如在 `/user` 页面中渲染 `/user/profile` 和 `/user/posts`。
- [[命名路由]]: 为路由指定一个名称，方便在代码中引用，例如 `<router-link:to="{ name: 'user', params: { id: 123 }}">`。
- [[路由守卫]]: 在路由跳转前后执行的函数，可以用于权限验证和数据处理。

## 示例

```javascript
// 1. 定义路由组件
const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

// 2. 定义路由
const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/about', component: About, name: 'about' },
  { path: '/user/:id', component: User, name: 'user' }, // 动态路由
]

// 3. 创建路由实例
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 4. 在 Vue 应用中使用路由
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

## 问答卡片

- Q1：Vue Router 有哪些 History 模式？有什么区别？
- A：Vue Router 支持 Hash 模式和 HTML5 History 模式。Hash 模式使用 URL 的 hash 部分进行路由，兼容性好，但 URL 不美观。HTML5 History 模式使用 HTML5 History API 进行路由，URL 美观，但需要服务器配置支持。
- Q2：如何在 Vue Router 中使用路由守卫？
- A：可以使用 `beforeEach`, `beforeResolve` 和 `afterEach` 等导航守卫函数，在路由跳转前后执行自定义的逻辑。

## 参考资料

- Vue Router 官方文档: [https://router.vuejs.org/](https://router.vuejs.org/)
