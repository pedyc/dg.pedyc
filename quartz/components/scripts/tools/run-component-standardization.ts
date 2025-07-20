#!/usr/bin/env node
/**
 * 组件标准化自动化脚本
 * 扫描所有组件文件并应用统一的事件管理模式
 */

import { promises as fs } from "fs"
import { join, extname, relative } from "path"
import { componentStandardizer, StandardizationReport } from "./component-standardizer"

/**
 * 文件扫描器
 */
class ComponentFileScanner {
  private readonly targetExtensions = [".ts", ".tsx", ".js", ".jsx"]
  private readonly excludePatterns = [
    /node_modules/,
    /\.d\.ts$/,
    /\.test\./,
    /\.spec\./,
    /\.backup$/,
    /dist/,
    /build/,
  ]

  /**
   * 递归扫描目录
   */
  async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = []

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name)

        if (entry.isDirectory()) {
          // 递归扫描子目录
          const subFiles = await this.scanDirectory(fullPath)
          files.push(...subFiles)
        } else if (entry.isFile()) {
          // 检查文件是否符合条件
          if (this.shouldIncludeFile(fullPath)) {
            files.push(fullPath)
          }
        }
      }
    } catch (error) {
      console.error(`扫描目录失败 ${dirPath}:`, error)
    }

    return files
  }

  /**
   * 检查文件是否应该包含在扫描中
   */
  private shouldIncludeFile(filePath: string): boolean {
    // 检查文件扩展名
    const ext = extname(filePath)
    if (!this.targetExtensions.includes(ext)) {
      return false
    }

    // 检查排除模式
    for (const pattern of this.excludePatterns) {
      if (pattern.test(filePath)) {
        return false
      }
    }

    return true
  }

  /**
   * 扫描特定的组件文件
   */
  async scanComponentFiles(baseDir: string): Promise<{
    inlineScripts: string[]
    components: string[]
    managers: string[]
    utils: string[]
    all: string[]
  }> {
    const allFiles = await this.scanDirectory(baseDir)

    const categorized = {
      inlineScripts: allFiles.filter((f) => f.includes(".inline.ts")),
      components: allFiles.filter((f) => f.includes("/components/") && f.endsWith(".tsx")),
      managers: allFiles.filter((f) => f.includes("/managers/") || f.includes("Manager.ts")),
      utils: allFiles.filter((f) => f.includes("/utils/") || f.includes("/scripts/utils/")),
      all: allFiles,
    }

    return categorized
  }
}

/**
 * 标准化运行器
 */
class ComponentStandardizationRunner {
  private readonly scanner = new ComponentFileScanner()

  /**
   * 运行完整的组件标准化
   */
  async runFullStandardization(
    baseDir: string,
    options: {
      dryRun?: boolean
      createBackup?: boolean
      outputReport?: string
      categories?: string[]
    } = {},
  ): Promise<StandardizationReport> {
    const { dryRun = false, createBackup = true, outputReport, categories = ["all"] } = options

    console.log("🚀 开始组件标准化...")
    console.log(`📁 扫描目录: ${baseDir}`)
    console.log(`🔧 模式: ${dryRun ? "预览模式" : "应用模式"}`)
    console.log(`📋 类别: ${categories.join(", ")}`)
    console.log("")

    // 扫描文件
    const categorizedFiles = await this.scanner.scanComponentFiles(baseDir)

    // 根据类别选择文件
    let targetFiles: string[] = []
    if (categories.includes("all")) {
      targetFiles = categorizedFiles.all
    } else {
      categories.forEach((category) => {
        if (category in categorizedFiles) {
          targetFiles.push(...(categorizedFiles as any)[category])
        }
      })
      // 去重
      targetFiles = [...new Set(targetFiles)]
    }

    console.log(`📊 发现文件:`)
    console.log(`  - 内联脚本: ${categorizedFiles.inlineScripts.length}`)
    console.log(`  - 组件文件: ${categorizedFiles.components.length}`)
    console.log(`  - 管理器文件: ${categorizedFiles.managers.length}`)
    console.log(`  - 工具文件: ${categorizedFiles.utils.length}`)
    console.log(`  - 总计: ${categorizedFiles.all.length}`)
    console.log(`  - 目标文件: ${targetFiles.length}`)
    console.log("")

    // 执行标准化
    console.log("⚙️ 执行标准化...")
    const report = await componentStandardizer.standardizeFiles(targetFiles)

    // 显示进度
    this.printProgress(report)

    // 应用更改（如果不是预览模式）
    if (!dryRun && report.modifiedFiles > 0) {
      console.log("💾 应用更改...")
      await componentStandardizer.applyResults(
        report.results.filter((r) => r.hasChanges),
        createBackup,
      )
      console.log("✅ 更改已应用")
    } else if (dryRun) {
      console.log("👀 预览模式 - 未应用更改")
    }

    // 生成报告
    if (outputReport) {
      const reportContent = componentStandardizer.generateReport(report)
      await fs.writeFile(outputReport, reportContent, "utf-8")
      console.log(`📄 报告已保存到: ${outputReport}`)
    }

    return report
  }

  /**
   * 快速检查特定文件
   */
  async quickCheck(filePaths: string[]): Promise<void> {
    console.log("🔍 快速检查文件...")

    for (const filePath of filePaths) {
      try {
        const result = await componentStandardizer.standardizeFile(filePath)

        console.log(`\n📄 ${relative(process.cwd(), filePath)}`)

        if (result.hasChanges) {
          console.log(`  ✏️  需要修改`)
          console.log(`  📝 应用的规则: ${result.appliedRules.join(", ")}`)
        } else {
          console.log(`  ✅ 符合标准`)
        }

        if (result.issues.length > 0) {
          console.log(`  ⚠️  问题:`)
          result.issues.forEach((issue) => {
            console.log(`     - ${issue}`)
          })
        }
      } catch (error) {
        console.error(`❌ 检查失败 ${filePath}:`, error)
      }
    }
  }

  /**
   * 打印进度信息
   */
  private printProgress(report: StandardizationReport): void {
    console.log("📈 标准化结果:")
    console.log(`  - 总文件数: ${report.totalFiles}`)
    console.log(`  - 需要修改: ${report.modifiedFiles}`)
    console.log(`  - 修改率: ${((report.modifiedFiles / report.totalFiles) * 100).toFixed(1)}%`)

    if (report.appliedRules.size > 0) {
      console.log(`  - 应用的规则:`)
      Array.from(report.appliedRules.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // 只显示前5个最常用的规则
        .forEach(([rule, count]) => {
          console.log(`    * ${rule}: ${count} 次`)
        })
    }

    if (report.errors.length > 0) {
      console.log(`  - 错误数: ${report.errors.length}`)
      report.errors.slice(0, 3).forEach((error) => {
        console.log(`    * ${error}`)
      })
      if (report.errors.length > 3) {
        console.log(`    * ... 还有 ${report.errors.length - 3} 个错误`)
      }
    }

    console.log("")
  }

  /**
   * 生成标准化摘要
   */
  generateSummary(report: StandardizationReport): string {
    const lines: string[] = []

    lines.push("## 🎯 组件标准化摘要")
    lines.push("")

    // 总体统计
    lines.push("### 📊 总体统计")
    lines.push(`- **总文件数**: ${report.totalFiles}`)
    lines.push(`- **修改文件数**: ${report.modifiedFiles}`)
    lines.push(`- **修改率**: ${((report.modifiedFiles / report.totalFiles) * 100).toFixed(1)}%`)
    lines.push(`- **应用规则数**: ${report.appliedRules.size}`)
    lines.push("")

    // 规则应用统计
    if (report.appliedRules.size > 0) {
      lines.push("### 🔧 规则应用统计")
      const sortedRules = Array.from(report.appliedRules.entries()).sort(([, a], [, b]) => b - a)

      sortedRules.forEach(([rule, count]) => {
        const percentage = ((count / report.totalFiles) * 100).toFixed(1)
        lines.push(`- **${rule}**: ${count} 次 (${percentage}%)`)
      })
      lines.push("")
    }

    // 问题统计
    const allIssues = report.results.flatMap((r) => r.issues)
    if (allIssues.length > 0) {
      lines.push("### ⚠️ 发现的问题")
      const issueTypes = new Map<string, number>()

      allIssues.forEach((issue) => {
        const type = issue.split(":")[0]
        issueTypes.set(type, (issueTypes.get(type) || 0) + 1)
      })

      Array.from(issueTypes.entries())
        .sort(([, a], [, b]) => b - a)
        .forEach(([type, count]) => {
          lines.push(`- **${type}**: ${count} 个`)
        })
      lines.push("")
    }

    // 改进建议
    lines.push("### 💡 改进建议")

    if (report.modifiedFiles === 0) {
      lines.push("- ✅ 所有组件已符合统一标准，无需进一步改进")
    } else {
      const modificationRate = report.modifiedFiles / report.totalFiles

      if (modificationRate > 0.7) {
        lines.push("- 🔄 大部分组件需要标准化，建议分批次进行重构")
        lines.push("- 📚 考虑为团队提供标准化培训")
      } else if (modificationRate > 0.3) {
        lines.push("- 🎯 部分组件需要标准化，可以逐步改进")
        lines.push("- 📋 建立代码审查清单确保新代码符合标准")
      } else {
        lines.push("- 🌟 大部分组件已符合标准，只需少量调整")
        lines.push("- 🔍 重点关注问题较多的组件")
      }
    }

    lines.push("")

    return lines.join("\n")
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2)
  const runner = new ComponentStandardizationRunner()

  // 解析命令行参数
  const options = {
    dryRun: args.includes("--dry-run") || args.includes("-d"),
    createBackup: !args.includes("--no-backup"),
    outputReport: args.find((arg) => arg.startsWith("--report="))?.split("=")[1],
    categories: args
      .find((arg) => arg.startsWith("--categories="))
      ?.split("=")[1]
      ?.split(",") || ["all"],
    quickCheck: args.includes("--quick-check") || args.includes("-q"),
  }

  // 获取基础目录
  const baseDir =
    args.find((arg) => !arg.startsWith("-")) || "d:/Workspace/pedyc/dg.pedyc/quartz/components"

  try {
    if (options.quickCheck) {
      // 快速检查模式
      const files = args.filter((arg) => !arg.startsWith("-") && arg !== baseDir)
      if (files.length === 0) {
        console.error("❌ 快速检查模式需要指定文件路径")
        process.exit(1)
      }
      await runner.quickCheck(files)
    } else {
      // 完整标准化模式
      const report = await runner.runFullStandardization(baseDir, {
        dryRun: options.dryRun,
        createBackup: options.createBackup,
        outputReport: options.outputReport || "component-standardization-report.md",
        categories: options.categories,
      })

      // 生成摘要
      const summary = runner.generateSummary(report)
      console.log(summary)

      // 保存摘要
      const summaryPath = "component-standardization-summary.md"
      await fs.writeFile(summaryPath, summary, "utf-8")
      console.log(`📋 摘要已保存到: ${summaryPath}`)
    }

    console.log("🎉 标准化完成！")
  } catch (error) {
    console.error("❌ 标准化失败:", error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error)
}

// 导出供其他模块使用
export { ComponentStandardizationRunner, ComponentFileScanner }
