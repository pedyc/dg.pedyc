---
title: 函数组件每次渲染都重新执行，为什么 React 还能保留状态、函数引用？这些数据是怎么“记住”的？
date-created: 2025-05-21
date-modified: 2026-03-21
content-type: atomic
---

> React 函数组件本质上就是一个普通函数，每次重新渲染时都会重新执行函数体。但 React 通过 Hooks 机制 + 内部状态缓存，实现了跨 render 保留状态的能力——状态保存在组件的 Fiber 节点中，而不是保存在函数作用域中。

## 论据/示例

1. **useState**：每个组件实例在 React 内部有一个 fiber node，维护了 hooks 链表，状态保存在 Fiber 节点中
2. **闭包陷阱**：函数组件在每次执行时会创建新的函数闭包，在异步场景下会访问旧值

```tsx
useEffect(() => {
  setTimeout(() => {
    console.log(count) // 打印的是旧 count
  }, 1000)
}, [])
```

3. **useCallback/useMemo**：函数组件每次重新执行，所有函数和对象都会重新创建，使用它们可以缓存引用
4. **useRef**：创建组件生命周期内保持不变的引用容器，适合存放不会触发更新的变量

## 关联

- **相关**：[[Hooks(React)]] [[useCallback]]
