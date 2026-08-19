---
uid: 202606270000
title: 如何实现一个带并发限制的异步任务调度器（Scheduler）
aliases: ["Q-异步任务调度器", "Async Scheduler", "并发限制调度器"]
description: 实现同时最多执行 N 个异步任务的调度器，控制并发量，避免资源耗尽
tags: [前端/JavaScript/异步编程, 面试题]
date-created: 2026-06-27
date-modified: 2026-08-19
status: fleeting
content-type: question
up: "[[前端面试真题库]]"
---

## 问题

> 实现一个带并发限制的异步任务调度器（Scheduler），确保同时最多执行 N 个任务。

---

## 背景

同时发起大量异步请求（如文件上传、API 调用）会耗尽系统资源（文件句柄、网络连接、内存），需要一种机制限制并发数量，同时保持吞吐量。这是一个高频前端面试题，考查对 Promise、异步流程控制的理解。

---

## 解决方案

### 答案 1：Class 封装（推荐，最清晰）

```typescript
class Scheduler {
  private running = 0;
  private queue: (() => void)[] = [];
  private maxConcurrency: number;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrency) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }

    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift()!;
        next();
      }
    }
  }
}

const scheduler = new Scheduler(3);
const results = await Promise.all(urls.map(u => scheduler.add(() => fetch(u))));
```

### 答案 2：函数式 Worker（一次执行）

```typescript
async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}
```

### 答案 3：信号量（Semaphore）模式

```typescript
class Semaphore {
  private current = 0;
  private queue: (() => void)[] = [];

  constructor(private max: number) {}

  async acquire(): Promise<void> {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
  }

  release(): void {
    if (this.queue.length > 0) {
      this.queue.shift()!();
    } else {
      this.current--;
    }
  }
}
```

### 我的理解

核心思路是维护两个变量：`running`（当前执行数）和 `queue`（等待队列）。每次任务开始前检查并发是否达上限，到达则入队等待；任务完成后从队列取出下一个任务执行。

三类实现的取舍：

| 维度 | Class 封装 | 函数式 Worker | 信号量 |
|:---|:---|:---|:---|
| **可复用性** | 高（实例可多次 add） | 低（一次性） | 高（acquire/release 解耦） |
| **理解难度** | 中等 | 简单 | 中等 |
| **灵活性** | 高（支持动态添加） | 低（固定任务列表） | 高（可嵌入任意代码） |

---

## 探索路径

- [ ] 如何支持优先级？→ 将 queue 改为优先队列（最小堆）
- [ ] 如何支持超时？→ `Promise.race([task(), timeoutPromise])`
- [ ] 如何暂停/恢复？→ 添加 `pause()` 标记，worker 循环中检查
- [ ] 如何支持重试？→ finally 中判断失败次数，重新 add 到队列

---

## 关联

- **父级**：[[前端面试真题库]]
- **相关问题**：
	- [[在响应式对象频繁更新的场景下如何减少不必要的响应式开销？]]
- **前置知识**：
	- Promise 原理
	- Event Loop
