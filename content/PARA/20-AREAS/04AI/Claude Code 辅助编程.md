---
title: Claude Code 辅助编程
description: Claude Code 的安装配置和核心命令使用指南
tags: [AI/编程辅助, 工具/Claude]
date-created: 2025-08-26
date-modified: 2025-08-28
content-type: method
keywords: [Claude Code, AI编程, 命令行工具]
para: area
zettel: permanent
---

## 一、环境准备与安装

### 安装步骤

1. **安装 Node.js** (v18+)

	 ```bash
   # 使用 nvm 安装
   nvm install 18
   nvm use 18
   ```

2. **安装 Claude Code**

	 ```bash
   npm install -g @anthropic-ai/claude
   ```

3. **可选安装** - Claude Code Router

	 ```bash
   # 用于多模型切换或离线使用
   npm install -g claude-code-router
   ```

### 验证安装

```bash
claude --version
claude --help
```

## 二、核心命令指南

### 🗂 目录与项目管理

`/add-dir` - 添加工作目录
`/init` - 初始化代码库文档 (CLAUDE.md)

### ⚙️ 配置与设置

`/config` - 打开配置面板
`/model` - 设置 AI 模型 (Claude-3 系列)
`/output-style` - 设置输出样式
`/output-style:new` - 创建自定义输出样式
`/vim` - Vim/普通模式切换

### 🔍 状态与诊断

`/status` - 显示完整状态信息
`/context` - 可视化上下文使用
`/cost` - 显示会话成本
`/doctor` - 诊断安装问题

### 💬 会话管理

`/clear` - 清除对话历史
`/compact` - 清除历史但保留摘要
`/export` - 导出对话内容
`/resume` - 恢复之前对话

### 🔐 账户与权限

`/login` - Anthropic 账户登录
`/logout` - 退出登录
`/permissions` - 管理工具权限
`/upgrade` - 升级到 Max 版本

### 🛠 开发工具集成

`/ide` - IDE 集成管理
`/mcp` - MCP 服务器管理
`/hooks` - 工具事件钩子配置
`/terminal-setup` - 终端键绑定设置

### 📊 代码审查与分析

`/review` - 代码审查
`/security-review` - 安全审查
`/pr-comments` - GitHub PR 评论

### 🔧 高级功能

`/agents` - 代理配置管理
`/bashes` - 后台 shell 管理
`/memory` - 记忆文件编辑

## 三、高效工作流

### 启动流程

```bash
# 进入项目目录
cd your-project

# 启动 Claude Code
claude

# 或指定工作目录
claude --dir /path/to/project
```

### 交互策略

> [!tip]
> - **从宽到窄**: 先问宽泛问题，再细化具体需求
> - **上下文利用**: 使用 `/compact` 保持重要上下文
> - **多轮对话**: 通过 `/resume` 继续复杂任务

### 典型使用场景

1. **代码生成**: 描述功能需求 → 生成代码
2. **代码解释**: 粘贴代码段 → 请求解释
3. **错误调试**: 提供错误信息 → 获取解决方案
4. **文档编写**: 提供代码 → 生成文档
5. **代码重构**: 现有代码 → 优化建议

## 四、最佳实践

### ✅ 推荐做法

- 定期使用 `/compact` 优化上下文使用
- 为不同项目创建独立工作目录 (`/add-dir`)
- 使用 `/output-style` 设置适合的输出格式
- 利用 `/memory` 功能保存重要信息

### ⚠️ 注意事项

- 注意上下文长度限制，及时清理历史
- 复杂任务建议分步进行，避免一次性请求
- 生产环境代码需人工审核后再使用
- 关注 `/cost` 显示的使用成本

### 🚀 高级技巧

```bash
# 使用特定模型
/model claude-3-opus-20240229

# 创建自定义输出样式
/output-style:new
```

## 五、故障排除

### 常见问题解决

1. **安装失败**
	 - 检查 Node.js 版本 (需要 v18+)
	 - 运行 `/doctor` 诊断问题

2. **认证问题**
	 - 使用 `/login` 重新登录
	 - 检查网络连接

3. **上下文不足**
	 - 使用 `/compact` 压缩历史
	 - 分步骤处理复杂任务

4. **性能问题**
	 - 检查 `/status` 中的连接状态
	 - 考虑升级到 Max 版本 (`/upgrade`)

## 六、实用示例

### 代码生成示例

```bash
请帮我生成一个 Python 函数，用于计算斐波那契数列的前 n 项
```

### 代码审查示例

```bash
请审查以下代码的安全性和性能问题：
[粘贴代码]
```

### 文档生成示例

```bash
请为这个函数生成详细的文档字符串：
[粘贴函数代码]
```

## 七、版本更新

### 更新方法

```bash
# 更新 Claude Code
npm update -g @anthropic-ai/claude

# 查看更新日志
/release-notes
```

## 八、相关资源

### 官方文档

- [Claude Code 官方文档](https://docs.anthropic.com/claude/code)
- [API 参考](https://docs.anthropic.com/claude/reference)

### 社区资源

- [GitHub 讨论区](https://github.com/anthropics/claude-code/discussions)
- [Stack Overflow 标签](https://stackoverflow.com/questions/tagged/claude-code)

### 学习材料

- [[Claude Code 实战案例]]
- [[AI编程工具对比分析]]
- [[编程效率提升方法]]

*最后更新: 2025-08-27*
