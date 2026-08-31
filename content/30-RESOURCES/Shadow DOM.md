---
uid: '202608311142'
title: Shadow DOM
aliases: [C-Shadow-DOM, C-ShadowDOM, Shadow DOM]
description: Web Components 核心规范之一，提供原生的 DOM 树与 CSS 样式作用域强隔离能力
tags: [WebComponents, 浏览器API, DOM, 前端架构, 概念]
date-created: 2026-08-31
date-modified: 2026-08-31
status: cultivating
content-type: concept
up: ["[[Web Components]]", "[[微前端]]"]
---

## 概念：Shadow DOM

Shadow DOM（影子 DOM）是 W3C Web Components 规范的核心基石之一。它允许浏览器将一棵封装的、独立的 DOM 子树（Shadow Tree）附加到指定的常规 DOM 节点（Shadow Host）上，使得该子树内部的 DOM 结构和 CSS 样式规则与外部主文档完全隔离。

**解决的核心痛点**：彻底解决传统 Web 开发中**全局 CSS 样式污染/冲突**（需要依赖 BEM、CSS Modules 等人工或编译层约定规范）以及**组件内部 DOM 结构被外部脚本随意窥探与意外修改**的问题，提供浏览器原生级别的真正强封装。

---

### 核心命题

* [[Shadow DOM 的本质是浏览器渲染引擎原生的作用域硬隔离机制]]
		* **原理**：浏览器渲染引擎在构建 Render Tree 与计算 CSS Rule 时，将 Shadow Tree 视为独立的样式与节点上下文，外部 CSS 选择器（除继承属性与 CSS 自定义变量外）默认无法穿透 Shadow Boundary。
* [[Shadow DOM 并未脱离主渲染上下文与事件主干]]
		* **原理**：Shadow DOM 并不是 iframe；它与宿主文档共享相同的 JavaScript 执行上下文、内存和主渲染线程，且事件会通过重定向机制（Event Retargeting）向上冒泡至主文档。

---

### 运行机制

```mermaid
flowchart TD
    subgraph LightDOM [Light DOM / 主文档树]
        HostNode[Shadow Host 宿主元素: <my-element>]
        LightChild[Light DOM 子节点: <span slot='title'>]
    end

    subgraph Boundary [Shadow Boundary 作用域边界]
        subgraph ShadowTree [Shadow Tree 内部独立作用域]
            ShadowRoot[Shadow Root 根节点]
            InternalStyle[<style> 内部私有样式]
            InternalDOM[内部结构: <div class='card'>]
            SlotNode[插槽出口: <slot name='title'>]
        end
    end

    HostNode -.->|attachShadow 挂载| ShadowRoot
    ShadowRoot --> InternalStyle
    ShadowRoot --> InternalDOM
    InternalDOM --> SlotNode
    LightChild ==>|投影/组合| SlotNode
````

#### 核心要素与运作特征

1. **Shadow Host & Root**：宿主元素通过 `element.attachShadow({ mode: 'open' | 'closed' })` 创建并挂载独立的 `ShadowRoot`。
2. **模式区别（Open vs Closed）**：

	* `open`：外部可通过 `host.shadowRoot` 访问内部 DOM（推荐，便于测试与调试）。
	* `closed`：外部 `host.shadowRoot` 返回 `null`，完全对外部隐藏内部引用。

3. **样式穿透与定制机制**：

	* `:host` / `:host-context()`：内部向外定义宿主样式。
	* `::slotted()`：样式作用于被插槽分配的 Light DOM 节点。
	* `::part()` & CSS Custom Properties（CSS 变量）：官方推荐的向内暴露可定制外观的受控通道。

4. **事件重定向（Event Retargeting）**：Shadow Tree 内部冒泡出的事件在跨越边界后，其 `event.target` 会被重写为 `Shadow Host`，避免向外泄露内部实现细节。

### 关键区别

|**维度**|**Shadow DOM**|**iframe**|**CSS Modules / Scoped CSS**|
|---|---|---|---|
|**隔离级别**|原生 DOM 结构与 CSS 样式双重隔离|完整的上下文隔离（JS/DOM/Window/CSS 全隔离）|仅编译期 CSS Class 哈希混淆（软隔离）|
|**内存与通信**|共享主执行上下文，直接调用/传参|独立进程/上下文，依赖 `postMessage` 通信|共享主执行上下文|
|**性能开销**|极低（渲染引擎原生优化）|极高（独立文档、网络开销与内存占用）|几乎无额外运行时开销|
|**布局与自适应**|与主文档无缝流式排版，高度自适应|尺寸自适应困难，易出现双滚动条|完全融入主文档流|

### 适用范围

* ✅ **适用场景**
	* **独立可复用 UI 组件库与 Design System**：构建与宿主技术栈（React/Vue/Angular）解耦的高内聚组件。
	* **微前端与三方嵌入插件（Widget/SDK）**：在宿主环境插入独立浮窗、客服插件或广告挂件，杜绝外部 CSS 样式污染。
	* **富媒体与原生控件封装**：浏览器原生 `<video>`、`<input type="range">` 内部即采用 Shadow DOM 实现控件封装。
* ⛔ **误用与反模式**
	* **反模式：过度隔离导致无法复用全局主题**：未规划 CSS 变量与 `::part`，导致主站全局主题色换肤无法影响内部组件。
	* **反模式：闭合模式（`mode: 'closed'`）的虚假安全感**：误以为 closed 模式可防黑客攻击（实际上仍可通过原型链篡改拦截 `attachShadow` 捕获引用）。
* **失效边界**
	* **继承性 CSS 属性**：`color`、`font-family` 等具备继承特性的 CSS 属性依然会隐式穿透边界影响 Shadow DOM。
	* **非视觉逻辑隔离**：对全局 JS 污染（如 `window` 对象污染、全局网络请求劫持）无任何隔离防护能力。

### 批判

* **外部批判**
	* **SSR 与 SEO 历史断层**：早期服务端渲染（SSR）无法输出包含 Shadow DOM 的静态 HTML，导致白屏与 SEO 友好度极差（直到 DSD 声明式 Shadow DOM 标准落地才缓解）。
	* **生态集成摩擦**：与 React 等合成事件系统（SyntheticEvent）存在事件冒泡与捕获时序的阻抗，第三方表单验证与全局无障碍（A11y/ARIA 跨边界关联）较为繁琐。
* **内在张力**
	* **"完全封装"与"灵活换肤"的天然矛盾**：封装越严密，外部业务定制组件内部样式的成本越高；过多开放 `::part` 又会导致封装边界形同虚设。

### FAQ

* [[Q-如何优雅解决服务端渲染中ShadowDOM的水合与直出问题]] — 探索 Declarative Shadow DOM (DSD) 的工程实践
* [[Q-微前端架构下样式隔离方案的技术选型与权衡]] — 探索 Shadow DOM 与 CSS Scope 方案的落地差异

### SOP

* [[SOP-使用声明式ShadowDOM实现组件服务端渲染]] — DSD 在现代 SSR 框架中的标准化配置与水合流程
* [[SOP-封装跨框架通用的WebComponents基础组件]] — 基于 Custom Elements 与 Shadow DOM 的组件封装标准

### 知识图谱

* **父级概念**：[[Web Components]] — 浏览器原生组件化技术体系
* **子级概念**：
	* [[T-Declarative-Shadow-DOM]] — 声明式影子 DOM
	* [[T-CSS-Shadow-Parts]] — `::part` 穿透选择器规范
* **并列概念**：
	* [[Custom Elements]] — 自定义元素注册与生命周期管理
	* [[HTML Templates]] — `<template>` 与 `<slot>` 模板复用机制
* **相关概念**：
	* [[CSS Modules]] — 编译期 CSS 作用域方案
	* [[微前端]] — 架构层面的应用隔离与集成
	* MDN Web Docs: Using Shadow DOM
	* W3C Web Components Specification
