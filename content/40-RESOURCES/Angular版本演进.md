---
uid: 20260713000001
title: Angular版本演进
aliases: [R-Angular-版本演进, Angular版本演进]
description: Angular 从 AngularJS 到 v22 的演进路线图与未来方向
tags: [angular, frontend, roadmap, 版本历史]
date-created: 2026-07-13
date-modified: 2026-07-13
status: active
content-type: [roadmap]
up: ["[[Angular]]"]
---

## Angular 版本演进路线图

> Angular 从 2012 年 AngularJS 1.0 到 2026 年的 v22，经历了从 MVVM 框架到现代化响应式平台的架构重构。本条笔记以 roadmap 视角梳理关键里程碑、当前状态与未来方向。

**核心定位**：帮助开发者在技术选型和版本升级时清晰了解 Angular 的演进路径，判断当前版本所处的生命周期。

---

### 演进路线图

```mermaid
graph TD
    subgraph 第一代: AngularJS
        A[AngularJS 1.x<br/>2010-2012] -->|"脏检查<br/>MVVM"| B[AngularJS 1.5-1.7<br/>2015-2022]
    end

    subgraph 第二代: 架构重构
        C[Angular 2<br/>2016.09] --> D[Angular 4-8<br/>2017-2019]
    end

    subgraph 第三代: Ivy + Standalone
        E[Angular 9-13<br/>2020-2021] --> F[Angular 14-15<br/>2022]
    end

    subgraph 第四代: Signals + Zoneless
        G[Angular 16-17<br/>2023] --> H[Angular 18-19<br/>2024]
    end

    subgraph 第五代: 全栈收敛
        I[Angular 20-21<br/>2025] --> J[Angular 22<br/>2026.06]
    end

    B -->|"完全重写"| C
    D -->|"Ivy 默认"| E
    F -->|"Signals"| G
    H -->|"Zoneless 稳定"| I
```

---

### 里程碑

| 时代 | 开始版本 | 结束版本 | 核心主题 | 架构标志 |
|:--- |:--- |:--- |:--- |:--- |
| AngularJS | 1.0 (2012) | 1.7 (2022 LTS end) | MVVM 双向绑定 | `$scope` + `$digest` |
| 重写重构 | 2 (2016) | 8 (2019) | TypeScript + 组件化 | Zone.js + View Engine |
| Ivy 时代 | 9 (2020) | 13 (2021) | 增量 DOM + 编译优化 | Ivy 渲染引擎 |
| Standalone | 14 (2022) | 15 (2022) | 去 NgModule | Standalone API |
| Signals | 16 (2023) | 17 (2023) | 细粒度响应式 | `signal()` / `effect()` |
| Zoneless | 18 (2024) | 19 (2024) | 脱离 Zone.js | Zoneless Change Detection |
| 全栈收敛 | 20 (2025) | 22 (2026) | SSR + 开发者体验 | Vite 构建全面切换 |
| **Signal 全面成熟** | **22 (2026.06)** | **—** | **Signal 原生化所有核心模块** | **@Service()、Fetch 默认、OnPush 默认** |

---

### 逐版关键特性

| 版本 | 发布日期 | 关键特性 |
|:--- |:--- |:--- |
| **AngularJS 1.x** | 2010-2012 | 双向数据绑定、MVC 模式、指令系统 |
| **Angular 2** | 2016.09 | TypeScript、Zone.js、组件化、DI 新架构 |
| **Angular 4** | 2017.03 | 统一语义化版本（跳过 v3）、ngIfelse、TS 2.2 |
| **Angular 5** | 2017.11 | HttpClient（替代 Http）、Build Optimizer |
| **Angular 6** | 2018.05 | Angular CLI Workspaces、`ng update`、Angular Elements |
| **Angular 7** | 2018.10 | CLI Prompts、CDK Drag & Drop、Virtual Scrolling |
| **Angular 8** | 2019.05 | Ivy 预览（opt-in）、Differential Loading、Lazy Loading 重构 |
| **Angular 9** | 2020.02 | Ivy 默认启用、Component Test Bed 重构 |
| **Angular 10** | 2020.06 | Strict Mode 增强、Date Range Picker |
| **Angular 11** | 2020.11 | HMR 支持、Webpack 5 实验、国际化更新 |
| **Angular 12** | 2021.05 | 废弃 IE11、Webpack 5 稳定、Strict Mode 默认启用 |
| **Angular 13** | 2021.11 | 移除 View Engine、RxJS 7、动态组件改进 |
| **Angular 14** | 2022.06 | Standalone Components (dev preview)、Typed Forms |
| **Angular 15** | 2022.11 | Standalone API 稳定、Directive Composition API |
| **Angular 16** | 2023.05 | Signals (dev preview)、esbuild Dev Server、SSR Hydration |
| **Angular 17** | 2023.11 | `@if`/`@for`/`@defer` 模板语法、Signals 稳定、Vite + esbuild 默认 |
| **Angular 18** | 2024.05 | Zoneless (experimental)、`output()` API、Signal Forms (dev preview) |
| **Angular 19** | 2024.11 | Zoneless 稳定、Incremental Hydration、`linkedSignal()`、`resource()` |
| **Angular 20** | 2025.05 | Signal Forms 稳定、图片指令、应用级 DI 范围增强 |
| **Angular 21** | 2025.11 | esbuild 全面覆盖 AOT、SSR 流式渲染优化、开发者工具重做 |
| **Angular 22** | 2026.06 | Signals 全面成熟、Signal Forms 稳定、`@Service()` + `injectAsync()`、Fetch 默认 HTTP、OnPush 默认变更检测、增量水合默认、Resource API SSR 缓存 + stream、`linkedSignal()` custom set、Signal debounce、Karma→Vitest 迁移、chunk 优化默认、TS 6.0 + Node.js 26 |

---

### 当前状态（2026.07）

| 状态 | 版本 |
|:--- |:--- |
| **最新稳定版** | Angular 22 (2026.06) |
| **LTS 活跃支持** | v21, v22 |
| **LTS 长期维护** | v18, v19, v20 |
| **已停止支持** | v17 及更早 |

---

### 阶段详情

#### 第一代：AngularJS（2010-2022）

- **时间**：2010-2022（LTS 结束）
- **核心变化**：双向数据绑定、MVC 模式、指令系统、依赖注入雏形
- **解决的关键问题**：Web 应用从静态页面走向动态交互，减少 DOM 操作样板代码
- **相关概念**：[[MVVM]] [[脏检查]]

#### 第二代：架构重构（2016-2019）

- **时间**：Angular 2 (2016.09) — Angular 8 (2019.05)
- **核心变化**：TypeScript + Zone.js + 组件化架构，完全重写 AngularJS
- **解决的关键问题**：AngularJS 脏检查性能瓶颈、移动端不友好、缺乏类型安全
- **相关概念**：[[Zone.js]] [[TypeScript]] [[依赖注入]]

#### 第三代：Ivy + Standalone（2020-2022）

- **时间**：Angular 9 (2020.02) — Angular 15 (2022.11)
- **核心变化**：Ivy 渲染引擎成为默认，增量 DOM 优化 bundle；Standalone API 消除 NgModule 强制依赖
- **解决的关键问题**：View Engine 的 bundle 体积过大和编译速度慢；NgModule 引入的间接依赖层
- **相关概念**：[[Ivy渲染引擎]] [[Standalone Components]]

#### 第四代：Signals + Zoneless（2023-2024）

- **时间**：Angular 16 (2023.05) — Angular 19 (2024.11)
- **核心变化**：`signal()` / `effect()` 细粒度响应式、`@if`/`@for` 模板语法、Zoneless 变更检测
- **解决的关键问题**：Zone.js 无法感知数据流路径，必须全树 `markForCheck`；rxjs 在模板场景的过度抽象
- **相关概念**：[[Angular Signals]] [[Zoneless变更检测]]

#### 第五代：全栈收敛 + Signal 全面成熟（2025-2026）

- **时间**：Angular 20 (2025.05) — Angular 22 (2026.06)
- **核心变化**：
	- v20：Signal Forms 稳定、图片指令、应用级 DI 范围增强
	- v21：esbuild 全面覆盖 AOT、SSR 流式渲染优化、开发者工具重做
	- **v22**：Signal Forms 正式 GA、`@Service()` 装饰器 + `injectAsync()` 懒加载、Fetch 替代 XHR 为默认 HTTP 实现、OnPush 成为默认变更检测策略（Eager 作为重命名的降级选项）、`linkedSignal()` 支持 custom set 选项、Signal debounce 支持、增量水合默认启用、Resource API 获得 SSR 传输缓存和 stream 资源支持、Karma→Vitest 迁移 schematic 稳定、chunk 优化默认、TS 6.0 + Node.js 26 支持、移除 ComponentFactoryResolver / Hammer.js / provideRoutes()
- **解决的关键问题**：Signal 生态的最后拼图——表单和 HTTP 的 Signal 原生支持、构建工具链统一、Zone.js 全面可移除
- **相关概念**：[[Angular Signals]] [[SSR演进]] [[Vite]]

---

### 关键转折点

> 演进中的重要里程碑或范式转换

| 时间点 | 转折内容 | 影响 |
|:---|:---|:---|
| AngularJS 1.0 (2012) | MVVM 框架诞生 | 开启前端框架时代 |
| Angular 2 (2016.09) | 完全重写，TypeScript + 组件化 | 确立了现代 Angular 的架构方向 |
| Angular 9 (2020.02) | Ivy 渲染引擎默认 | bundle 体积减小 40%，编译速度显著提升 |
| Angular 14 (2022.06) | Standalone Components | 消除 NgModule 强制依赖，降低入门门槛 |
| Angular 16 (2023.05) | Signals 引入 | 从 Zone.js 全局检测迈向细粒度响应式 |
| Angular 17 (2023.11) | 新模板语法 + Vite 默认 | 编译器和构建工具链全面现代化 |
| Angular 19 (2024.11) | Zoneless 稳定 | Zone.js 从必须变为可选 |
| **Angular 22 (2026.06)** | **Signal 全面成熟 + OnPush 默认** | **Signal 原生覆盖变更检测/表单/HTTP/DI，十年架构迁移完成；Fetch 替代 XHR 标志网络层全面现代化** |

---

### 未来展望

- **趋势**：
	- Signal 继续向深层社区生态渗透（状态管理库、组件库中的 Signal-first 模式）
	- 编译时优化更进一步：更多模板分析前移到编译阶段（类似 Svelte 的方向）
	- SSR 和边缘渲染的融合（Angular + Cloudflare Workers / Deno）
- **待解决**：
	- rxjs 与 Signals 两套体系在大型项目中的共存策略仍需规范
	- 微前端场景下 Signal 跨应用边界传递尚无标准方案
	- 旧 API（NgModule、`*ngIf`、zone.js 依赖库）的清理和 LTS 退役计划
- **值得关注**：
	- v23 可能的方向：Signal-based 路由守卫、编译时模板错误分析、对 React Server Components 风格的探索

### 核心命题

- AngularJS 的脏检查机制在复杂应用中导致性能瓶颈，这是 Angular 2 完全重写的根本动因
	- **原理**：AngularJS 的 `$digest` 循环在每次事件后遍历所有 watch，页面复杂度上升时帧率急剧下降；Angular 2 改用单向数据流 + Zone.js 触发变更检测，将检测从 O(n²) 降至接近 O(n)
- Ivy 渲染引擎是 Angular 历史上最重要的架构变革，其增量 DOM 策略同时优化了 bundle 体积和编译速度
	- **原理**：Ivy 将模板编译为模板指令（template instructions），而非 View Engine 的解释器模式；同一棵树中静态节点不参与变更检测，tree-shaking 可直接移除未使用的指令
- Signals 的引入标志着 Angular 从 Zone.js 全局变更检测向细粒度响应式编程的范式转移
	- **原理**：Zone.js 无法感知数据流的具体路径，必须在整个组件树上执行 `markForCheck`；Signals 通过生产者-消费者图精确追踪依赖，只有订阅了变更 signal 的视图节点才会重新求值
- v22 是 Angular 历史上信号全面成熟的版本：OnPush 默认变更检测、Signal Forms 稳定、`@Service()` + `injectAsync()`、Fetch 替代 XHR 为默认 HTTP
	- **原理**：v22 标志着 Angular 从 Zone.js 到 Signal 的十年架构迁移正式完成，所有核心模块（变更检测、表单、HTTP、依赖注入）都已 Signal 原生化
- v20-v22 的全栈收敛方向使 Angular 从纯前端框架演进为端到端应用平台（SSR → 流式渲染 → 全站融合）
	- **原理**：ESR 和增量水合技术模糊了 CSR/SSR 的边界，编译时统一管线让构建产出在服务端和客户端共用同一份 AST 分析

---

### 适用范围

- ✅ **适用场景**
	- **企业级后台管理**：强类型 + DI + 模块化的开箱即用体系适配大型团队协作
	- **长期维护项目**：语义化版本 + 自动化迁移脚本降低跨版本升级成本
	- **SSR 全栈应用（v20+）**：统一的构建和渲染管线简化了传统的前后端分离架构
- ⛔ **误用**
	- **快速原型**：Angular 的 CLI 脚手架和类型系统在快速验证阶段是额外负担
- **失效边界**
	- 微前端场景下 DI 容器的隔离仍需额外适配（Module Federation + Angular 有已知运行时冲突）
	- v22 中 Signal 跨微前端边界传递仍缺乏标准协议，复杂异步场景仍需 rxjs 配合

---

### 批判

- **外部批判**
	- React 社区：Angular 的全家桶架构在灵活性和 bundle 体积上不及渐进式方案
	- Svelte 社区：编译时优化的理念本可以让 Angular 做得更彻底，Ivy 和 Signals 虽然追赶但历史包袱仍在
- **内在张力**
	- rxjs 与 signals 并存：两套响应式体系的转换（`toSignal` / `toObservable`）增加认知负担
	- 向后兼容压力：长时间 LTS 周期导致老旧 API（如 `*ngIf`、NgModule）的清理速度慢

---

### FAQ

- [[Q-Angular跳过v3的原因]]
- [[Q-Signals能否完全替代RxJS]]
- [[Q-Angular的LTS策略]]

---

### 知识图谱

- **父级概念**：[[前端框架]] — Angular 所属的上位领域
- **子级概念**：
	- [[Signal(Angular)|Angular Signals]] — v16 引入的细粒度响应式原语
	- [[Ivy渲染引擎]] — v8-v9 引入的第三代编译与渲染引擎
	- [[Zoneless变更检测]] — v18-v19 稳定化的无 Zone.js 新范式
- **并列概念**：
	- [[React版本演进]] — React 从类组件到 Server Components 的演进路径
- **相关概念**：
	- [[前端工程化]] — CLI、monorepo、module federation 等工程实践
	- [[SSR演进]] — 从 CSR 到 SSR 再到全站渲染的演化
- **参考文章**
	- [Angular 官方更新日志](https://angular.dev/update-guide)
	- [Angular Blog - Releases](https://blog.angular.dev/tag/releases)
