---
uid: 202603111625
title: A-前端开发 MOC
aliases: [A-前端开发, 前端开发]
description: 前端开发领域知识索引
tags: [area]
content-type: moc
status: cultivating
date-created: 2026-03-08
date-modified: <% tp.date.now("YYYY-MM-DD") %>
related: ["[[JavaScript MOC]]", "[[前端工程化 MOC]]"]
---

## 🗺️ 领域：前端开发

### 子领域

### 关联项目

```dataview
TABLE
file.link as "项目",
status,
expire,
date(expire) - date(today) as "剩余天数"
FROM "10-PROJECTS"
WHERE
contains(area, this.file.link) AND
status != "completed"
SORT
choice(date(expire) < date(today), 0, 1) ASC,
expire ASC
```

> [!abstract] 核心定义
> 创建用户交互界面的技术领域，关注体验、性能与兼容性。

---

### 🧠 核心心智模型 (Atomic Principles)

- **理论基石**
- [[JavaScript是词法作用域，函数作用域在定义时确定]]
	- **洞见**：函数的作用域链由词法环境中的 `outer` 指针在函数定义时决定，而非调用时，这构成了闭包和静态作用域分析的基础。
- [[事件循环通过宏任务与微任务的优先级调度实现单线程非阻塞]]
	- **洞见**：事件循环协调同步代码、微任务队列（高优先级）和宏任务队列（低优先级）的执行顺序，确保异步回调有序执行而不阻塞主线程。
- **思维模型**
- [[V8引擎通过JIT编译在启动速度与运行效率间取得平衡]]
	- **洞见**：V8 使用 Ignition 解释器快速生成字节码保证启动速度，同时由 TurboFan 监控并优化热点代码为机器码以提升运行效率，并在类型假设失效时进行去优化。

### 🛠️ 执行系统 (Actionable Workflows)

- **SOP (标准流程)**
- [[前端项目构建SOP]]：解决从零开始搭建前端项目的标准化流程问题
- [[性能优化检查清单]]：解决前端应用性能分析与优化的系统性问题
- **关键工具**
- [[React]]：声明式 UI 库，核心价值是组件化开发与虚拟 DOM
- [[Vue]]：渐进式 JavaScript 框架，核心价值是响应式数据绑定与易用性

### 🔗 知识网络 (Context)

- **上游学科**：[[计算机科学]] (提供理论支撑)
- **协同领域**：[[UI/UX设计]] (设计实现协同)
- **对立/竞争概念**：[[后端开发]] (关注点分离：前端关注用户界面与交互，后端关注数据处理与业务逻辑)

### 🧪 探索前沿 (The Frontier)

- [[Q-Web Components 能否成为下一代前端框架？]]
- [[Q-如何将AI能力有效融入前端开发工作流？]]
