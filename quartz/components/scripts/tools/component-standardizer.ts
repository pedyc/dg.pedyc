/**
 * 组件事件管理标准化工具
 * 自动重构现有组件以符合统一的事件管理模式
 */

import { promises as fs } from "fs"
import { basename } from "path"

export interface StandardizationRule {
  name: string
  description: string
  pattern: RegExp
  replacement: string | ((match: string, ...groups: string[]) => string)
  priority: number // 1-10, 数字越大优先级越高
}

export interface StandardizationResult {
  filePath: string
  originalContent: string
  modifiedContent: string
  appliedRules: string[]
  hasChanges: boolean
  issues: string[]
}

export interface StandardizationReport {
  totalFiles: number
  modifiedFiles: number
  totalRules: number
  appliedRules: Map<string, number>
  results: StandardizationResult[]
  errors: string[]
}

/**
 * 组件标准化器
 */
export class ComponentStandardizer {
  private readonly rules: StandardizationRule[] = [
    // 1. 导入语句标准化
    {
      name: "import-global-managers",
      description: "添加全局管理器导入",
      pattern: /^(import.*from ['"].*['"])$/m,
      replacement: (match) => {
        if (match.includes("globalResourceManager") || match.includes("./managers")) {
          return match
        }
        return `${match}\nimport { globalResourceManager, globalStorageManager, globalCacheManager } from "./managers"`
      },
      priority: 9,
    },

    {
      name: "import-cache-factory",
      description: "添加缓存工厂导入",
      pattern: /^(import.*from ['"].*['"])$/m,
      replacement: (match) => {
        if (match.includes("CacheKeyFactory") || match.includes("./cache")) {
          return match
        }
        return `${match}\nimport { CacheKeyFactory } from "./cache"`
      },
      priority: 8,
    },

    // 2. 硬编码缓存键替换
    {
      name: "replace-hardcoded-theme-key",
      description: "替换硬编码的主题缓存键",
      pattern: /['"`]theme[_-]?preference['"`]/g,
      replacement: 'CacheKeyFactory.generateSystemKey("theme", "preference")',
      priority: 7,
    },

    {
      name: "replace-hardcoded-user-keys",
      description: "替换硬编码的用户相关缓存键",
      pattern: /['"`]user[_-]([a-zA-Z0-9_-]+)['"`]/g,
      replacement: 'CacheKeyFactory.generateUserKey("user", userId, "$1")',
      priority: 7,
    },

    // 3. 直接存储访问替换
    {
      name: "replace-localStorage-setItem",
      description: "替换 localStorage.setItem",
      pattern: /localStorage\.setItem\s*\(\s*([^,]+),\s*([^)]+)\)/g,
      replacement: "globalStorageManager.instance.setItem('local', $1, $2)",
      priority: 6,
    },

    {
      name: "replace-localStorage-getItem",
      description: "替换 localStorage.getItem",
      pattern: /localStorage\.getItem\s*\(\s*([^)]+)\)/g,
      replacement: "globalStorageManager.instance.getItem('local', $1)",
      priority: 6,
    },

    {
      name: "replace-sessionStorage-setItem",
      description: "替换 sessionStorage.setItem",
      pattern: /sessionStorage\.setItem\s*\(\s*([^,]+),\s*([^)]+)\)/g,
      replacement: "globalStorageManager.instance.setItem('session', $1, $2)",
      priority: 6,
    },

    {
      name: "replace-sessionStorage-getItem",
      description: "替换 sessionStorage.getItem",
      pattern: /sessionStorage\.getItem\s*\(\s*([^)]+)\)/g,
      replacement: "globalStorageManager.instance.getItem('session', $1)",
      priority: 6,
    },

    // 4. 事件监听器标准化
    {
      name: "add-cleanup-for-addEventListener",
      description: "为 addEventListener 添加清理逻辑",
      pattern: /(\w+)\.addEventListener\s*\(\s*['"`]([^'"`)]+)['"`],\s*(\w+)\s*\)/g,
      replacement: (_match, element, event, handler) => {
        return `${element}.addEventListener('${event}', ${handler})\n  window.addCleanup(() => ${element}.removeEventListener('${event}', ${handler}))`
      },
      priority: 5,
    },

    // 5. 组件初始化模式
    {
      name: "add-component-setup-pattern",
      description: "添加标准组件设置模式",
      pattern: /document\.addEventListener\s*\(\s*['"`]nav['"`],\s*([^)]+)\)/g,
      replacement: (_match, handler) => {
        return `// 防止重复初始化的标志\nlet componentEventListenersSetup = false\n\n/**\n * 设置组件事件监听器\n */\nfunction setupComponentEventListeners() {\n  if (!globalResourceManager.instance) {\n    console.error('[Component] Global instances not available')\n    return\n  }\n\n  if (componentEventListenersSetup) {\n    console.log('[Component] 事件监听器已设置，跳过重复注册')\n    return\n  }\n\n  globalResourceManager.instance.addEventListener(document as any, "nav", ${handler})\n  componentEventListenersSetup = true\n}\n\nsetupComponentEventListeners()`
      },
      priority: 4,
    },

    // 6. 清理函数标准化
    {
      name: "standardize-cleanup-registration",
      description: "标准化清理函数注册",
      pattern: /window\.addCleanup\s*\(\s*\(\)\s*=>\s*([^}]+)\}/g,
      replacement: "globalResourceManager.instance.addCleanupTask(() => {\n    $1\n  })",
      priority: 3,
    },

    // 7. 日志标准化
    {
      name: "standardize-console-log",
      description: "标准化控制台日志格式",
      pattern: /console\.log\s*\(\s*['"`]([^'"`)]*)['"`]/g,
      replacement: (match, message) => {
        const componentName = this.extractComponentNameFromContext(match)
        return `console.log('[${componentName}] ${message}')`
      },
      priority: 2,
    },

    // 8. 错误处理标准化
    {
      name: "standardize-error-handling",
      description: "标准化错误处理",
      pattern: /console\.error\s*\(\s*['"`]([^'"`)]*)['"`]/g,
      replacement: (match, message) => {
        const componentName = this.extractComponentNameFromContext(match)
        return `console.error('[${componentName}] ${message}')`
      },
      priority: 2,
    },
  ]

  /**
   * 标准化单个文件
   */
  async standardizeFile(filePath: string): Promise<StandardizationResult> {
    const originalContent = await fs.readFile(filePath, "utf-8")
    let modifiedContent = originalContent
    const appliedRules: string[] = []
    const issues: string[] = []

    // 按优先级排序规则
    const sortedRules = [...this.rules].sort((a, b) => b.priority - a.priority)

    // 应用每个规则
    for (const rule of sortedRules) {
      try {
        const beforeContent = modifiedContent

        if (typeof rule.replacement === "string") {
          modifiedContent = modifiedContent.replace(rule.pattern, rule.replacement)
        } else {
          modifiedContent = modifiedContent.replace(rule.pattern, rule.replacement)
        }

        if (beforeContent !== modifiedContent) {
          appliedRules.push(rule.name)
        }
      } catch (error) {
        issues.push(`规则 ${rule.name} 应用失败: ${error}`)
      }
    }

    // 执行额外的验证和修复
    const validationResult = this.validateAndFix(modifiedContent, filePath)
    modifiedContent = validationResult.content
    issues.push(...validationResult.issues)

    return {
      filePath,
      originalContent,
      modifiedContent,
      appliedRules,
      hasChanges: originalContent !== modifiedContent,
      issues,
    }
  }

  /**
   * 验证和修复内容
   */
  private validateAndFix(
    content: string,
    _filePath: string,
  ): { content: string; issues: string[] } {
    let fixedContent = content
    const issues: string[] = []

    // 检查是否缺少必要的导入
    const missingImports = this.checkMissingImports(content)
    if (missingImports.length > 0) {
      fixedContent = this.addMissingImports(fixedContent, missingImports)
      issues.push(`添加了缺失的导入: ${missingImports.join(", ")}`)
    }

    // 检查是否有未处理的硬编码键
    const hardcodedKeys = this.findHardcodedKeys(content)
    if (hardcodedKeys.length > 0) {
      issues.push(`发现未处理的硬编码键: ${hardcodedKeys.join(", ")}`)
    }

    // 检查是否有未处理的直接存储访问
    const directStorageAccess = this.findDirectStorageAccess(content)
    if (directStorageAccess.length > 0) {
      issues.push(`发现未处理的直接存储访问: ${directStorageAccess.join(", ")}`)
    }

    return { content: fixedContent, issues }
  }

  /**
   * 检查缺失的导入
   */
  private checkMissingImports(content: string): string[] {
    const missing: string[] = []

    if (
      content.includes("globalResourceManager") &&
      !content.includes("import.*globalResourceManager")
    ) {
      missing.push("globalResourceManager")
    }

    if (content.includes("CacheKeyFactory") && !content.includes("import.*CacheKeyFactory")) {
      missing.push("CacheKeyFactory")
    }

    if (
      content.includes("globalStorageManager") &&
      !content.includes("import.*globalStorageManager")
    ) {
      missing.push("globalStorageManager")
    }

    return missing
  }

  /**
   * 添加缺失的导入
   */
  private addMissingImports(content: string, imports: string[]): string {
    const lines = content.split("\n")
    const importIndex = lines.findIndex((line) => line.startsWith("import"))

    if (importIndex === -1) {
      // 如果没有导入语句，在文件开头添加
      const newImports = this.generateImportStatements(imports)
      return newImports + "\n\n" + content
    }

    // 在最后一个导入语句后添加
    let lastImportIndex = importIndex
    for (let i = importIndex; i < lines.length; i++) {
      if (lines[i].startsWith("import") || lines[i].trim() === "") {
        lastImportIndex = i
      } else {
        break
      }
    }

    const newImports = this.generateImportStatements(imports)
    lines.splice(lastImportIndex + 1, 0, newImports)

    return lines.join("\n")
  }

  /**
   * 生成导入语句
   */
  private generateImportStatements(imports: string[]): string {
    const statements: string[] = []

    if (
      imports.some((imp) =>
        ["globalResourceManager", "globalStorageManager", "globalCacheManager"].includes(imp),
      )
    ) {
      const managerImports = imports.filter((imp) =>
        ["globalResourceManager", "globalStorageManager", "globalCacheManager"].includes(imp),
      )
      statements.push(`import { ${managerImports.join(", ")} } from "./managers"`)
    }

    if (imports.includes("CacheKeyFactory")) {
      statements.push('import { CacheKeyFactory } from "./cache"')
    }

    return statements.join("\n")
  }

  /**
   * 查找硬编码键
   */
  private findHardcodedKeys(content: string): string[] {
    const keys: string[] = []
    const patterns = [
      /['"`]([a-zA-Z0-9_-]+_[a-zA-Z0-9_-]+)['"`]/g,
      /localStorage\.(get|set)Item\s*\(\s*['"`]([^'"`)]+)['"`]/g,
    ]

    patterns.forEach((pattern) => {
      const matches = Array.from(content.matchAll(pattern))
      matches.forEach((match) => {
        const key = match[2] || match[1]
        if (key && key.length > 5 && !keys.includes(key)) {
          keys.push(key)
        }
      })
    })

    return keys
  }

  /**
   * 查找直接存储访问
   */
  private findDirectStorageAccess(content: string): string[] {
    const accesses: string[] = []
    const patterns = [
      /localStorage\.(get|set|remove)Item/g,
      /sessionStorage\.(get|set|remove)Item/g,
    ]

    patterns.forEach((pattern) => {
      const matches = Array.from(content.matchAll(pattern))
      matches.forEach((match) => {
        if (!accesses.includes(match[0])) {
          accesses.push(match[0])
        }
      })
    })

    return accesses
  }

  /**
   * 从上下文提取组件名称
   */
  private extractComponentNameFromContext(_context: string): string {
    // 这里可以根据实际情况实现更复杂的逻辑
    return "Component"
  }

  /**
   * 标准化多个文件
   */
  async standardizeFiles(filePaths: string[]): Promise<StandardizationReport> {
    const results: StandardizationResult[] = []
    const errors: string[] = []
    const appliedRules = new Map<string, number>()

    for (const filePath of filePaths) {
      try {
        const result = await this.standardizeFile(filePath)
        results.push(result)

        // 统计应用的规则
        result.appliedRules.forEach((rule) => {
          appliedRules.set(rule, (appliedRules.get(rule) || 0) + 1)
        })
      } catch (error) {
        errors.push(`处理文件 ${filePath} 失败: ${error}`)
      }
    }

    return {
      totalFiles: filePaths.length,
      modifiedFiles: results.filter((r) => r.hasChanges).length,
      totalRules: this.rules.length,
      appliedRules,
      results,
      errors,
    }
  }

  /**
   * 应用标准化结果（写入文件）
   */
  async applyResults(
    results: StandardizationResult[],
    createBackup: boolean = true,
  ): Promise<void> {
    for (const result of results) {
      if (!result.hasChanges) continue

      try {
        // 创建备份
        if (createBackup) {
          const backupPath = result.filePath + ".backup"
          await fs.writeFile(backupPath, result.originalContent, "utf-8")
        }

        // 写入修改后的内容
        await fs.writeFile(result.filePath, result.modifiedContent, "utf-8")

        console.log(`✅ 已标准化: ${result.filePath}`)
        if (result.appliedRules.length > 0) {
          console.log(`   应用的规则: ${result.appliedRules.join(", ")}`)
        }
        if (result.issues.length > 0) {
          console.log(`   问题: ${result.issues.join("; ")}`)
        }
      } catch (error) {
        console.error(`❌ 应用标准化失败 ${result.filePath}:`, error)
      }
    }
  }

  /**
   * 生成标准化报告
   */
  generateReport(report: StandardizationReport): string {
    const lines: string[] = []

    lines.push("# 组件标准化报告")
    lines.push("")
    lines.push(`## 总体概况`)
    lines.push(`- 总文件数: ${report.totalFiles}`)
    lines.push(`- 修改文件数: ${report.modifiedFiles}`)
    lines.push(`- 修改率: ${((report.modifiedFiles / report.totalFiles) * 100).toFixed(1)}%`)
    lines.push(`- 总规则数: ${report.totalRules}`)
    lines.push("")

    if (report.appliedRules.size > 0) {
      lines.push("## 应用的规则统计")
      Array.from(report.appliedRules.entries())
        .sort(([, a], [, b]) => b - a)
        .forEach(([rule, count]) => {
          lines.push(`- ${rule}: ${count} 次`)
        })
      lines.push("")
    }

    if (report.errors.length > 0) {
      lines.push("## 错误")
      report.errors.forEach((error) => {
        lines.push(`- ${error}`)
      })
      lines.push("")
    }

    lines.push("## 文件详情")
    report.results.forEach((result) => {
      lines.push(`### ${basename(result.filePath)}`)
      lines.push(`路径: ${result.filePath}`)

      if (result.hasChanges) {
        lines.push(`✅ 已修改`)
        if (result.appliedRules.length > 0) {
          lines.push(`应用的规则: ${result.appliedRules.join(", ")}`)
        }
      } else {
        lines.push(`⏭️ 无需修改`)
      }

      if (result.issues.length > 0) {
        lines.push(`问题:`)
        result.issues.forEach((issue) => {
          lines.push(`  - ${issue}`)
        })
      }

      lines.push("")
    })

    return lines.join("\n")
  }
}

// 导出单例实例
export const componentStandardizer = new ComponentStandardizer()
