---
uid: "202604211743"
title: React Context 可搭配 React.memo 使用
aliases: []
tags: []
date-created: 2026-04-21
date-modified: 2026-04-21
status: fleeting
content-type: atomic
up: "[[React Context]]"
---

> React Context 可搭配 React.memo 使用

## 论据/示例

React Context 每次更新会导致所有消费组件重新渲染，可搭配 React.memo 来进行性能优化

```typescript
// 未优化：Context 更新时，所有消费组件都会重渲染
const ThemeButton = ({ onClick }) => {
  const theme = useContext(ThemeContext)
  return <button className={theme} onClick={onClick}>Click</button>
}

// 已优化：用 React.memo 包裹，仅当 props 变化时才重渲染
const ThemeButton = React.memo(({ onClick }) => {
  const theme = useContext(ThemeContext)
  return <button className={theme} onClick={onClick}>Click</button>
})

// 进阶优化：使用 useMemo 稳定 Context value 引用
const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
return (
  <ThemeContext.Provider value={themeValue}>
    <ThemeButton onClick={handleClick} />
  </ThemeContext.Provider>
)
```

**关键点**：
1. `React.memo` 让组件仅在 props 变化时重渲染
2. `useMemo` 稳定 `Provider value` 引用，避免不必要的连锁渲染

## 关联

- [[React.memo]]
- [[React Context]]
