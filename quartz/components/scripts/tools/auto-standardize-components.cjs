#!/usr/bin/env node

/**
 * Quartz 组件自动标准化工具
 * 自动修复组件中的统一事件管理模式问题
 */

const fs = require("fs")
const path = require("path")

// 配置
const CONFIG = {
  targetDirectory: "d:/Workspace/pedyc/dg.pedyc/quartz/components",
  fileExtensions: [".ts", ".tsx"],
  excludePatterns: [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".bak",
    ".copy",
    "cache-consistency",
    "auto-standardize",
    "component-standardizer.ts",
    "cache-consistency-checker.ts",
  ],
  backupDirectory: "d:/Workspace/pedyc/dg.pedyc/quartz/components/backup",
}

// 标准化规则
const STANDARDIZATION_RULES = [
  {
    name: "replace-direct-localStorage-setItem",
    description: "替换直接的 localStorage.setItem",
    pattern: /localStorage\.setItem\s*\(\s*([^,]+),\s*([^)]+)\)/g,
    replacement: "globalStorageManager.instance.setItem('local', $1, $2)",
    addImport: true,
  },
  {
    name: "replace-direct-localStorage-getItem",
    description: "替换直接的 localStorage.getItem",
    pattern: /localStorage\.getItem\s*\(\s*([^)]+)\)/g,
    replacement: "globalStorageManager.instance.getItem('local', $1)",
    addImport: true,
  },
  {
    name: "replace-direct-sessionStorage-setItem",
    description: "替换直接的 sessionStorage.setItem",
    pattern: /sessionStorage\.setItem\s*\(\s*([^,]+),\s*([^)]+)\)/g,
    replacement: "globalStorageManager.instance.setItem('session', $1, $2)",
    addImport: true,
  },
  {
    name: "replace-direct-sessionStorage-getItem",
    description: "替换直接的 sessionStorage.getItem",
    pattern: /sessionStorage\.getItem\s*\(\s*([^)]+)\)/g,
    replacement: "globalStorageManager.instance.getItem('session', $1)",
    addImport: true,
  },
  {
    name: "replace-window-addCleanup",
    description: "替换 window.addCleanup",
    pattern: /window\.addCleanup\s*\(\s*([^)]+)\)/g,
    replacement: "globalResourceManager.instance.addCleanupTask($1)",
    addImport: true,
  },
  {
    name: "replace-direct-addEventListener",
    description: "替换直接的 addEventListener (需要手动检查)",
    pattern: /(\w+)\.addEventListener\s*\(\s*['"`]([^'"`)]+)['"`],\s*(\w+)(?:,\s*[^)]*)?\)/g,
    replacement: "// TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener\n$&",
    addImport: false,
    manual: true,
  },
]

// 需要添加的导入语句
const REQUIRED_IMPORTS = {
  globalStorageManager: "import { globalStorageManager } from './managers/manager-factory'",
  globalResourceManager: "import { globalResourceManager } from './managers/manager-factory'",
  CacheKeyFactory: "import { CacheKeyFactory } from './cache/cache-factory'",
}

/**
 * 文件扫描器
 */
class ComponentFileScanner {
  constructor(rootDir) {
    this.rootDir = rootDir
    this.files = []
  }

  scan() {
    this._scanDirectory(this.rootDir)
    return this.files.filter((file) => {
      const relativePath = path.relative(this.rootDir, file)
      return !CONFIG.excludePatterns.some((pattern) => relativePath.includes(pattern))
    })
  }

  _scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          this._scanDirectory(fullPath)
        } else if (stat.isFile()) {
          const ext = path.extname(item)
          if (CONFIG.fileExtensions.includes(ext)) {
            this.files.push(fullPath)
          }
        }
      }
    } catch (error) {
      console.error(`扫描目录失败: ${dir}`, error.message)
    }
  }
}

/**
 * 组件标准化器
 */
class ComponentStandardizer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false
    this.createBackup = options.createBackup !== false
    this.results = []
  }

  standardizeFile(filePath) {
    try {
      const originalContent = fs.readFileSync(filePath, "utf-8")
      let content = originalContent
      const changes = []
      const requiredImports = new Set()

      // 应用所有标准化规则
      for (const rule of STANDARDIZATION_RULES) {
        const matches = [...originalContent.matchAll(rule.pattern)]

        if (matches.length > 0) {
          content = content.replace(rule.pattern, rule.replacement)

          changes.push({
            rule: rule.name,
            description: rule.description,
            matches: matches.length,
            manual: rule.manual || false,
          })

          // 检查是否需要添加导入
          if (rule.addImport) {
            if (rule.replacement.includes("globalStorageManager")) {
              requiredImports.add("globalStorageManager")
            }
            if (rule.replacement.includes("globalResourceManager")) {
              requiredImports.add("globalResourceManager")
            }
            if (rule.replacement.includes("CacheKeyFactory")) {
              requiredImports.add("CacheKeyFactory")
            }
          }
        }
      }

      // 添加必要的导入语句
      if (requiredImports.size > 0) {
        content = this._addImports(content, requiredImports, filePath)
      }

      const result = {
        file: filePath,
        hasChanges: content !== originalContent,
        changes,
        requiredImports: Array.from(requiredImports),
        originalSize: originalContent.length,
        newSize: content.length,
      }

      // 如果不是预览模式且有变更，写入文件
      if (!this.dryRun && result.hasChanges) {
        // 创建备份
        if (this.createBackup) {
          this._createBackup(filePath, originalContent)
        }

        // 写入修改后的内容
        fs.writeFileSync(filePath, content, "utf-8")
        result.applied = true
      } else {
        result.applied = false
      }

      return result
    } catch (error) {
      console.error(`处理文件失败: ${filePath}`, error.message)
      return {
        file: filePath,
        hasChanges: false,
        changes: [],
        error: error.message,
        applied: false,
      }
    }
  }

  _addImports(content, requiredImports, filePath) {
    const lines = content.split("\n")
    const importLines = []
    const existingImports = new Set()

    // 检查现有的导入语句
    for (const line of lines) {
      if (line.includes("globalStorageManager")) existingImports.add("globalStorageManager")
      if (line.includes("globalResourceManager")) existingImports.add("globalResourceManager")
      if (line.includes("CacheKeyFactory")) existingImports.add("CacheKeyFactory")
    }

    // 添加缺失的导入
    for (const importName of requiredImports) {
      if (!existingImports.has(importName)) {
        const importPath = this._getRelativeImportPath(filePath, importName)
        importLines.push(this._generateImportStatement(importName, importPath))
      }
    }

    if (importLines.length > 0) {
      // 找到插入位置（在现有导入之后）
      let insertIndex = 0
      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].startsWith("import ") ||
          (lines[i].startsWith("const ") && lines[i].includes("require"))
        ) {
          insertIndex = i + 1
        } else if (lines[i].trim() === "" && insertIndex > 0) {
          insertIndex = i
          break
        }
      }

      lines.splice(insertIndex, 0, ...importLines, "")
    }

    return lines.join("\n")
  }

  _getRelativeImportPath(filePath, importName) {
    const fileDir = path.dirname(filePath)
    const componentsDir = CONFIG.targetDirectory

    // 计算相对路径
    const relativePath = path.relative(fileDir, componentsDir)
    const normalizedPath = relativePath.replace(/\\/g, "/")

    switch (importName) {
      case "globalStorageManager":
      case "globalResourceManager":
        return `${normalizedPath}/scripts/managers/manager-factory`
      case "CacheKeyFactory":
        return `${normalizedPath}/scripts/cache/cache-factory`
      default:
        return `${normalizedPath}/scripts/managers/manager-factory`
    }
  }

  _generateImportStatement(importName, importPath) {
    return `import { ${importName} } from '${importPath}'`
  }

  _createBackup(filePath, content) {
    try {
      // 确保备份目录存在
      if (!fs.existsSync(CONFIG.backupDirectory)) {
        fs.mkdirSync(CONFIG.backupDirectory, { recursive: true })
      }

      const fileName = path.basename(filePath)
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupPath = path.join(CONFIG.backupDirectory, `${fileName}.${timestamp}.bak`)

      fs.writeFileSync(backupPath, content, "utf-8")
      console.log(`📁 备份已创建: ${backupPath}`)
    } catch (error) {
      console.error(`创建备份失败: ${filePath}`, error.message)
    }
  }

  standardizeAll(files) {
    console.log(`开始标准化 ${files.length} 个文件...`)
    console.log(`模式: ${this.dryRun ? "预览模式" : "应用模式"}`)

    for (const file of files) {
      const result = this.standardizeFile(file)
      this.results.push(result)

      if (result.hasChanges) {
        const relativePath = path.relative(CONFIG.targetDirectory, file)
        console.log(
          `${result.applied ? "✅" : "👁️"} ${relativePath} (${result.changes.length} 项更改)`,
        )
      }
    }

    return this.generateReport()
  }

  generateReport() {
    const totalFiles = this.results.length
    const changedFiles = this.results.filter((r) => r.hasChanges)
    const appliedFiles = this.results.filter((r) => r.applied)
    const totalChanges = this.results.reduce((sum, r) => sum + r.changes.length, 0)

    // 按规则统计更改
    const changesByRule = {}
    for (const result of this.results) {
      for (const change of result.changes) {
        changesByRule[change.rule] = (changesByRule[change.rule] || 0) + change.matches
      }
    }

    // 需要手动检查的文件
    const manualFiles = this.results.filter((r) => r.changes.some((c) => c.manual))

    const report = {
      summary: {
        totalFiles,
        changedFiles: changedFiles.length,
        appliedFiles: appliedFiles.length,
        totalChanges,
        mode: this.dryRun ? "preview" : "apply",
      },
      changesByRule,
      manualFiles: manualFiles.map((f) => ({
        file: f.file,
        manualChanges: f.changes.filter((c) => c.manual),
      })),
      detailedResults: this.results.filter((r) => r.hasChanges),
    }

    return report
  }
}

/**
 * 报告生成器
 */
class StandardizationReportGenerator {
  static generateConsoleReport(report) {
    console.log("\n" + "=".repeat(60))
    console.log("🔧 Quartz 组件标准化报告")
    console.log("=".repeat(60))

    // 总体统计
    console.log("\n📊 总体统计:")
    console.log(`   处理文件数: ${report.summary.totalFiles}`)
    console.log(`   有变更文件: ${report.summary.changedFiles}`)
    console.log(`   已应用文件: ${report.summary.appliedFiles}`)
    console.log(`   总变更数: ${report.summary.totalChanges}`)
    console.log(`   运行模式: ${report.summary.mode === "preview" ? "预览模式" : "应用模式"}`)

    // 按规则统计
    console.log("\n🔄 变更统计:")
    const sortedChanges = Object.entries(report.changesByRule).sort(([, a], [, b]) => b - a)

    for (const [rule, count] of sortedChanges) {
      const ruleInfo = STANDARDIZATION_RULES.find((r) => r.name === rule)
      const description = ruleInfo ? ruleInfo.description : rule
      console.log(`   • ${description}: ${count} 处`)
    }

    // 需要手动检查的文件
    if (report.manualFiles.length > 0) {
      console.log("\n⚠️  需要手动检查的文件:")
      for (const file of report.manualFiles) {
        const relativePath = path.relative(CONFIG.targetDirectory, file.file)
        console.log(`   📁 ${relativePath}`)
        for (const change of file.manualChanges) {
          console.log(`      • ${change.description} (${change.matches} 处)`)
        }
      }
    }

    // 详细变更列表
    if (report.detailedResults.length > 0 && report.summary.mode === "preview") {
      console.log("\n📝 详细变更预览 (前10个文件):")
      const previewFiles = report.detailedResults.slice(0, 10)

      for (const result of previewFiles) {
        const relativePath = path.relative(CONFIG.targetDirectory, result.file)
        console.log(`\n   📁 ${relativePath}`)
        for (const change of result.changes) {
          const icon = change.manual ? "⚠️" : "✅"
          console.log(`      ${icon} ${change.description} (${change.matches} 处)`)
        }
      }

      if (report.detailedResults.length > 10) {
        console.log(`\n   ... 还有 ${report.detailedResults.length - 10} 个文件有变更`)
      }
    }

    console.log("\n" + "=".repeat(60))
  }

  static generateMarkdownReport(report, outputPath) {
    const content = `# Quartz 组件标准化报告

生成时间: ${new Date().toISOString()}
运行模式: ${report.summary.mode === "preview" ? "预览模式" : "应用模式"}

## 📊 总体统计

- **处理文件数**: ${report.summary.totalFiles}
- **有变更文件**: ${report.summary.changedFiles}
- **已应用文件**: ${report.summary.appliedFiles}
- **总变更数**: ${report.summary.totalChanges}

## 🔄 变更统计

${Object.entries(report.changesByRule)
  .sort(([, a], [, b]) => b - a)
  .map(([rule, count]) => {
    const ruleInfo = STANDARDIZATION_RULES.find((r) => r.name === rule)
    const description = ruleInfo ? ruleInfo.description : rule
    return `- **${description}**: ${count} 处`
  })
  .join("\n")}

## ⚠️ 需要手动检查的文件

${
  report.manualFiles.length === 0
    ? "无需要手动检查的文件"
    : report.manualFiles
        .map((file) => {
          const relativePath = path.relative(CONFIG.targetDirectory, file.file)
          return `### 📁 ${relativePath}\n\n${file.manualChanges
            .map((change) => `- **${change.description}**: ${change.matches} 处`)
            .join("\n")}`
        })
        .join("\n\n")
}

## 📝 详细变更列表

${report.detailedResults
  .map((result) => {
    const relativePath = path.relative(CONFIG.targetDirectory, result.file)
    return `### 📁 ${relativePath}\n\n${result.changes
      .map((change) => {
        const icon = change.manual ? "⚠️" : "✅"
        return `- ${icon} **${change.description}**: ${change.matches} 处`
      })
      .join("\n")}`
  })
  .join("\n\n")}

---

*报告由 Quartz 组件自动标准化工具生成*`

    fs.writeFileSync(outputPath, content, "utf-8")
    console.log(`\n📄 详细报告已保存到: ${outputPath}`)
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes("--preview") || args.includes("--dry-run")
  const noBackup = args.includes("--no-backup")
  const help = args.includes("--help") || args.includes("-h")

  if (help) {
    console.log(`
🔧 Quartz 组件自动标准化工具

用法:
  node auto-standardize-components.cjs [选项]

选项:
  --preview, --dry-run    预览模式，不实际修改文件
  --no-backup            不创建备份文件
  --help, -h             显示帮助信息

示例:
  node auto-standardize-components.cjs --preview    # 预览变更
  node auto-standardize-components.cjs              # 应用变更
  node auto-standardize-components.cjs --no-backup  # 应用变更但不备份
`)
    return
  }

  console.log("🚀 启动 Quartz 组件自动标准化工具...")

  // 检查目标目录是否存在
  if (!fs.existsSync(CONFIG.targetDirectory)) {
    console.error(`❌ 目标目录不存在: ${CONFIG.targetDirectory}`)
    process.exit(1)
  }

  // 扫描文件
  const scanner = new ComponentFileScanner(CONFIG.targetDirectory)
  const files = scanner.scan()

  if (files.length === 0) {
    console.log("⚠️  未找到任何符合条件的文件")
    return
  }

  console.log(`📁 找到 ${files.length} 个组件文件`)

  // 执行标准化
  const standardizer = new ComponentStandardizer({
    dryRun,
    createBackup: !noBackup,
  })

  const report = standardizer.standardizeAll(files)

  // 生成报告
  StandardizationReportGenerator.generateConsoleReport(report)

  // 保存详细报告
  const reportPath = path.join(CONFIG.targetDirectory, "component-standardization-report.md")
  StandardizationReportGenerator.generateMarkdownReport(report, reportPath)

  // 保存 JSON 报告
  const jsonReportPath = path.join(CONFIG.targetDirectory, "component-standardization-report.json")
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), "utf-8")
  console.log(`📊 JSON 报告已保存到: ${jsonReportPath}`)

  if (dryRun) {
    console.log("\n💡 这是预览模式。要应用更改，请运行:")
    console.log("   node auto-standardize-components.cjs")
  } else {
    console.log("\n✅ 标准化完成!")
    if (report.summary.changedFiles > 0) {
      console.log("\n🔍 建议运行缓存一致性检查以验证结果:")
      console.log("   node cache-consistency-check.cjs")
    }
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  ComponentFileScanner,
  ComponentStandardizer,
  StandardizationReportGenerator,
  CONFIG,
  STANDARDIZATION_RULES,
}
