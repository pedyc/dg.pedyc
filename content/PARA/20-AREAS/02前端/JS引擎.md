---
title: JS引擎
aliases: [JavaScript Engine]
description: JS 引擎是一种用于解析和执行 JavaScript 代码的程序或解释器。
tags: [前端, JavaScript, 引擎]
date-created: 2025-05-21
date-modified: 2025-05-21
content-type: concept
keywords: [JS引擎, JavaScript Engine, V8, JavaScriptCore]
para: resource
zettel: permanent
---

## 核心定义

JS 引擎 (JavaScript Engine) 是一种用于解析和执行 JavaScript 代码的程序或解释器。 它是浏览器或 Node.js 等 JavaScript 运行时环境的核心组成部分。

## 关键要点

- **解析和执行 JavaScript 代码：** JS 引擎负责将 JavaScript 代码转换成机器可以理解和执行的指令。
- **性能优化：** JS 引擎会进行各种性能优化，例如 JIT (Just-In-Time) 编译、代码优化等，以提高 JavaScript 代码的执行效率。
- **与渲染引擎交互：** JS 引擎通过 [[事件循环]] 与 [[渲染引擎]] 交互，实现网页的动态效果和交互功能。
- **位于渲染进程内：** JS 引擎位于渲染进程内，负责执行 JavaScript 代码。

## 组成部分

- **解析器 (Parser)：** 负责将 JavaScript 代码解析成抽象语法树 (AST)。
- **编译器 (Compiler)：** 负责将 AST 编译成字节码或机器码。
- **解释器 (Interpreter)：** 负责解释执行字节码。
- **优化器 (Optimizer)：** 负责对代码进行优化，提高性能。
- **垃圾回收器 (Garbage Collector)：** 负责回收不再使用的内存。
- **运行时系统 (Runtime System)：** 提供 JavaScript 代码运行所需的环境，例如内置对象、API 等。

## 工作原理

1. **解析 (Parsing)：** JS 引擎的解析器将 JavaScript 代码解析成抽象语法树 (AST)。
2. **编译 (Compilation)：** JS 引擎的编译器将 AST 编译成字节码或机器码。
3. **执行 (Execution)：** JS 引擎的解释器执行字节码或机器码，实现 JavaScript 代码的逻辑。
4. **优化 (Optimization)：** JS 引擎的优化器在执行过程中，会对代码进行优化，提高性能。
5. **垃圾回收 (Garbage Collection)：** JS 引擎的垃圾回收器负责回收不再使用的内存，防止内存泄漏。

参见👉[[JS执行机制]]

## 优化策略

- **JIT (Just-In-Time) 编译：** 将 JavaScript 代码动态编译成机器码，提高执行效率。
- **代码优化：** 对 JavaScript 代码进行优化，例如内联函数、消除死代码等。
- **垃圾回收优化：** 优化垃圾回收算法，减少垃圾回收的频率和时间。

## 常见 JS 引擎

- **V8：** Chrome 和 Node.js 使用的 JS 引擎。
- **JavaScriptCore：** Safari 使用的 JS 引擎。
- **SpiderMonkey：** Firefox 使用的 JS 引擎。

## 内部联系

- [[浏览器]]: JS 引擎是浏览器的核心组成部分。
- [[渲染引擎]]: JS 引擎通过 [[事件循环]] 与 [[渲染引擎]] 交互。
- [[JavaScript]]: JS 引擎负责解析和执行 JavaScript 代码。
- [[事件循环]]: JS 引擎通过 [[事件循环]] 处理异步任务。

## 后续优化建议

- 可以进一步介绍 JS 引擎的各个组成部分，例如解析器、编译器、解释器、优化器、垃圾回收器等。
- 可以介绍 JS 引擎的优化策略，例如 JIT 编译、代码优化、垃圾回收优化等。
- 可以介绍不同 JS 引擎的特点和差异。
