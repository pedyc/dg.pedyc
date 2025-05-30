---
title: Tree-shaking
aliases: [Dead code elimination]
description: 一种移除 JavaScript 代码中未引用代码（死代码）的技术，以减小最终打包体积。
date-created: 2025-05-28
date-modified: 2025-05-28
status: active
para: area
related: ["[[Webpack]]", "[[Rollup]]", "[[ES Modules]]"]
zettel: permanent
---

## 🎯 目标与愿景

通过本领域（Tree-shaking）的学习和实践，能够有效地减小 JavaScript 代码的打包体积，提升 Web 应用的加载速度和性能。

## 🔎 描述

Tree-shaking 是一种移除 JavaScript 代码中未引用代码（死代码）的技术。它可以分析代码的依赖关系，找出没有被使用的代码，并在打包过程中将其移除，从而减小最终的打包体积，提升 Web 应用的加载速度和性能。

## 🔗 活跃连接

### 相关领域

- [[ES Modules]]：「Tree-shaking 依赖 ES Modules 的静态分析能力。」
- [[Webpack]]：「Webpack 是一种常用的 JavaScript 打包工具，支持 Tree-shaking。」
- [[Rollup]]：「Rollup 是一种专注于 ES Modules 打包的工具，Tree-shaking 效果更好。」

## 🧱 关键要素

- **静态分析**: Tree-shaking 的基础，通过分析代码的 AST（抽象语法树）来确定代码的依赖关系。
- **ES Modules**: Tree-shaking 的前提，ES Modules 的静态导入导出语法使得静态分析成为可能。
- **标记与清除**: Tree-shaking 的过程，首先标记出所有被引用的代码，然后清除掉未被标记的代码。

## ⚙️ 原理

Tree-shaking 的原理是基于 ES Modules 的静态分析能力。ES Modules 的 `import` 和 `export` 语句是静态的，这意味着可以在编译时确定模块的依赖关系，而不需要在运行时执行代码。

Tree-shaking 工具（如 Webpack、Rollup）会分析代码的 AST，找出所有被 `import` 语句引用的代码，并将这些代码标记为 " 存活 " 代码。然后，Tree-shaking 工具会清除掉所有未被标记为 " 存活 " 的代码，从而减小最终的打包体积。

## 🛠️ 配置

### Webpack

在 Webpack 中，Tree-shaking 默认是开启的，但需要满足以下条件：

- 使用 ES Modules 的 `import` 和 `export` 语句。
- 使用 Webpack 的 production mode（`mode: 'production'`），或者手动开启 `optimization.usedExports` 和 `optimization.sideEffects`。

### Rollup

在 Rollup 中，Tree-shaking 也是默认开启的，只需要使用 ES Modules 的 `import` 和 `export` 语句即可。

## ⚠️ 注意事项

- Tree-shaking 只能移除未被**静态**引用的代码。如果代码是通过动态 `import()` 或 `require()` 引入的，Tree-shaking 无法识别。
- Tree-shaking 可能会错误地移除一些有副作用的代码。可以通过 `sideEffects` 属性来告诉 Webpack 哪些模块是有副作用的，不能被 Tree-shaking 移除。
- Tree-shaking 的效果取决于代码的结构和依赖关系。如果代码的模块化程度不高，或者存在大量的循环依赖，Tree-shaking 的效果可能不明显。

## 📚 核心资源

### 文章

- [Webpack - Tree Shaking](https://webpack.js.org/guides/tree-shaking/)：「Webpack 官方文档关于 Tree Shaking 的介绍。」
- [Rollup - Tree-shaking](https://rollupjs.org/guide/en/#tree-shaking)：「Rollup 官方文档关于 Tree Shaking 的介绍。」

### 视频

- [深入理解 Tree-Shaking](https://www.youtube.com/watch?v=cK_oUe6MbH8)：「一个深入讲解 Tree-Shaking 原理和实践的视频。」
