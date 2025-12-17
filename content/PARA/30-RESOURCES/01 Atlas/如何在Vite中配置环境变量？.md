---
title: 如何在Vite中配置环境变量？
date-created: 2025-06-16
date-modified: 2025-06-16
content-type: faq
---

## 回答

在 Vite 中配置环境变量，可以通过以下步骤：

1. **创建 `.env` 文件**：
* 在项目根目录下创建 `.env` 文件，用于存储环境变量。
* 可以创建多个 `.env` 文件，例如 `.env.development`、`.env.production`，用于配置不同的环境。
* Vite 会自动加载这些文件，并将其中的环境变量注入到 `import.meta.env` 中。

2. **定义环境变量**：
* 在 `.env` 文件中定义环境变量，例如 `VITE_API_URL=http://localhost:3000`。
* 注意：环境变量必须以 `VITE_` 开头，才能被 Vite 正确识别。

3. **在代码中使用环境变量**：
* 使用 `import.meta.env.VITE_API_URL` 访问环境变量。
* 例如：

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl); // 输出：http://localhost:3000
```

## 示例

1. **创建 `.env.development` 文件**：

```bash
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=My App (Development)
```

2. **创建 `.env.production` 文件**：

```bash
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App (Production)
```

3. **在代码中使用环境变量**：

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

console.log(apiUrl); // 输出：http://localhost:3000 (开发环境) 或 https://api.example.com (生产环境)
console.log(appName); // 输出：My App (Development) (开发环境) 或 My App (Production) (生产环境)
```

**注意**：

* 在 `.env` 文件中定义的环境变量是字符串类型。如果需要使用其他类型，需要手动进行转换。
* 为了安全起见，不要将敏感信息（例如 API 密钥）存储在 `.env` 文件中。可以使用其他方式（例如环境变量）来传递敏感信息。
