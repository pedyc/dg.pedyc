---
uid: 20260317000009
title: Vue3 响应式系统分为 effect 和 reactive 两部分
description: Vue3 响应式系统中 effect 负责依赖收集和触发更新，reactive 负责将普通对象转换为响应式对象
tags: [前端/Vue]
date-created: 2026-03-17
date-modified: 2026-03-23
status: fleeting
content-type: atomic
---

## Vue3 响应式系统分为 effect 和 reactive 两部分

> effect 负责收集依赖和触发更新，reactive 负责将普通对象转换为响应式对象

### 论据 / 示例

```javascript
// reactive：将普通对象转换为响应式
const state = reactive({ count: 0 });

// effect：定义响应式逻辑
effect(() => {
  console.log('count:', state.count);
});

// 修改 count 会自动触发 effect 执行
state.count++; // 输出：count: 1
```

### 关联

- **父级**：[[响应式原理(Vue3)]]
- **相关**：[[Vue3 ref 和 reactive 的区别]]
