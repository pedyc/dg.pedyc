---
title: 环境变量（Vite）
date-created: 2025-05-29
date-modified: 2025-05-29
---

Vite 支持使用 `.env` 文件来管理不同模式下的环境变量。

| 文件名                | 应用模式                  |
| ------------------ | --------------------- |
| `.env`             | 所有模式通用                |
| `.env.development` | 仅开发模式下生效              |
| `.env.production`  | 仅构建生产时生效              |
| `.env.[custom]`    | 自定义模式（配合 `--mode` 使用） |

## 使用方式

1. 定义环境变量

```.env
# .env.development
VITE_API_URL=https://dev.api.com
VITE_APP_VERSION=1
```

> [!warning]
> 注意：**环境变量必须以 `VITE_` 开头**，否则不会被暴露到客户端代码中（这是出于安全考虑）。

2. 在代码中访问

```ts
// 通过import.meta.env访问
console.log(import.meta.env.VITE_API_URL)
// 通过loadEnv方法访问
import { loadEnv } from ‘vite’
const env = loadEnv(mode, process.cws())
const API_URL = JSON.stringify(env.VITE_API_URL)
```

3. 设置 mode 模式

```bash
# 自动加载production模式
vite --mode production 

# 使用自定义模式打包
vite build --mode custom
```
