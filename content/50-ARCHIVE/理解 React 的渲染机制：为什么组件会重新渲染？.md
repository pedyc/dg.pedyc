---
title: 理解 React 的渲染机制：为什么组件会重新渲染？
author: "[[niusir]]"
description: React 是一个优秀的 UI 库，以其声明式、组件化、响应式的设计深受前端开发者喜爱。但在实际开发中，我们经常会遇到「组件频繁重新渲染」的问题，甚至因此导致性能下降、动画卡顿或者数据闪烁等现象。 这
tags: [clippings]
date-created: 2026-03-01
date-modified: 2026-05-15
published: 2025-06-24
source: https://juejin.cn/post/7519131267293888522
---

React 是一个优秀的 UI 库，以其声明式、组件化、响应式的设计深受前端开发者喜爱。但在实际开发中，我们经常会遇到「组件频繁重新渲染」的问题，甚至因此导致性能下降、动画卡顿或者数据闪烁等现象。

这篇文章将带你深入了解 React 的渲染机制，帮助你从根本上掌握 " 组件为什么会重新渲染 "，并提供一些优化技巧。

---

## 一、什么是 React 渲染？

React 的 " 渲染 " 指的是：

> **React 根据当前的状态和 props，生成 UI 的 Virtual DOM，然后与上一次的 Virtual DOM 对比，通过 Diff 算法找到最小变化，最终更新真实 DOM。**

所以，" 重新渲染 " 并不意味着每次都操作真实 DOM，而是指组件函数被重新执行（即再次 return JSX），进而产生新的 Virtual DOM。

---

## 二、导致组件重新渲染的原因

1. **State 变化**

最常见的原因。当调用 `setState` 或 `useState` 的 setter 函数时，组件会重新执行。

```jsx
const [count, setCount] = useState(0);

// 点击按钮会导致组件重新渲染
<button onClick={() => setCount(count + 1)}>增加</button>
```

1. **Props 变化**

如果父组件传递给子组件的 `props` 发生变化，子组件也会重新渲染。

```jsx
<Child value={parentValue} />
```

哪怕只是一个函数或对象的引用变了，也会触发。

1. **父组件重新渲染**

即使 props 没变，只要父组件重新渲染（如 state 改变），它的所有子组件默认都会重新执行。

1. **上下文变化（React Context）**

使用了 `useContext()` 的组件，当 `context` 值改变时，也会重新渲染。

---

## 三、React 是如何优化渲染的？

React 内部并不会自动 " 阻止 " 不必要的渲染，它的策略是：

- **只更新需要更新的真实 DOM（通过 Virtual DOM Diff）**
- **不会自动跳过函数组件的执行**

因此，组件函数即使被重新执行，只要渲染结果一样，React 也不会重新操作 DOM。这就是为什么即使频繁渲染，页面看起来不会抖动的原因。

---

## 四、如何手动优化性能？

### 1\. 使用 React.memo

对于纯函数组件，如果 props 没有变化，可以使用 `React.memo` 来阻止重新渲染。

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  // 只有当 props 改变时才重新渲染
  return <div>{props.text}</div>;
});
```

### 2\. 避免不必要的引用变化（尤其是对象和函数）

每次渲染都会创建新的对象和函数，除非使用 `useCallback` 或 `useMemo` ：

```jsx
const memoizedFn = useCallback(() => {
  // ...
}, [dependencies]);

const memoizedObj = useMemo(() => ({ a: 1 }), []);
```

### 3\. 拆分组件

将大组件拆成多个小组件，粒度更小，更容易控制渲染行为。

---

## 五、如何判断是否重新渲染了？

可以通过以下几种方式：

- `console.log()` ：在组件内部打印，看是否重新执行
- React 开发者工具（Profiler）：观察组件渲染次数
- 使用 `why-did-you-render` 工具：自动提示哪些组件不必要地渲染了

---

## 六、结语

理解 React 的渲染机制是构建高性能应用的前提。掌握这些知识后，我们就能有意识地编写高效、可维护的 React 组件。

下次遇到组件频繁渲染时，别急着 " 瞎优化 "，先问自己： **这个组件为什么会重新渲染？是否真的需要重新渲染？**
