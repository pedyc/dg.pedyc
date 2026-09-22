---
uid: "202609212049"
title: DSH的的一切皆插件架构是如何实现的？
aliases:
  - Q-DSH的一切皆插件架构是如何实现的
  - DSH架构实现
  - 一切皆插件
description:
tags: []
date-created: 2026-09-21
date-modified: 2026-09-21
status: fleeting
content-type: question
up: ["[[DeepSeek Harness]]"]
---

## 问题

> DSH的「一切皆插件」架构是如何实现的？

---

## 背景

DSH是DeepSeek团队开源的Harness架构，采用一切皆插件的架构，理解此架构能够对Harness工程由更深的理解。

---

## 解决方案

DeepSeek Harness（dsh）的 **"一切皆插件"（Everything is a Plugin）** 架构并不是简单的"在固定内核上挂载钩子"，而是从底层框架到上层业务彻底实现解耦与模块化。其核心实现机制可以拆解为以下五个维度：

### 1. 无特权内核（No Privileged Core）

- **以 Cordis 微内核为底座**：DeepSeek Harness 跑在内置的 Cordis 元框架上。框架内部 **不存在需要打补丁的特权内核**，所有核心功能单元均以插件形式运行在共享上下文（Context）中。
- **连 Agent 循环本身都是插件**：不仅模型适配器、工具注册表、沙箱与会话存储是插件，连驱动 Agent 运行的 **Agent Loop（智能体循环）** 本身也仅是一个通过 依赖注入 挂载的普通 Cordis 服务插件。如果需要替换循环逻辑，只需修改一行配置挂载不同的 Loop 插件即可。

### 2. "能力接缝"（Capability Seam）三段式分工

为防止能力提供方与工具逻辑强绑定，dsh 将新功能的接入抽象为 **三段式接缝模式**：

1. **服务定义（Service Definition）**：用抽象类定义能力的类型契约与接口（如 `ctx.shell`、`ctx.fs`、`ctx.sandbox`）。
2. **服务提供方（Service Provider）**：具体的实现插件，同一上下文中仅允许存在一个生效的提供方。
3. **消费方（Consumer）**：面向模型的工具（如 `dsh-tool-bash`）或内部模块，直接消费 Service 定义。

- **无缝热替换后端**：这种设计使得 **替换提供方不会改变工具 Schema 或模型可见行为**。例如，将 `ctx.shell` 的提供方从本地 Bash（`dsh-bash-local`）替换为云沙箱（`dsh-bash-sandbox`），模型调用的工具无需任何改动，即可将整个终端执行搬移到隔离环境中。

### 3. 反应式依赖注入与可逆生命周期（Reactive & Reversible Effects）

- **依赖驱动激活（`inject`）**：插件只需在静态元数据中声明 `static inject = ['tools', 'llm']`。框架在检测到其依赖的服务全部就绪后，会自动将插件从等待状态激活。这使得插件的加载顺序由服务依赖关系自动决定，无需手写顺序编排逻辑。
- **注册即副作用（Registrations are Effects）**：插件注册工具、系统提示词段落、事件监听器或服务时，所有行为都会返回一个销毁函数（Disposer）并绑定到该插件的 Fiber 生命周期中。
- **完全撤销与无残渣热重载（HMR）**：当插件被卸载或热重载时，框架会逆序执行所有销毁函数，**彻底撤销插件产生的所有副作用**，使系统干净地恢复到挂载前的状态，实现了"改配置无需重启"的动态能力。

### 4. 三大事件域与 Waterfall 拦截流水线

事件在 dsh 中即为扩展点，分为三个层级的事件域：

- **会话事件（Session Events）**：记录追加到日志中的持久事实（如 `turn/start`、`tool/result`）。
- **Agent 事件（Agent Events）**：围绕 Agent 运行周期的生命周期扩展点（如 `agent/pre-step`、`agent/request`、`agent/turn-stopping`）。
- **能力事件（Capability Events）**：拦截具体的执行流水线（如 `tools/pre-execute`、`tools/execute`、`tools/post-execute`）。
- **Waterfall（瀑布/中间件）拦截机制**：在 `tools/pre-execute` 等 waterfall 事件中，监听器接收 `(args, next)` 参数。拦截插件（如权限审批、沙箱包装、上下文压缩）可以选择调用 `next()` 委托给下游，或者中断流水线改写输入/拒绝执行，从而将策略控制与核心工具逻辑彻底解耦。

### 5. 配置即组合与 Patch 补丁栈（Profile, Bundle & Patch）

- **树状插件组合**：运行中的 dsh 实例被抽象为一棵由配置驱动的插件树。
- **分层 YAML Patch 补丁**：通过 Profile（如 `web`、`headless`）、组合包（Bundle）与 YAML 补丁（`cordis.patch.yml`），开发者可以通过 `id` 定位配置树中的任意插件节点，进行配置覆盖、替换或插入新插件。
- **预设即插件选择**：dsh 内置的四个智能体预设（如 **Standard** 标准模式、**Minimal** 极简模式、**Code/PTC** 程序化工具调用模式、**Creator** 创造模式），本质上就是不同的插件组合，通过简单切换配置即可决定 Agent 拥有哪些能力与权限。

### 我的理解

{{你对这个问题的理解和思考}}

---

## 探索路径

- [ ] {{探索步骤 1}}
- [ ] {{探索步骤 2}}

---

## 待验证（扩展）

- [ ] {{验证点 1}}
- [ ] {{验证点 2}}

---

## 收敛

> 经过实践验证后，此问题的解决方案可固化为 SOP。标记已验证的方案。

- [ ] **已收敛** → [[构建一个无特权内核架构的MVP实现]] — 本问题的验证标准和流程

---

## 关联

- **相关问题**：[[{{相关问题1}}]]
- **参考资料**：{{链接}}
