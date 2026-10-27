---
uid: 202605210003
title: Vite急速冷启动的本质是延迟编译
aliases: []
description: Vite通过将编译时机从启动时推迟到请求时，实现了与项目规模无关的秒级冷启动
tags:
  - 前端工程
  - Vite
  - ESM
date-created: 2026-05-21
date-modified: 2026-05-21
status: active
content-type: atomic
up: "[[Vite相关问题]]"
noteId: 1792465711684
---
Vite 急速冷启动的本质是把编译从 " 启动时全量打包 " 推迟到 " 浏览器请求时~~按需编译~~ "，浏览器原生 ESM 支持是这个策略可行的底层基础。

**边界**：延迟的成本转移到了首次访问该模块时。依赖预构建（esbuild）仍要在启动时做一遍，所以冷启动快不等于首屏快——模块多、请求瀑布深时，首屏可能反而更慢。
