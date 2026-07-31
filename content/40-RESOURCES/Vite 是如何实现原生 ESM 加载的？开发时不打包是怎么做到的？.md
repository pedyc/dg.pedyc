---
uid: 202603130110
title: Vite 是如何实现原生 ESM 加载的？开发时不打包是怎么做到的？
aliases: []
date-created: 2025-05-28
date-modified: 2026-05-19
status: cultivating
content-type: [question]
up: ["[[MOC-Vite相关问题]]"]
---

## 问题

> Vite 是如何实现原生 ESM 加载的？开发时不打包是怎么做到的？

---

## 背景

在传统打包工具（Webpack、Rollup）中，开发时需要先把所有源码打包成 bundle，再启动开发服务器。这导致：
- **冷启动慢**：项目越大，启动时间越长（几分钟很常见）
- **热更新慢**：修改一行代码，可能需要重新打包整个 bundle

Vite 解决了这个问题，实现了**基于原生 ESM 的开发服务器**，启动速度和热更新都极快。

---

## 现有答案

### 答案 1：基于浏览器原生 ESM 的按需加载

Vite 在开发模式下**不打包**，而是直接让浏览器加载源码。浏览器通过 `<script type="module">` 和 `import` 语句发起请求，Vite 的开发服务器按需处理。

核心流程：
1. 启动开发服务器（通常 `< 500ms`）
2. 浏览器请求 `index.html`
3. `index.html` 中 `<script type="module" src="/src/main.ts"></script>` 触发浏览器请求
4. Vite 拦截请求，**对源码做轻量转换**（主要是路径解析），返回给浏览器
5. 浏览器解析返回的模块，继续 `import` 其他模块
6. Vite 继续按需处理每个请求

关键点：**不是一次性打包全部，而是逐个按需编译**。

### 答案 2：依赖预打包（Dependency Pre-bundling）

对于 `node_modules` 中的第三方依赖（如 `lodash`、组件库），Vite 仍会做一次打包，但原因不同：

- **减少请求数量**：一个库可能包含几十个 ESM 文件，直接 import 会触发几十个 HTTP 请求
- **兼容 CJS 依赖**：很多 npm 包是 CommonJS 格式，浏览器原生 ESM 无法直接运行
- **提升解析速度**：预打包后，Vite 用 esbuild 将这些依赖合并成少量文件

Vite 的预打包使用 `esbuild`，速度极快（通常是几十到几百毫秒）。

### 答案 3：路径重写与内容替换

Vite 拦截请求后，会对源码做两个处理：

1. **路径重写**：将 `import Foo from './foo.js'` 改写成 `/node_modules/.vite/foo.js` 这样的路径
2. **边界转换**：如果是 CJS 模块，转换为 ESM 格式

这使得浏览器可以正确找到并加载模块。

### 我的理解

Vite 的核心洞察是：**开发时不需要打包全部代码，只需要提供源码给浏览器**。

传统 bundler 的思路是 "build all → serve"，而 Vite 是 "serve on demand"。这利用了：

1. **现代浏览器支持 ESM**：浏览器本身就是模块解析器
2. **HTTP/2 多路复用**：多个小文件不再是性能问题
3. **esbuild 的速度**：预打包依赖很快，弥补浏览器直接加载 CJS 的不足

Vite 实际上充当了**模块请求的代理/转换器**——它让浏览器认为可以直接加载源码，而实际按需做了路径解析和格式转换。

---

## 探索路径

- [ ] 阅读 Vite 源码中 `server.ts` 的请求拦截逻辑
- [ ] 理解 `transform` 链如何处理不同文件类型
- [ ] 验证预打包的触发条件和缓存机制

---

## 待验证（扩展）

- [ ] 生产构建时 Vite 如何切换到 Rollup 打包？
- [ ] Vite 的 HMR（热模块替换）原理是什么？
- [ ] 大量小文件场景下，Vite 的性能表现如何？

---

## 关联

- **相关概念**：[[esbuild 打包原理]]
- **相关工具**：[[Rollup 概述]]
- **参考资料**：https://vite.dev/guide/
