---
title: Vue和React对于状态管理的思路有什么不同？
date-created: 2026-09-22
date-modified: 2026-09-22
content-type:
  - question
up:
  - "[[前端状态管理]]"
---

|       | Vue                     | React                   |
| ----- | ----------------------- | ----------------------- |
| 核心机制  | 响应式依赖追踪                 | 状态更新触发重新渲染              |
| 状态读取  | 自动追踪                    | 通常不建立类似 Vue 的属性级依赖      |
| 状态修改  | `trigger`               | `setState` / dispatch   |
| 依赖建立  | 自动                      | 更多依赖组件结构和 Hook          |
| 派生状态  | `computed`              | 通常 `useMemo`            |
| 副作用   | `watch` / `watchEffect` | `useEffect`             |
| 对象响应式 | Proxy                   | React 本身不提供 Proxy 响应式对象 |
| 更新模型  | Dependency-driven       | Render-driven           |

简单来说：

```bash
Vue：

状态变化
   ↓
谁依赖这个状态？
   ↓
更新谁

React：

状态变化
   ↓
触发组件重新 render
   ↓
计算新的 UI
   ↓
React 决定 DOM 怎么更新
```
