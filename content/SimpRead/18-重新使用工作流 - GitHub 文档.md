---
title: 18-重新使用工作流 - GitHub 文档
aliases: [重新使用工作流 - GitHub 文档]
tags: []
date-created: 2025-03-11
date-modified: 2025-03-11
desc: 了解如何通过重用现有工作流程来避免在创建工作流程时重复。
url: https://docs.github.com/zh/actions/sharing-automations/reusing-workflows
---

了解如何通过重用现有工作流程来避免在创建工作流程时重复。

## [概述](#overview)

您可以使工作流程可重复使用，而不是从一个工作流程复制并粘贴到另一个工作流程。 然后，您和有权访问可重用工作流程的任何人都可以从另一个工作流程调用可重用工作流程。

重用工作流程可避免重复。 这使得工作流程更易于维护，并允许您通过构建他人的工作来更快地创建新工作流程，就像您对操作所做的那样。 工作流重用还通过帮助你使用设计良好、已经过测试且已证明有效的工作流来促进最佳做法。 您的组织可以构建可集中维护的可重用工作流程库。

下图显示了使用可重用工作流的正在进行的工作流运行。

* 在该图左侧的三个生成作业均成功完成后，将运行一个名为 " 部署 " 的依赖作业。
* " 部署 " 作业调用包含三个作业的可重用工作流：" 暂存 "、" 审阅 " 和 " 生产 "。
* " 生产 " 部署作业仅在 " 暂存 " 作业成功完成后运行。
* 当作业以环境为目标时，工作流运行会显示一个进度条，其中显示作业中的步骤数。 在下图中，" 生产 " 作业包含 8 个步骤，目前正在处理步骤 6。
* 使用可重用工作流程运行部署作业，可以为每个构建运行这些作业，而无需在工作流程中重复代码。

![[SimpRead/_resources/18-重新使用工作流 - GitHub 文档/b23fbd9db0bf05696a654678cef75453_MD5.jpg]]

使用其他工作流程的工作流程称为 " 调用方 " 工作流程。 可重用工作流程是 " 被调用 " 工作流程。 一个调用方工作流程可以使用多个被调用的工作流程。 每个被调用的工作流程都在一行中引用。 结果是，调用方工作流程文件可能只包含几行 YAML，但在运行时可能会执行大量任务。 当您重用工作流程时，将使用整个被调用的工作流程，就像它是调用方工作流程的一部分一样。

如果重用其他存储库中的工作流程，则被调用工作流程中的任何操作都将像调用方工作流程的一部分一样运行。 例如，如果被调用的工作流使用 `actions/checkout`，则该操作将签出托管调用方工作流（而不是被调用的工作流）的存储库的内容。

当可重用工作流由调用方工作流触发时，`github` 上下文始终与调用方工作流关联。 调用的工作流会自动授予对 `github.token` 和 `secrets.GITHUB_TOKEN` 访问权限。 有关 `github` 上下文的详细信息，请参阅 "[访问有关工作流运行的上下文信息](https://docs.github.com/zh/actions/learn-github-actions/contexts#github-context)"。

您可以将 GitHub Actions 工作流程中引用的重用工作流程视为包含工作流程的仓库依赖图中的依赖项。 有关详细信息，请参阅 "[关于依赖项关系图](https://docs.github.com/zh/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph)"。

### [可重用工作流和复合操作](#reusable-workflows-and-composite-actions)

可重用工作流和复合操作均有助于避免重复。 可重用工作流允许你重用包含多个作业和步骤的整个工作流，而复合操作则合并了多个步骤，然后你可以在作业步骤中运行这些步骤，就像执行任何其他操作一样。 有关详细信息，请参阅 "[避免重复](https://docs.github.com/zh/actions/using-workflows/avoiding-duplication)"。

### [可重用工作流和工作流模板](#reusable-workflows-and-workflow-templates)

组织中所有有权创建工作流的人员可利用工作流模板，更快、更轻松地创建工作流。 当用户创建新的工作流时，可以选择一个工作流模板，并且将为其完成编写工作流的部分或全部工作。 在工作流模板中，还可以引用可重用的工作流，以便用户能够轻松地从重用集中管理的工作流代码中受益。 如果在引用可重用工作流时使用提交 SHA，则可以确保重用该工作流的每个人都将始终使用相同的 YAML 代码。 但是，如果通过标记或分支引用可重用工作流程，请确保您可以信任该版本的工作流程。 有关详细信息，请参阅 "[GitHub Actions 的安全强化](https://docs.github.com/zh/actions/security-guides/security-hardening-for-github-actions#reusing-third-party-workflows)"。

有关详细信息，请参阅 "[为组织创建工作流模板](https://docs.github.com/zh/actions/using-workflows/creating-starter-workflows-for-your-organization)"。

## [访问可重复使用的工作流程](#access-to-reusable-workflows)

如果满足以下任意条件，则可重用工作流程可由另一个工作流使用：

* 这两个工作流程位于同一存储库中。
* 被调用的工作流存储在 GitHub Enterprise Server 上的公共存储库，并且 organization 允许您使用公共可重用工作流。
* 被调用的工作流存储在专用存储库中，该存储库的设置允许对其进行访问。 有关详细信息，请参阅 [与组织共享操作和工作流](https://docs.github.com/zh/actions/creating-actions/sharing-actions-and-workflows-with-your-organization) 和 [从专用存储库共享操作和工作流](https://docs.github.com/zh/actions/creating-actions/sharing-actions-and-workflows-from-your-private-repository)。

下表显示了可重用工作流对调用方工作流的可访问性，具体取决于主机存储库的可见性。

<table><thead><tr><th scope="col">调用方存储库</th><th scope="col">可访问的工作流存储库</th></tr></thead><tbody><tr><td><code>private</code></td><td><code>private</code> 以及 <code>public</code></td></tr><tr><td><code>public</code></td><td><code>public</code></td></tr></tbody></table>

调用方存储库的 " 操作设置 " 页面上的 " 操作权限 " 必须配置为允许使用操作和可重用工作流 - 请参阅 "[管理存储库的 GitHub Actions 设置](https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#allowing-select-actions-and-reusable-workflows-to-run)"。

对于专用存储库，必须在所调用工作流存储库的 " 操作设置 " 页面上将访问策略显式配置为允许从包含调用方工作流的存储库进行访问 - 请参阅 "[管理存储库的 GitHub Actions 设置](https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#allowing-access-to-components-in-a-private-repository)"。

Note

为了增强安全性，GitHub Actions 不支持对操作或可重用工作流进行重定向。 这意味着，当所有者、操作存储库的名称或操作名称发生更改时，使用该操作并具有先前名称的任何工作流都将失败。

## [使用运行器](#using-runners)

### [使用 GitHub 托管的运行器](#using-github-hosted-runners)

始终仅使用调用方的上下文来评估 GitHub 托管的运行器的分配。 GitHub 托管的运行器的计费始终与调用方相关联。 调用方工作流程不能使用被调用存储库中 GitHub 托管的运行器。 有关详细信息，请参阅 "[使用 GitHub 托管的运行器](https://docs.github.com/zh/actions/using-github-hosted-runners/about-github-hosted-runners)"。

### [使用自托管的运行器](#using-self-hosted-runners)

与调用方工作流程属于同一用户或组织 的被调用工作流程可以从调用方的上下文中访问自托管运行器。 这意味着被调用的工作流程可以访问自托管运行器，这些运行器具有以下特点：

* 在调用方存储库中
* 在调用方存储库的组织 中，前提是运行器已可供调用方存储库使用

## [限制](#limitations)

* 最多可以连接到四个级别的工作流。 有关详细信息，请参阅 "[嵌套可重用工作流](#nesting-reusable-workflows)"。
* 最多可以从单个工作流文件调用 20 个唯一的可重用工作流。 此限制包括可能从顶层调用方工作流文件开始调用的任何嵌套可重用工作流树。

例如，top-level-caller-workflow.yml → called-workflow-1.yml → called-workflow-2.yml 计为 2 个可重用工作流 。

* 对于在调用方工作流中的工作流级别定义的 `env` 上下文，在其中设置的任何环境变量都不会传播到被调用的工作流。 有关详细信息，请参阅 [在变量中存储信息](https://docs.github.com/zh/actions/learn-github-actions/variables) 和 [访问有关工作流运行的上下文信息](https://docs.github.com/zh/actions/learn-github-actions/contexts#env-context)。
* 同样，对于在被调用的工作流中定义的 `env` 上下文，无法在调用方工作流的 `env` 上下文中访问在其中设置的环境变量。 必须改用可重用工作流的输出。 有关详细信息，请参阅 "[使用可重用工作流的输出](#using-outputs-from-a-reusable-workflow)"。
* 若要在多个工作流中重复使用变量，请在组织、存储库或环境级别设置变量，并使用 `vars` 上下文来引用它们。 有关详细信息，请参阅 "[在变量中存储信息](https://docs.github.com/zh/actions/learn-github-actions/variables)" 和 "[访问有关工作流运行的上下文信息](https://docs.github.com/zh/actions/learn-github-actions/contexts#vars-context)"。
* 可重用工作流直接在作业中调用，而不是从作业步骤中调用。 因此，不能使用 `GITHUB_ENV` 将值传递给调用方工作流中的作业步骤。

## [创建可重用的工作流程](#creating-a-reusable-workflow)

可重用工作流程是 YAML 格式的文件，与任何其他工作流程文件非常相似。 与其他工作流文件一样，可以在存储库的 `.github/workflows` 目录中找到可重用的工作流。 不支持 `workflows` 目录的子目录。

若要使工作流可重用，`on` 的值必须包括 `workflow_call`：

```bash
on:
workflow_call:
```

### [在可重用工作流程中使用输入和机密](#using-inputs-and-secrets-in-a-reusable-workflow)

您可以定义输入和机密，这些输入和机密可以从调用方工作流程传递，然后在被调用的工作流程中使用。 在可重用工作流程中使用输入或机密有三个阶段。

1. 在可重用工作流中，使用 `inputs` 和 `secrets` 关键字定义将从调用方工作流传递的输入或机密。

```bash
on:  
	workflow_call:  
		inputs:  
			config-path:  
				required: true  
				type: string  
		secrets:  
			personal_access_token:  
				required: true

```bash

有关定义输入和机密的语法的详细信息，请参阅 [`on.workflow_call.inputs`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputs) 和 [`on.workflow_call.secrets`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callsecrets)。


2. 在可重用工作流中，引用在上一步的 `on` 键中定义的输入或机密。

```bash
jobs:  
	reusable_workflow_job:  
		runs-on: ubuntu-latest  
		steps:  
		- uses: actions/labeler@v4  
			with:  
				repo-token: ${{ secrets.personal_access_token }}  
				configuration-path: ${{ inputs.config-path }}

```bash

在上面的示例中，`personal_access_token` 是在存储库或组织级别定义的机密。

Warning

无法从调用方工作流传递环境机密，因为 `on.workflow_call` 不支持 `environment` 关键字 (keyword)。 如果在作业级别的可重用工作流中包含 `environment`，则将使用环境机密，而不是从调用方工作流传递的机密。 有关详细信息，请参阅 [管理部署环境](https://docs.github.com/zh/actions/deployment/targeting-different-environments/managing-environments-for-deployment#environment-secrets) 和 [GitHub Actions 的工作流语法](https://docs.github.com/zh/actions/writing-workflows/workflow-syntax-for-github-actions#onworkflow_call)。


3. 传递来自调用方工作流程的输入或机密。

若要将命名输入传递到调用的工作流，请在作业中使用 `with` 关键字。 使用 `secrets` 关键字传递命名机密。 对于输入，输入值的数据类型必须与调用的工作流中指定的类型（布尔值、数字或字符串）匹配。

```bash
jobs:  
	call-workflow-passing-data:  
		uses: octo-org/example-repo/.github/workflows/reusable-workflow.yml@main  
		with:  
			config-path:.github/labeler.yml  
		secrets:  
			personal_access_token: ${{ secrets.token }}

```bash

在同一组织或企业中调用可重用工作流的工作流可以使用 `inherit` 关键字隐式传递机密。

```bash
jobs:  
	call-workflow-passing-data:  
		uses: octo-org/example-repo/.github/workflows/reusable-workflow.yml@main  
		with:  
			config-path:.github/labeler.yml  
		secrets: inherit

```bash

### [示例可重用工作流程](#example-reusable-workflow)

此名为 `workflow-B.yml` 的可重用工作流文件（稍后将在 [调用方工作流示例](#example-caller-workflow) 中引用此文件）从调用方工作流中获取输入字符串和机密，并在操作中使用它们。

YAML

```bash
name: Reusable workflow example

on:
workflow_call:
inputs:
	config-path:
		required: true
		type: string
secrets:
	token:
		required: true

jobs:
triage:
runs-on: ubuntu-latest
steps:
- uses: actions/labeler@v4
	with:
		repo-token: ${{ secrets.token }}
		configuration-path: ${{ inputs.config-path }}


```

## [调用可重用工作流程](#calling-a-reusable-workflow)

使用 `uses` 关键字调用可重用工作流。 与在工作流程中使用操作不同，您可以直接在作业中调用可重用工作流程，而不是从作业步骤中调用。

[`jobs.<job_id>.uses`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_iduses)

可以使用以下语法之一引用可重用的工作流文件：

* `{owner}/{repo}/.github/workflows/{filename}@{ref}` 用于公共和专用存储库中的可重用工作流。
* `./.github/workflows/{filename}` 用于同一存储库中的可重用工作流。

在第一个选项中，`{ref}` 可以是 SHA、发布标记或分支名称。 如果发布标记和分支具有相同的名称，则发布标记优先于分支名称。 出于稳定性和安全性考虑，使用提交 SHA 是最稳妥的选项。 有关详细信息，请参阅 "[GitHub Actions 的安全强化](https://docs.github.com/zh/actions/security-guides/security-hardening-for-github-actions#reusing-third-party-workflows)"。

如果使用第二个语法选项（不带 `{owner}/{repo}` 和 `@{ref}`），则调用的工作流来自与调用方工作流相同的提交。 不允许使用 `refs/heads` 和 `refs/tags` 等引用前缀。 您不能在此关键词中使用上下文或表达式。

您可以调用多个工作流程，在单独的作业中引用每个工作流程。

```bash
jobs:
call-workflow-1-in-local-repo:
uses: octo-org/this-repo/.github/workflows/workflow-1.yml@172239021f7ba04fe7327647b213799853a9eb89
call-workflow-2-in-local-repo:
uses: ./.github/workflows/workflow-2.yml
call-workflow-in-another-repo:
uses: octo-org/another-repo/.github/workflows/workflow.yml@v1


```

### [将输入和机密传递到可重用的工作流程](#passing-inputs-and-secrets-to-a-reusable-workflow)

若要将命名输入传递到调用的工作流，请在作业中使用 `with` 关键字。 使用 `secrets` 关键字传递命名机密。 对于输入，输入值的数据类型必须与调用的工作流中指定的类型（布尔值、数字或字符串）匹配。

```bash
jobs:
call-workflow-passing-data:
uses: octo-org/example-repo/.github/workflows/reusable-workflow.yml@main
with:
	config-path: .github/labeler.yml
secrets:
	personal_access_token: ${{ secrets.token }}


```

在同一组织或企业中调用可重用工作流的工作流可以使用 `inherit` 关键字隐式传递机密。

```bash
jobs:
call-workflow-passing-data:
uses: octo-org/example-repo/.github/workflows/reusable-workflow.yml@main
with:
	config-path: .github/labeler.yml
secrets: inherit


```

### [将矩阵策略与可重用工作流配合使用](#using-a-matrix-strategy-with-a-reusable-workflow)

使用矩阵策略的作业可以调用可重用工作流。

使用矩阵策略，可以在单个作业定义中使用变量自动创建基于变量组合的多个作业运行。 例如，可以使用矩阵策略将不同输入传递给可重用工作流。 有关矩阵的详细信息，请参阅 "[在工作流中运行作业的变体](https://docs.github.com/zh/actions/using-jobs/using-a-matrix-for-your-jobs)"。

以下示例作业调用可重用工作流，并通过使用值 `[dev, stage, prod]` 定义变量 `target` 来引用矩阵上下文。 它将运行三个作业，变量中的每个值对应一个作业。

YAML

```bash
jobs:
ReuseableMatrixJobForDeployment:
strategy:
	matrix:
		target: [dev, stage, prod]
uses: octocat/octo-repo/.github/workflows/deployment.yml@main
with:
	target: ${{ matrix.target }}


```

### [调用可重用工作流程的作业支持的关键字](#supported-keywords-for-jobs-that-call-a-reusable-workflow)

调用可重用工作流程时，只能在包含调用的作业中使用以下关键字：

* [`jobs.<job_id>.name`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idname)
* [`jobs.<job_id>.uses`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_iduses)
* [`jobs.<job_id>.with`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idwith)
* [`jobs.<job_id>.with.<input_id>`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idwithinput_id)
* [`jobs.<job_id>.secrets`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsecrets)
* [`jobs.<job_id>.secrets.<secret_id>`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretssecret_id)
* [`jobs.<job_id>.secrets.inherit`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretsinherit)
* [`jobs.<job_id>.strategy`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategy)
* [`jobs.<job_id>.needs`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds)
* [`jobs.<job_id>.if`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idif)
* [`jobs.<job_id>.concurrency`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idconcurrency)
* [`jobs.<job_id>.permissions`](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions)

Note

* 如果调用作业中未指定 `jobs.<job_id>.permissions`，则调用的工作流将具有 `GITHUB_TOKEN` 的默认权限。 有关详细信息，请参阅 "[自动令牌身份验证](https://docs.github.com/zh/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)"。
* 从调用方工作流传递的 `GITHUB_TOKEN` 权限只能由被调用的工作流降级（不能升级）。
* 如果使用 `jobs.<job_id>.concurrency.cancel-in-progress: true`，请不要在调用工作流和调用方工作流中使用相同的 `jobs.<job_id>.concurrency.group` 值，因为这将导致已运行的工作流被取消。 调用的工作流在 ${{github.workflow}} 中使用其调用方工作流的名称，因此使用此上下文作为调用方工作流和调用工作流的 `jobs.<job_id>.concurrency.group` 值将导致调用方工作流在调用工作流运行时被取消。

### [示例调用方工作流程](#example-caller-workflow)

此工作流程文件调用两个工作流程文件。 向其中的第二个文件 `workflow-B.yml`（如 [可重用工作流示例](#example-reusable-workflow) 中所示）传递了一个输入 (`config-path`) 和一个机密 (`token`)。

YAML

```bash
name: Call a reusable workflow

on:
pull_request:
branches:
	- main

jobs:
call-workflow:
uses: octo-org/example-repo/.github/workflows/workflow-A.yml@v1

call-workflow-passing-data:
permissions:
	contents: read
	pull-requests: write
uses: octo-org/example-repo/.github/workflows/workflow-B.yml@main
with:
	config-path: .github/labeler.yml
secrets:
	token: ${{ secrets.GITHUB_TOKEN }}


```

## [嵌套可重用工作流](#nesting-reusable-workflows)

最多可以连接四个级别的工作流 - 即顶级调用方工作流和最多三个级别的可重用工作流。 例如：caller-workflow.yml → called-workflow-1.yml → called-workflow-2.yml → called-workflow-3.yml 。 不允许工作流树中存在循环。

在可重用工作流中，可以调用另一个可重用工作流。

YAML

```bash
name: Reusable workflow

on:
workflow_call:

jobs:
call-another-reusable:
uses: octo-org/example-repo/.github/workflows/another-reusable.yml@v1


```

### [将机密传递给嵌套工作流](#passing-secrets-to-nested-workflows)

可以在调用工作流中使用 `jobs.<job_id>.secrets` 将命名机密传递给直接调用的工作流。 或者，可以使用 `jobs.<job_id>.secrets.inherit` 将调用工作流的所有机密传递给直接调用的工作流。 有关详细信息，请参阅上面的 "[重新使用工作流](https://docs.github.com/zh/actions/using-workflows/reusing-workflows#passing-inputs-and-secrets-to-a-reusable-workflow)" 部分和参考文章 "[GitHub Actions 的工作流语法](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idsecretsinherit)"。 机密仅传递给直接调用的工作流，因此在工作流链 A > B > C 中，工作流 C 仅从 A 接收从 A 传递给 B，然后从 B 传递给 C 的机密。

在以下示例中，工作流 A 使用 `inherit` 关键字将其所有机密传递给工作流 B，但工作流 B 仅将一个机密传递给工作流 C。传递给工作流 B 的任何其他机密都不可供工作流 C 使用。

```bash
jobs:
workflowA-calls-workflowB:
uses: octo-org/example-repo/.github/workflows/B.yml@main
secrets: inherit 


```

```bash
jobs:
workflowB-calls-workflowC:
uses: different-org/example-repo/.github/workflows/C.yml@main
secrets:
	repo-token: ${{ secrets.personal_access_token }} 


```

### [访问和权限](#access-and-permissions)

如果初始调用方工作流无法访问任何嵌套工作流，则包含嵌套可重用工作流的工作流会失败。 有关详细信息，请参阅 "[重新使用工作流](https://docs.github.com/zh/actions/using-workflows/reusing-workflows#access-to-reusable-workflows)"。

`GITHUB_TOKEN` 权限在嵌套工作流中只能相同或更严格。 例如，在工作流链 A > B > C 中，如果工作流 A 具有 `package: read` 令牌权限，则 B 和 C 不能具有 `package: write` 权限。 有关详细信息，请参阅 "[自动令牌身份验证](https://docs.github.com/zh/actions/security-guides/automatic-token-authentication)"。

有关如何使用 API 确定特定工作流运行中涉及哪些工作流文件的信息，请参阅 "[监视正在使用哪些工作流](#monitoring-which-workflows-are-being-used)"。

## [使用可重用工作流程的输出](#using-outputs-from-a-reusable-workflow)

可重用工作流程可能会生成要在调用方工作流程中使用的数据。 要使用这些输出，必须将它们指定为可重用工作流的输出。

如果设置输出的可重用工作流使用矩阵策略来执行，则输出会是由矩阵的最后一个成功完成且实际设置值的可重用工作流设置的输出。 这意味着，如果最后一个成功完成可重用工作流为其输出设置空字符串，而倒数第二个成功完成可重用工作流为其输出设置实际值，则输出会包含倒数第二个完成可重用工作流的值。

以下可重用工作流程具有包含两个步骤的单个作业。 在每个步骤中，我们设置一个单词作为输出："hello" 和 "world"。 在作业的 `outputs` 部分，我们将这些步骤输出映射到名为 `output1` 和 `output2` 的作业输出。 然后，在 `on.workflow_call.outputs` 部分中，为工作流本身定义两个输出，一个称为 `firstword`，映射到 `output1`，另一个称为 `secondword`，映射到 `output2`。

必须将 `value` 设置为所调用工作流中作业级输出的值。 步骤级输出必须首先映射到作业级输出，如下所示。

有关详细信息，请参阅 [在作业之间传递信息](https://docs.github.com/zh/actions/using-jobs/defining-outputs-for-jobs#overview) 和 [GitHub Actions 的工作流语法](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_calloutputs)。

YAML

```bash
name: Reusable workflow

on:
workflow_call:

outputs:
	firstword:
		description: "The first output string"
		value: ${{ jobs.example_job.outputs.output1 }}
	secondword:
		description: "The second output string"
		value: ${{ jobs.example_job.outputs.output2 }}

jobs:
example_job:
name: Generate output
runs-on: ubuntu-latest

outputs:
	output1: ${{ steps.step1.outputs.firstword }}
	output2: ${{ steps.step2.outputs.secondword }}
steps:
	- id: step1
		run: echo "firstword=hello" >> $GITHUB_OUTPUT
	- id: step2
		run: echo "secondword=world" >> $GITHUB_OUTPUT


```

现在，我们可以在调用方工作流程中使用输出，就像使用同一工作流程中作业的输出一样。 我们使用在可重用工作流中的工作流级别定义的名称引用输出：`firstword` 和 `secondword`。 在此工作流中，`job1` 调用可重用工作流，`job2` 将可重用工作流的输出（"hello world"）呈现在工作流日志的标准输出中。

YAML

```bash
name: Call a reusable workflow and use its outputs

on:
workflow_dispatch:

jobs:
job1:
uses: octo-org/example-repo/.github/workflows/called-workflow.yml@v1

job2:
runs-on: ubuntu-latest
needs: job1
steps:
	- run: echo ${{ needs.job1.outputs.firstword }} ${{ needs.job1.outputs.secondword }}


```

有关使用作业输出的详细信息，请参阅 "[GitHub Actions 的工作流语法](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs)"。 如果要在工作流之间共享变量以外的内容（例如生成工件），请参阅 "[从工作流存储和共享数据](https://docs.github.com/zh/actions/using-workflows/storing-workflow-data-as-artifacts)"。

## [监控正在使用的工作流程](#monitoring-which-workflows-are-being-used)

您可以使用 GitHub REST API 来监控可重用工作流程的使用过程。 `prepared_workflow_job` 审核日志操作会在工作流作业启动时触发。 记录的数据包括：

* `repo` - 工作流作业所在的组织 / 存储库。 对于调用其他工作流程的作业，这是调用方工作流程的组织 / 存储库。
* `@timestamp` - 启动作业的日期和时间，采用 Unix 纪元格式。
* `job_name` - 运行的作业的名称。
* `calling_workflow_refs` - 此工作流作业中涉及的所有调用方工作流的文件路径数组。 数组中的项的顺序与它们被调用的顺序相反。 例如，在工作流 A > B > C 的链中，当查看工作流 C 中作业的日志时，数组为 `["octo-org/octo-repo/.github/workflows/B.yml", "octo-org/octo-repo/.github/workflows/A.yml"]`。
* `calling_workflow_shas` - 此工作流作业中涉及的所有调用方工作流的 SHA 数组。 数组包含的项数与 `calling_workflow_refs` 数组的相同，并且这些项的顺序相同。
* `job_workflow_ref` - 使用的工作流文件，采用 `{owner}/{repo}/{path}/{filename}@{ref}` 格式。 对于调用其他工作流程的作业，这用于标识被调用的工作流程。

有关使用 REST API 查询组织的审核日志的信息，请参阅 "[适用于组织的 REST API 终结点](https://docs.github.com/zh/rest/orgs#get-the-audit-log-for-an-organization)"。

Note

只能使用 REST API 查看 `prepared_workflow_job` 的审核数据。 它在 GitHub Web 界面中不可见，也不包含在 JSON/CSV 导出的审核数据中。

## [使用可重用工作流重新运行工作流和作业](#re-running-workflows-and-jobs-with-reusable-workflows)

可使用 SHA、发布标记或分支名称引用公共存储库中的可重用工作流。 有关详细信息，请参阅 "[重新使用工作流](https://docs.github.com/zh/actions/using-workflows/reusing-workflows#calling-a-reusable-workflow)"。

重新运行使用可重用工作流且引用不是 SHA 的工作流时，有一些行为需要注意：

* 重新运行工作流中的所有作业时将使用指定引用中的可重用工作流。 有关重新运行工作流中所有作业的详细信息，请参阅 [重新运行工作流程和作业](https://docs.github.com/zh/actions/managing-workflow-runs/re-running-workflows-and-jobs#re-running-all-the-jobs-in-a-workflow)。
* 重新运行失败的作业或工作流中的特定作业时将使用第一次尝试的同一提交 SHA 中的可重用工作流。 有关重新运行工作流中失败作业的详细信息，请参阅 [重新运行工作流程和作业](https://docs.github.com/zh/actions/managing-workflow-runs/re-running-workflows-and-jobs#re-running-failed-jobs-in-a-workflow)。 有关重新运行工作流中特定作业的详细信息，请参阅 [重新运行工作流程和作业](https://docs.github.com/zh/actions/managing-workflow-runs/re-running-workflows-and-jobs#re-running-a-specific-job-in-a-workflow)。

## [后续步骤](#next-steps)

若要继续了解 GitHub Actions，请参阅 "[触发工作流的事件](https://docs.github.com/zh/actions/using-workflows/events-that-trigger-workflows)"。
