---
uid: 202606160002
title: Signal(Angular)
aliases: [T-Angular-Signal, Angular Signals]
description: Angular 的响应式原始类型，自动追踪依赖的高性能状态管理方案
tags: [前端/Angular]
date-created: 2026-06-16
date-modified: 2026-07-13
status: cultivating
content-type: term
up: "[[Angular]]"
---

## 术语：Angular Signals

> Angular 16+ 引入的响应式原始类型（Reactive Primitive），持有值并在值变更时通知所有消费者，替代 Zone.js 成为 Angular 的新响应式基础。

### 核心 API

| API | 用途 | 示例 |
|:---|:---|:---|
| `signal()` | 创建可写信号 | `const count = signal(0)` |
| `computed()` | 创建衍生信号（只读，自动依赖追踪） | `const doubled = computed(() => count() * 2)` |
| `effect()` | 注册副作用（自动收集依赖） | `effect(() => console.log(count()))` |
| `input()` | 定义组件输入（Signal 形式） | `name = input('default')` |
| `output()` | 定义组件输出 | `clicked = output<string>()` |
| `model()` | 双向绑定信号（类似 `[(ngModel)]`） | `value = model('')` |
| `toObservable()` | Signal → Observable | `toObservable(count)` |
| `toSignal()` | Observable → Signal | `toSignal(interval(1000))` |
| `untracked()` | 读取信号但不追踪依赖 | `untracked(() => count())` |

### 关键特征

- **自动依赖追踪**：`computed()` 和 `effect()` 在回调中读取哪些信号，就自动订阅哪些信号——不需要 deps array，也不会遗漏依赖
- **推送式更新**：信号变化时主动推送给订阅者，比 Zone.js 的脏检查更高效
- **范式转换**：Angular 17 开始 Signal 逐渐成为首选，模板中会自动标记依赖实现 **OnPush 级性能**而无需手动 `OnPush`
- **RxJS 互通**：`toObservable()` / `toSignal()` 可在 Signal 和 Observable 之间自由切换，迁移期也能混用

### 使用示例

```typescript
import { signal, computed, effect } from '@angular/core';

// 创建信号
const count = signal(0);
const price = signal(10);

// 衍生值（自动追踪 count 和 price）
const total = computed(() => count() * price());
console.log(total()); // 0

// 更新信号
count.set(5);           // 直接赋值
price.update(v => v * 2); // 基于当前值更新

// effect 自动重新执行
effect(() => {
  console.log(`总价：${total()}`);
});
// 当 count 或 price 变化时自动重新执行
// 不会因为 total 变了就执行——因为 total 本身是 computed，它的值来自 count 和 price
```

### 应用

- **组件状态管理**：取代组件类属性的手动变更检测
- **跨组件共享**：通过服务（`providedIn: 'root'`）实现全局信号状态
- **表单交互**：`model()` 实现双向绑定，替代 `[(ngModel)]`
- **与 RxJS 共存**：`toObservable()` 将信号接入现有 Observable 管道

### 相关概念

- **父级概念**：[[Angular|A-前端/Angular]] — Angular 框架的响应式系统核心
- **相关概念**：
	- [[RxJS]] — 之前 Angular 的响应式方案，Signal 是轻量替代
	- [[Zone.js]] — Angular 传统变更检测机制，Signal 旨在减少对其依赖
	- [[Hooks(React)|React Hooks]] — React 的响应式方案，与 Signal 设计哲学不同
- **相关对比**：[[Angular vs React]] — 响应式模型的差异在其中详细讨论
