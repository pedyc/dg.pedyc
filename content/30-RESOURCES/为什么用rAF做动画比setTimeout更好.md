---
uid: 202608301721
title: 为什么用rAF做动画比setTimeout更好
aliases: [Q-为什么rAF比setTimeout更好, requestAnimationFrame优势]
description: 深入解析 requestAnimationFrame (rAF) 与 setTimeout 在事件循环、屏幕刷新率同步 (VSync)、能耗及渲染时机上的本质区别与性能优势。
tags: [JavaScript, EventLoop, 浏览器渲染, 性能优化, Web动画]
date-created: 2026-08-30
date-modified: 2026-08-30
status: completed
content-type: question
up: ["[[事件循环]]"]
---

## 问题

> 为什么使用 rAF (requestAnimationFrame) 做动画比 setTimeout 更好？

---

## 背景

在传统前端动画实现中，常借助 `setTimeout` 或 `setInterval` 以固定的时间间隔（如 `1000/60 ≈ 16.7ms`）递增样式或坐标。但在实际运行中，往往会出现**掉帧、画面撕裂、卡顿**以及**高刷屏（90Hz/120Hz）不匹配**等问题。此外，当页面处于后台标签页或最小化时，定时器依然持续触发，白白浪费 CPU/GPU 算力并加剧设备耗电。

---

## 解决方案

### 答案 1：setTimeout 的不可控性与时间漂移

1. **宏任务调度偏差（Timer Drift）**：`setTimeout(fn, 16.7)` 只能保证在指定毫秒后将回调放入**宏任务队列（Task Queue）**。若主线程有长任务（Long Task）或微任务堆积，执行时机将大幅滞后。
2. **与屏幕刷新时钟（VSync）脱节**：
* 屏幕刷新由硬件垂直同步信号驱动。若定时器在某一帧的中后段触发并修改 DOM，可能由于剩余时间不足以完成 Style/Layout/Paint，导致该帧丢失（Dropped Frame）。
* 即使以固定 16.7ms 间隔触发，累积误差也会导致某些刷新周期内执行了 0 次或 2 次回调，造成视觉上的**顿挫与撕裂**。

### 答案 2：rAF 的硬件级同步与渲染流水线协同

1. **天然绑定垂直同步信号（VSync）**：`requestAnimationFrame` 回调的执行由浏览器的渲染时钟驱动，并在进入重绘流程（Style -> Layout -> Paint -> Composite）**前的一瞬间精准执行**，确保每次 DOM/CSS 计算都能刚好赶上当帧渲染。
2. **自动适配硬件刷新率**：在 60Hz 屏幕上约每 16.7ms 触发一次，在 120Hz（ProMotion）高刷屏上自动按 8.3ms 触发，无需手动硬编码时间间隔。
3. **后台休眠与节能机制**：当页面处于非激活标签页、被最小化或隐藏在 `iframe` 中时，浏览器会自动暂停 `rAF` 回调，并在切回前台时恢复，大幅降低 CPU/GPU 负载与电池消耗。
4. **时间戳精度支持**：`rAF` 回调默认传入高精度时间戳 `DOMHighResTimeStamp`（`performance.now()` 级别），便于精确计算基于物理时间的缓动（Time-based Easing），不受单帧波动影响。

### 我的理解

这个机制在前端工程化与性能优化中扮演了极重要的角色：

* **防止 Long Task 阻塞渲染**：若微任务或同步逻辑耗时过长，会严重拖延微任务队列的清空时间，导致事件循环迟迟无法走到 GUI 渲染阶段，从而引发视觉上的严重卡顿（INP/CLS 指标变差）。
* **高频更新节流（Render Throttling）**：在处理高频的 `scroll`、`resize`、`mousemove` 或 **LLM / SSE（Server-Sent Events）流式打字机**输出时，直接将数据同步写入 DOM 会引发密集的重排重绘。利用 `requestAnimationFrame` 将多次数据推入缓存队列，**合并并延迟到下一帧渲染前统一批量执行**，可以彻底规避高频渲染导致的界面假死。

---

## 探索路径

* [x] 对比 `setTimeout` 与 `requestAnimationFrame` 在浏览器事件循环规范（WHATWG Rendering Steps）中的精确执行时序。
* [x] 在 Chrome DevTools 的 **Performance** 面板中录制帧流，观测两种方式下的 Tasks 与 Render Pipeline 对齐情况。
* [x] 编写基于 `rAF` 的高频输入/流式渲染节流器（`rafThrottle`）。

---

## 待验证（扩展）

* [ ] 在 120Hz 刷新率显示设备上，测试 `requestAnimationFrame` 能否稳定以 8.3ms 间隔触发。
* [ ] 验证后台 Tab 挂起时，`requestAnimationFrame` 与 `setTimeout`（被限制为 1000ms+）的实际能耗差异。
* [ ] 探索 `requestPostAnimationFrame` 与 CSS Houdini 规范在下一代渲染管线中的演进。

---

## 收敛

> 经过实践验证后，此问题的解决方案可固化为 SOP。标记已验证的方案。

* [x] **已收敛** → [[前端高性能动画与渲染节流实施指南]] — 本问题的验证标准和流程

---

## 关联

* **相关问题**：
	* [[浏览器渲染流水线与重排重绘]]
	* [[requestAnimationFrame与微任务宏任务执行时机]]
	* [[大模型流式打字机渲染性能优化]]
	* [[Event-Loop与帧生命周期]]
* **参考资料**：
	* [MDN - window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
	* [WHATWG HTML Standard - Update the rendering](https://www.google.com/search?q=https://html.spec.whatwg.org/multipage/webappapis.html%23event-loop-processing-model)
