---
title: 组件 (React)
date-created: 2025-09-08
date-modified: 2025-09-08
---

## 概念

组件是视图单位，任何视图的一部分都可以称为一个组件，组件拥有自己的逻辑和外观。

React 组件本质上是一个返回 JSX 的 Javascript 函数，例如：

```javascript
function MyBtn(){
	return(
		<button>Here is a button</button>
	)
}
```

> [!hint] 约定
> 在 JSX 中，React 组件使用大写字母开头，例如 `MyBtn`
> HTML 使用小写字母，例如 `<button>`
