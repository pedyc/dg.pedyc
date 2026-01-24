---
title: JS执行机制
aliases: [JS Execution Context, V8 Pipeline, JS Runtime]
tags: [领域/前端, 核心概念, 面试/高频]
date-created: 2025-12-17
date-modified: 2025-12-26
status: 🟢 活跃
related: ["[[事件循环]]", "[[V8引擎工作原理]]", "[[闭包与作用域链]]", "[[垃圾回收机制]]"]
---

## ⚙️ 核心概念：JS 执行机制

### 🔎 核心定义

> [!info] 单线程与 JIT 的艺术
> JavaScript 是一门**单线程**、**非阻塞**、**解释与编译混合 (JIT)** 的语言。
> 它的执行机制包含两个核心部分：
> 1.  **引擎 (Engine)**：负责将源码翻译成机器码并执行 (如 V8)。
> 2.  **运行时 (Runtime)**：负责调度异步任务和内存管理 (如浏览器/[[Node.js]] 环境)。

---

### 🏗️ 第一阶段：解析与编译 (The V8 Pipeline)

在代码执行前，V8 引擎需要对其进行 " 咀嚼 " 和 " 消化 "。

```mermaid
graph TD
    %% --- 节点定义 ---
    Source["📜 源代码 Source Code"]
    
    %% 解析阶段节点
    Scanner["词法分析<br>Tokenization"]
    Parser["语法分析<br>AST 构建"]
    AST(("🌳 AST"))

    %% 编译阶段节点
    Ignition["🔥 Ignition (解释器)<br>生成 Bytecode"]
    TurboFan["🚀 TurboFan (优化编译器)<br>生成 Machine Code"]
    
    %% 产物节点
    Bytecode["字节码"]
    Optimized["机器码"]
    CPU["CPU 执行"]

    %% --- 子图结构 (关键修改：移除 '1. ' 格式) ---
    subgraph Parse ["Phase 1 - 解析 (Parsing)"]
        direction TB
        Scanner
        Parser
    end

    subgraph Compile ["Phase 2 - 编译与执行 (JIT)"]
        direction TB
        Ignition
        TurboFan
    end

    %% --- 连接关系 ---
    Source --> Scanner
    Scanner --> Parser
    Parser --> AST
    AST --> Ignition
    
    Ignition -->|"逐行执行"| Bytecode
    Bytecode -->|"执行结果"| CPU
    
    Ignition -.->|"发现热点代码 (Hot)"| TurboFan
    TurboFan -->|"优化编译"| Optimized
    Optimized -->|"执行"| CPU
    
    Optimized -.->|"假设失效 (Deopt)"| Ignition
````

#### 关键环节深度解析

1. **AST (抽象语法树)**：Babel、ESLint、Vue 模板编译都基于此。
2. **JIT (即时编译)**：
		
	- **Ignition**：先将 AST 转为**字节码 (Bytecode)** 并解释执行。启动快，内存占用小。
	- **TurboFan**：后台线程监控代码，发现**热点代码 (Hot Spot)**（例如被多次调用的函数），将其编译为高效的**机器码 (Machine Code)**。
	- **去优化 (Deoptimization)**：如果变量类型动态改变（如 `add(1, 2)` 突变为 `add("1", 2)`），优化的机器码失效，V8 会回退到字节码解释执行（会有性能损耗）。

---

### 🏃 第二阶段：运行时环境 (The Runtime)

当引擎开始执行代码时，就进入了动态的运行时环境。

#### 1. 执行上下文 (Execution Context)

代码运行的 " 环境 "。包含：

- **变量环境 (Variable Environment)**：`var` 声明、函数声明。
- **词法环境 (Lexical Environment)**：`let`/`const` 声明、外部环境引用（作用域链）。
- **This 绑定**。

#### 2. 调用栈 (Call Stack)

JS 引擎维护的一个 **LIFO (后进先出)** 栈结构，用于管理执行上下文。

Code snippet

```bash
sequenceDiagram
    participant Stack as 📚 调用栈 (Call Stack)
    participant Heap as 💾 堆内存 (Heap)
    
    Note over Stack: Global Context 入栈
    Stack->>Stack: foo() 被调用
    Note over Stack: foo Context 入栈
    Stack->>Stack: bar() 被调用
    Note over Stack: bar Context 入栈
    Note over Stack: bar 执行完毕出栈
    Note over Stack: foo 执行完毕出栈
```

#### 3. 作用域与闭包

- **作用域链**：由**词法环境**中的 `outer` 指针决定。JS 是**词法作用域**（静态作用域），函数的作用域在**定义时**就决定了，而不是调用时。
- **闭包**：即使外层函数销毁，内存中依然保留了被内部函数引用的变量对象（Closure）。

---

### 🔄 第三阶段：事件循环 (The Coordinator)

由于 JS 是单线程的，为了处理异步操作（HTTP、定时器、DOM），浏览器引入了 **[[事件循环]] (Event Loop)**。

> [!important] 执行顺序口诀
>
> 同步代码 -> 清空微任务 -> 尝试渲染 -> 执行一个宏任务 -> 循环

|**任务类型**|**代表 API**|**优先级**|
|---|---|---|
|**Macrotask (宏任务)**|`setTimeout`, `setInterval`, `setImmediate`, I/O, UI Rendering|低|
|**Microtask (微任务)**|`Promise.then`, `process.nextTick`, `MutationObserver`|🔥 **高 (插队执行)**|

---

### 💾 第四阶段：内存管理 (Memory)

- **栈内存 (Stack)**：存储基本数据类型（Number, Boolean…）和引用类型的地址。系统自动回收。
- **堆内存 (Heap)**：存储对象（Object, Array…）。由 **[[垃圾回收机制]] (GC)** 管理。

#### V8 GC 策略

- **新生代 (New Space)**：存活时间短的对象。使用 **Scavenge 算法** (Cheney 算法)，以空间换时间，快速清理。
- **老生代 (Old Space)**：存活时间长或大对象。使用 **标记 - 清除 (Mark-Sweep)** 和 **标记 - 整理 (Mark-Compact)**。

---

### 📝 代码实战分析

JavaScript

```bash
console.log('1'); // 同步

setTimeout(() => {
    console.log('2'); // 宏任务
    Promise.resolve().then(() => {
        console.log('3'); // 宏任务中的微任务
    });
}, 0);

new Promise((resolve) => {
    console.log('4'); // 同步 (构造函数立即执行)
    resolve();
}).then(() => {
    console.log('5'); // 微任务
});

console.log('6'); // 同步
```

> 输出顺序：1 -> 4 -> 6 -> 5 -> 2 -> 3
>
> 解析：同步代码走完，清空微任务队列 (5)，然后事件循环取出一个宏任务 (setTimeout)，执行其中的同步代码 (2)，再清空该宏任务产生的微任务 (3)。

---

### 📥 自检清单 (Checklist)

- [ ] **JIT**：V8 为什么要先把代码转成字节码，而不是直接转机器码？（内存占用、启动速度平衡）
- [ ] **Deopt**：为什么 TypeScript 的静态类型有助于 V8 性能优化？（保持 Hidden Class 稳定，减少去优化）
- [ ] **Event Loop**：如果微任务队列无限添加任务，页面会卡死吗？（会，因为微任务在渲染前执行）
- [ ] **Scope**：`var`, `let`, `const` 在 " 创建、初始化、赋值 " 三个阶段有什么区别？（[[暂时性死区]]）
