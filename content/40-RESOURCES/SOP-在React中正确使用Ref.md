---
uid: "202604290004"
title: SOP-在React中正确使用Ref
aliases: [SOP-在React中正确使用Ref]
description: 在 React 中正确使用 Ref 的标准操作流程
tags: [react, react/refs]
date-created: 2026-04-29
date-modified: 2026-04-29
status: active
content-type: sop
up: ["[[Refs(React)|React Refs]]"]
---

> 在 React 中正确使用 Ref 的标准操作流程

## 原则

1. **Ref 是逃生通道，不是数据通道** — 优先使用 state，必要时使用 ref
2. **修改 ref 不会触发渲染** — ref 变化需要手动触发 UI 更新（如 setState）
3. **ref 值在渲染周期外可变** — 不要依赖 ref.current 参与渲染逻辑

---

## 适用场景

### ✅ 应该使用 Ref

- **DOM 操作**：聚焦、文本选择、触发动画、集成第三方库
- **存储计时器 ID**：setInterval / setTimeout
- **存储不需要渲染的可变数据**：如第三方库实例、缓存值
- **避免闭包陷阱**：在 useEffect 中保持稳定的引用

### ❌ 不应该使用 Ref

- **替代 state**：需要渲染到 UI 的数据
- **替代 props**：组件间数据传递
- **参与渲染逻辑**：如 `{ref.current.length}`

---

## 标准操作流程

### 1. 创建 Ref

```jsx
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(null); // 初始值为 null
  // 或
  const counterRef = useRef(0); // 存储数值
}
```

### 2. 使用 Ref

#### 2.1 DOM 引用

```jsx
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // 挂载后聚焦
  }, []);

  return <input ref={inputRef} />;
}
```

#### 2.2 存储计时器 ID

```jsx
function Timer() {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);

    return () => clearInterval(intervalRef.current); // 清理
  }, []);

  return <div>Timer</div>;
}
```

#### 2.3 避免闭包陷阱

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 保持 ref 与 state 同步
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      // ❌ 闭包陷阱：count 永远是初始值 0
      // console.log(count);

      // ✅ 使用 ref 避免闭包陷阱
      console.log(countRef.current);
    }, 1000);
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 3. 访问 Ref

```jsx
// 在 DOM 上设置 ref
<input ref={inputRef} />

// 访问 DOM
inputRef.current?.focus();
inputRef.current?.value;

// ref 存储的值
console.log(counterRef.current);
```

### 4. 回调 Ref（特殊场景）

```jsx
function CallbackRefInput() {
  const [value, setValue] = useState('');

  const refCallback = useCallback((node) => {
    if (node) {
      node.focus();
      console.log('DOM 节点已挂载');
    }
  }, []);

  return <input ref={refCallback} value={value} onChange={e => setValue(e.target.value)} />;
}
```

---

## 常见错误

| 错误 | 问题 | 正确做法 |
|:----|:----|:--------|
| `ref.current = value` 期望 UI 更新 | ref 变化不触发渲染 | 使用 `setState` 更新 UI |
| 在渲染时读取 `ref.current` | 值可能不是最新的 | 只在事件处理器或 useEffect 中使用 |
| `ref` 作为 props 传递 | ref 是命令式 API | 使用 `forwardRef` 或 ref 收集模式 |
| 忘记清理 ref 的副作用 | 内存泄漏 | 在 useEffect return 中清理 |

---

## 检查清单

- [ ] 是否确实需要 Ref，还是 state 更合适
- [ ] Ref 是否只用于命令式操作（DOM、计时器）
- [ ] Ref 存储的值是否不需要渲染到 UI
- [ ] DOM ref 是否在 useEffect 中访问（避免提前访问）
- [ ] 计时器 ref 是否在 cleanup 函数中清除
- [ ] 是否避免了 ref 参与渲染逻辑

---

## 关联

- [[Refs(React)|React Refs]] — Ref 概念总览
- [[useRef变化不会触发重新渲染]] — atomic 笔记
- [[在React中有哪些更改数据不触发重新渲染的方式]] — question 笔记
- [[SOP-React性能优化]] — 性能优化相关
