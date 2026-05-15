---
title: React 的 Diff 算法是怎么工作的？为什么性能很高？
date-created: 2025-05-21
date-modified: 2026-05-15
content-type: [question]
---

> React 使用的是一种基于树的 diff 算法，通过比较新旧虚拟 DOM 树，计算出最小的 DOM 更新操作，最小化实际 DOM 操作次数 + 避免不必要的重绘重排。

## 论据/示例

1. **同级比较**：只对比同一层级，不考虑跨层重排
2. **key 区分子节点**：有 key 可以精确判断哪些节点复用、插入、移动或删除

```tsx
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
```

3. **组件级 diff**：如果是同一组件类型，React 会复用旧组件实例，只更新 props

## 关联

- **相关**：[[React 重新渲染]]
