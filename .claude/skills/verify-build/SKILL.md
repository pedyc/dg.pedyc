---
name: verify-build
description: 验证代码通过构建和类型检查。适用于代码修改后、提交前验证构建是否通过。
argument-hint: [project-path]
allowed-tools: Bash(npm *)
---

执行完整的构建验证：

1. 运行 `npm run check` 进行类型检查和代码质量检查
2. 如果 check 通过，运行 `npm run build` 验证生产构建
3. 报告检查结果

如果检查失败，尝试分析错误原因并修复。
