---
title: Claude Code 如何工作
date-created: 2026-03-03
date-modified: 2026-03-25
---

> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

## Claude Code 如何工作

> 了解 [代理循环](#代理循环)、内置工具以及 Claude Code 如何与您的项目交互。

Claude Code 是一个在您的终端中运行的代理助手。虽然它在编码方面表现出色，但它可以帮助您完成从命令行可以做的任何事情：编写文档、运行构建、搜索文件、研究主题等。

本指南涵盖核心架构、内置功能和 [有效使用 Claude Code 的提示](#work-effectively-with-claude-code)。有关分步演练，请参阅 [常见工作流](/zh-CN/common-workflows)。有关 skills、MCP 和 hooks 等可扩展性功能，请参阅 [扩展 Claude Code](/zh-CN/features-overview)。

### 代理循环

当您给 Claude 一个任务时，它会经历三个阶段：**收集上下文**、**采取行动**和**验证结果**。这些阶段相互融合。Claude 始终使用工具，无论是搜索文件以了解您的代码、编辑以进行更改，还是运行测试以检查其工作。

![[d93a75128019bc05e27a6a3f72afc9e5_MD5.jpg]]

循环会根据您的要求进行调整。关于您代码库的问题可能只需要收集上下文。错误修复会循环通过所有三个阶段多次。重构可能涉及广泛的验证。Claude 根据从前一步学到的内容决定每一步需要什么，将数十个操作链接在一起并沿途进行纠正。

您也是这个循环的一部分。您可以在任何时刻中断以引导 Claude 朝不同方向发展、提供额外上下文或要求它尝试不同的方法。Claude 自主工作但对您的输入保持响应。

代理循环由两个组件驱动：[推理的模型](#models) 和 [采取行动的工具](#tools)。Claude Code 充当围绕 Claude 的**代理工具**：它提供工具、上下文管理和执行环境，将语言模型转变为能力强大的编码代理。

#### Models

Claude Code 使用 Claude 模型来理解您的代码并推理任务。Claude 可以读取任何语言的代码、理解组件如何连接，以及找出需要改变什么来实现您的目标。对于复杂任务，它将工作分解为步骤、执行它们，并根据学到的内容进行调整。

[多个模型](/zh-CN/model-config) 可用，具有不同的权衡。Sonnet 可以很好地处理大多数编码任务。Opus 为复杂的架构决策提供更强的推理能力。在会话期间使用 `/model` 切换或使用 `claude --model <name>` 启动。

当本指南说 "Claude 选择 " 或 "Claude 决定 " 时，是模型在进行推理。

#### Tools

工具是使 Claude Code 成为代理的原因。没有工具，Claude 只能用文本回应。有了工具，Claude 可以采取行动：读取您的代码、编辑文件、运行命令、搜索网络并与外部服务交互。每个工具使用都会返回信息，反馈到循环中，告知 Claude 的下一个决定。

内置工具通常分为四类，每一类代表不同类型的代理能力。

| 类别       | Claude 可以做什么                                                                   |
| -------- | ------------------------------------------------------------------------------ |
| **文件操作** | 读取文件、编辑代码、创建新文件、重命名和重新组织                                                       |
| **搜索**   | 按模式查找文件、使用正则表达式搜索内容、探索代码库                                                      |
| **执行**   | 运行 shell 命令、启动服务器、运行测试、使用 git                                                  |
| **网络**   | 搜索网络、获取文档、查找错误消息                                                               |
| **代码智能** | 编辑后查看类型错误和警告、跳转到定义、查找引用（需要 [代码智能插件](/zh-CN/discover-plugins#code-intelligence)） |

这些是主要功能。Claude 还有用于生成 subagents、询问您问题和其他编排任务的工具。有关完整列表，请参阅 [Claude 可用的工具](/zh-CN/settings#tools-available-to-claude)。

Claude 根据您的提示和沿途学到的内容选择使用哪些工具。当您说 " 修复失败的测试 " 时，Claude 可能会：

1. 运行测试套件以查看失败的内容
2. 读取错误输出
3. 搜索相关源文件
4. 读取这些文件以理解代码
5. 编辑文件以修复问题
6. 再次运行测试以验证

每个工具使用都给 Claude 新信息，告知下一步。这就是代理循环的实际应用。

**扩展基本功能：** 内置工具是基础。您可以使用 [skills](/zh-CN/skills) 扩展 Claude 知道的内容、使用 [MCP](/zh-CN/mcp) 连接到外部服务、使用 [hooks](/zh-CN/hooks) 自动化工作流，以及使用 [subagents](/zh-CN/sub-agents) 卸载任务。这些扩展形成了核心代理循环之上的一层。有关为您的需求选择正确扩展的指导，请参阅 [扩展 Claude Code](/zh-CN/features-overview)。

### Claude 可以访问什么

当您在目录中运行 `claude` 时，Claude Code 可以访问：

* **您的项目。** 您目录和子目录中的文件，以及其他地方有您许可的文件。
* **您的终端。** 您可以运行的任何命令：构建工具、git、包管理器、系统实用程序、脚本。如果您可以从命令行做到，Claude 也可以。
* **您的 git 状态。** 当前分支、未提交的更改和最近的提交历史。
* **您的 [CLAUDE.md](/zh-CN/memory)。** 一个 markdown 文件，您可以在其中存储项目特定的说明、约定和 Claude 应该在每个会话中了解的上下文。
* **您配置的扩展。** 用于外部服务的 [MCP servers](/zh-CN/mcp)、用于工作流的 [skills](/zh-CN/skills)、用于委派工作的 [subagents](/zh-CN/sub-agents) 和用于浏览器交互的 [Claude in Chrome](/zh-CN/chrome)。

因为 Claude 看到您的整个项目，它可以跨越它工作。当您要求 Claude" 修复身份验证错误 " 时，它搜索相关文件、读取多个文件以理解上下文、跨它们进行协调编辑、运行测试以验证修复，并在您要求时提交更改。这与只看到当前文件的内联代码助手不同。

### 环境和接口

上面描述的代理循环、工具和功能在您使用 Claude Code 的任何地方都是相同的。改变的是代码执行的位置以及您与它交互的方式。

#### 执行环境

Claude Code 在三个环境中运行，每个环境对代码执行位置有不同的权衡。

| 环境       | 代码运行位置           | 用例                |
| -------- | ---------------- | ----------------- |
| **本地**   | 您的机器             | 默认。完全访问您的文件、工具和环境 |
| **云**    | Anthropic 管理的虚拟机 | 卸载任务、处理您本地没有的仓库   |
| **远程控制** | 您的机器，从浏览器控制      | 使用网络 UI 同时保持一切本地  |

#### 接口

您可以通过终端、[桌面应用](/zh-CN/desktop)、[IDE 扩展](/zh-CN/ide-integrations)、[claude.ai/code](https://claude.ai/code)、[远程控制](/zh-CN/remote-control)、[Slack](/zh-CN/slack) 和 [CI/CD 管道](/zh-CN/github-actions) 访问 Claude Code。接口决定了您如何看到和与 Claude 交互，但底层代理循环是相同的。有关完整列表，请参阅 [在任何地方使用 Claude Code](/zh-CN/overview#use-claude-code-everywhere)。

### 使用会话

Claude Code 在您工作时将您的对话保存在本地。每条消息、工具使用和结果都被存储，这使得 [回退](#undo-changes-with-checkpoints)、[恢复和分叉](#resume-or-fork-sessions) 会话成为可能。在 Claude 进行代码更改之前，它还会对受影响的文件进行快照，以便您在需要时可以恢复。

**会话是独立的。** 每个新会话都以新的上下文窗口开始，没有来自以前会话的对话历史。Claude 可以使用 [自动内存](/zh-CN/memory#auto-memory) 跨会话保持学习，您可以在 [CLAUDE.md](/zh-CN/memory) 中添加您自己的持久说明。

#### 跨分支工作

每个 Claude Code 对话都是绑定到您当前目录的会话。当您恢复时，您只看到来自该目录的会话。

Claude 看到您当前分支的文件。当您切换分支时，Claude 看到新分支的文件，但您的对话历史保持不变。Claude 记得您讨论过的内容，即使在切换后也是如此。

由于会话绑定到目录，您可以通过使用 [git worktrees](/zh-CN/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) 运行并行 Claude 会话，这为各个分支创建单独的目录。

#### 恢复或分叉会话

当您使用 `claude --continue` 或 `claude --resume` 恢复会话时，您使用相同的会话 ID 从中断处继续。新消息附加到现有对话。您的完整对话历史被恢复，但会话范围的权限不会。您需要重新批准这些。

<img src="https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=808da1b213c731bf98874c75981d688b" alt="会话连续性：恢复继续相同的会话，分叉创建具有新 ID 的新分支。" data-og-width="560" width="560" data-og-height="280" height="280" data-path="images/session-continuity.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?w=280&fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=ba75f64bc571f3ef84a3237ef795bf22 280w, https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?w=560&fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=343ad422a171a2b909c87ed01c768745 560w, https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?w=840&fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=afce54d5e3b08cdb54d506332462b74c 840w, https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?w=1100&fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=28648c0a04cf7aef2de02d1c98491965 1100w, https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?w=1650&fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=a5287882beedaea54af606f682e4818d 1650w, https://mintcdn.com/claude-code/TBPmHzr19mDCuhZi/images/session-continuity.svg?w=2500&fit=max&auto=format&n=TBPmHzr19mDCuhZi&q=85&s=f392dbe67b63eead4a2aae67adfbfdbe 2500w" />

要分支并尝试不同的方法而不影响原始会话，请使用 `--fork-session` 标志：

```bash  theme={null}
claude --continue --fork-session
```

这创建一个新的会话 ID，同时保留到该点的对话历史。原始会话保持不变。与恢复一样，分叉的会话不继承会话范围的权限。

**在多个终端中的相同会话**：如果您在多个终端中恢复相同的会话，两个终端都写入相同的会话文件。来自两者的消息会交错，就像两个人在同一个笔记本中写字。没有任何东西损坏，但对话变得混乱。每个终端在会话期间只看到自己的消息，但如果您稍后恢复该会话，您会看到所有内容交错。对于从相同起点的并行工作，使用 `--fork-session` 为每个终端提供自己的干净会话。

#### 上下文窗口

==Claude 的上下文窗口保存您的对话历史、文件内容、命令输出、[CLAUDE.md](/zh-CN/memory)、加载的 skills 和系统说明。当您工作时，上下文填满。Claude 自动压缩，但对话早期的说明可能会丢失。将持久规则放在 CLAUDE.md 中，并运行 `/context` 以查看什么在占用空间。==

##### 当上下文填满时

Claude Code 在您接近限制时自动管理上下文。它首先清除较旧的工具输出，然后在需要时总结对话。您的请求和关键代码片段被保留；对话早期的详细说明可能会丢失。将持久规则放在 CLAUDE.md 中，而不是依赖对话历史。

要控制在压缩期间保留的内容，请向 CLAUDE.md 添加 "Compact Instructions" 部分或使用焦点运行 `/compact`（如 `/compact focus on the API changes`）。

运行 `/context` 以查看什么在占用空间。MCP servers 将工具定义添加到每个请求，因此几个服务器可以在您开始工作之前消耗大量上下文。运行 `/mcp` 以检查每个服务器的成本。

##### 使用 skills 和 subagents 管理上下文

除了压缩，您可以使用其他功能来控制什么加载到上下文中。

==[Skills](/zh-CN/skills) 按需加载。Claude 在会话开始时看到 skill 描述，但完整内容仅在使用 skill 时加载。对于您手动调用的 skills，设置 `disable-model-invocation: true` 以将描述保留在上下文之外，直到您需要它们。==

==[Subagents](/zh-CN/sub-agents) 获得自己的新上下文，完全独立于您的主对话。他们的工作不会膨胀您的上下文。完成后，他们返回摘要。这种隔离是为什么 subagents 有助于长会话。==

有关每个功能的成本，请参阅 [上下文成本](/zh-CN/features-overview#understand-context-costs)，以及有关管理上下文的提示，请参阅 [减少令牌使用](/zh-CN/costs#reduce-token-usage)。

### 使用检查点和权限保持安全

Claude 有两个安全机制：检查点让您撤销文件更改，权限控制 Claude 可以在不询问的情况下做什么。

#### 使用检查点撤销更改

==**每个文件编辑都是可逆的。** 在 Claude 编辑任何文件之前，它会对当前内容进行快照。如果出现问题，按两次 `Esc` 以回退到之前的状态，或要求 Claude 撤销。==

检查点是会话本地的，独立于 git。它们仅涵盖文件更改。影响远程系统（数据库、API、部署）的操作无法检查点，这就是为什么 Claude 在运行具有外部副作用的命令之前询问。

#### 控制 Claude 可以做什么

按 `Shift+Tab` 循环通过权限模式：

* **默认**：Claude 在文件编辑和 shell 命令之前询问
* **自动接受编辑**：Claude 编辑文件而不询问，仍然询问命令
* **Plan Mode**：Claude 仅使用只读工具，创建您可以在执行前批准的计划

==您也可以在 `.claude/settings.json` 中允许特定命令，以便 Claude 不会每次都询问。这对于受信任的命令（如 `npm test` 或 `git status`）很有用。设置可以从组织范围的策略范围到个人偏好。有关详细信息，请参阅 [权限](/zh-CN/permissions)。==

***

### 有效使用 Claude Code

这些提示可帮助您从 Claude Code 获得更好的结果。

#### 向 Claude Code 寻求帮助

Claude Code 可以教您如何使用它。提出问题，如 " 我如何设置 hooks？" 或 " 构建我的 CLAUDE.md 的最佳方式是什么？"Claude 会解释。

内置命令也会指导您完成设置：

* `/init` 引导您为项目创建 CLAUDE.md
* `/agents` 帮助您配置自定义 subagents
* `/doctor` 诊断您的安装的常见问题

#### 这是一个对话

Claude Code 是对话式的。您不需要完美的提示。从您想要的开始，然后细化：

```bash
> 修复登录错误

[Claude 调查，尝试一些东西]

> 这不太对。问题在于会话处理。

[Claude 调整方法]
```

当第一次尝试不对时，您不会重新开始。您迭代。

##### 中断和引导

您可以在任何时刻中断 Claude。如果它走错了路，只需输入您的更正并按 Enter。Claude 将停止正在做的事情并根据您的输入调整其方法。您不必等待它完成或重新开始。

#### 预先具体

您的初始提示越精确，您需要的更正就越少。参考特定文件、提及约束并指向示例模式。

```bash
> 结账流程对于持卡过期的用户来说已损坏。
> 检查 src/payments/ 中的问题，特别是令牌刷新。
> 首先编写失败的测试，然后修复它。
```

模糊的提示，如 " 修复登录错误 " 有效，但您会花更多时间引导。具体的提示，如上面的提示，通常在第一次尝试时成功。

#### 给 Claude 一些东西来验证

当 Claude 可以检查自己的工作时，它表现更好。包括测试用例、粘贴预期 UI 的屏幕截图或定义您想要的输出。

```bash
> 实现 validateEmail。测试用例：'user@example.com' → true，
> 'invalid' → false，'user@.com' → false。之后运行测试。
```

对于视觉工作，粘贴设计的屏幕截图并要求 Claude 将其实现与其进行比较。

#### 在实现之前探索

对于复杂问题，将研究与编码分开。使用计划模式（按两次 `Shift+Tab`）首先分析代码库：

```bash
> 读取 src/auth/ 并理解我们如何处理会话。
> 然后为添加 OAuth 支持创建计划。
```

审查计划，通过对话细化它，然后让 Claude 实现。这种两阶段方法比直接跳到代码产生更好的结果。

#### 委派，不要指示

想象委派给一个有能力的同事。提供上下文和方向，然后相信 Claude 会弄清楚细节：

```bash
> 结账流程对于持卡过期的用户来说已损坏。
> 相关代码在 src/payments/ 中。您可以调查并修复它吗？
```

您不需要指定要读取哪些文件或运行什么命令。Claude 会弄清楚。
