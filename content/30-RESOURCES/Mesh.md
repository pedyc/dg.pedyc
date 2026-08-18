---
uid: 202604160100
title: Mesh
aliases: [T-Mesh, 网格, 网格模型]
description: 3D 计算机图形学中由顶点、边、面组成的多边形几何体
tags: [计算机科学/计算机图形学]
date-created: 2026-04-16
date-modified: 2026-04-16
status: active
content-type: term
---

## 术语：Mesh（网格模型）

> **领域**：#计算机科学/计算机图形学/3D建模

### 定义

Mesh（网格/网格模型）是由**顶点（Vertices）**、**边（Edges）**和**面（Faces/Polygons）**组成的多边形几何体，用于在 3D 计算机图形学中表示物体的表面形状。

基本组成：
- **顶点 (Vertex)**：空间中的点坐标 (x, y, z)
- **边 (Edge)**：连接两个顶点的线段
- **面 (Face/Polygon)**：由三条或多条边围成的封闭区域

### 跨学科含义

- **在 3D 建模中**：Mesh 是最常见的 3D 模型格式，如立方体、球体、人形模型等
- **在游戏开发中**：用于角色、场景、道具的建模和渲染
- **在 CAD/CAE 中**：用于工程设计和仿真分析
- **在 WebGL/ThreeJS 中**：BufferGeometry 是 WebGL 处理 mesh 的底层实现

### 知识网络

- **父级概念**：[[计算机图形学]] — Mesh 的所属领域
- **相关概念**：
	- [[ThreeJS]] — WebGL/ThreeJS 中的 3D 引擎
	- [[顶点着色器]] — 处理顶点数据的 GPU 程序
	- [[片元着色器]] — 处理像素着色的 GPU 程序
	- [[法线]] — 定义表面朝向的向量
