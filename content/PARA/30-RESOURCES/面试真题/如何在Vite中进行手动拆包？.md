---
title: 如何在Vite中进行手动拆包？
date-created: 2025-06-16
date-modified: 2025-06-16
---

## 回答

- 使用 Rollup 中的 manualChunks 配置

## 示例

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将所有来自 node_modules 的模块打包到 'vendor' chunk 中
            return 'vendor';
          }

          // 可以根据文件类型进行拆分
          if (id.endsWith('.vue')) {
            return 'vue-components';
          }

          if (id.endsWith('.css')) {
            return 'styles';
          }

          // 默认情况下，将所有其他模块打包到 'app' chunk 中
          return 'app';
        },
      },
    },
  },
});
```
