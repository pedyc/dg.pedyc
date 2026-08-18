---
uid: 202606160003
title: Angular变更检测
aliases: ["C-Angular-变更检测", "Change Detection Angular"]
description: Angular 的 DOM 更新机制，从 Zone.js 自动检测到 Signal 精细粒度的演进
tags: [前端/Angular]
date-created: 2026-06-16
date-modified: 2026-07-14
status: cultivating
content-type: concept
up: "[[Angular|A-前端/Angular]]"
---

## 概念：Angular 变更检测

> Angular 变更检测是框架自动同步组件状态与 DOM 的机制——当数据变化时，框架检测变化并更新视图。

**解决的核心痛点**：开发者不需要手动操作 DOM 或调用渲染函数——框架替你追踪状态变化并更新页面。

---

### 核心命题

- [[Zone.js 通过打补丁拦截所有浏览器异步 API]]
	- **原理**：Zone.js 重写 setTimeout/XHR/事件监听等 API，使 Angular 能"感知"异步操作何时完成
- [[OnPush 策略将变更检测从全量遍历缩小到输入变更]]
	- **原理**：默认策略每次检查整棵组件树；OnPush 只在 @Input 引用变化时检查该组件及其子树
- [[Signal 将变更检测从"框架轮询"变为"数据推送"]]
	- **原理**：信号变化时主动通知消费组件，无需 Zone.js 介入，粒度精确到单个表达式

---

### 运行机制

```mermaid
flowchart TB
    subgraph zone ["Zone.js 拦截层"]
        A[用户事件] --> Z[Zone.js patch]
        B[XHR 响应] --> Z
        C[setTimeout 触发] --> Z
    end

    Z --> D{NgZone 是否在 Angular 区域?}

    D -->|是| E[触发变更检测]
    D -->|否| F[跳过，不触发]

    subgraph detect ["变更检测流程"]
        E --> G{组件策略?}
        G -->|Default| H[检查整个组件树]
        G -->|OnPush| I{@Input 变化?}
        I -->|是| J[检查该分支]
        I -->|否| K[跳过该分支]
    end

    subgraph signal ["Signal 模式（Angular 17+）"]
        L[Signal 值变化] --> M[通知消费组件]
        M --> N[仅更新关联的模板表达式]
    end

    J --> O[更新 DOM]
    K --> P[保持原样]
    N --> O
```

**核心流程**：

1. Zone.js 拦截所有异步操作（事件/定时器/XHR）
2. 判断是否在 Angular zone 内
3. 触发变更检测（从根组件开始遍历树）
4. 根据组件策略（Default/OnPush）决定检查范围
5. 对比当前值和上次渲染值，差异写入 DOM

---

### 关键区别

| 维度 | Default 策略 | OnPush 策略 | Signal 模式 |
|:---|:---|:---|:---|
| **触发范围** | 整棵组件树 | 仅输入变化的组件分支 | 仅使用该信号的组件 |
| **性能** | 大项目可能成为瓶颈 | 中等 | 最优 |
| **手动触发** | 不需要 | `markForCheck()` | 不需要 |
| **心智负担** | 最低（全自动） | 中等（需要理解引用不可变） | 低（自动追踪） |
| **适用** | 小组件树 / 原型 | 中大项目 / 性能敏感 | 新项目（Angular 17+） |

---

### 应用场景

- ✅ **适用场景**
	- **性能优化**：大列表用 `OnPush` + `trackBy` 避免全量渲染
	- **第三方集成**：在 Zone.js 外部操作后调用 `NgZone.run()` 重新接入检测
	- **高频更新**：WebSocket 数据用 Signal 推送给特定组件，避免全树检查
- ⛔ **误用**
	- **过于激进地使用 OnPush**：忘记调用 `markForCheck()` 导致视图不更新
	- **在 NgZone.runOutsideAngular 中修改状态**：修改了但不触发检测，视图不更新

---

### 性能优化实践

```typescript
// 1. OnPush 策略
@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ListComponent {
  @Input() items: Item[];

  // 必须传入新引用才能触发更新
  updateItem(id: number) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, done: true } : item
    );
  }
}

// 2. 脱离 Angular zone 执行高频操作
constructor(private ngZone: NgZone) {
  this.ngZone.runOutsideAngular(() => {
    setInterval(() => {
      // 高频轮询，不触发变更检测
      this.checkStatus();
    }, 100);
  });
}

// 3. Signal 模式（Angular 17+）
count = signal(0);
// 模板中直接使用 {{ count() }}
// 变化时仅更新对应文本节点，不检查任何组件
```

### 知识图谱

- **父级概念**：[[Angular|A-前端/Angular]]
- **基础组件**：
	- [[Zone.js]] — 变更检测的触发机制
	- [[Signal(Angular)]] — 下一代变更检测的基础
	- [[Zoneless变更检测]] — 变更检测的触发机制
- **相关概念**：
	- [[Virtual DOM]] — React 的变更检测方案，与 Angular 对比
	- [[RxJS]] — 可与 `ChangeDetectorRef` 配合使用
- **相关对比**：[[Angular vs React]] — 变更检测是核心差异之一
