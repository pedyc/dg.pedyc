---
content-type: concept
title: 插件系统及生命周期（Vite）
date-created: 2025-05-29
date-modified: 2025-12-25
---

## 🧩 一、什么是 Vite 插件？

Vite 插件本质上是基于 **Rollup 插件 API 的扩展实现**，但也提供了 **专属的 Vite 插件钩子（vite 独有）**，用于处理 dev server、HMR、HTML 注入等功能。

Vite 插件 = Rollup 插件 + Vite 扩展钩子

## 🧬 二、Vite 插件生命周期概览

生命周期大致分为两大阶段：

| 阶段       | 描述                       |
| -------- | ------------------------ |
| **开发阶段** | 处理 dev server 启动、HMR、转码等 |
| **构建阶段** | 调用 Rollup 构建流程，产物打包      |

完整钩子图：

```txt
┌──────────── dev server 启动
│
├── config
├── configResolved
├── configureServer
│
├── transformIndexHtml
├── resolveId
├── load
├── transform
│
├── handleHotUpdate
│
├──────────── build 时
│
├── options
├── buildStart
├── resolveId
├── load
├── transform
├── buildEnd
├── generateBundle
└── closeBundle
```

## 🔧 三、关键生命周期钩子详解

### 1️⃣ `config` / `configResolved`

* `config`：插件最早执行阶段，用于动态修改 Vite 配置。
* `configResolved`：Vite 配置对象被完整解析后的 hook，适合读取最终配置。

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    config(config, { command }) {
      console.log('vite config:', config)
    },
    configResolved(resolvedConfig) {
      console.log('final config:', resolvedConfig)
    }
  }
}
```

### 2️⃣ `configureServer`

* 仅在开发环境生效
* 注入中间件、定制 dev server 行为（例如：mock 数据）

```ts
configureServer(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === '/api/mock') {
      res.end(JSON.stringify({ msg: 'hello' }))
    } else {
      next()
    }
  })
}
```

### 3️⃣ `transformIndexHtml`

* 修改入口 HTML 内容（如注入 CDN、meta 标签等）

```ts
transformIndexHtml(html) {
  return html.replace(
    '</head>',
    `<script src="https://xx.cdn.com/abc.js"></script></head>`
  )
}
```

### 4️⃣ `resolveId` / `load` / `transform`

这三个钩子贯穿开发与构建阶段，是处理文件加载的核心。

| 钩子        | 作用           |
| --------- | ------------ |
| resolveId | 解析模块路径（虚拟模块） |
| load      | 返回模块内容       |
| transform | 对源码进行转换      |

```ts
resolveId(id) {
  if (id === 'virtual:env') return '\0virtual-env'
},
load(id) {
  if (id === '\0virtual-env') {
    return `export const env = "dev"`
  }
}
```

### 5️⃣ `handleHotUpdate`

* 用于处理 HMR（热更新逻辑）
* 监听文件变化后自定义响应行为

```ts
handleHotUpdate({ file, server }) {
  if (file.endsWith('.json')) {
    server.ws.send({
      type: 'custom',
      event: 'json-update',
      data: { file }
    })
  }
}
```

### 6️⃣ `generateBundle` / `closeBundle`

* 构建阶段生成产物前后执行
* 可用于分析构建产物 / 修改 bundle 输出

```ts
generateBundle(options, bundle) {
  console.log('Bundle keys:', Object.keys(bundle))
},
closeBundle() {
  console.log('🎉 构建结束')
}
```

## 🧪 四、完整插件示例（虚拟模块 + dev mock + 构建日志）

```ts
// vite-plugin-demo.ts
export default function demoPlugin(): Plugin {
  return {
    name: 'vite-plugin-demo',
    resolveId(id) {
      if (id === 'virtual:greeting') return '\0greeting'
    },
    load(id) {
      if (id === '\0greeting') {
        return `export default 'Hello from virtual module'`
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/hello') {
          res.end(JSON.stringify({ msg: 'Hello from mock' }))
        } else {
          next()
        }
      })
    },
    transformIndexHtml(html) {
      return html.replace('</head>', '<meta name="demo" /><script>alert("demo")</script></head>')
    },
    generateBundle(_, bundle) {
      console.log('👀 打包生成的文件有：', Object.keys(bundle))
    },
    closeBundle() {
      console.log('✅ 构建完成')
    }
  }
}
```

## ❓问答卡片

* Vite 插件和 Rollup 插件的关系？
* 插件生命周期中 dev 特有钩子有哪些？
* transformIndexHtml 有哪些应用场景？
* 如何通过插件实现虚拟模块？
* 如何通过插件实现 mock 接口？有哪些优缺点？
