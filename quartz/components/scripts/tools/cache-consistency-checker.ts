/**
 * 缓存一致性检查工具
 * 用于验证所有组件是否正确应用了统一的缓存键生成逻辑和缓存应用逻辑
 */

// import { CacheKeyFactory } from "../cache"

export interface CacheUsageReport {
  componentName: string
  file: string
  issues: CacheIssue[]
  score: number // 0-100 的一致性评分
}

export interface CacheIssue {
  type:
    | "hardcoded-key"
    | "direct-storage"
    | "missing-cleanup"
    | "inconsistent-prefix"
    | "missing-ttl"
  severity: "error" | "warning" | "info"
  line?: number
  description: string
  suggestion: string
  code?: string
}

export interface CacheConsistencyReport {
  totalComponents: number
  compliantComponents: number
  averageScore: number
  componentReports: CacheUsageReport[]
  globalIssues: CacheIssue[]
  recommendations: string[]
}

/**
 * 缓存一致性检查器
 */
export class CacheConsistencyChecker {
  private readonly patterns = {
    // 硬编码缓存键模式
    hardcodedKeys: [
      /localStorage\.(get|set)Item\s*\(\s*['"`]([^'"`)]+)['"`]/g,
      /sessionStorage\.(get|set)Item\s*\(\s*['"`]([^'"`)]+)['"`]/g,
      /['"`]([a-zA-Z0-9_-]+_[a-zA-Z0-9_-]+)['"`]\s*:/g, // 可能的硬编码键
    ],

    // 直接存储访问模式
    directStorage: [/localStorage\.(get|set|remove)Item/g, /sessionStorage\.(get|set|remove)Item/g],

    // CacheKeyFactory 使用模式
    cacheKeyFactory: [/CacheKeyFactory\.(generateSystemKey|generateUserKey|generateContentKey)/g],

    // 全局管理器使用模式
    globalManagers: [
      /globalStorageManager\.instance\.(get|set)Item/g,
      /globalCacheManager\.instance\.(get|set|has|delete)/g,
    ],
  }

  /**
   * 检查单个文件的缓存使用情况
   */
  public checkFile(filePath: string, content: string): CacheUsageReport {
    const componentName = this.extractComponentName(filePath)
    const issues: CacheIssue[] = []

    // 检查硬编码缓存键
    issues.push(...this.checkHardcodedKeys(content))

    // 检查直接存储访问
    issues.push(...this.checkDirectStorageAccess(content))

    // 检查缓存键工厂使用
    const hasFactoryUsage = this.checkCacheKeyFactoryUsage(content)

    // 检查全局管理器使用
    const hasGlobalManagerUsage = this.checkGlobalManagerUsage(content)

    // 检查一致性
    issues.push(...this.checkConsistency(content, hasFactoryUsage, hasGlobalManagerUsage))

    // 计算评分
    const score = this.calculateScore(issues)

    return {
      componentName,
      file: filePath,
      issues,
      score,
    }
  }

  /**
   * 检查硬编码缓存键
   */
  private checkHardcodedKeys(content: string): CacheIssue[] {
    const issues: CacheIssue[] = []
    const lines = content.split("\n")

    this.patterns.hardcodedKeys.forEach((pattern) => {
      lines.forEach((line, index) => {
        const matches = Array.from(line.matchAll(pattern))
        matches.forEach((match) => {
          if (this.isLikelyHardcodedKey(match[2] || match[1])) {
            issues.push({
              type: "hardcoded-key",
              severity: "error",
              line: index + 1,
              description: `发现硬编码缓存键: "${match[2] || match[1]}"`,
              suggestion: "使用 CacheKeyFactory.generateSystemKey() 等方法生成缓存键",
              code: line.trim(),
            })
          }
        })
      })
    })

    return issues
  }

  /**
   * 检查直接存储访问
   */
  private checkDirectStorageAccess(content: string): CacheIssue[] {
    const issues: CacheIssue[] = []
    const lines = content.split("\n")

    this.patterns.directStorage.forEach((pattern) => {
      lines.forEach((line, index) => {
        const matches = Array.from(line.matchAll(pattern))
        matches.forEach((match) => {
          issues.push({
            type: "direct-storage",
            severity: "warning",
            line: index + 1,
            description: `直接访问 ${match[0]}，应使用全局存储管理器`,
            suggestion: "使用 globalStorageManager.instance.setItem() 或 getItem()",
            code: line.trim(),
          })
        })
      })
    })

    return issues
  }

  /**
   * 检查缓存键工厂使用
   */
  private checkCacheKeyFactoryUsage(content: string): boolean {
    return this.patterns.cacheKeyFactory.some((pattern) => pattern.test(content))
  }

  /**
   * 检查全局管理器使用
   */
  private checkGlobalManagerUsage(content: string): boolean {
    return this.patterns.globalManagers.some((pattern) => pattern.test(content))
  }

  /**
   * 检查一致性
   */
  private checkConsistency(
    content: string,
    hasFactoryUsage: boolean,
    hasGlobalManagerUsage: boolean,
  ): CacheIssue[] {
    const issues: CacheIssue[] = []

    // 检查是否有缓存操作但没有使用工厂
    const hasCacheOperations = /cache|storage|localStorage|sessionStorage/i.test(content)

    if (hasCacheOperations && !hasFactoryUsage) {
      issues.push({
        type: "inconsistent-prefix",
        severity: "warning",
        description: "检测到缓存操作但未使用 CacheKeyFactory",
        suggestion: "使用 CacheKeyFactory 生成一致的缓存键",
      })
    }

    if (hasCacheOperations && !hasGlobalManagerUsage) {
      issues.push({
        type: "direct-storage",
        severity: "warning",
        description: "检测到缓存操作但未使用全局管理器",
        suggestion: "使用 globalStorageManager 或 globalCacheManager",
      })
    }

    return issues
  }

  /**
   * 判断是否为硬编码键
   */
  private isLikelyHardcodedKey(key: string): boolean {
    if (!key || key.length < 3) return false

    // 排除明显的非缓存键
    const excludePatterns = [
      /^(class|id|data-|aria-)/,
      /^(http|https|ftp):/,
      /\.(js|css|html|json)$/,
      /^[0-9]+$/,
    ]

    if (excludePatterns.some((pattern) => pattern.test(key))) {
      return false
    }

    // 包含下划线或连字符的可能是缓存键
    return /_|-/.test(key) && key.length > 5
  }

  /**
   * 计算一致性评分
   */
  private calculateScore(issues: CacheIssue[]): number {
    let score = 100

    issues.forEach((issue) => {
      switch (issue.severity) {
        case "error":
          score -= 20
          break
        case "warning":
          score -= 10
          break
        case "info":
          score -= 5
          break
      }
    })

    return Math.max(0, score)
  }

  /**
   * 提取组件名称
   */
  private extractComponentName(filePath: string): string {
    const fileName = filePath.split("/").pop() || filePath
    return fileName.replace(/\.(ts|tsx|js|jsx)$/, "")
  }

  /**
   * 生成一致性报告
   */
  public generateReport(componentReports: CacheUsageReport[]): CacheConsistencyReport {
    const totalComponents = componentReports.length
    const compliantComponents = componentReports.filter((report) => report.score >= 80).length
    const averageScore =
      componentReports.reduce((sum, report) => sum + report.score, 0) / totalComponents

    const globalIssues = this.analyzeGlobalIssues(componentReports)
    const recommendations = this.generateRecommendations(componentReports, globalIssues)

    return {
      totalComponents,
      compliantComponents,
      averageScore,
      componentReports,
      globalIssues,
      recommendations,
    }
  }

  /**
   * 分析全局问题
   */
  private analyzeGlobalIssues(reports: CacheUsageReport[]): CacheIssue[] {
    const globalIssues: CacheIssue[] = []

    // 统计问题类型
    const issueStats = new Map<string, number>()
    reports.forEach((report) => {
      report.issues.forEach((issue) => {
        const key = `${issue.type}-${issue.severity}`
        issueStats.set(key, (issueStats.get(key) || 0) + 1)
      })
    })

    // 生成全局问题报告
    if (issueStats.get("hardcoded-key-error") || 0 > reports.length * 0.3) {
      globalIssues.push({
        type: "hardcoded-key",
        severity: "error",
        description: "超过30%的组件使用硬编码缓存键",
        suggestion: "建立缓存键生成标准并强制执行",
      })
    }

    if (issueStats.get("direct-storage-warning") || 0 > reports.length * 0.5) {
      globalIssues.push({
        type: "direct-storage",
        severity: "warning",
        description: "超过50%的组件直接访问存储API",
        suggestion: "推广使用全局存储管理器",
      })
    }

    return globalIssues
  }

  /**
   * 生成改进建议
   */
  private generateRecommendations(
    reports: CacheUsageReport[],
    _globalIssues: CacheIssue[],
  ): string[] {
    const recommendations: string[] = []

    const lowScoreComponents = reports.filter((report) => report.score < 60)
    if (lowScoreComponents.length > 0) {
      recommendations.push(
        `优先重构以下低分组件: ${lowScoreComponents.map((r) => r.componentName).join(", ")}`,
      )
    }

    const hasHardcodedKeys = reports.some((report) =>
      report.issues.some((issue) => issue.type === "hardcoded-key"),
    )
    if (hasHardcodedKeys) {
      recommendations.push("建立 ESLint 规则禁止硬编码缓存键，强制使用 CacheKeyFactory")
    }

    const hasDirectStorage = reports.some((report) =>
      report.issues.some((issue) => issue.type === "direct-storage"),
    )
    if (hasDirectStorage) {
      recommendations.push("创建存储访问的 TypeScript 类型检查，确保使用全局管理器")
    }

    if (reports.length > 0) {
      const avgScore = reports.reduce((sum, r) => sum + r.score, 0) / reports.length
      if (avgScore < 80) {
        recommendations.push("整体缓存一致性评分较低，建议制定缓存使用规范并进行团队培训")
      }
    }

    return recommendations
  }

  /**
   * 输出格式化报告
   */
  public formatReport(report: CacheConsistencyReport): string {
    const lines: string[] = []

    lines.push("# 缓存一致性检查报告")
    lines.push("")
    lines.push(`## 总体概况`)
    lines.push(`- 总组件数: ${report.totalComponents}`)
    lines.push(
      `- 合规组件数: ${report.compliantComponents} (${((report.compliantComponents / report.totalComponents) * 100).toFixed(1)}%)`,
    )
    lines.push(`- 平均评分: ${report.averageScore.toFixed(1)}/100`)
    lines.push("")

    if (report.globalIssues.length > 0) {
      lines.push("## 全局问题")
      report.globalIssues.forEach((issue) => {
        lines.push(`- **${issue.severity.toUpperCase()}**: ${issue.description}`)
        lines.push(`  - 建议: ${issue.suggestion}`)
      })
      lines.push("")
    }

    lines.push("## 组件详情")
    report.componentReports
      .sort((a, b) => a.score - b.score)
      .forEach((componentReport) => {
        lines.push(`### ${componentReport.componentName} (评分: ${componentReport.score}/100)`)
        lines.push(`文件: ${componentReport.file}`)

        if (componentReport.issues.length === 0) {
          lines.push("✅ 无问题发现")
        } else {
          componentReport.issues.forEach((issue) => {
            lines.push(
              `- **${issue.severity.toUpperCase()}** (${issue.type}): ${issue.description}`,
            )
            if (issue.line) {
              lines.push(`  - 行号: ${issue.line}`)
            }
            if (issue.code) {
              lines.push(`  - 代码: \`${issue.code}\``)
            }
            lines.push(`  - 建议: ${issue.suggestion}`)
          })
        }
        lines.push("")
      })

    if (report.recommendations.length > 0) {
      lines.push("## 改进建议")
      report.recommendations.forEach((rec, index) => {
        lines.push(`${index + 1}. ${rec}`)
      })
    }

    return lines.join("\n")
  }
}

// 导出单例实例
export const cacheConsistencyChecker = new CacheConsistencyChecker()
