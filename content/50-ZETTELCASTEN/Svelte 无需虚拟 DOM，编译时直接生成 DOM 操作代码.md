---
uid: 202605261100
title: Svelte 无需虚拟 DOM，编译时直接生成 DOM 操作代码
aliases: []
description: Svelte 在编译阶段分析组件模板，生成精准的原生 JavaScript DOM 操作指令，无需虚拟 DOM 运行时
tags: [前端开发, Svelte]
date-created: 2026-05-26
date-modified: 2026-05-26
status: fleeting
content-type: atomic
up: "[[Svelte]]"
---

> Svelte 在编译阶段分析组件模板，生成精准的原生 JavaScript DOM 操作指令，无需虚拟 DOM 运行时

## 论据/示例

**编译对比**：

| 框架 | 运行时需求 | DOM 更新方式 |
|:---|:---|:---|
| React | ~40KB 运行时 | 虚拟 DOM + Diff |
| Vue | ~30KB 运行时 | 响应式追踪 + DOM patch |
| Svelte | ~0KB 运行时 | 编译时生成直接赋值 |

**Svelte 编译示例**：

```svelte
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  点击次数：{count}
</button>
```

编译后生成的代码大致等价于：

```js
button.addEventListener('click', () => {
  text.textContent = `点击次数：${++count}`;
});
```

**关键洞察**：Svelte 把原本运行时要做的事情（依赖收集、Diff 计算）提前到编译阶段完成，输出的是极简的赋值语句，浏览器直接执行即可，无须任何中间层。

## 关联

- [[Svelte]] — 本观点的父级 concept
