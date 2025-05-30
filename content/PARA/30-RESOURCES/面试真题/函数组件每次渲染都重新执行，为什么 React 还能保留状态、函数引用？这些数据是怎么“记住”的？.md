---
title: 函数组件每次渲染都重新执行，为什么 React 还能保留状态、函数引用？这些数据是怎么“记住”的？
date-created: 2025-05-21
date-modified: 2025-05-28
---

## 函数组件每次渲染都重新执行，为什么 React 还能保留状态、函数引用？这些数据是怎么 " 记住 " 的？

> React 函数组件本质上就是一个 " 普通函数 "，每次重新渲染时都会**重新执行函数体**，也就意味着所有变量、函数、引用**理论上应该都会丢失**。
> 但 React 通过**Hooks 机制 + 内部状态缓存**，实现了跨 render 保留状态的能力：

1. `useState` 是怎么 " 记住 " 状态的？

> - 每个组件实例在 React 内部都有一个 **fiber node**，它维护了一个 hooks 链表。
> - 当你调用 `useState()` 时，React 会把当前 state 保存在这个链表中。
> - 下一次组件 render，React 会用**相同顺序**执行 hooks，然后拿出旧的 state。
> - 所以状态能保留是因为：**状态保存在组件的 Fiber 节点中，而不是保存在函数作用域中。**

2. 函数组件确实是闭包，但闭包会导致什么？

> - 函数组件在每次执行时会创建新的函数闭包。
> - 在异步场景下，这会带来**闭包陷阱**：旧函数作用域没被销毁

```tsx
useEffect(() => {
  setTimeout(() => {
    console.log(count) // ⚠️ 打印的是旧 count
  }, 1000)
}, [])
```

3. 为什么要用 `useCallback` / `useMemo`？

> 因为函数组件每次重新执行，所有函数和对象都会重新创建（即引用会变）。
> 这会导致子组件无意义的 re-render 或 effect 重新执行：
> 使用 `useCallback(fn, deps)` 可以缓存这个函数引用，除非 deps 变。

```tsx
const handleClick = () => doSomething() // 每次都是新函数

const handleClick1 = useCallback(doSomething,[dep1,dep2])
```

4. `useRef` 的作用？

> - 它可以创建一个组件生命周期内保持不变的引用容器。
> - 类似 class 组件中的 `this.someRef`。
> - 非常适合存放**不会触发更新**的变量，如 timer ID、上一次值等。

## 示例回答

> 虽然函数组件每次都会重新执行，但状态和引用并没有丢失，是因为 React 内部通过 Fiber 节点中的 hooks 链表，缓存了所有 hooks 数据。hooks 是通过调用顺序来对齐的，而不是靠作用域保留。
> 闭包可能导致访问旧值，所以需要 `ref`、`useEffect` 或 `useCallback` 等机制来规避陷阱。
