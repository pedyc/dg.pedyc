---
uid: 202605210003
title: Vite急速冷启动的本质是延迟编译
aliases: []
description: Vite通过将编译时机从启动时推迟到请求时，实现了与项目规模无关的秒级冷启动
tags: [前端工程, Vite, ESM]
date-created: 2026-05-21
date-modified: 2026-05-21
status: cultivating
content-type: atomic
up: "[[MOC-Vite相关问题]]"
---

Vite 急速冷启动的本质是把编译从 " 启动时全量打包 " 推迟到 " 浏览器请求时按需编译 "，浏览器原生 ESM 支持是这个策略可行的底层基础。
