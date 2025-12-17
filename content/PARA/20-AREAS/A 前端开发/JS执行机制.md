---
title: JS执行机制
date-created: 2025-05-16
date-modified: 2025-05-22
---

浏览器解析和执行 JavaScript 代码的机制是一个多阶段协作的过程，涉及引擎、编译器、内存管理和优化策略。以下是详细解析：

## 1. 加载阶段（Loading）

- **网络请求**：当 HTML 解析器遇到 `<script>` 标签时，会暂停 HTML 解析（除非标记为 `async/defer`），发起网络请求获取 JS 文件。
- **缓存策略**：根据 HTTP 头部（如 `Cache-Control`）决定是否复用本地缓存。

---

## 2. 解析与编译（Parsing & Compilation）

### 词法分析（Lexical Analysis）

- **分词（Tokenization）**：将源代码字符串拆分为有意义的词法单元（tokens），例如：

	```javascript
  const x = 10; // 分解为 tokens: ["const", "x", "=", "10", ";"]
  ```

### 语法分析（Syntax Analysis）

- **生成 AST（Abstract Syntax Tree）**：根据 tokens 构建树状结构表示代码逻辑。例如：

	```javascript
  function foo() { return 1; }
  ```

	转换为 AST 的伪结构：

	```json
  {
    "type": "FunctionDeclaration",
    "id": { "name": "foo" },
    "body": { "type": "BlockStatement", "body": […] }
  }
  ```

### 预解析（Pre-Parsing）

- **快速跳过非立即执行的代码**：如函数声明，仅进行浅层解析以提升速度。当函数被调用时再深度解析。

### 编译阶段

- **即时编译（JIT, Just-In-Time）**：
	- **基线编译器（Baseline Compiler）**：快速生成未优化的机器码（如 V8 的 Ignition 解释器生成字节码）。
	- **优化编译器（Optimizing Compiler）**：对热点代码（Hot Code）进行优化（如 V8 的 TurboFan 生成高效机器码）。
	- **去优化（Deoptimization）**：当假设失效（如变量类型变化）时回退到未优化代码。

---

## 3. 执行阶段（Execution）

### 创建 [[执行上下文]]（Execution Context）

- **全局上下文**：脚本开始执行时创建。
- **函数上下文**：每次函数调用时创建。
- **Eval 上下文**：`eval()` 调用时创建（性能差，避免使用）。

### 变量环境与词法环境

- **变量提升（Hoisting）**：`var` 声明在编译阶段被提升并初始化为 `undefined`，而 `let/const` 处于 " 暂时性死区 "（TDZ）直至实际声明处。
- **作用域链（Scope Chain）**：根据代码嵌套关系确定变量访问权限。

### [[事件循环]]（Event Loop）

- **调用栈（Call Stack）**：同步代码按顺序执行，函数调用压入栈，执行完毕弹出。
- **微任务（Microtasks）与宏任务（Macrotasks）**：
	- **微任务**：`Promise.then`、`queueMicrotask`、`MutationObserver`，在每轮宏任务结束后立即执行。
	- **宏任务**：`setTimeout`、`setInterval`、DOM 事件、I/O 操作。
	- **执行顺序**：

```plaintext
宏任务 → 清空微任务队列 → 渲染（如有需要） → 下一宏任务
```

### 内存管理

- **垃圾回收（GC）**：
	- **标记 - 清除（Mark-Sweep）**：从根对象（全局变量、活动函数）出发标记可达对象，清除未标记的。
	- **分代收集（Generational Collection）**：V8 将堆分为新生代（频繁 GC）和老生代（较少 GC）。
	- **内联缓存（Inline Caching）**：优化属性访问路径。

---

## 4. 优化策略

- **隐藏类（Hidden Classes）**：V8 为对象创建隐藏类以优化属性访问。
- **逃逸分析（Escape Analysis）**：确定对象是否可在栈上分配而非堆。
- **延迟解析（Lazy Parsing）**：推迟非立即执行函数的解析。

---

## 示例分析

```javascript
console.log(a); // undefined（var 提升）
var a = 1;
let b = 2;     // TDZ 开始

function foo() {
  console.log(b); // 2（闭包访问外层作用域）
}
foo();

setTimeout(() => console.log('Macrotask'), 0);
Promise.resolve().then(() => console.log('Microtask'));
```

**执行顺序**：
1. 变量 `a` 提升，输出 `undefined`。
2. 执行 `foo()`，输出 `2`。
3. 微任务优先于宏任务，输出 `Microtask` → `Macrotask`。

---

## 关键点总结

- **解析与执行分离**：现代引擎通过预解析和延迟编译加速启动。
- **JIT 权衡**：快速启动（基线编译）与高效运行（优化编译）的平衡。
- **单线程模型**：JS 通过事件循环实现非阻塞，避免 UI 冻结。

理解这些机制有助于编写高性能代码（如减少重优化、合理使用微任务）和调试复杂问题（如内存泄漏）。
