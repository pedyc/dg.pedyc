---
title: 如何使用 Babel 将 ES6+ 代码转换为 ES5 代码，以兼容旧版本浏览器？
date-created: 2025-06-16
date-modified: 2025-06-16
---

## 回答

使用 Babel 将 ES6+ 代码转换为 ES5 代码，以兼容旧版本浏览器，可以按照以下步骤进行：

1. **安装 Babel**：
* 使用 npm 或 yarn 安装 Babel 相关的依赖包：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
# 或者
yarn add --dev @babel/core @babel/cli @babel/preset-env
```

* `@babel/core`：Babel 的核心库。
* `@babel/cli`：Babel 的命令行工具，用于在命令行中运行 Babel。
* `@babel/preset-env`：Babel 的预设，用于将 ES6+ 代码转换为 ES5 代码。

2. **配置 Babel**：
* 在项目根目录下创建 `.babelrc` 文件，并配置 Babel 的预设：

```json
{
	"presets": ["@babel/preset-env"]
}
```

* 也可以在 `package.json` 文件中配置 Babel：

```json
{
	"babel": {
		"presets": ["@babel/preset-env"]
	}
}
```

3. **运行 Babel**：
* 在命令行中运行 Babel，将 ES6+ 代码转换为 ES5 代码：

```bash
npx babel src --out-dir lib
# 或者
yarn babel src --out-dir lib
```

* `src`：ES6+ 代码的目录。
* `lib`：转换后的 ES5 代码的目录。

4. **配置构建工具**：
* 如果使用 Webpack、Rollup 等构建工具，可以在构建配置中配置 Babel，使其自动将 ES6+ 代码转换为 ES5 代码。

## 示例

1. **创建 `.babelrc` 文件**：

```json
{
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": {
					"browsers": ["> 0.25%", "not dead"]
				}
			}
		]
	]
}
```

* `targets`：指定要兼容的浏览器版本。

2. **在 `package.json` 文件中添加构建脚本**：

```json
{
	"scripts": {
		"build": "babel src --out-dir lib"
	}
}
```

3. **运行构建脚本**：

```bash
npm run build
# 或者
yarn build
```
