---
title: React 组件之间有哪些通信方式？适用于哪些场景？
date-created: 2025-05-21
date-modified: 2025-05-28
---

## React 组件之间有哪些通信方式？适用于哪些场景？

1. 父子通信
	- 父到子通过传递 props
	- 子到父通过事件通知
2. 兄弟间通信
	- 通过共同父组件中转
3. 隔代通信
	- React Context
	- Redux 全局状态管理
4. 全局状态共享
	- Redux/Zustand
5. URL/路由通信
	- React Router 的 URL 参数、query string、location state
6. Ref/Imperative Handle 通信
	- useImperativeHandle + forwardRef

## 示例回答

> 父子之间用 props；
> 兄弟之间通过公共父组件；
	跨多层用 Context 或状态管理；
	对于复杂场景，可以引入 Redux 或 Zustand 实现全局状态共享；
	URL / 路由参数也可以作为页面间通信的一种手段；
	少数情况下可以用 ref 暴露方法，或自定义事件进行解耦。
