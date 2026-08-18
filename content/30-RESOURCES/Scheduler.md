---
uid: '202605091200'
title: Scheduler
aliases: ["T-浏览器API-Scheduler", "Scheduler", "任务调度器"]
description: "Scheduler 是浏览器提供的任务调度 API，支持优先级任务队列"
tags: [前端开发/浏览器API]
date-created: 2026-05-09
date-modified: 2026-05-09
status: fleeting
content-type: term
---

## 术语：Scheduler

> **领域**：#前端开发/浏览器 API

### 定义

Scheduler API 是浏览器提供的**优先级任务调度**接口，允许开发者控制任务的执行顺序和优先级，弥补了 `requestIdleCallback` 的不足。

**核心 API**：

```javascript
// 调度任务
scheduler.postTask(task, options)

// options 可选参数：
// - priority: 'user-blocking' | 'user-visible' | 'background'
// - delay: 延迟执行时间（毫秒）
// - signal: AbortSignal 可取消任务

// 示例
scheduler.postTask(() => console.log('执行'), {
  priority: 'user-blocking'
})
```

---

### 核心特点

| 特点         | 说明                                                    |
|:--------- |:---------------------------------------------------- |
| **优先级调度**  | 三种优先级：`user-blocking` > `user-visible` > `background` |
| **可取消**    | 通过 AbortSignal 取消待执行任务                                |
| **确定性**    | 高优先级任务一定先于低优先级执行                                      |
| **超时控制**   | 可设置任务超时时间                                             |
| **替代 ric** | 解决了 requestIdleCallback 无法控制优先级的缺陷                    |

---

### 跨学科含义

- **在浏览器中**：Scheduler API 是新一代任务调度标准，取代 requestIdleCallback
- **在 React 中**：React Scheduler 是 Fiber 架构的核心，负责优先级调度
- **在操作系统中**：CPU 调度器决定进程/线程的执行顺序和时间片分配

---

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：
	- [[Web API]] — Scheduler 归属的 API 分类
- **并列概念**：
	- [[requestIdleCallback]] — 早期任务调度 API（无优先级）
	- [[requestAnimationFrame]] — 每帧渲染回调
- **相关概念**：
	- [[Fiber|Fiber]] — React 的优先级调度实现
	- [[事件循环]] — 任务调度的执行环境
	- [[Scheduler.postTask]] — Scheduler API 的核心方法

---

### 参考延伸

- MDN: [Scheduler API](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler)
- Chrome Status: [Scheduler.postTask](https://chromestatus.com/feature/6031161994502144)
- Nitro: [Scheduling APIs Explainer](https://github.com/WICG/scheduling-apis)
