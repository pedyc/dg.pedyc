---
title: 2025Q1-学习Github Actions
tags: [DevOps, CI/CD]
date-created: 2025-01-01
date-modified: 2025-04-14
status: 进行中
area: ["[[00专业技术领域]]"]
cycle: 2025/01/01 - 2025/03/31
type: [project]
---

## 🎯 核心靶心

- [ ] **掌握 GitHub Actions 核心能力**（实现 5+ 自动化工作流）
- [ ] **成功标准**：在 [[项目矩阵]] 中落地 CI/CD 流水线，并输出 [[GitHub Actions最佳实践]]

## 🗺️ 战略地图

- **KR1**：系统性学习（权重 30%）
	- 通读 GitHub 官方文档核心章节
	- 完成 1 个专项课程（标注：Udemy《Advanced GitHub Actions》）
- **KR2**：实战集成（权重 50%）
	- 为 3 类项目配置工作流（前端/后端/文档站点）
	- 实现多环境部署（开发/预发/生产）
- **KR3**：效能优化（权重 20%）
	- 构建可复用的 Action 模板库
	- 整理 [[自动化流水线性能调优指南]]

---

## 🛠️ 执行引擎

### 阶段一：学习 GithubActions 基础（2025/01/01 - 2025/01/10）

- [ ] Github Actions 的工作流程 👉[[16-关于工作流程 - GitHub 文档@annote|srAnnote@关于工作流程 - GitHub 文档]]
- [ ] 缓存工作流👉[[17-缓存依赖项以加快工作流程 - GitHub 文档@annote|srAnnote@缓存依赖项以加快工作流程 - GitHub 文档]]
- [ ] 收集 [[范例工作流库]]（精选社区 Top20 案例）

### 阶段二：Github Actions 实战（2025/01/11 - 2025/03/25）

- [ ] **每日固定动作**：Review 一个复杂工作流并注释原理
- [ ] **关键里程碑**：
	- 2025/02/10：为 React 项目实现自动 Lint+Build+Deploy（链接到 [[项目1-前端流水线]]）
	- 2025/03/15：通过 Matrix 策略实现多版本 Python 测试（链接到 [[压力测试报告]]）

### 阶段三：Github Actions 进阶（2025/03/26 - 2025/03/31）

- [ ] 封装 [[自定义Composite Action模板]]
- [ ] 归档所有工作流配置至 [[GitHub-Actions-Playbook]]

---

## 📦 关联资源

- [Github官方指南](https://docs.github.com/en/actions) 📚 核心工具（场景：YAML 语法/环境变量）
- 《GitHub Actions: Beyond the Basics》📘 书籍（推荐指数★★★★☆）
- [[StackOverflow-GHA标签]] 💬 应急预案（触发条件：工作流报错排查）

## 🧩 成果与交付物

- [[Github Actions新手指南]]
- [[自动化流水线设计文档]]💎
- [[可复用Action模板库]]💎
- [[多环境部署checklist]]💎

---

## 💡 项目总结

### 2025/02/20

🚩 **突破进展**：成功通过 Artifact 实现跨 Job 数据传递
👺 **关键障碍**：缓存依赖导致构建结果不一致
🔄 **策略调整**：引入 `actions/cache` 精准控制缓存键

### 2025/03/20

🚩 **突破进展**：利用 Slack Action 实现部署状态实时通知
👺 **关键障碍**：权限作用域不足触发安全拦截
🔄 **策略调整**：采用 Fine-grained PAT 替代传统 Token

---

## ✅ 结算检查清单

- [ ] 所有工作流通过 [[端到端测试]]
- [ ] 文档可读性 Peer Review
- [ ] 模板库同步至 [[团队知识共享平台]]
