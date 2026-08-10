---
uid: 202605061030
title: React RSC 是发动机技术而非完整汽车框架
aliases: []
description: "React 19 RSC 提供了服务端渲染能力，但完整开发体验仍需 NextJS"
tags: []
date-created: 2026-05-06
date-modified: 2026-05-06
status: fleeting
content-type: atomic
up:
---

> React 19 RSC 是发动机技术，而非完整汽车框架，完整开发体验仍需 NextJS

## 论据/示例

**1. React 19 vs NextJS 功能对比**

| 维度           | React 19 (RSC)        | NextJS                  |
|:----------- |:-------------------- |:---------------------- |
| 路由           | ❌ 需自己实现（需搭配 Remix/其他） | ✅ 文件系统路由                |
| 构建优化         | ❌ 需搭配 Vite/Webpack    | ✅ 内置优化构建                |
| API Routes   | ❌ 无                   | ✅ 原生支持                  |
| 图片/字体优化      | ❌ 无                   | ✅ next/image, next/font |
| Edge Runtime | ❌ 无                   | ✅ 原生支持                  |
| 部署           | ❌ 需自己配置               | ✅ Vercel 原生集成           |

**2. 类比理解**

```bash
React 19 RSC = 发动机技术（能跑，但缺轮子/方向盘/车身）
NextJS = 完整汽车（发动机 + 轮子 + 方向盘 + 车身 + 售后）
```

**3. React 官方态度**

React 官方明确表示 React 是「库」而非「框架」，RSC 是底层能力，
上层路由/构建/部署仍交给社区框架（NextJS、Remix 等）。

## 关联

- [[React]]
- [[NextJS]]
- [[React Server Components]]
