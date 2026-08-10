---
name: plugin-dev
description: 辅助创建或修改 Quartz 插件（transformer、filter、emitter）
argument-hint: [name] [type: transformer|filter|emitter]
allowed-tools: Glob,Grep,Read,Write,Edit
---

辅助开发 Quartz 插件：

1. **确定插件类型**
   - Transformer: 在解析时修改内容 (quartz/plugins/transformers/)
   - Filter: 决定哪些内容发布 (quartz/plugins/filters/)
   - Emitter: 生成输出文件 (quartz/plugins/emitters/)

2. **查找参考实现**
   - 在 quartz/plugins/ 目录下找到类似功能的插件作为参考
   - 查看 quartz/plugins/types.ts 了解插件接口

3. **创建插件**
   - 在对应目录创建新插件文件
   - 实现插件接口（name, annotateSPA, process 等方法）

4. **注册插件**
   - 在 quartz.config.ts 的 plugins 配置中添加插件

5. **测试**
   - 创建测试文件验证插件功能
   - 运行 `npm run build` 验证构建通过
