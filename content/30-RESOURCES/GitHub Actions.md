---
uid: "20261104102000"
title: GitHub Actions
aliases: [C-GitHub-Actions]
description: GitHub 内置的 CI/CD 平台；价值不在五个对象的名词表，而在「Job 隔离、runner 一次性、权限默认只读」这三条推出的实践
tags: [Git, 前端工程化, CI/CD, 概念]
status: active
content-type: concept
up: ["[[前端交付与观测]]", "[[DevOps]]"]
date-created: 2026-09-27
date-modified: 2026-11-04
---

## 概念：GitHub Actions

> GitHub 内置的 CI/CD 平台：把自动化流程写成仓库里的 YAML，由 GitHub 提供的机器执行。它解决的不是「能不能自动化」，而是**自动化脚本放在哪、跟不跟代码一起版本化**——放仓库里，改配置就要过 PR，也能跟着分支回滚。
> 它是 CI/CD 的一种**实现**，不是 CI/CD 本身。判据、持续交付与持续部署的分界，见 [[持续集成与持续部署]]。

### 五个对象怎么套起来

```bash
Event ──触发──▶ Workflow ──包含──▶ Job ──包含──▶ Step ──调用──▶ Action
                                      │
                                      └──▶ Runner（每次全新的一台机器）
```

- **Event** — 触发条件，如 `push`、`pull_request`、`schedule`、`workflow_dispatch`（手动）
- **Workflow** — 一个 YAML 文件，位于 `.github/workflows/`
- **Job** — 一组在同一次执行的 steps；**默认与其他 job 并行**，要串行得写 `needs`
- **Step** — 一个 shell 命令，或一次 Action 调用
- **Action** — 可复用的组件（`actions/checkout`、`actions/setup-node`），来自仓库、市场或本地路径
- **Runner** — 跑 Job 的机器；GitHub 托管或自建

判定口诀只有一句：**能不能直接读同一个文件，就看它们是不是同一个 Job。**

### 三条由模型推出的推论

这三条不是配置技巧，是上面那张图的直接后果——反过来看，配置里大多数「莫名其妙」的写法都源于它们。

**1. Job 之间不共享文件系统。** 所以构建 job 产出的 `dist/` 不能直接被部署 job 读到，必须走 artifact 上传下载。这解释了为什么流水线里总有 `upload-artifact` + `download-artifact` 这一对；跳过它们、在部署 job 里重新 `build` 一次，是常见但有害的简化——重新构建出来的产物未必和刚才验证过的那个一样。

**2. 每个 Job 跑在全新 runner 上。** 没有上一次的残留，`node_modules`、全局装的 CLI、改过的环境变量全都不在。所以缓存必须显式声明（`setup-node` 的 `cache: npm`，或 `actions/cache`）。这也解释了「本地能跑、CI 不能跑」最常见的原因：本地靠的是没写进配置的残留状态。

**3. `GITHUB_TOKEN` 在新仓库里默认只读。** 要往仓库写东西（打 tag、推 commit、改 PR 评论）必须显式给权限，如 `permissions: contents: write`。不给就是权限错误，而报错信息不会告诉你去改这个字段。

### 与自建 CI 的区别

| 维度 | GitHub Actions | 自建 Jenkins |
|:---|:---|:---|
| 配置位置 | 仓库内 YAML，随分支版本化，改配置要过 PR | 平台侧，改配置不进代码审查 |
| 执行环境 | 托管 runner，每次全新 | 自建节点，状态会累积，容易配出「只有那台机器能跑」 |
| 权限 | 仓库 token + environment 审批 | 自己设计，灵活也意味着要自己负责 |
| 定制的代价 | 深度定制受限，要么写 composite action，要么自建 runner | 定制自由，维护成本自己背 |

GitLab CI 与它同构（配置同样在仓库内、同样是托管 runner），迁移成本主要在语法与缓存语义，不在模型。

### 适用范围与失效边界

- **只适用 GitHub 托管的仓库。** 内网 GitLab、自建 Gitea 需要换成对应平台的语法，模型可迁移、YAML 不可
- **单个 Job 有 6 小时上限。** 全量 E2E、镜像构建这类长任务会撞上，必须拆 job 或改自建 runner
- **并发数随套餐而定。** 不是无限并行，PR 密集时会排队
- **不是进程管理器。** 常驻服务、需要持久状态的任务不该放这里
- **artifact 有保留期（默认 90 天，可在仓库设置改）。** 别把它当长期存储，发布产物该进对象存储或 CDN

### 批判

- **YAML 不是编程语言。** 条件、循环、复用都靠表达式和 composite action 硬凑，编排一复杂就退化成一堆 shell 脚本，测试不了、复用靠复制。
- **调试成本高。** 改一次要等一次排队，本地无法完整复现——`act` 只能近似，托管 runner 的镜像、预装软件、网络都与本地不同。
- **绑定的是流程，不是数据。** 换平台等于重写整条流水线。lock-in 的实际形态在这里不是数据迁移，是流程重写。

### 问题与流程

- 具体流水线怎么搭（触发、缓存、不可变产物、人工确认）：[[CI-CD流程]]
- 流水线里「检查」那一段的三道门：[[前端质量闸门]]
- 同一件事的 AI 辅助形态：[[使用Claude-Code自动化CI-CD流水线]]

### 知识图谱

- **上位**：[[前端交付与观测]] — 交付段里的一种执行载体
- **并列**：[[GitLab CI]]（待写）— 同构竞品，配置同样在仓库内
- **相关**：
	- [[持续集成与持续部署]] — 判据与区别，本页只管平台
	- [[CI-CD流程]] — 用它搭出来的流水线
	- [[DevOps]] — 组织层，本页只到工具层
- **外部资料**
	- [Workflow syntax](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions) — 字段与表达式的真值
	- [Events that trigger workflows](https://docs.github.com/actions/reference/events-that-trigger-workflows) — 各事件能拿到哪些上下文

### 待探索

- [ ] 权限模型没写清：`permissions:` 的粒度、environment 的 secrets 隔离与审批，现在只有零散印象
- [ ] 自建 runner 的隔离风险：它跑在谁的机器上、能不能碰内网、坏了怎么重建
- [ ] 计费差异：私有仓库消耗分钟数、公开仓库免费，这条影响「要不要把 CI 拆成多个 job」
