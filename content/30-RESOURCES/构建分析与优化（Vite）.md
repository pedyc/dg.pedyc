---
title: 构建分析与优化（Vite）
date-created: 2025-05-29
date-modified: 2026-08-01
content-type: concept
up: "[[MOC-Vite相关问题]]"
---

## 一、构建分析

分析工具：rollup-plugin-visualizer

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true, // 构建后自动打开报告
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

## 二、构建优化

### 🔧 常见优化技术 + Vite 对应实践

|技术|描述|Vite 配置方式 / 插件示例|
|---|---|---|
|Tree-shaking|剔除未使用的模块|默认启用，确保使用 ES 模块语法导入|
|Code Splitting|自动分割 chunk，支持按需加载|`import()` 动态引入，或配置 `build.rollupOptions.output.manualChunks`|
|external 外部化依赖|阻止特定模块被打包进产物，适合用 CDN 加载|`build.rollupOptions.external: ['vue']`|
|Gzip / Brotli 压缩|构建产物压缩，减小传输体积|`vite-plugin-compression` 插件支持 gzip、brotli 压缩|
|图片资源压缩 / 优化|WebP 转换、SVG 压缩、图片懒加载等|`vite-imagetools`、`vite-plugin-imagemin` 插件|
|按需加载组件 / 库函数|减少打包体积，避免全量引入|使用 `unplugin-auto-import`、`unplugin-vue-components`、`babel-plugin-import` 等插件|
|替换大体积依赖|替换为体积小、支持 Tree-shaking 的库|`lodash` → `lodash-es`，`moment` → `dayjs`，或使用 `vite-plugin-optimizer` 替换默认打包|
|构建产物分析与优化点定位|可视化分析每个 chunk 的构成|`rollup-plugin-visualizer` 插件|
|静态资源预处理优化|静态资源提前转换格式、压缩、合并|在 `public/` 中放置预处理资源，或通过插件管道（如 esbuild）预处理|

### ✂️ manualChunks 示例（手动提取第三方库）

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('lodash')) return 'vendor-lodash'
            return 'vendor'
          }
        },
      },
    },
  },
})
```

### 🧊 CDN 外部化优化（使用 unplugin-cdn）

```ts
import CDN from 'unplugin-cdn-import/vite'

export default defineConfig({
  plugins: [
    CDN({
      modules: [
        { name: 'vue', var: 'Vue', path: 'https://cdn.jsdelivr.net/npm/vue@3.4.0/dist/vue.global.prod.js' },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      external: ['vue'],
    },
  },
})
```

### 🧯 vite-plugin-compression 示例（Gzip + Brotli）

```ts
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
})
```

## 三、构建优化（场景导向）

|问题场景|建议解决方案|
|---|---|
|第三方库体积大|外部化依赖、使用 CDN、替换为小体积库|
|构建时间过长|optimizeDeps 配置、预构建缓存、减少插件数量|
|dev 模式加载慢|optimizeDeps.include 精选依赖|
|不知道谁贡献了最大体积|使用 visualizer 插件生成依赖图|
|样式/图标冗余|使用 Tailwind 的按需工具类、SVG 图标精简系统|
|产物 chunk 太碎或重复|配置 manualChunks 合理拆分|
