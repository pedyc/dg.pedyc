---
title: 17-缓存依赖项以加快工作流程 - GitHub 文档
aliases: [缓存依赖项以加快工作流程 - GitHub 文档]
tags: []
date-created: 2025-03-11
date-modified: 2025-03-11
desc: 为了使工作流程更快、更高效，可以为依赖项及其他经常重复使用的文件创建和使用缓存。
url: https://docs.github.com/zh/actions/writing-workflows/choosing-what-your-workflow-does/caching-dependencies-to-speed-up-workflows
---

为了使工作流程更快、更高效，可以为依赖项及其他经常重复使用的文件创建和使用缓存。

## [关于缓存工作流程依赖项](#about-caching-workflow-dependencies)

工作流程运行通常在不同运行之间重新使用相同的输出或下载的依赖项。 例如，Maven、Gradle、npm 和 Yarn 等软件包和依赖项管理工具都会对下载的依赖项保留本地缓存。

GitHub 托管的运行器上的 作业在干净的运行器映像中启动，每次都必须下载依赖项，导致网络利用率提高、运行时间延长和成本增加。 为帮助加快重新创建依赖项等文件，GitHub 可以缓存你在工作流中经常使用的文件。

要缓存作业的依赖项，可以使用 GitHub 的 [`cache` 操作](https://github.com/actions/cache)。 该操作创建和还原由唯一键标识的缓存。 或者，如果要缓存下列包管理器，则使用其各自的 setup-* 操作需要最小配置并将为你创建和还原依赖项缓存。

<table><thead><tr><th scope="col">包管理器</th><th scope="col">用于缓存的 setup-* 操作</th></tr></thead><tbody><tr><td>npm、Yarn、pnpm</td><td><a href="https://github.com/actions/setup-node#caching-global-packages-data">setup-node</a></td></tr><tr><td>pip、pipenv、Poetry</td><td><a href="https://github.com/actions/setup-python#caching-packages-dependencies">setup-python</a></td></tr><tr><td>Gradle、Maven</td><td><a href="https://github.com/actions/setup-java#caching-packages-dependencies">setup-java</a></td></tr><tr><td>RubyGems</td><td><a href="https://github.com/ruby/setup-ruby#caching-bundle-install-automatically">setup-ruby</a></td></tr><tr><td>Go <code>go.sum</code></td><td><a href="https://github.com/actions/setup-go#caching-dependency-files-and-build-outputs">setup-go</a></td></tr><tr><td>.NET NuGet</td><td><a href="https://github.com/actions/setup-dotnet?tab=readme-ov-file#caching-nuget-packages">setup-dotnet</a></td></tr></tbody></table>

> [!warning]
> 将缓存与 GitHub Actions 结合使用时，请注意以下几点：
> * 建议不要在缓存中存储任何敏感信息。 例如，敏感信息可以包括存储在缓存路径的文件中的访问令牌或登录凭据。 此外，命令行接口 (CLI) 程序（例如 `docker login`）可以将访问凭据保存在配置文件中。 具有读取访问权限的任何人都可以在存储库上创建拉取请求并访问缓存的内容。 仓库的复刻也可在基本分支上创建拉取请求，并在基本分支上访问缓存。
> * 使用自托管运行器时，工作流运行中的缓存存储在 GitHub 拥有的云存储上。 客户拥有的存储解决方案仅适用于 GitHub Enterprise Server。

## [比较构件和依赖项缓存](#比较构件和依赖项缓存)

构件与缓存类似，因为它们能够在 GitHub 上存储文件，但每项功能都提供不同的用例，不能互换使用。

* 当想要重复使用在作业或工作流运行之间不频繁更改的文件时（例如从程序包管理系统构建依赖项），请使用缓存。
* 如果要保存作业生成的文件，以在工作流运行结束后查看（例如生成的二进制文件或生成日志），请使用项目。

有关工作流运行工件的详细信息，请参阅 "[从工作流存储和共享数据](https://docs.github.com/zh/actions/using-workflows/storing-workflow-data-as-artifacts)"。

## [访问缓存的限制](#restrictions-for-accessing-a-cache)

访问限制通过在不同分支或标记之间创建逻辑边界来提供缓存隔离和安全性。 工作流运行可以还原在当前分支或默认分支（通常是 `main`）中创建的缓存。 如果为拉取请求触发了工作流运行，则它还可以还原在基分支中创建的缓存，包括分支存储库的基分支。 例如，如果分支 `feature-b` 具有基分支 `feature-a`，则对拉取请求触发的工作流运行将有权访问在默认 `main` 分支、`feature-a` 基分支和当前 `feature-b` 分支中创建的缓存。

工作流运行无法还原为子分支或同级分支创建的缓存。 例如，在父分支 `feature-b` 上触发的工作流运行无法访问为子分支 `main` 创建的缓存。 例如，为 `feature-a` 分支（基分支为 `main`）创建的缓存无法供其同级 `feature-c` 分支（基分支为 `main`）访问。 工作流运行也不能还原为不同标记名称创建的缓存。 例如，针对标记 `release-b`（基分支为 `main`）触发的工作流无法访问为标记 `release-a`（基分支为 `main`）创建的缓存。

当缓存由对拉取请求触发的工作流运行创建时，会为合并引用 (`refs/pull/…/merge`) 创建缓存。 因此，缓存的范围有限，只能通过重新运行拉取请求来还原。 它不能由基分支或针对该基分支的其他拉取请求还原。

存储库中的多个工作流运行可以共享缓存。 可以从同一存储库和分支的另一个工作流运行访问和还原为工作流运行中的分支创建的缓存。

## [使用 `cache` 操作](#using-the-cache-action)

此 [`cache` 操作](https://github.com/actions/cache) 将尝试根据你提供 `key` 的还原缓存。 当操作找到与键完全匹配的缓存时，该操作会将缓存的文件还原到你配置的 `path`。 可以选择提供在 `key` 与现有缓存不匹配时要使用的 `restore-keys` 列表。 从另一个分支还原缓存时，`restore-keys` 列表非常有用，因为 `restore-keys` 可以部分匹配缓存键。 有关匹配 `restore-keys` 的详细信息，请参阅 "[匹配缓存键](#matching-a-cache-key)"。

如果与提供的 `key` 完全匹配，则这被视为缓存命中。 如果没有缓存与提供的 `key` 完全匹配，则这被视为缓存失误。 在缓存失误情况下，该操作会在作业成功完成时自动创建一个新缓存。 新缓存将使用你提供的 `key`，并包含你在 `path` 中指定的文件。 有关如何处理此问题的详细信息，请参阅 "[缓存命中和未命中](#cache-hits-and-misses)"。

不能更改现有缓存的内容。 相反，可以使用新键创建新缓存。

### [`cache` 操作的输入参数](#input-parameters-for-the-cache-action)

* `key`：必要。保存缓存时创建的密钥和用于搜索缓存的密钥。 它可以是变量、上下文值、静态字符串和函数的任何组合。 密钥最大长度为 512 个字符，密钥长度超过最大长度将导致操作失败。
* `path`：必要。运行器上用于缓存或还原的路径。
* 可以指定单个路径，也可以在单独的行上添加多个路径。 例如：

```bash
- name: Cache Gradle packages
uses: actions/cache@v4
with:
path: |
	~/.gradle/caches
	~/.gradle/wrapper
```

* 可以指定目录或单个文件，并且支持 glob 模式。
* 可以指定绝对路径或相对于工作区目录的路径。
* `restore-keys`：可选。包含备用还原键的字符串，每个还原键均放置在一个新行上。 如果 `key` 没有发生缓存命中，则按照提供的顺序依次使用这些还原键来查找和还原缓存。 例如：

```bash
restore-keys: |  
npm-feature-${{ hashFiles('package-lock.json') }}  
npm-feature-  
npm-

```bash


* `enableCrossOsArchive`：可选 一个布尔值，启用后，允许 Windows 运行程序独立于创建缓存的操作系统保存或还原缓存。 如果未设置此参数，则默认为 `false`。 有关详细信息，请参阅操作缓存文档中的 [交叉操作系统缓存](https://github.com/actions/cache/blob/main/tips-and-workarounds.md#cross-os-cache)。

### [`cache` 操作的输出参数](#output-parameters-for-the-cache-action)

* `cache-hit`：表示找到了键的精确匹配项的布尔值。

### [缓存命中和缓存失误](#cache-hits-and-misses)

当 `key` 完全匹配现有缓存时，被称为缓存命中，并且操作会将缓存的文件还原到 `path` 目录。

当 `key` 不匹配现有缓存时，则被称为缓存失误，在作业成功完成时会自动创建一个新缓存。

发生缓存失误时，该操作还会搜索指定的 `restore-keys` 以查找任何匹配项：

1. 如果提供 `restore-keys`，`cache` 操作将按顺序搜索与 `restore-keys` 列表匹配的任何缓存。
* 当存在精确匹配时，该操作会将缓存中的文件还原到 `path` 目录。
* 如果没有精确匹配，操作将会搜索恢复键值的部分匹配。 当操作找到部分匹配时，最近的缓存将还原到 `path` 目录。
1. `cache` 操作完成，作业中的下一个步骤运行。
2. 如果作业成功完成，则操作将自动创建一个包含 `path` 目录内容的新缓存。

有关缓存匹配过程更详细的说明，请参阅 "[匹配缓存键](#matching-a-cache-key)"。

### [使用 `cache` 操作的示例](#example-using-the-cache-action)

此示例在 `package-lock.json` 文件中的包更改时，或运行器的操作系统更改时，创建一个新的缓存。 缓存键使用上下文和表达式生成一个键值，其中包括运行器的操作系统和 `package-lock.json` 文件的 SHA-256 哈希。

YAML

```bash
name: Caching with npm
on: push
jobs:
build:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4

- name: Cache node modules
id: cache-npm
uses: actions/cache@v4
env:
cache-name: cache-node-modules
with:

path: ~/.npm
key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
restore-keys: |
${{ runner.os }}-build-${{ env.cache-name }}-
${{ runner.os }}-build-
${{ runner.os }}-

- if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
name: List the state of node modules
continue-on-error: true
run: npm list

- name: Install dependencies
run: npm install

- name: Build
run: npm run build

- name: Test
run: npm test
```

### [使用上下文创建缓存键](#using-contexts-to-create-cache-keys)

缓存键可以包括 GitHub Actions 支持的任何上下文、函数、文本和运算符。 有关详细信息，请参阅 [访问有关工作流运行的上下文信息](https://docs.github.com/zh/actions/learn-github-actions/contexts) 和 [对工作流和操作中的表达式求值](https://docs.github.com/zh/actions/learn-github-actions/expressions)。

使用表达式创建 `key` 使你能够在依赖项更改时自动创建新缓存。

例如，可以使用可计算 npm `package-lock.json` 文件的哈希的表达式创建 `key`。 因此，当构成 `package-lock.json` 文件的依赖项更改时，缓存键会更改，并自动创建新缓存。

```bash
npm-${{ hashFiles('package-lock.json') }}
```

GitHub 计算表达式 `hash "package-lock.json"` 以派生最终的 `key`。

```bash
npm-d5ea0750
```

### [使用 `cache` 操作的输出](#using-the-output-of-the-cache-action)

可以使用 `cache` 操作的输出，以根据发生的是缓存命中还是缓存失误来执行某些操作。 找到指定 `key` 的缓存的精确匹配时，`cache-hit` 输出设置为 `true`。

在上面的示例工作流中，有一个步骤会列出发生缓存失误时节点模块的状态：

```bash
- if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
name: List the state of node modules
continue-on-error: true
run: npm list
```

## [匹配缓存键](#matching-a-cache-key)

`cache` 操作首先在包含工作流运行的分支中搜索 `key` 和缓存版本的缓存命中。 如果没有命中，它会搜索 `restore-keys` 和版本。 如果当前分支中仍然没有命中，`cache` 操作会在默认分支上重试相同步骤。 请注意，范围限制在搜索期间适用。 有关详细信息，请参阅 "[访问缓存的限制](#restrictions-for-accessing-a-cache)"。

缓存版本是使用 `path` 元数据以及创建缓存时使用的压缩工具标记缓存的一种方法。 这可确保使用的工作流运行与它实际可以解压缩和使用的缓存唯一匹配。 有关详细信息，请参阅操作缓存文档中的 [缓存版本](https://github.com/actions/cache#cache-version)。

通过 `restore-keys`，你可以指定当 `key` 中发生缓存失误时要使用的备用还原键列表。 您可以创建从最具体到最不具体的多个恢复键。 `cache` 操作按顺序搜索 `restore-keys`。 当键不直接匹配时，操作将搜索以恢复键为前缀的键。 如果恢复键值有多个部分匹配项，操作将返回最近创建的缓存。

### [使用多个恢复键值的示例](#example-using-multiple-restore-keys)

```bash
restore-keys: |
npm-feature-${{ hashFiles('package-lock.json') }}
npm-feature-
npm-
```

运行器将计算表达式，这些表达式解析为以下 `restore-keys`：

```bash
restore-keys: |
npm-feature-d5ea0750
npm-feature-
npm-
```

还原键 `npm-feature-` 与以字符串 `npm-feature-` 开头的任何键匹配。 例如，`npm-feature-fd3052de` 和 `npm-feature-a9b253ff` 这两个键都与还原键匹配。 将使用创建日期最新的缓存。 此示例中的键值按以下顺序搜索：

1. `npm-feature-d5ea0750` 匹配特定哈希。
2. `npm-feature-` 匹配前缀为 `npm-feature-` 的缓存键。
3. `npm-` 匹配前缀为 `npm-` 的任何键。

#### [搜索优先级示例](#example-of-search-priority)

```bash
key:
npm-feature-d5ea0750
restore-keys: |
npm-feature-
npm-
```

例如，如果拉取请求包含 `feature` 分支，并以默认分支 (`main`) 为目标，则该操作将按以下顺序搜索 `key` 和 `restore-keys`：

1. `feature` 分支中的键 `npm-feature-d5ea0750`
2. `feature` 分支中的键 `npm-feature-`
3. `feature` 分支中的键 `npm-`
4. `main` 分支中的键 `npm-feature-d5ea0750`
5. `main` 分支中的键 `npm-feature-`
6. `main` 分支中的键 `npm-`

## [使用限制和收回政策](#usage-limits-and-eviction-policy)

GitHub 将删除 7 天内未被访问的任何缓存条目。 可以存储的缓存数没有限制，但仓库中所有缓存的总大小有限为 10 GB。 存储库达到其最大缓存存储后，缓存逐出策略将通过删除存储库中最早的缓存来腾出空间。

如果超过此限制，GitHub 将保存新缓存，但会开始收回缓存，直到总大小小于存储库限制。缓存逐出过程可能会导致缓存抖动，即频繁地创建和删除缓存。 若要减少这种情况，可以查看存储库缓存并采取纠正措施，例如从特定工作流中删除缓存。 有关详细信息，请参阅 [管理缓存](#managing-caches)。

## [管理缓存](#managing-caches)

若要管理从工作流创建的缓存，可以：

* 查看存储库的所有缓存条目的列表。
* 使用特定元数据（如缓存大小、创建时间或上次访问时间）对缓存列表进行筛选和排序。
* 从存储库中删除缓存条目。
* 监视存储库和组织的聚合缓存使用情况。

可通过多种方式管理存储库缓存：

* 使用 GitHub Web 界面，如下所示。
* 使用 REST API。 有关详细信息，请参阅 "[GitHub Actions 缓存的 REST API 终结点](https://docs.github.com/zh/rest/actions/cache)"。
* 安装 `gh cache` 子命令，以便从命令行管理缓存。 有关详细信息，请参阅 [GitHub CLI 文档](https://cli.github.com/manual/gh_cache)。

Note

如果手动执行此操作，请确保已安装 2.32.0 或更高版本的 CLI。

### [查看缓存条目](#viewing-cache-entries)

可以使用 Web 界面查看存储库的缓存条目列表。 在缓存列表中，可以看到每个缓存占用的磁盘空间量、创建缓存的时间以及上次使用缓存的时间。

1. 在 GitHub 上，导航到存储库的主页面。
2. 在存储库名称下，单击 " 操作 "。

![[d8d420b3e560cba35d63db716989988e_MD5.jpg]]

3. 在左侧栏中的 " 管理 " 部分下，单击 " 缓存 "。
4. 查看存储库的缓存条目列表。

* 若要搜索用于特定分支的缓存条目，请单击 " 分支 " 下拉菜单并选择一个分支。 缓存列表将显示用于所选分支的所有缓存。
* 若要搜索具有特定缓存键的缓存条目，请使用 " 筛选缓存 " 字段中的语法 `key: key-name`。 缓存列表将显示使用键的所有分支中的缓存。

![[982d5711cb08e1b5097167402845b2b0_MD5.jpg]]

### [删除缓存条目](#deleting-cache-entries)

对存储库具有 `write` 权限的用户可以使用 GitHub Web 界面删除缓存条目。

1. 在 GitHub 上，导航到存储库的主页面。
2. 在存储库名称下，单击 " 操作 "。

![[d8d420b3e560cba35d63db716989988e_MD5.jpg]]

3. 在左侧栏中的 " 管理 " 部分下，单击 " 缓存 "。
4. 在要删除的缓存条目右侧，单击 。

![[d88ba8d4a85a163be5cdfde7b499d00c_MD5.jpg]]

### [强制删除缓存条目](#force-deleting-cache-entries)

缓存具有分支范围限制，这意味着某些缓存的使用选项有限。 有关缓存范围限制的详细信息，请参阅本文前面的 "[访问缓存的限制](#restrictions-for-accessing-a-cache)"。 如果限制为特定分支的缓存使用大量存储配额，则可能会导致高频率创建和删除 `default` 分支中的缓存。

例如，存储库可以打开许多新的拉取请求，每个请求都有自己的缓存，这些缓存仅限于该分支。 这些缓存可能会占用该存储库的大部分缓存存储。 存储库达到其最大缓存存储后，缓存逐出策略将通过删除存储库中最早的缓存来腾出空间。为了防止发生此情况时缓存抖动，可以设置工作流，以比缓存逐出策略更快的节奏删除缓存。 可以使用 GitHub CLI 删除特定分支的缓存。

以下示例工作流使用 `gh cache` 在拉取请求关闭后删除分支创建的多达 100 个缓存。

要对跨存储库拉取请求或来自分支的拉取请求运行以下示例，可以使用 `pull_request_target` 事件触发该工作流。 如果确实使用 `pull_request_target` 来触发该工作流，请记住一些安全注意事项。 有关详细信息，请参阅 "[触发工作流的事件](https://docs.github.com/zh/actions/using-workflows/events-that-trigger-workflows#pull_request_target)"。

```bash
name: cleanup caches by a branch
on:
pull_request:
types:
- closed

jobs:
cleanup:
runs-on: ubuntu-latest
steps:
- name: Cleanup
run: |
echo "Fetching list of cache key"
cacheKeysForPR=$(gh cache list --ref $BRANCH --limit 100 --json id --jq '.[].id')


set +e
echo "Deleting caches..."
for cacheKey in $cacheKeysForPR
do
	gh cache delete $cacheKey
done
echo "Done"
env:
GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
GH_REPO: ${{ github.repository }}
BRANCH: refs/pull/${{ github.event.pull_request.number }}/merge


```

或者，可以使用 API 按照自己的节奏自动列出或删除所有缓存。 有关详细信息，请参阅 "[GitHub Actions 缓存的 REST API 终结点](https://docs.github.com/zh/rest/actions/cache#about-the-cache-in-github-actions)"。
