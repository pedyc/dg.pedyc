---
uid: 202603271045
title: requestAnimationFrame
aliases: [T-requestAnimationFrame]
description: "浏览器提供的用于动画的 API，在下一次重绘前调用回调"
tags: [JavaScript/浏览器API]
date-created: 2026-03-27
date-modified: 2026-08-02
status: active
content-type: term
---

## 术语：requestAnimationFrame

> **领域**：#浏览器/渲染性能

### 定义

`requestAnimationFrame` 是浏览器提供的动画优化 API，它接受一个回调函数作为参数，该回调会在浏览器下一次重绘之前执行。

```javascript
const animationId = requestAnimationFrame(callback);
```

**特点**：
- 自动优化到 60fps（通常与屏幕刷新率同步）
- 在后台标签页时暂停执行，节省资源
- 回调接收一个 `timestamp` 参数，表示开始执行的时间

### 跨学科含义

- **在前端性能优化中**：代替 `setInterval`/`setTimeout` 实现动画，减少回流重绘
- **在游戏开发中**：作为游戏循环的核心，驱动帧更新

### 知识网络

- **父级概念**：[[前端性能优化]] — 渲染性能优化的重要工具
- **相关概念**：[[怎样减少回流和重绘]], [[事件循环与帧动画]], [[will-change]]
