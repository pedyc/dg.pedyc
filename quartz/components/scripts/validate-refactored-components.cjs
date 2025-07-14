#!/usr/bin/env node

/**
 * 重构组件验证脚本
 * 检查重构后的组件是否正常工作
 */

const fs = require("fs")
const path = require("path")

// 配置
const CONFIG = {
  baseDir: __dirname,
  refactoredComponents: [
    {
      name: "Search",
      manager: "SearchComponentManager.ts",
      inline: "search.inline.ts",
      expectedPatterns: [
        "ComponentManagerFactory.register",
        "ComponentManagerFactory.initialize",
        "SearchComponentManager",
      ],
    },
    {
      name: "Darkmode",
      manager: "DarkmodeComponentManager.ts",
      inline: "darkmode.inline.ts",
      expectedPatterns: [
        "ComponentManagerFactory.register",
        "ComponentManagerFactory.initialize",
        "DarkmodeComponentManager",
      ],
    },
    {
      name: "TOC",
      manager: "TocComponentManager.ts",
      inline: "toc.inline.ts",
      expectedPatterns: [
        "ComponentManagerFactory.register",
        "ComponentManagerFactory.initialize",
        "TocComponentManager",
      ],
    },
    {
      name: "Explorer",
      manager: "ExplorerComponentManager.ts",
      inline: "explorer.inline.ts",
      expectedPatterns: [
        "ComponentManagerFactory.register",
        "ComponentManagerFactory.initialize",
        "ExplorerComponentManager",
      ],
    },
  ],
}

/**
 * 验证结果统计
 */
class ValidationResults {
  constructor() {
    this.total = 0
    this.passed = 0
    this.failed = 0
    this.issues = []
  }

  addResult(component, test, passed, message = "") {
    this.total++
    if (passed) {
      this.passed++
      console.log(`✅ ${component} - ${test}: PASSED`)
    } else {
      this.failed++
      console.log(`❌ ${component} - ${test}: FAILED - ${message}`)
      this.issues.push({ component, test, message })
    }
  }

  getSummary() {
    return {
      total: this.total,
      passed: this.passed,
      failed: this.failed,
      successRate: ((this.passed / this.total) * 100).toFixed(2),
      issues: this.issues,
    }
  }
}

/**
 * 检查文件是否存在
 */
function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch (error) {
    return false
  }
}

/**
 * 读取文件内容
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8")
  } catch (error) {
    return null
  }
}

/**
 * 检查文件中是否包含指定模式
 */
function checkPatterns(content, patterns) {
  const results = []
  for (const pattern of patterns) {
    const found = content.includes(pattern)
    results.push({ pattern, found })
  }
  return results
}

/**
 * 验证组件管理器文件
 */
function validateManagerFile(component, results) {
  const managerPath = path.join(CONFIG.baseDir, "managers", component.manager)

  // 检查文件存在
  const exists = checkFileExists(managerPath)
  results.addResult(
    component.name,
    "Manager File Exists",
    exists,
    exists ? "" : `File not found: ${managerPath}`,
  )

  if (!exists) return

  // 检查文件内容
  const content = readFileContent(managerPath)
  if (!content) {
    results.addResult(component.name, "Manager File Readable", false, "Cannot read file")
    return
  }

  results.addResult(component.name, "Manager File Readable", true)

  // 检查基本结构
  const hasBaseImport = content.includes("BaseComponentManager")
  results.addResult(
    component.name,
    "Extends BaseComponentManager",
    hasBaseImport,
    hasBaseImport ? "" : "Missing BaseComponentManager import/extension",
  )

  const hasExport = content.includes(`export class ${component.manager.replace(".ts", "")}`)
  results.addResult(
    component.name,
    "Proper Export",
    hasExport,
    hasExport ? "" : "Missing proper class export",
  )

  // 检查必需方法
  const requiredMethods = [
    "findComponentElements",
    "onInitialize",
    "onSetupEventListeners",
    "onSetupPage",
    "onCleanup",
  ]

  for (const method of requiredMethods) {
    const hasMethod = content.includes(method)
    results.addResult(
      component.name,
      `Has ${method} method`,
      hasMethod,
      hasMethod ? "" : `Missing required method: ${method}`,
    )
  }
}

/**
 * 验证内联文件
 */
function validateInlineFile(component, results) {
  const inlinePath = path.join(CONFIG.baseDir, component.inline)

  // 检查文件存在
  const exists = checkFileExists(inlinePath)
  results.addResult(
    component.name,
    "Inline File Exists",
    exists,
    exists ? "" : `File not found: ${inlinePath}`,
  )

  if (!exists) return

  // 检查文件内容
  const content = readFileContent(inlinePath)
  if (!content) {
    results.addResult(component.name, "Inline File Readable", false, "Cannot read file")
    return
  }

  results.addResult(component.name, "Inline File Readable", true)

  // 检查重构模式
  const patternResults = checkPatterns(content, component.expectedPatterns)
  for (const { pattern, found } of patternResults) {
    results.addResult(
      component.name,
      `Contains ${pattern}`,
      found,
      found ? "" : `Missing pattern: ${pattern}`,
    )
  }

  // 检查是否移除了旧的TODO注释
  const hasTodoComments = content.includes(
    "TODO: 检查是否需要替换为 globalResourceManager.instance.addEventListener",
  )
  results.addResult(
    component.name,
    "Removed TODO Comments",
    !hasTodoComments,
    hasTodoComments ? "Still contains old TODO comments" : "",
  )

  // 检查是否移除了直接的addEventListener调用
  const hasDirectAddEventListener =
    /(?<!this\.|globalResourceManager\.instance\.)addEventListener\s*\(/.test(content)
  results.addResult(
    component.name,
    "No Direct addEventListener",
    !hasDirectAddEventListener,
    hasDirectAddEventListener ? "Still contains direct addEventListener calls" : "",
  )
}

/**
 * 验证BaseComponentManager基础设施
 */
function validateBaseInfrastructure(results) {
  const baseManagerPath = path.join(CONFIG.baseDir, "base", "BaseComponentManager.ts")
  const exists = checkFileExists(baseManagerPath)
  results.addResult(
    "Infrastructure",
    "BaseComponentManager Exists",
    exists,
    exists ? "" : "BaseComponentManager.ts not found",
  )

  if (exists) {
    const content = readFileContent(baseManagerPath)
    if (content) {
      const hasFactory = content.includes("ComponentManagerFactory")
      results.addResult(
        "Infrastructure",
        "ComponentManagerFactory Available",
        hasFactory,
        hasFactory ? "" : "ComponentManagerFactory not found in BaseComponentManager",
      )
    }
  }
}

/**
 * 检查TypeScript编译兼容性
 */
function validateTypeScriptCompatibility(results) {
  const tsConfigPath = path.join(CONFIG.baseDir, "..", "..", "..", "tsconfig.json")
  const exists = checkFileExists(tsConfigPath)
  results.addResult(
    "TypeScript",
    "tsconfig.json Exists",
    exists,
    exists ? "" : "tsconfig.json not found",
  )

  // 检查是否有明显的TypeScript错误模式
  for (const component of CONFIG.refactoredComponents) {
    const managerPath = path.join(CONFIG.baseDir, "managers", component.manager)
    const content = readFileContent(managerPath)

    if (content) {
      // 检查导入语句
      const hasProperImports = content.includes("import") && !content.includes("import {}")
      results.addResult(
        component.name,
        "Proper Imports",
        hasProperImports,
        hasProperImports ? "" : "Missing or empty imports",
      )

      // 检查接口定义
      const hasInterfaces = content.includes("interface") || content.includes("type")
      results.addResult(
        component.name,
        "Type Definitions",
        hasInterfaces,
        hasInterfaces ? "" : "Missing type definitions",
      )
    }
  }
}

/**
 * 生成验证报告
 */
function generateReport(results) {
  const summary = results.getSummary()

  console.log("\n" + "=".repeat(60))
  console.log("🔍 重构组件验证报告")
  console.log("=".repeat(60))

  console.log(`\n📊 总体统计:`)
  console.log(`   总测试数: ${summary.total}`)
  console.log(`   通过数: ${summary.passed}`)
  console.log(`   失败数: ${summary.failed}`)
  console.log(`   成功率: ${summary.successRate}%`)

  if (summary.issues.length > 0) {
    console.log(`\n❌ 发现的问题:`)
    summary.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. [${issue.component}] ${issue.test}: ${issue.message}`)
    })
  }

  console.log(`\n🎯 建议:`)
  if (summary.failed === 0) {
    console.log("   ✅ 所有验证都通过了！重构成功完成。")
  } else if (summary.successRate >= 80) {
    console.log("   ⚠️  大部分验证通过，请修复剩余问题。")
  } else {
    console.log("   🚨 发现较多问题，建议仔细检查重构实现。")
  }

  console.log(`\n📝 下一步:`)
  console.log("   1. 修复上述问题")
  console.log("   2. 运行 TypeScript 编译检查")
  console.log("   3. 在浏览器中测试功能")
  console.log("   4. 检查控制台是否有错误")

  return summary.failed === 0
}

/**
 * 主验证函数
 */
function main() {
  console.log("🚀 开始验证重构后的组件...")

  const results = new ValidationResults()

  // 验证基础设施
  console.log("\n🏗️  验证基础设施...")
  validateBaseInfrastructure(results)

  // 验证每个组件
  console.log("\n🔧 验证组件管理器...")
  for (const component of CONFIG.refactoredComponents) {
    console.log(`\n--- 验证 ${component.name} 组件 ---`)
    validateManagerFile(component, results)
    validateInlineFile(component, results)
  }

  // 验证TypeScript兼容性
  console.log("\n📝 验证 TypeScript 兼容性...")
  validateTypeScriptCompatibility(results)

  // 生成报告
  const success = generateReport(results)

  // 退出码
  process.exit(success ? 0 : 1)
}

// 运行验证
if (require.main === module) {
  main()
}

module.exports = {
  validateManagerFile,
  validateInlineFile,
  validateBaseInfrastructure,
  ValidationResults,
}
