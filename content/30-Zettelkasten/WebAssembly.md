---
title: WebAssembly
aliases: [WASM, Web Assembly]
tags: [领域/前端, 核心概念, 性能优化]
date-created: 2025-12-27
date-modified: 2025-12-27
status: 🟢 活跃
related: ["[[机器码]]", "[[V8引擎工作原理]]", "[[前端性能优化]]", "[[编译原理]]"]
---

## 🚀 核心概念：WebAssembly (WASM)

### 🔎 核心定义

> [!abstract] Web 的第四种语言
> **WebAssembly (WASM)** 是一种运行在现代 Web 浏览器中的**二进制指令格式**。
> 它被设计为 C/C++、Rust 等高级语言的**编译目标 (Compilation Target)**，使它们能在浏览器中以**接近原生机器码**的速度运行。
>
> *地位*：它是继 HTML、CSS、JavaScript 之后，W3C 标准认定的 Web 第四种核心语言。

---

### 🏗️ 协作模型 (The Architecture)

WASM 并不是要取代 JavaScript，而是与 JS **协同工作**。

```mermaid
graph TD
    %% --- 样式定义 ---
    classDef commonNode fill:#fff,stroke:#333,stroke-width:1px,color:#000;
    classDef wasmNode fill:#654ff0,stroke:#333,stroke-width:2px,color:#fff;
    classDef jsNode fill:#f7df1e,stroke:#333,stroke-width:2px,color:#000;

    %% 节点
    Source["📜 源码 (C++ / Rust / Go)"]:::commonNode
    Compiler["⚙️ 编译器 (LLVM / Emscripten)"]:::commonNode
    
    WASMFile["📦 .wasm 文件<br>(二进制格式)"]:::wasmNode
    
    subgraph Browser ["🌐 浏览器运行时 (Sandbox)"]
        direction TB
        JS_Engine["JS 引擎 (V8 / SpiderMonkey)"]:::commonNode
        
        subgraph Context ["执行上下文"]
            JS_Thread["💛 JavaScript<br>(胶水代码 / DOM 操作)"]:::jsNode
            WASM_Thread["💜 WebAssembly<br>(密集计算 / 核心逻辑)"]:::wasmNode
        end
    end

    %% 流程
    Source -->|编译| Compiler
    Compiler -->|生成| WASMFile
    WASMFile -->|加载 & 实例化| JS_Engine
    
    JS_Thread <-->|函数调用 / 共享内存| WASM_Thread
````

---

### ⚡ 为什么快？ (Performance)

与 JavaScript 相比，WASM 的性能优势来自以下几点：

| **维度**   | **JavaScript**              | **WebAssembly**             |
| -------- | --------------------------- | --------------------------- |
| **体积**   | 文本格式，体积大，需解析                | **二进制格式**，紧凑，体积小            |
| **解析**   | 先转 AST 再转字节码 (慢)            | **直接解码** (几乎与下载同步进行)        |
| **编译**   | JIT 需 " 热身 " 才能优化，且可能 Deopt | **AOT/Streaming**，一开始就是优化好的 |
| **执行**   | 需处理类型推断、GC                  | **静态类型**，指令直接对应硬件操作         |
| **垃圾回收** | 自动 GC (不可控的暂停)              | 手动内存管理 (线性内存)，**无 GC 暂停**   |

> [!important] 适用场景
>
> - **不适合**：简单的表单交互、DOM 操作（目前 WASM 操作 DOM 开销大）。
> 
> - **适合**：视频剪辑 (FFmpeg)、3D 游戏 (Unity)、图像处理 (Photoshop Web)、加密算法、AI 推理。

---

### 🔬 两种格式 (Formats)

WASM 有两种表现形式，一种给机器看，一种给人看。

1. **二进制格式 (`.wasm`)**：
	- 浏览器直接加载执行的文件。
	- 示例：`00 61 73 6d 01 00 00 00 …`

2. **文本格式 (`.wat` - WebAssembly Text Format)**：
	- 基于 S-expression (类似 Lisp)，方便开发者调试和阅读。
	- 示例：

	```lisp
		(module
			(func $add (param $a i32) (param $b i32) (result i32)
				local.get $a
				local.get $b
				i32.add)
			(export "add" (func $add))
		)
		```



---

### 🛠️ 前端开发实战

在前端项目中，我们通常不会手写 `.wat`，而是通过工具链引入。

#### 1. 加载流程

```JavaScript
// 现代加载方式 (Streaming)
WebAssembly.instantiateStreaming(fetch('module.wasm'), importObject)
  .then(obj => {
    // 调用 WASM 导出的函数
    const result = obj.instance.exports.add(1, 2);
    console.log(result); // 3
  });
```

#### 2. 生态工具

- **Emscripten**：C/C++ 转 WASM 的老牌工具链。
- **wasm-pack**：Rust 转 WASM 的神器，自动生成 JS 胶水代码。
- **AssemblyScript**：用 TypeScript 的子集编写 WASM，前端友好度 Max。

---

### 📥 自检清单 (Checklist)

- [x] **误区澄清**：WASM 是用来取代 JavaScript 的吗？（答案：不是，是互补。JS 负责交互和胶水，WASM 负责繁重计算）。 ✅ 2025-12-27
- [ ] **安全性**：WASM 安全吗？（答案：安全。它运行在沙箱中，遵循同源策略，无法直接访问硬盘或 OS，必须通过 JS 桥接）。
- [ ] **底层原理**：WASM 可以直接操作 DOM 吗？（答案：目前不能。必须通过 JS `Glue Code` 互调，这会有一定的性能开销）。
- [ ] **关联思考**：为什么 Figma 或 Photoshop 网页版能做到那么流畅？（答案：核心渲染和计算逻辑使用了 C++/WASM）。
