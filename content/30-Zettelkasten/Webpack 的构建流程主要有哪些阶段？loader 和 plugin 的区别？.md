---
title: Webpack 的构建流程主要有哪些阶段？loader 和 plugin 的区别？
date-created: 2025-05-28
date-modified: 2025-05-28
---

- Webpack 的构建流程主要有哪些阶段？

> 1.初始化阶段：解析配置文件，注册 loader 和 plugin
> 2.编译阶段：从 entry 开始递归解析模块，使用 loader 处理源码，构建依赖图
> 3.构建阶段：将源代码打包成 bundle，执行 tree-shaking、代码压缩、代码拆分等优化
> 4.输出阶段：将最终构建产物输出到指定目录，调用 plugin 的 `emit`、`done` 等钩子

- Loader 和 plugin 的区别

> Loader 处理某一类文件，例如 `css-loader`
> Plugin 通过钩子插入整个打包过程，例如 `HtmlWebpackPlugin`

| ~      | Loader                                         | Plugin                                                |
| ------ | ---------------------------------------------- | ----------------------------------------------------- |
| 目的     | 处理某一类资源文件（转换文件内容）                              | 插入扩展整个打包生命周期                                          |
| 使用场景   | 如：babel-loader、css-loader、file-loader          | 如：HtmlWebpackPlugin、DefinePlugin、MiniCssExtractPlugin |
| 工作阶段   | 模块加载过程中逐个应用                                    | 构建过程多个阶段都可钩入                                          |
| API 接口 | 是函数，本质是 `module.exports = function(source) {}` | 是对象，需实现 `apply(compiler)` 方法                          |
| 粒度     | 单文件处理                                          | 全流程控制                                                 |

- 追问：Tree-shaking 是 Loader 实现的吗？

> 不是，是 Webpack 内部和 Terser 插件联合实现

- 追问：Loader 能操作 DOM 吗？

> 不能，Loader 只处理源码
