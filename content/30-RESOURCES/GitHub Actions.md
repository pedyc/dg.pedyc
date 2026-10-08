GitHub Actions 是 GitHub 提供的 CI/CD 服务，可以直接在 GitHub 仓库中配置和运行 CI/CD 流程。

#### 核心概念

* **Workflow（工作流）：** 一个 Workflow 定义了一个自动化流程，包含一个或多个 Jobs。Workflow 配置文件通常位于 `.github/workflows` 目录下，使用 YAML 格式。
* **Job（任务）：** 一个 Job 是一组在同一个 runner 上执行的 steps。
* **Step（步骤）：** 一个 Step 可以是一个 shell 命令，也可以是一个 Action。
* **Action（动作）：** 一个 Action 是一个可重用的组件，可以执行特定的任务，例如代码检查、构建、测试、部署等。
* **Runner（运行器）：** 一个 Runner 是一个运行 Job 的服务器。GitHub 提供了托管的 Runner，也可以使用自建的 Runner。
* **Event（事件）：** 触发 Workflow 运行的事件，例如 `push`、`pull_request` 等。

#### 示例 Workflow

```yaml
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 16
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

这个 Workflow 定义了一个名为 "CI" 的流程，当 `main` 分支有代码提交或 Pull Request 时触发。它包含一个名为 "build" 的 Job，在 `ubuntu-latest` 运行器上执行。Job 包含以下步骤：

1. 使用 `actions/checkout@v3` Action 检出代码。
2. 使用 `actions/setup-node@v3` Action 安装 Node.js 16。
3. 使用 `npm install` 命令安装项目依赖。
4. 使用 `npm test` 命令运行测试。
5. 使用 `npm run build` 命令构建项目。

GitHub Actions 实现持续部署

可以使用 GitHub Actions 实现持续部署。以下是一个示例 Workflow：

```yaml
name: CD

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: build # 依赖于 build job

    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # 你的部署脚本
          echo "Deploying to production..."
          # 例如：
          # ssh user@your-server "cd /var/www/your-app && git pull && npm install && npm run build && pm2 restart your-app"
```

这个 Workflow 定义了一个名为 "CD" 的流程，当 `main` 分支有代码提交时触发。它包含一个名为 "deploy" 的 Job，在 `ubuntu-latest` 运行器上执行。Job 包含以下步骤：

1. 使用 `actions/checkout@v3` Action 检出代码。
2. 运行部署脚本，将代码部署到生产环境。

**注意：** 上述示例只是一个简单的示例，实际的部署脚本需要根据你的具体情况进行编写。