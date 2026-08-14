---
uid: 202608141030
title: P-斑驳光背景实现
description: 在 Quartz 数字花园中实现程序化斑驳光（Dappled Light）着色器背景，用五层渲染流水线替换现有纯 CSS 近似方案
tags: [前端, CSS, Canvas, Shader, Quartz]
date-created: 2026-08-14
date-modified: 2026-08-14
status: active
area: ["[[前端开发|A-前端开发]]"]
consequence: 5
content-type: project
expire: 2026-09-14
urgency: 3
---

## 背景

站点现有 `quartz/components/renderPage.tsx` + `quartz/styles/custom.scss` 实现了一套**纯 CSS 的斑驳光近似**——用静态 `leaves.png` 图片、线性渐变 `#glow`/`#glow-bounce`、`backdrop-filter` 的 `#progressive-blur` 和 matrix3d 透视来模拟光影。它**不是** [[Experiments in procedural dappled light shaders|文章]] 所描述的程序化着色器五层流水线：#

| 文章五层 | 现有实现 | 差距 |
|---|---|---|
| 1. 噪点 + 抖动 | 静态 `leaves.png` 图片 | ❌ 缺失（无程序化噪点） |
| 2. 金色暖边 | `#glow` 静态线性渐变 | 🟡 无边缘检测，本质不同 |
| 3. L 系统树枝 | 静态图片，无生成 | ❌ 缺失 |
| 4. 半影模糊 U=f×b/a | `backdrop-filter` 屏幕空间模糊 | 🟡 非深度相关 |
| 5. 视差 | matrix3d 静态透视 | 🟡 无鼠标交互 |

> 现有实现独有的**昼夜主题联动**（sunrise/sunset 配色）值得保留，可作为程序化方案之上的"时间维度"增强。

**本项目目标**：用 [[斑驳光]] 的五层着色器流水线实现真正的程序化斑驳光，替换（或并存）现有 CSS 近似。方法论上，本项目同时是 [[实现网页斑驳光背景效果|SOP]] 的**实践验证载体**——通过动手把「文章推导版」SOP 收敛为「实践验证版」。

## 🔗关联领域

- [[前端开发|A-前端开发]]

## 🎯 核心靶心（项目的主要目标）

- [ ] 用 Canvas/WebGL 实现五层流水线的程序化斑驳光背景
- [ ] 集成到 Quartz，替换或并存现有 `DappledLight` CSS 近似
- [ ] 保留昼夜主题联动，并与程序化方案融合
- [ ] 实践回流：修订 [[实现网页斑驳光背景效果|SOP]]，证伪/证实其中的具体参数假设

## 🗺️ 战略地图（KEY RESULT：关键结果）

- [ ] **KR1**：五层流水线跑通 — 噪点抖动、金色暖边、L 系统树枝、半影模糊、视差（权重 60%）
- [ ] **KR2**：Quartz 集成 — 替换/并存 `renderPage.tsx` 的 DappledLight，主题联动融合（权重 25%）
- [ ] **KR3**：性能与可访问性 — OffscreenCanvas/Worker、`prefers-reduced-motion`、visibilitychange 降级（权重 15%）

## 🛠️ 执行引擎（分步执行）

### 阶段一：准备期（选型与骨架）

- [ ] 复读 [[斑驳光]] 概念 + [[实现网页斑驳光背景效果|SOP]]，明确五层各自输入/输出
- [ ] 技术选型：Canvas 2D（低分辨率+抖动，噪点层够用）vs WebGL/OffscreenCanvas（距离场 L 系统 + 半影模糊可能需要）
- [ ] 搭最小可运行骨架：Canvas 覆盖层 + CSS 自定义属性面板 + `requestAnimationFrame` 循环
- [ ] 决策：替换还是并存现有 CSS 近似（建议先并存，验证后替换）

### 阶段二：攻坚期（五层流水线）

- [ ] 第 1 层：多层 Perlin/Simplex 噪点 + 阈值化 + 抖动 + 风效
- [ ] 第 2 层：金色暖边（中调 0.35–0.65 + 大梯度检测，`lerp(current, gold, intensity)`）
- [ ] 第 3 层：概率 [[L系统]] 生成树枝骨架 + 达·芬奇分枝法则 + 黄金角 137.5°，距离场渲染
- [ ] 第 4 层：半影模糊 `blurRadius = f * b / a` + 冠层深度梯度 + 深度跟随
- [ ] 第 5 层：鼠标视差（每层按深度比例 `parallaxStrength` 偏移）

### 阶段三：收尾期（集成与封装）

- [ ] 集成到 `renderPage.tsx`，融合 sunrise/sunset 昼夜配色
- [ ] 性能优化：OffscreenCanvas + Worker、`visibilitychange` 暂停、降低分辨率
- [ ] 可访问性：`prefers-reduced-motion` 关闭动画
- [ ] 实践回流 → 修订 [[实现网页斑驳光背景效果|SOP]]（升 `active`），更新 [[斑驳光]] 概念

## 📦 关联资源（输入资源）

- [[实现网页斑驳光背景效果]] 🔧 SOP 蓝图 — 五层流水线的标准步骤
- [[斑驳光]] 📚 概念理论 — 设计原理与核心命题
- [[L系统]] 📚 术语 — 树枝骨架生成算法
- [[Experiments in procedural dappled light shaders]] 📄 源文章 — Jacky Zhao，2024
- `quartz/components/renderPage.tsx` + `quartz/styles/custom.scss` 🧱 现有 CSS 近似实现

## 🧩 成果与交付物（输出资源）

- 程序化斑驳光 Canvas/WebGL 组件 💎 — 可运行的完整实现
- 修订版 [[实现网页斑驳光背景效果|SOP]] 💎 — 由 `cultivating` 升 `active` 的验证版
- 实践验证记录 💎 — 哪些参数/假设被证实、哪些被证伪

## 💡 项目总结（复盘）

> 项目进行中，复盘待实践后填写。

**突破进展**：
**关键障碍**：
**策略调整**：

## ✅ 结算检查清单

- [ ] 五层流水线全部跑通并集成到 Quartz
- [ ] 昼夜主题联动与程序化方案融合
- [ ] 性能达标（稳定 FPS，低端设备可降级）
- [ ] [[实现网页斑驳光背景效果|SOP]] 完成实践验证并升 `active`
