---
uid: 202605121600
title: PWA持续更新本质是ServiceWorker与页面生命周期解耦
description: SW 在独立线程完成安装与激活，页面不用刷新就能在后台换版本
tags: []
date-created: 2026-05-12
date-modified: 2026-10-24
content-type: atomic
up: "[[PWA]]"
noteId: 1792465707911
---

> PWA 能持续更新，本质是 **Service Worker 的生命周期与页面生命周期解耦**：页面继续跑着，SW 在后台独立完成 install → activate，把新版本准备好。

**边界**：默认不是「立刻生效」。新 SW 装好后要等旧页面全部关闭才 activate——所以「用户无感知」的准确含义是**下次访问才是新版本**，想立刻接管必须显式 `skipWaiting`。

## 论据/示例

SW 运行在独立线程，它的 install / activate 与页面无关，因此不必刷新页面就能在后台完成更新。对比传统 Web：资源与页面绑定，不刷新就一直停在旧版本，用户可能几小时都在跑旧代码。

## 关联

- [[Service Worker]] — 实现持续更新的技术基础
- [[PWA]] — 父级概念
