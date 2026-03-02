---
title: 0-React_js 中组件重渲染性能问题及优化方法_react 弹框 导致 页面重新渲染 - CSDN 博客
tags: []
date-created: 2026-03-01
date-modified: 2026-03-01
banner: "https://images.unsplash.com/photo-1769008303219-eaf84b0e916c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzIzNzg3ODR8&ixlib=rb-4.1.0&q=85&fit=crop&w=660&max-h=540"
date: 2026-03-01 23:26:32
url: https://blog.csdn.net/yuanlong12178/article/details/148257073
---

## React.js 中组件重渲染性能问题及优化方法

在 React.js 开发中，组件的重渲染是常见的操作，但如果处理不当，可能会导致性能问题，如页面卡顿、响应缓慢等。本文将探讨组件重渲染性能问题的常见原因，并提供相应的优化方法。

## 一、React.js 中组件重渲染性能问题的常见原因

### （一）不必要的重渲染

如果组件的 `props` 或 `state` 发生变化，React 会重新渲染组件。然而，有时这些变化是不必要的，导致了不必要的重渲染。

**错误示例：**

```bash
import React, { useState } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const ChildComponent = ({ count }) => {
  console.log('ChildComponent rendered');
  return <div>{count}</div>;
};
```

在上述代码中，每次点击按钮时，`ParentComponent` 和 `ChildComponent` 都会重新渲染，即使 `ChildComponent` 的 `count` 值没有变化。

### （二）深层嵌套组件的重渲染

在深层嵌套的组件结构中，父组件的重渲染可能会导致所有子组件的重渲染，即使子组件的 `props` 或 `state` 没有变化。

**错误示例：**

```bash
import React, { useState } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <GrandChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const ChildComponent = ({ count }) => {
  console.log('ChildComponent rendered');
  return <div>{count}</div>;
};

const GrandChildComponent = ({ count }) => {
  console.log('GrandChildComponent rendered');
  return <ChildComponent count={count} />;
};
```

在上述代码中，每次点击按钮时，`ParentComponent`、`GrandChildComponent` 和 `ChildComponent` 都会重新渲染，即使 `ChildComponent` 的 `count` 值没有变化。

### （三）未正确使用 `React.memo`

`React.memo` 是一个高阶组件，用于避免不必要的重渲染。如果未正确使用 `React.memo`，可能会导致组件的重渲染性能问题。

**错误示例：**

```bash
import React, { useState, memo } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const ChildComponent = memo(({ count }) => {
  console.log('ChildComponent rendered');
  return <div>{count}</div>;
});
```

在上述代码中，虽然使用了 `React.memo`，但未正确处理 `count` 的变化，导致 `ChildComponent` 仍然会重新渲染。

### （四）未正确使用 `useCallback` 和 `useMemo`

`useCallback` 和 `useMemo` 是 React 的 Hooks，用于避免不必要的函数或值的重新创建。如果未正确使用这些 Hooks，可能会导致组件的重渲染性能问题。

**错误示例：**

```bash
import React, { useState, useCallback } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <ChildComponent onIncrement={handleIncrement} />
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

const ChildComponent = memo(({ onIncrement }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onIncrement}>Increment</button>;
});
```

在上述代码中，虽然使用了 `React.memo`，但未正确使用 `useCallback`，导致 `ChildComponent` 仍然会重新渲染。

## 二、优化方法

### （一）避免不必要的重渲染

确保组件的 `props` 或 `state` 变化是必要的，避免不必要的重渲染。

**正确示例：**

```bash
import React, { useState, memo } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const ChildComponent = memo(({ count }) => {
  console.log('ChildComponent rendered');
  return <div>{count}</div>;
});
```

在上述代码中，`ChildComponent` 使用了 `React.memo`，避免了不必要的重渲染。

### （二）优化深层嵌套组件的重渲染

在深层嵌套的组件结构中，确保只有必要的组件重新渲染，避免不必要的重渲染。

**正确示例：**

```bash
import React, { useState, memo } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <GrandChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const ChildComponent = memo(({ count }) => {
  console.log('ChildComponent rendered');
  return <div>{count}</div>;
});

const GrandChildComponent = memo(({ count }) => {
  console.log('GrandChildComponent rendered');
  return <ChildComponent count={count} />;
});
```

在上述代码中，`GrandChildComponent` 和 `ChildComponent` 都使用了 `React.memo`，避免了不必要的重渲染。

### （三）正确使用 `React.memo`

确保正确使用 `React.memo`，避免不必要的重渲染。

**正确示例：**

```bash
import React, { useState, memo } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const ChildComponent = memo(({ count }) => {
  console.log('ChildComponent rendered');
  return <div>{count}</div>;
});
```

在上述代码中，`ChildComponent` 使用了 `React.memo`，避免了不必要的重渲染。

### （四）正确使用 `useCallback` 和 `useMemo`

确保正确使用 `useCallback` 和 `useMemo`，避免不必要的函数或值的重新创建。

**正确示例：**

```bash
import React, { useState, useCallback, memo } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <ChildComponent onIncrement={handleIncrement} />
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

const ChildComponent = memo(({ onIncrement }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onIncrement}>Increment</button>;
});
```

在上述代码中，`handleIncrement` 使用了 `useCallback`，避免了不必要的函数重新创建，`ChildComponent` 使用了 `React.memo`，避免了不必要的重渲染。

## 三、最佳实践建议

### （一）避免不必要的重渲染

在组件的 `props` 或 `state` 变化时，确保这些变化是必要的，避免不必要的重渲染。

### （二）优化深层嵌套组件的重渲染

在深层嵌套的组件结构中，确保只有必要的组件重新渲染，避免不必要的重渲染。

### （三）正确使用 `React.memo`

在需要避免不必要的重渲染时，正确使用 `React.memo`。

### （四）正确使用 `useCallback` 和 `useMemo`

在需要避免不必要的函数或值的重新创建时，正确使用 `useCallback` 和 `useMemo`。

### （五）使用 `shouldComponentUpdate` 或 `React.PureComponent`

在 类 组件中，使用 `shouldComponentUpdate` 或 `React.PureComponent` 来避免不必要的重渲染。

**正确示例：**

```bash
import React from 'react';

class ChildComponent extends React.PureComponent {
  render() {
    console.log('ChildComponent rendered');
    return <div>{this.props.count}</div>;
  }
}

const ParentComponent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <ChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

在上述代码中，`ChildComponent` 使用了 `React.PureComponent`，避免了不必要的重渲染。

## 四、总结

在 React.js 开发中，组件重渲染性能问题是一个常见的问题。通过避免不必要的重渲染、优化深层嵌套组件的重渲染、正确使用 `React.memo`、正确使用 `useCallback` 和 `useMemo` 以及使用 `shouldComponentUpdate` 或 `React.PureComponent`，可以有效解决这些问题。希望本文的介绍能帮助你在 React.js 开发中更好地管理组件重渲染，提升应用的性能和用户体验。

最后问候亲爱的朋友们，并邀请你们阅读我的全新著作

📚 [《 React 开发实践：掌握 Redux 与 Hooks 应用 》](https://item.jd.com/14915270.html)

![[40-RESOURCES/SimpRead/_resources/0-React_js 中组件重渲染性能问题及优化方法_react 弹框 导致 页面重新渲染 - CSDN 博客/94acb6f4bdfae182247febb78becafb4_MD5.jpg]]
