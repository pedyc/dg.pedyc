---
uid: "202604300001"
title: React.memo通过浅比较props决定是否重新渲染
aliases: []
description: React.memo 通过浅比较 props 决定是否重新渲染
tags: []
date-created: 2026-04-30
date-modified: 2026-05-01
status: cultivating
content-type: atomic
up: ["[[React]]"]
---

> React.memo 通过浅比较 props 决定是否重新渲染

## 论据/示例

**核心原理**：

- `React.memo` 是一个高阶组件，包装后会对 props 进行浅比较
- 只有当 props 变化时才会触发重新渲染
- 默认浅比较是 referential equality（引用相等性）

**代码示例**：

```jsx
const MyComponent = React.memo(function MyComponent({ name, count }) {
  return <div>{name}: {count}</div>;
});
```

**浅比较的局限性**：

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染创建新对象，memo 无法检测内部变化
  const style = { color: 'red' };
  return <MyComponent style={style} />;

  // ✅ useMemo 保持对象引用不变
  const style = useMemo(() => ({ color: 'red' }), []);
  return <MyComponent style={style} />;

  // ✅ 或使用 useRef 存储
}
```

**自定义比较函数**：

```jsx
const MyComponent = React.memo(
  function MyComponent({ data }) {
    return <div>{data.value}</div>;
  },
  (prevProps, nextProps) => {
    // 自定义比较逻辑
    return prevProps.data.id === nextProps.data.id;
  }
);
```

## 关联

- [[Refs(React)|React Refs]] — Ref 概念总览
- [[SOP-React性能优化]] — 性能优化 SOP
