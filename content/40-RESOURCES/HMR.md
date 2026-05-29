---
uid: 202505290000
title: HMR
aliases: [T-HMR, Hot Module Replacement]
description: 热模块替换——应用中模块/文件变更时，无需刷新页面即可实时替换
tags: [前端/工程化/HMR]
date-created: 2025-05-29
date-modified: 2026-05-29
status: cultivated
content-type: term
---

## 术语：HMR（热模块替换）

> **主题**：#前端/工程化

### 定义

**HMR**（Hot Module Replacement，热模块替换）是基于 [[Vite]] / [[Webpack]] 等 bundless 开发服务器实现的运行时特性——在文件变更后，无需刷新整个页面即可将变更模块注入并替换，同时**保留应用运行时状态**（输入框内容、滚动位置、组件 state 等）。

核心接口：`import.meta.hot.accept()`

### 原理

```bash
文件修改 → Dev Server 监听(FS watcher)
                        ↓
              判断模块是否支持 HMR
                        ↓
          ✅ 支持 → 仅请求变更模块 → 触发 update callback → 局部替换
          ❌ 不支持 → 触发 full reload（全页刷新）
```

### 知识网络

- **父级概念**：[[bundless]] — HMR 依赖 bundless 架构实现
- **并列概念**：[[冷启动]] — 对比：冷启动需重建整个模块图，HMR 只替换单个模块
- **相关概念**：[[Vite]] — 实现 HMR 的典型工具

### 实现机制

#### 客户端（Browser）

```ts
// Vite 注入的 HMR runtime
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // newModule 为更新后的模块导出
    // 执行自定义热更新逻辑，如更新 store、force re-render
  })
}
```

#### 插件扩展点（Vite Plugin）

```ts
handleHotUpdate({ file, server, modules }) {
  if (file.endsWith('.md')) {
    // Quartz 可在此处触发笔记内容的局部更新
    server.ws.send({ type: 'custom', data: { file } })
  }
}
```

### 关联

- [[Vite 的 HMR（热模块替换）是如何实现的？与 Webpack HMR 的区别？|Vite HMR vs Webpack HMR]]
- [[Vite 的 HMR（热模块替换）是如何实现的？与 Webpack HMR 的区别？]]
