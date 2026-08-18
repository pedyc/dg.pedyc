---
uid: 202605061000
title: NextJS 首屏渲染不需要 JS 引擎参与但 hydration 仍然需要
aliases: []
description: "NextJS 首屏快是因为内容生成在服务端完成，hydration 仍需 JS 引擎"
tags: []
status: fleeting
content-type: atomic
up:
---

> NextJS 首屏渲染不需要 JS 引擎参与，但 hydration 仍然需要

### 论据/示例

**1. CRA vs NextJS 首屏对比**

| 对比 | CRA (纯客户端) | NextJS SSR |
|:---|:---|:---|
| 首屏 HTML | 空壳/骨架，需 JS 生成内容 | 服务端直接返回完整 HTML |
| 白屏时间 | 长（等 JS 下载 + 执行） | 短（HTML 立即可渲染） |
| 可交互时间 | 需要完整 hydration | hydration 后可交互 |

**2. NextJS 首屏渲染流程**
```
用户请求 → 服务端执行 React 组件 → 生成完整 HTML → 返回浏览器 → 立即渲染（无 JS）
                                      ↓
                              浏览器下载 JS → hydration → 页面可交互
```

**3. 为什么不是"不需要 JS 引擎"**
- **Hydration** 是 NextJS 将 React 组件树"附加"到已有 HTML 的过程
- 这个过程仍然需要 JS 引擎执行 React 代码
- 区别在于：首屏内容展示**不需要等**这个过程

### 关联

- [[NextJS]]
- [[React]]
- [[服务端渲染]]
