---
title: HMR原理（Vite）
date-created: 2025-05-29
date-modified: 2025-05-29
---

## HMR 热模块替换原理与实现

### 💡 什么是 HMR？

模块热替换（HMR）允许你在修改文件后，浏览器不刷新整个页面，而是只替换发生变更的模块代码，保留应用状态（如输入、滚动、Vue/React 状态等）。

### 🎯 为什么 Vite 的 HMR 更快？

传统构建工具（如 Webpack）：

* 构建一个 bundle
* 检测到文件变化后 **重新构建整个模块图**
* 发给客户端热更新代码块

Vite：

✅ **利用原生 ESM：模块级热替换**
✅ **只替换实际变更的模块及其依赖链**
✅ 无需重新打包整个项目

## ⚙️ 工作原理详解

### HMR 步骤示意

```bash
你修改了某个文件 →
  Vite Dev Server 监听到文件变化 →
    判断该模块是否支持 HMR →
      ✅ 如果支持 →
        只重新请求该模块（通过 import） →
        通知客户端替换模块并触发更新回调
      ❌ 如果不支持 →
        全页刷新
```

### Vite 的 HMR 机制图

```bash
[文件修改] → Vite Dev Server (WS 通知客户端)
                          ↓
            [客户端 HMR runtime 触发回调]
                          ↓
                import 新模块 → 执行热更新
```

### 🔧 模块是如何注册 HMR 的？

在 React/Vue 应用中，Vite 自动注入如下逻辑：

```ts
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 自定义热替换逻辑
  })
}
```

你也可以手动写：

```ts
import { state } from './store'

if (import.meta.hot) {
  import.meta.hot.accept('./store', (newModule) => {
    console.log('Store updated!', newModule.state)
  })
}
```

### 🧩 插件开发者如何接入 HMR？

Vite 插件可以注册 HMR 处理钩子：

```ts
handleHotUpdate({ file, server, modules }) {
  if (file.endsWith('.custom.js')) {
    // invalidate the module or send custom event
  }
}
```

### 🚧 HMR 支持 vs 不支持的模块类型

| 模块类型          | 是否支持 HMR | 备注                        |
| ------------- | -------- | ------------------------- |
| `.vue` 组件     | ✅        | 内部使用 vue plugin 接管        |
| React 组件      | ✅        | 配合 `@vitejs/plugin-react` |
| CSS/LESS/SASS | ✅        | 样式变更会动态注入 style tag       |
| JSON / 静态资源   | ❌        | 直接全页刷新                    |
| 后端接口返回        | ❌        | 非前端模块不受控                  |

## ❓问答卡片

Q：Vite 的 HMR 是如何实现的？和传统工具的差别在哪？
A：Vite 使用原生 ESM 机制，实现模块级热替换，无需重新构建 bundle。修改文件后只替换变更模块，通过 `import.meta.hot` 接口注册更新回调。如果模块不支持热更新则自动全页刷新。相比 Webpack 更快、粒度更细。

### 🧠 进阶建议

* 理解 `import.meta.hot.accept()` 的应用场景
* 熟悉插件 `handleHotUpdate` 钩子写法
* 会写一个自定义 HMR 模块（如 store、样式切换等）
