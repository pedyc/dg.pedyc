---
title: useCallback
date-created: 2025-09-09
date-modified: 2025-09-09
---

## React useCallback 与 Vue computed 的区别

### 🎯 核心用途不同

React useCallback:
- 用于**缓存函数引用**，避免不必要的函数重新创建
- 主要解决**性能优化**问题，防止子组件不必要的重新渲染
- 返回一个**记忆化的函数**

Vue computed:
- 用于**计算派生状态**，基于响应式数据计算新值
- 主要解决**数据转换**问题，将复杂逻辑从模板中抽离
- 返回一个**计算后的值**

### 📝 代码示例对比

React useCallback:

```javascript
const MyComponent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // 缓存函数，只有当 count 变化时才重新创建
  const handleClick = useCallback(() => {
    console.log('Count:', count);
  }, [count]); // 依赖数组
  
  return <ChildComponent onClick={handleClick} />;
};
```

Vue computed:

```javascript
const MyComponent = {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    // 计算属性，基于 firstName 和 lastName 计算
    fullName() {
      return this.firstName + ' ' + this.lastName;
    }
  }
};
```

### 🔄 触发机制

useCallback:
- 依赖数组中的值变化时，返回新的函数引用
- 依赖不变时，返回缓存的函数引用
- 手动控制缓存策略

computed:
- 依赖的响应式数据变化时，自动重新计算
- 结果会被缓存，依赖不变时直接返回缓存值
- Vue 自动追踪依赖关系

### ⚡ 性能特点

useCallback:
- 防止函数重新创建导致的子组件重渲染
- 需要配合 `React.memo` 或 `useMemo` 使用才有效果
- 过度使用可能适得其反

computed:
- 自动缓存计算结果，避免重复计算
- 惰性求值，只有被访问时才计算
- Vue 的响应式系统自动优化

### 🎨 使用场景

useCallback 适用于:
- 传递给子组件的事件处理函数
- 作为其他 Hook 的依赖项的函数
- 避免昂贵的函数重新创建

computed 适用于:
- 基于现有数据计算新数据
- 复杂的数据格式化
- 过滤、排序等数据处理

### 📊 总结对比

| 特性 | React useCallback | Vue computed |
|------|------------------|-------------|
| **目的** | 缓存函数引用 | 计算派生数据 |
| **返回值** | 函数 | 计算结果 |
| **依赖追踪** | 手动指定依赖数组 | 自动追踪依赖 |
| **缓存机制** | 基于依赖比较 | 基于响应式系统 |
| **主要用途** | 性能优化 | 数据转换 |
| **使用复杂度** | 需要理解依赖数组 | 相对简单直观 |

两者解决的是不同层面的问题：useCallback 专注于**函数缓存优化**，而 computed 专注于**数据计算缓存**。
