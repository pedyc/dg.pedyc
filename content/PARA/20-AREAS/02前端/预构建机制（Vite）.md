---
title: 预构建机制（Vite）
date-created: 2025-05-29
date-modified: 2025-05-29
---

## 核心概念

开发环境下，Vite 不打包代码，而是利用原生 ESM 按需解析模块。

## 为什么需要预构建？

一些第三方库例如 `lodash`、`react-dom`
- 采用 CJS 而不是 ESM 格式
- 内部引用了大量子模块
- 频繁重复加载会严重拖慢性能

所以——==Vite 在启动时自动对依赖进行一次 " 预构建 "==，用 `esbuild` 转成 ESM 格式 + 合并依赖。

## 关键点

| 特性              | 说明                                |
| --------------- | --------------------------------- |
| ⏱️ 构建时间快        | 用 esbuild 打包第三方依赖，速度比 Rollup 快几十倍 |
| 📦 生成缓存         | 输出到 `node_modules/.vite` 下，供开发时使用 |
| 🔁 依赖缓存         | 如果依赖没变，就不会重新预构建，提升启动速度            |
| 📄 支持 CJS 转 ESM | 把旧的 CJS 库转成浏览器能识别的模块              |
| 🧩 多模块合并        | 减少网络请求，避免一个库被拆成多个 import          |

## 工作流程

### 📌 工作流程示意

```go
项目启动 vite dev →
  检查 package.json 中依赖 →
    如果未缓存/依赖版本更新 →
      用 esbuild 打包成 ESM → 缓存在 .vite 中 →
        浏览器 import 从 .vite 加载依赖
```

1. 你在组件中写了：`import _ from 'lodash'`
2. 启动 Vite，它发现 lodash 是 CJS
3. 用 esbuild 把它转成 ESM 格式
4. 浏览器加载的其实是 `.vite` 中的版本

```ts
//.vite/deps/lodash.js 
export { default as _ } from "/node_modules/lodash/lodash.js"`
```

### 📁 缓存结构示意

```bash
node_modules/
├── lodash/
└── .vite/
    ├── deps/
    │   └── lodash.js       ← 转换成 ESM 的 lodash
    ├── lodash.js.map
    └── metadata.json       ← 依赖图缓存
```

### 🔧 配置项：optimizeDeps

```ts
// vite.config.ts
export default {
  optimizeDeps: {
    include: ['lodash-es'], // 强制预构建
    exclude: ['some-raw-lib'], // 跳过构建
  }
}
```

## ❓问答卡片

Q1：修改依赖后，Vite 不重新构建？
Q2：某些库用 CJS 导致报错？
Q3：不想预构建某些库？
