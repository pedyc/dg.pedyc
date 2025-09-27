---
title: React 重新渲染
date-created: 2025-09-09
date-modified: 2025-09-09
---

1. 状态 (State) 变化
	- 组件内部调用 setState 或 useState 的 setter 函数
	- 即使新值与旧值相同，React 也会触发重新渲染
2. Props 变化
	- 父组件传递给子组件的 props 发生变化
	- 包括 props 的值变化或引用变化
3. 父组件重新渲染
	- 父组件重新渲染时，默认情况下所有子组件都会重新渲染
	- 这是 React 的默认行为，不管子组件的 props 是否真的变化了
4. Context 值变化
	- 使用 useContext 的组件在 Context 值变化时会重新渲染
5. 强制更新
	- 调用 forceUpdate() (类组件) 或其他强制更新方法
