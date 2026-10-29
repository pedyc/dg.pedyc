---
uid: "202604290003"
title: React性能优化
aliases: [SOP-React性能优化]
description: React 性能优化的标准操作流程
tags: [react, react/性能优化]
date-created: 2026-04-29
date-modified: 2026-06-16
status: active
content-type: sop
up: "[[React]]"
---

> React 性能优化的标准操作流程

## 原则

1. **避免不必要的渲染** — 组件渲染成本高时优化，而非所有组件
2. **先测量再优化** — 使用 Profiler、React DevTools 定位瓶颈
3. **保持代码可读性** — 优化不应牺牲代码维护性

---

## 方法清单

### 1. 减少不必要的渲染

#### 1.1 React.memo

包装组件，避免 props 没变化时重新渲染。

> [[memo 的浅比较看不见嵌套变化，也拦不住自身 state 更新]]

```jsx
const MyComponent = React.memo(function MyComponent({ name }) {
  return <div>{name}</div>;
});
```

**适用场景**：子组件渲染成本高、接收复杂 props。

**浅比较会在两处失效**：

- **父组件每次渲染都新建对象或函数**（`style={{ color: 'red' }}`、内联回调），引用每次都变，memo 判定「变了」，等于没包
- **props 里的嵌套对象内部变了但引用没变**（直接改 `obj.x`），memo 判定「没变」，界面停在旧值

两处都靠稳定引用来解决：`useMemo` 缓存对象、`useCallback` 缓存函数。反过来，如果 props 只有原始值、组件本身也轻，包一层 memo 的比较成本可能超过重渲染成本——memo 不是默认该加的。

需要按业务字段而非引用比较时，传第二个参数：

```jsx
const Row = React.memo(
  ({ data }) => <div>{data.value}</div>,
  (prev, next) => prev.data.id === next.data.id
);
```

> [!warning]
> 自定义比较函数把「什么算相同」的责任交回给你：漏比一个字段，界面就会停在旧值，而且这种 bug 只在那一个字段变化时出现。

#### 1.2 useMemo

缓存计算结果，避免重复计算。

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

**适用场景**：复杂计算、派生数据。

#### 1.3 useCallback

缓存函数引用，稳定依赖。

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

**适用场景**：回调传递给子组件、useEffect 依赖。

---

### 2. 避免重复创建

#### 2.1 useRef 保存不变的值

避免在渲染时重新创建对象或函数。

```jsx
function Component({ size }) {
  // ❌ 每次渲染创建新对象
  const style = { width: size, height: size };

  // ✅ useMemo 缓存对象
  const style = useMemo(() => ({ width: size, height: size }), [size]);

  // ✅ 或 useRef 存储（不触发渲染的引用）
  const styleRef = useRef({ width: size, height: size });
}
```

#### 2.2 组件外部定义不变内容

静态配置、映射表等放在组件外。

```jsx
// ❌ 每次渲染重新创建
const OPTIONS = computeOptions();

// ✅ 模块级别，渲染周期外
const OPTIONS = [...];
```

---

### 3. 延迟加载

#### 3.1 React.lazy + Suspense

代码分割，延迟加载组件。

```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<Spinner />}>
      <OtherComponent />
    </Suspense>
  );
}
```

#### 3.2 条件加载非关键 UI

```jsx
function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <CriticalUI />
      {showChart && <HeavyChart />}
    </div>
  );
}
```

---

### 4. 虚拟列表

长列表场景使用虚拟化，只渲染可视区域。

```jsx
import { FixedSizeList } from 'react-window';

function LongList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}
```

---

## 检查清单

- [ ] 使用 React DevTools Profiler 确认瓶颈位置
- [ ] 检查组件是否接收不必要的 props 变化
- [ ] 确认 useEffect 依赖数组完整
- [ ] 确认 useCallback/useMemo 依赖正确
- [ ] 评估是否需要代码分割
- [ ] 检查长列表是否需要虚拟化

---

## 关联

- [[Refs(React)]] — Ref 优化相关
- [[useRef 存的是可变值不是界面状态，它变了界面不会跟]] — atomic 笔记
- [[在React中有哪些更改数据不触发重新渲染的方式]] — question 笔记
