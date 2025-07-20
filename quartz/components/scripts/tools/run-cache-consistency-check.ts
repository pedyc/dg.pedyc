/**
 * 缓存一致性检查运行脚本
 * 自动扫描所有组件文件并生成一致性报告
 */

import { promises as fs } from "fs"
import { join, extname } from "path"
import {
  cacheConsistencyChecker,
  type CacheUsageReport,
  type CacheConsistencyReport,
} from "./cache-consistency-checker"

/**
 * 文件扫描器
 */
class FileScanner {
  private readonly extensions = [".ts", ".tsx", ".js", ".jsx"]
  private readonly excludePatterns = [
    /node_modules/,
    /\.git/,
    /dist/,
    /build/,
    /coverage/,
    /\.next/,
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

        // 跳过排除的路径
        if (this.excludePatterns.some((pattern) => pattern.test(fullPath))) {
          continue
        }

        if (entry.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath)
          files.push(...subFiles)
        } else if (entry.isFile() && this.isTargetFile(entry.name)) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error)
    }

    return files
  }

  /**
   * 检查是否为目标文件
   */
  private isTargetFile(fileName: string): boolean {
    return this.extensions.includes(extname(fileName))
  }
}

/**
 * 缓存一致性检查运行器
 */
export class CacheConsistencyRunner {
  private readonly scanner = new FileScanner()
  private readonly componentsDir: string
  private readonly outputDir: string

  constructor(
    componentsDir: string = "d:/Workspace/pedyc/dg.pedyc/quartz/components",
    outputDir: string = "d:/Workspace/pedyc/dg.pedyc/quartz/components/scripts/reports",
  ) {
    this.componentsDir = componentsDir
    this.outputDir = outputDir
  }

  /**
   * 运行完整的缓存一致性检查
   */
  async run(): Promise<CacheConsistencyReport> {
    console.log("🔍 开始缓存一致性检查...")
    console.log(`📁 扫描目录: ${this.componentsDir}`)

    // 扫描所有文件
    const files = await this.scanner.scanDirectory(this.componentsDir)
    console.log(`📄 找到 ${files.length} 个文件`)

    // 检查每个文件
    const componentReports: CacheUsageReport[] = []
    let processedCount = 0

    for (const file of files) {
      try {
        const content = await fs.readFile(file, "utf-8")
        const report = cacheConsistencyChecker.checkFile(file, content)
        componentReports.push(report)

        processedCount++
        if (processedCount % 10 === 0) {
          console.log(`⏳ 已处理 ${processedCount}/${files.length} 个文件`)
        }
      } catch (error) {
        console.warn(`⚠️  无法读取文件 ${file}:`, error)
      }
    }

    console.log(`✅ 处理完成，共检查 ${componentReports.length} 个文件`)

    // 生成报告
    const report = cacheConsistencyChecker.generateReport(componentReports)

    // 保存报告
    await this.saveReport(report)

    // 输出摘要
    this.printSummary(report)

    return report
  }

  /**
   * 保存报告到文件
   */
  private async saveReport(report: CacheConsistencyReport): Promise<void> {
    try {
      // 确保输出目录存在
      await fs.mkdir(this.outputDir, { recursive: true })

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

      // 保存详细报告 (Markdown)
      const markdownReport = cacheConsistencyChecker.formatReport(report)
      const markdownPath = join(this.outputDir, `cache-consistency-${timestamp}.md`)
      await fs.writeFile(markdownPath, markdownReport, "utf-8")
      console.log(`📝 详细报告已保存: ${markdownPath}`)

      // 保存 JSON 数据
      const jsonPath = join(this.outputDir, `cache-consistency-${timestamp}.json`)
      await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf-8")
      console.log(`📊 JSON 数据已保存: ${jsonPath}`)

      // 保存最新报告的副本
      const latestMarkdownPath = join(this.outputDir, "cache-consistency-latest.md")
      const latestJsonPath = join(this.outputDir, "cache-consistency-latest.json")
      await fs.writeFile(latestMarkdownPath, markdownReport, "utf-8")
      await fs.writeFile(latestJsonPath, JSON.stringify(report, null, 2), "utf-8")
    } catch (error) {
      console.error("❌ 保存报告失败:", error)
    }
  }

  /**
   * 打印摘要信息
   */
  private printSummary(report: CacheConsistencyReport): void {
    console.log("\n📋 缓存一致性检查摘要")
    console.log("=".repeat(50))
    console.log(`📊 总组件数: ${report.totalComponents}`)
    console.log(
      `✅ 合规组件数: ${report.compliantComponents} (${((report.compliantComponents / report.totalComponents) * 100).toFixed(1)}%)`,
    )
    console.log(`📈 平均评分: ${report.averageScore.toFixed(1)}/100`)

    // 评分分布
    const scoreRanges = {
      "90-100": 0,
      "80-89": 0,
      "70-79": 0,
      "60-69": 0,
      "0-59": 0,
    }

    report.componentReports.forEach((r) => {
      if (r.score >= 90) scoreRanges["90-100"]++
      else if (r.score >= 80) scoreRanges["80-89"]++
      else if (r.score >= 70) scoreRanges["70-79"]++
      else if (r.score >= 60) scoreRanges["60-69"]++
      else scoreRanges["0-59"]++
    })

    console.log("\n📊 评分分布:")
    Object.entries(scoreRanges).forEach(([range, count]) => {
      const percentage = ((count / report.totalComponents) * 100).toFixed(1)
      console.log(`   ${range}: ${count} 个组件 (${percentage}%)`)
    })

    // 问题统计
    const issueStats = new Map<string, number>()
    report.componentReports.forEach((r) => {
      r.issues.forEach((issue) => {
        const key = `${issue.type}-${issue.severity}`
        issueStats.set(key, (issueStats.get(key) || 0) + 1)
      })
    })

    if (issueStats.size > 0) {
      console.log("\n⚠️  问题统计:")
      Array.from(issueStats.entries())
        .sort(([, a], [, b]) => b - a)
        .forEach(([type, count]) => {
          console.log(`   ${type}: ${count} 个`)
        })
    }

    // 最需要改进的组件
    const worstComponents = report.componentReports
      .filter((r) => r.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)

    if (worstComponents.length > 0) {
      console.log("\n🔧 最需要改进的组件:")
      worstComponents.forEach((r) => {
        console.log(`   ${r.componentName}: ${r.score}/100 (${r.issues.length} 个问题)`)
      })
    }

    // 全局问题
    if (report.globalIssues.length > 0) {
      console.log("\n🚨 全局问题:")
      report.globalIssues.forEach((issue) => {
        console.log(`   ${issue.severity.toUpperCase()}: ${issue.description}`)
      })
    }

    // 改进建议
    if (report.recommendations.length > 0) {
      console.log("\n💡 改进建议:")
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`)
      })
    }

    console.log("\n" + "=".repeat(50))
  }

  /**
   * 运行快速检查（仅检查特定文件）
   */
  async quickCheck(filePaths: string[]): Promise<CacheUsageReport[]> {
    console.log(`🔍 快速检查 ${filePaths.length} 个文件...`)

    const reports: CacheUsageReport[] = []

    for (const filePath of filePaths) {
      try {
        const content = await fs.readFile(filePath, "utf-8")
        const report = cacheConsistencyChecker.checkFile(filePath, content)
        reports.push(report)

        console.log(
          `✅ ${report.componentName}: ${report.score}/100 (${report.issues.length} 个问题)`,
        )
      } catch (error) {
        console.warn(`⚠️  无法检查文件 ${filePath}:`, error)
      }
    }

    return reports
  }
}

/**
 * 命令行接口
 */
if (require.main === module) {
  const runner = new CacheConsistencyRunner()

  // 检查命令行参数
  const args = process.argv.slice(2)

  if (args.length > 0 && args[0] === "--quick") {
    // 快速检查模式
    const files = args.slice(1)
    if (files.length === 0) {
      console.error("❌ 快速检查模式需要指定文件路径")
      process.exit(1)
    }

    runner
      .quickCheck(files)
      .then(() => {
        console.log("✅ 快速检查完成")
      })
      .catch((error) => {
        console.error("❌ 快速检查失败:", error)
        process.exit(1)
      })
  } else {
    // 完整检查模式
    runner
      .run()
      .then((report) => {
        const exitCode = report.averageScore >= 80 ? 0 : 1
        console.log(`\n🏁 检查完成，退出码: ${exitCode}`)
        process.exit(exitCode)
      })
      .catch((error) => {
        console.error("❌ 检查失败:", error)
        process.exit(1)
      })
  }
}

// 导出运行器
export const cacheConsistencyRunner = new CacheConsistencyRunner()
