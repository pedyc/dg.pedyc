---
uid: 202605151049
title: JSX 是什么？如何被转换？React 渲染过程是怎样的？
aliases: ["Q-JSX是什么？"]
description: "理解 JSX 语法糖本质、babel 编译过程和 React 虚拟 DOM 渲染机制"
tags: [面试题, React]
date-created: 2026-05-15
date-modified: 2026-07-22
status: cultivating
content-type: question
up: "[[React]]"
---

## 问题

> JSX 是什么？如何被转换？React 渲染过程是怎样的？

---

## 背景

这是 React 面试中的高频基础问题。理解 JSX 转换和虚拟 DOM 渲染过程，是深入 React 原理的必经之路。

---

## 现有答案

### JSX 是什么？

JSX 是 JavaScript 的语法扩展，允许在 JS 代码中写 XML 格式的标签语法。

```jsx
const element = <h1 className="title">Hello, {name}</h1>;
```

**核心特点**：
- 不是字符串，是 JavaScript 的语法扩展
- JSX 中的 `{}` 可以嵌入任意 JS 表达式
- 组件首字母大写（PascalCase）表示 React 组件，小写表示原生 DOM 标签

---

### JSX 如何被转换？

JSX 经 **Babel** 编译后，转换为 `React.createElement()` 函数调用：

```jsx
// 原始 JSX
const element = <div className="title">Hello</div>;

// Babel 编译后
const element = React.createElement(
    'div',
    { className: 'title' },
    'Hello'
);
```

**Babel 判断规则**：
- 首字母小写 → 编译为**字符串标签**（如 `'div'`、`'span'`）
- 首字母大写 → 编译为**组件对象**（如 `Hello` 组件）

`React.createElement()` 返回一个**虚拟 DOM 对象**（JS 普通对象）：

```javascript
{
    $$typeof: Symbol(react.element),
    type: 'div',
    props: {
        className: 'title',
        children: 'Hello'
    },
    key: null,
    ref: null
}
```

---

### React 渲染过程是怎样的？

#### 首次渲染

```bash
JSX 语法
    ↓ Babel 编译
React.createElement() 调用
    ↓
虚拟 DOM 对象（JavaScript 对象）
    ↓ ReactDOM.render()
真实 DOM（插入到页面）
```

1. **JSX 编译**：Babel 将 JSX 转换为 `React.createElement()` 调用
2. **生成虚拟 DOM**：`React.createElement()` 返回一个描述 UI 的 JS 对象
3. **构建虚拟 DOM 树**：嵌套的 `createElement` 形成树形结构
4. **渲染真实 DOM**：ReactDOM.render() 将虚拟 DOM 转换为真实 DOM

#### 更新渲染（Diff 算法）

```bash
组件状态/属性变化
    ↓
重新生成虚拟 DOM 树
    ↓
与旧虚拟 DOM 对比（Diff）
    ↓
只更新变化的部分（ Reconciliation）
    ↓
应用最小更新到真实 DOM
```

**Diff 算法核心策略**：
- 同层对比，不同则替换
- Key 帮助识别同层节点变化
- 跨层移动成本高（尽量避免）

---

### 我的理解

JSX 的本质是**语法糖**，它让组件结构声明更直观，但运行时仍然是 `createElement` 的 JS 对象。虚拟 DOM 是 React 的核心抽象——它用 JS 对象模拟 DOM 树，避免直接操作真实 DOM 的性能损耗，通过 Diff 算法实现最小更新。

---

## 探索路径

- [ ] React 中虚拟 DOM 树是怎样更新的？Fiber 架构是什么？
- [ ] React 17 新 JSX 转换（无需引入 React）

---

## 待验证（扩展）

- [ ] Babel 如何判断组件首字母大写/小写？
- [ ] `React.createElement` 和 `ReactDOM.render` 的源码实现

---

## 关联

- **相关概念**：[[React]] — 虚拟 DOM 是 React 的核心机制
- **相关问题**：[[虚拟 DOM 的原理是什么？]] — 深入 Diff 算法 
- **参考资料**：
	- [React 官方文档 - JSX 简介](https://react.dev/learn/writing-markup-with-jsx)
	- [Babel 官网 - JSX 编译器](https://babeljs.io/docs/babel-plugin-transform-react-jsx)
