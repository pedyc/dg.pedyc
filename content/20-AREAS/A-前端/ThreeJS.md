---
uid: 202603200004
title: ThreeJS
aliases: [A-ThreeJS, Three.js, three.js]
description: 使用 Three.js 在浏览器中创建和展示 3D 图形的领域
tags: [前端开发/图形]
date-created: 2026-03-20
date-modified: 2026-10-26
content-type: area
up: "[[前端开发]]"
---

## Area: ThreeJS

> 基于 WebGL 的 3D 图形库，把场景、材质、光照、动画抽象成可组合的对象。

### 领域定义

- **核心范畴**：场景图结构、材质系统、光照、后处理、粒子与着色器
- **不包括**：原生 WebGL 底层开发、2D 图形渲染（属 Canvas / SVG）、游戏逻辑与物理引擎
- **与相关领域的区别**：vs WebGL——Three.js 是高级封装，提供场景图、材质、光照等抽象；vs Canvas 2D——一个做 3D 渲染，一个做 2D 绘图；vs Babylon.js——Three.js 更轻、社区更大，Babylon.js 内置功能更全

### 里程碑

- **愿景**：掌握场景、材质、光照、动画，能独立实现 3D 交互效果与可视化项目
- **里程碑**：
	- [x] 阶段 1：场景图结构（Scene / Camera / Renderer）
	- [x] 阶段 2：材质系统（MeshPhysicalMaterial / ShaderMaterial）
	- [x] 阶段 3：光照与阴影
	- [ ] 阶段 4：粒子系统与特效
	- [ ] 阶段 5：后处理（Bloom / EffectComposer）
	- [ ] 阶段 6：完成 3D 可视化作品集

> 判据：阶段 6 是唯一可数的验收点——「作品集」要有条目、能打开。前五条都以它为落点，所以它不是锦上添花的一条，而是这个领域的验收口。

### 专题导航

> 中观层：本领域是知识粒度的最小单元，没有独立 MOC，概念在此平铺。**未解析的链接不是错误，是尚未写下的洞**——排序见 [[知识缺口]]。

- **场景与渲染** — [[场景图结构]] · [[透视投影]] · [[自定义着色器]]
- **材质与光照** — [[MeshPhysicalMaterial]] · [[光照模型]] · [[环境贴图]]
- **后处理与特效** — [[后处理管线]] · [[粒子系统]] · [[流体模拟]]
- **动画与交互** — [[缓动函数]] · [[帧间隔标准化]]
- **外部资源**
	- 官网：[threejs.org](https://threejs.org/)
	- 课程：Three.js Journey（付费）
	- [第一个 Three.js 项目（B 站）](https://www.bilibili.com/video/BV1SdkNBBE1r/)

> 11 条概念里只写了 1 条（场景图结构）。这个领域的知识目前全在 SOP 里——四条实现流程写得比概念清楚，说明是「先会做，后解释」的顺序。

### FAQ

> 三条题面已登记，笔记未写（链接未解析）。

- [[Q-ThreeJS和Babylonjs怎么选]]
- [[Q-ThreeJS能做移动端吗]]
- [[Q-ThreeJS性能瓶颈在哪]]

### 执行系统

- **核心流程**
	- [[ThreeJS实现3D视差滚动]] — 多层视差滚动
	- [[ThreeJS实现气泡粒子]] — 透射材质粒子系统
	- [[ThreeJS实现光影滤镜]] — 光照与后处理滤镜
	- [[ThreeJS实现平面凹凸效果]] — ShaderMaterial 自定义变形
- **跨领域引用**
	- 这四条流程里的着色器与后处理概念，将来应提炼进 [[前端交互]] 的动画侧；现在只在本文实现，没有上升成概念

### 领域健康度

| 维度 | 状态 | 说明 |
|:---:|:---:|---|
| 目标进展 | 🟡 | 6 个阶段勾了 3 个，粒子、后处理、作品集未完成 |
| 认知更新 | 🔴 | 12 条概念只写了 1 条，`up` 指向本领域的 4 篇全是 SOP |
| 行动频率 | 🟢 | 四条实现流程全部建成，是「先会做」的典型样本 |

### 领域知识图谱

```dataviewjs
// 领域页看板（逻辑在 _scripts/areaBacklinks.js）
await dv.view("_scripts/areaBacklinks")
```
