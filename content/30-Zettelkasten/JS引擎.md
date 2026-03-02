---
title: JS引擎
aliases: [JavaScript Engine, JS Virtual Machine]
tags: [领域/前端, 核心概念, 工具/运行时]
date-created: 2025-12-26
date-modified: 2025-12-28
status: 🟢 活跃
related: ["[[V8引擎工作原理]]", "[[JS执行机制]]", "[[垃圾回收机制]]", "[[浏览器工作原理]]"]
---

## ⚙️ 核心概念：JS 引擎 (JavaScript Engine)

### 🔎 核心定义

> [!abstract] 翻译官
> **JS 引擎** 是一个专门处理 JavaScript 脚本的虚拟机。
> 它的核心职责是将人类可读的 **JS 源代码** 编译（或解释）为机器可执行的 **[[机器码]] (Machine Code)** 或 **[[字节码]] (Bytecode)**。
> *它是浏览器渲染进程（Renderer Process）中最核心的组件之一。*

---

### 🏗️ 核心架构与流水线 (Pipeline)

现代 JS 引擎（以 Chrome V8 为代表）普遍采用 **JIT (Just-In-Time)** 技术，即 " 混合使用解释器和编译器 "。

```mermaid
graph TD
    %% --- 节点定义 ---
    Source["📜 源代码 (Source)"]
    Parser["词法/语法分析 (Parser)"]
    AST(("🌳 AST"))
    
    %% JIT 核心组件
    Ignition["🔥 解释器 (Interpreter)<br>生成字节码 (Bytecode)"]
    TurboFan["🚀 优化编译器 (Compiler)<br>生成机器码 (Machine Code)"]
    
    CPU["💻 CPU 执行"]

    %% --- 连接关系 ---
    Source --> Parser
    Parser --> AST
    AST --> Ignition
    
    %% 解释执行路径
    Ignition -->|"启动快 / 执行慢"| CPU
    
    %% 优化编译路径
    Ignition -.->|"Profiler 标记热点 (Hot)"| TurboFan
    TurboFan -->|"启动慢 / 执行快"| CPU
    
    %% 去优化路径 (面试考点)
    TurboFan -.->|"假设失效 (Deoptimization)"| Ignition
````

### 关键组件详解

1. **解析器 (Parser)**：负责 " 阅读 " 代码。

	- *Pre-Parser*：预解析，快速扫描，跳过未调用的函数。
	- *Full-Parser*：全量解析，生成 **[[AST]]** (抽象语法树)。
			
2. **解释器 (Interpreter)**：

	- *作用*：将 AST 转换为 **字节码 (Bytecode)** 并逐行解释执行。
	- *特点*：**启动极快**，内存占用小，但执行效率不如机器码。
	- *代表*：V8 的 Ignition。
			
3. **优化编译器 (Optimizing Compiler)**：

	- *作用*：将 " 热点代码 " 编译为高效的 **机器码**。
	- *特点*：需要时间进行分析和编译，但执行效率极高。
	- *代表*：V8 的 TurboFan。

---

### ⚡ 核心机制与优化 (Optimization)

为什么现代 JS 引擎跑得这么快？

#### 1. JIT (即时编译)

- **策略**：为了平衡 " 启动速度 " 和 " 运行速度 "。
- **流程**：==先用解释器快速启动页面，后台监控运行频率高的代码（Hot Spot），将其送入编译器优化。==

#### 2. 推测优化与去优化 (Deoptimization)

- **推测**：==JS 是动态类型，但引擎会 " 猜 " 类型。例如 `function add(a, b) { return a + b }`，如果前 10 次传入的都是整数，引擎会生成针对整数加法的优化机器码。==
- **去优化 (Deopt)**：第 11 次如果传入了字符串，刚才生成的整数机器码失效。引擎必须**回退**到解释器执行。

		- _启示_：保持变量类型稳定（Monomorphic）有助于性能。
				

#### 3. 内存管理

- JS 引擎自带 **[[垃圾回收机制]] (GC)**，通过标记 - 清除、分代回收等算法自动管理内存。

---

### 🌍 主流引擎一览

| **引擎名称**                 | **开发者**         | **主要应用场景**                      | **特点**          |
| ------------------------ | --------------- | ------------------------------- | --------------- |
| **V8**                   | Google          | Chrome, Edge, Node.js, Electron | 性能标杆，极致的 JIT 优化 |
| **JavaScriptCore** (JSC) | Apple           | Safari, React Native (iOS)      | 启动速度快，低功耗优化好    |
| **SpiderMonkey**         | Mozilla         | Firefox                         | 历史最悠久，引入了 WASM  |
| **QuickJS**              | Fabrice Bellard | 嵌入式设备, 轻量级应用                    | 体积极小，完全符合 ES 标准 |

---

### 📥 自检清单 (Checklist)

- [x] **机制辨析**：解释器 (Interpreter) 和编译器 (Compiler) 有什么区别？为什么 V8 要同时用这两个？ ✅ 2025-12-27
- [x] **性能陷阱**：什么是 **Deoptimization**？写代码时如何避免？（提示：不要频繁改变对象结构或变量类型） ✅ 2025-12-27
- [x] **执行顺序**：JS 引擎解析脚本时，会阻塞 DOM 渲染吗？（提示：会，除非使用 `async/defer`） ✅ 2025-12-27
- [x] **深度关联**：JS 引擎和渲染引擎（Blink/WebKit）是如何协作的？（通过 [[事件循环]] 和 [[Web API]]） ✅ 2025-12-27
