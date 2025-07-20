#!/usr/bin/env node

/**
 * Quartz 组件缓存一致性检查工具
 * 检查所有组件是否正确应用了统一的缓存键生成逻辑和缓存应用逻辑
 */

const fs = require("fs")
const path = require("path")

// 配置
const CONFIG = {
  targetDirectory: "d:/Workspace/pedyc/dg.pedyc/quartz/components",
  fileExtensions: [".ts", ".tsx", ".js", ".jsx"],
  excludePatterns: ["node_modules", ".git", "dist", "build", ".bak", ".copy"],
}

// 检查规则
const RULES = {
  // 硬编码缓存键检查
  hardcodedCacheKeys: {
    pattern: /['"`]([a-zA-Z][a-zA-Z0-9_-]*)['"`]\s*,\s*['"`]([^'"`)]+)['"`]/g,
    severity: "warning",
    message: "发现可能的硬编码缓存键",
    suggestion: "使用 CacheKeyFactory.generateSystemKey() 等方法生成缓存键",
  },

  // 直接存储访问检查
  directStorageAccess: {
    pattern: /(localStorage|sessionStorage)\.(getItem|setItem|removeItem)/g,
    severity: "error",
    message: "直接访问 localStorage 或 sessionStorage",
    suggestion: "使用 globalStorageManager.instance.setItem() 或 getItem()",
  },

  // CacheKeyFactory 使用检查
  cacheKeyFactoryUsage: {
    pattern: /CacheKeyFactory\.(generateSystemKey|generateUserKey|generateContentKey)/g,
    severity: "info",
    message: "正确使用 CacheKeyFactory",
    suggestion: "继续保持",
  },

  // globalStorageManager 使用检查
  globalStorageManagerUsage: {
    pattern: /globalStorageManager\.instance\.(getItem|setItem|removeItem)/g,
    severity: "info",
    message: "正确使用 globalStorageManager",
    suggestion: "继续保持",
  },

  // 旧式事件清理检查
  oldEventCleanup: {
    pattern: /window\.addCleanup/g,
    severity: "warning",
    message: "使用旧式事件清理方法",
    suggestion: "使用 globalResourceManager.addCleanupTask()",
  },

  // 直接事件监听器检查
  directEventListener: {
    pattern: /(?<!globalResourceManager\.instance\.)addEventListener/g,
    severity: "warning",
    message: "直接使用 addEventListener",
    suggestion: "使用 globalResourceManager.instance.addEventListener()",
  },
}

/**
 * 文件扫描器
 */
class FileScanner {
  constructor(rootDir) {
    this.rootDir = rootDir
    this.files = []
  }

  scan() {
    this._scanDirectory(this.rootDir)
    return this.files
  }

  _scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        // 跳过排除的目录
        if (CONFIG.excludePatterns.some((pattern) => item.includes(pattern))) {
          continue
        }

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
 * 缓存一致性检查器
 */
class CacheConsistencyChecker {
  constructor() {
    this.results = []
  }

  checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf-8")
      const fileResult = {
        file: filePath,
        issues: [],
        score: 100,
        compliance: "excellent",
      }

      // 应用所有检查规则
      for (const [ruleName, rule] of Object.entries(RULES)) {
        const matches = [...content.matchAll(rule.pattern)]

        for (const match of matches) {
          const issue = {
            rule: ruleName,
            severity: rule.severity,
            message: rule.message,
            suggestion: rule.suggestion,
            line: this._getLineNumber(content, match.index),
            match: match[0],
          }

          fileResult.issues.push(issue)

          // 计算分数影响
          if (rule.severity === "error") {
            fileResult.score -= 20
          } else if (rule.severity === "warning") {
            fileResult.score -= 10
          }
        }
      }

      // 确保分数不低于0
      fileResult.score = Math.max(0, fileResult.score)

      // 确定合规等级
      if (fileResult.score >= 90) {
        fileResult.compliance = "excellent"
      } else if (fileResult.score >= 70) {
        fileResult.compliance = "good"
      } else if (fileResult.score >= 50) {
        fileResult.compliance = "fair"
      } else {
        fileResult.compliance = "poor"
      }

      return fileResult
    } catch (error) {
      console.error(`检查文件失败: ${filePath}`, error.message)
      return {
        file: filePath,
        issues: [
          {
            rule: "file_error",
            severity: "error",
            message: `文件读取失败: ${error.message}`,
            suggestion: "检查文件权限和路径",
            line: 0,
            match: "",
          },
        ],
        score: 0,
        compliance: "error",
      }
    }
  }

  _getLineNumber(content, index) {
    return content.substring(0, index).split("\n").length
  }

  checkAll(files) {
    console.log(`开始检查 ${files.length} 个文件...`)

    for (const file of files) {
      const result = this.checkFile(file)
      this.results.push(result)
    }

    return this.generateReport()
  }

  generateReport() {
    const totalFiles = this.results.length
    const totalIssues = this.results.reduce((sum, r) => sum + r.issues.length, 0)
    const averageScore = this.results.reduce((sum, r) => sum + r.score, 0) / totalFiles

    // 按合规等级分组
    const complianceGroups = {
      excellent: this.results.filter((r) => r.compliance === "excellent"),
      good: this.results.filter((r) => r.compliance === "good"),
      fair: this.results.filter((r) => r.compliance === "fair"),
      poor: this.results.filter((r) => r.compliance === "poor"),
      error: this.results.filter((r) => r.compliance === "error"),
    }

    // 问题统计
    const issueStats = {}
    for (const result of this.results) {
      for (const issue of result.issues) {
        issueStats[issue.rule] = (issueStats[issue.rule] || 0) + 1
      }
    }

    // 最需要改进的文件
    const worstFiles = this.results
      .filter((r) => r.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)

    const report = {
      summary: {
        totalFiles,
        totalIssues,
        averageScore: Math.round(averageScore * 100) / 100,
        complianceDistribution: {
          excellent: complianceGroups.excellent.length,
          good: complianceGroups.good.length,
          fair: complianceGroups.fair.length,
          poor: complianceGroups.poor.length,
          error: complianceGroups.error.length,
        },
      },
      issueStats,
      worstFiles,
      detailedResults: this.results,
    }

    return report
  }
}

/**
 * 报告生成器
 */
class ReportGenerator {
  static generateConsoleReport(report) {
    console.log("\n" + "=".repeat(60))
    console.log("🔍 Quartz 组件缓存一致性检查报告")
    console.log("=".repeat(60))

    // 总体统计
    console.log("\n📊 总体统计:")
    console.log(`   检查文件数: ${report.summary.totalFiles}`)
    console.log(`   发现问题数: ${report.summary.totalIssues}`)
    console.log(`   平均评分: ${report.summary.averageScore}/100`)

    // 合规分布
    console.log("\n📈 合规等级分布:")
    const dist = report.summary.complianceDistribution
    console.log(`   🟢 优秀 (90+): ${dist.excellent} 个文件`)
    console.log(`   🟡 良好 (70-89): ${dist.good} 个文件`)
    console.log(`   🟠 一般 (50-69): ${dist.fair} 个文件`)
    console.log(`   🔴 较差 (<50): ${dist.poor} 个文件`)
    console.log(`   ❌ 错误: ${dist.error} 个文件`)

    // 问题统计
    console.log("\n🚨 问题类型统计:")
    const sortedIssues = Object.entries(report.issueStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    for (const [rule, count] of sortedIssues) {
      const ruleInfo = RULES[rule]
      const severity = ruleInfo ? ruleInfo.severity : "unknown"
      const icon = severity === "error" ? "🔴" : severity === "warning" ? "🟡" : "🔵"
      console.log(`   ${icon} ${rule}: ${count} 次`)
    }

    // 最需要改进的文件
    if (report.worstFiles.length > 0) {
      console.log("\n🎯 最需要改进的文件:")
      for (const file of report.worstFiles) {
        const relativePath = path.relative(CONFIG.targetDirectory, file.file)
        console.log(`   📁 ${relativePath} (评分: ${file.score}/100)`)

        // 显示主要问题
        const majorIssues = file.issues
          .filter((i) => i.severity === "error" || i.severity === "warning")
          .slice(0, 3)

        for (const issue of majorIssues) {
          const icon = issue.severity === "error" ? "🔴" : "🟡"
          console.log(`      ${icon} 第${issue.line}行: ${issue.message}`)
        }
      }
    }

    // 改进建议
    console.log("\n💡 改进建议:")
    const topIssues = Object.entries(report.issueStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    for (const [rule, count] of topIssues) {
      const ruleInfo = RULES[rule]
      if (ruleInfo && ruleInfo.suggestion) {
        console.log(`   • ${ruleInfo.suggestion} (影响 ${count} 处)`)
      }
    }

    console.log("\n" + "=".repeat(60))
  }

  static generateMarkdownReport(report, outputPath) {
    const content = `# Quartz 组件缓存一致性检查报告

生成时间: ${new Date().toISOString()}

## 📊 总体统计

- **检查文件数**: ${report.summary.totalFiles}
- **发现问题数**: ${report.summary.totalIssues}
- **平均评分**: ${report.summary.averageScore}/100

## 📈 合规等级分布

| 等级 | 评分范围 | 文件数 | 百分比 |
|------|----------|--------|--------|
| 🟢 优秀 | 90+ | ${report.summary.complianceDistribution.excellent} | ${Math.round((report.summary.complianceDistribution.excellent / report.summary.totalFiles) * 100)}% |
| 🟡 良好 | 70-89 | ${report.summary.complianceDistribution.good} | ${Math.round((report.summary.complianceDistribution.good / report.summary.totalFiles) * 100)}% |
| 🟠 一般 | 50-69 | ${report.summary.complianceDistribution.fair} | ${Math.round((report.summary.complianceDistribution.fair / report.summary.totalFiles) * 100)}% |
| 🔴 较差 | <50 | ${report.summary.complianceDistribution.poor} | ${Math.round((report.summary.complianceDistribution.poor / report.summary.totalFiles) * 100)}% |
| ❌ 错误 | - | ${report.summary.complianceDistribution.error} | ${Math.round((report.summary.complianceDistribution.error / report.summary.totalFiles) * 100)}% |

## 🚨 问题类型统计

${Object.entries(report.issueStats)
  .sort(([, a], [, b]) => b - a)
  .map(([rule, count]) => {
    const ruleInfo = RULES[rule]
    const severity = ruleInfo ? ruleInfo.severity : "unknown"
    const icon = severity === "error" ? "🔴" : severity === "warning" ? "🟡" : "🔵"
    return `- ${icon} **${rule}**: ${count} 次`
  })
  .join("\n")}

## 🎯 最需要改进的文件

${report.worstFiles
  .map((file) => {
    const relativePath = path.relative(CONFIG.targetDirectory, file.file)
    return `### 📁 ${relativePath} (评分: ${file.score}/100)\n\n${file.issues
      .filter((i) => i.severity === "error" || i.severity === "warning")
      .slice(0, 5)
      .map((issue) => {
        const icon = issue.severity === "error" ? "🔴" : "🟡"
        return `- ${icon} **第${issue.line}行**: ${issue.message}\n  - 建议: ${issue.suggestion}`
      })
      .join("\n")}`
  })
  .join("\n\n")}

## 💡 改进建议

${Object.entries(report.issueStats)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([rule, count]) => {
    const ruleInfo = RULES[rule]
    if (ruleInfo && ruleInfo.suggestion) {
      return `- **${ruleInfo.suggestion}** (影响 ${count} 处)`
    }
    return ""
  })
  .filter(Boolean)
  .join("\n")}

---

*报告由 Quartz 组件缓存一致性检查工具自动生成*`

    fs.writeFileSync(outputPath, content, "utf-8")
    console.log(`\n📄 详细报告已保存到: ${outputPath}`)
  }
}

/**
 * 主函数
 */
function main() {
  console.log("🚀 启动 Quartz 组件缓存一致性检查...")

  // 检查目标目录是否存在
  if (!fs.existsSync(CONFIG.targetDirectory)) {
    console.error(`❌ 目标目录不存在: ${CONFIG.targetDirectory}`)
    process.exit(1)
  }

  // 扫描文件
  const scanner = new FileScanner(CONFIG.targetDirectory)
  const files = scanner.scan()

  if (files.length === 0) {
    console.log("⚠️  未找到任何符合条件的文件")
    return
  }

  // 执行检查
  const checker = new CacheConsistencyChecker()
  const report = checker.checkAll(files)

  // 生成报告
  ReportGenerator.generateConsoleReport(report)

  // 保存详细报告
  const reportPath = path.join(CONFIG.targetDirectory, "cache-consistency-detailed-report.md")
  ReportGenerator.generateMarkdownReport(report, reportPath)

  // 保存 JSON 报告
  const jsonReportPath = path.join(CONFIG.targetDirectory, "cache-consistency-report.json")
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), "utf-8")
  console.log(`📊 JSON 报告已保存到: ${jsonReportPath}`)

  console.log("\n✅ 检查完成!")
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  FileScanner,
  CacheConsistencyChecker,
  ReportGenerator,
  CONFIG,
  RULES,
}
