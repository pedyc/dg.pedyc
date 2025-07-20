/**
 * Clipboard 组件管理器
 * 管理代码块的复制功能，包括复制按钮的创建、点击事件处理和视觉反馈
 */

import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"

/**
 * Clipboard 组件配置接口
 */
export interface ClipboardConfig extends ComponentConfig {
  /** 复制成功后的反馈持续时间（毫秒） */
  feedbackDuration?: number
  /** 是否显示复制按钮的标签 */
  showLabel?: boolean
  /** 自定义复制按钮的样式类名 */
  buttonClassName?: string
  /** 是否启用键盘快捷键支持 */
  enableKeyboardShortcut?: boolean
}

/**
 * Clipboard 组件状态接口
 */
export interface ClipboardState extends ComponentState {
  isInitialized: boolean
  hasError: boolean
  /** 当前页面的代码块数量 */
  codeBlockCount: number
  /** 复制按钮的数量 */
  buttonCount: number
  /** 最近一次复制的内容 */
  lastCopiedContent?: string
  /** 复制操作的统计 */
  copyStats: {
    totalCopies: number
    successfulCopies: number
    failedCopies: number
  }
}

/**
 * Clipboard 组件管理器类
 */
export class ClipboardComponentManager extends BaseComponentManager<
  ClipboardConfig,
  ClipboardState
> {
  private readonly svgCopy =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>'
  private readonly svgCheck =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>'

  private copyButtons: Map<HTMLElement, HTMLButtonElement> = new Map()
  private feedbackTimeouts: Map<HTMLButtonElement, NodeJS.Timeout> = new Map()

  /**
   * 查找页面中的代码块元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll("pre"))
  }

  /**
   * 初始化组件
   */
  protected async onInitialize(): Promise<void> {
    Object.assign(this.state, {
      isInitialized: false,
      isVisible: true,
      hasError: false,
      codeBlockCount: 0,
      buttonCount: 0,
      copyStats: {
        totalCopies: 0,
        successfulCopies: 0,
        failedCopies: 0,
      },
    })

    // 检查 Clipboard API 支持
    if (!navigator.clipboard) {
      this.state.hasError = true
      return
    }

    this.state.isInitialized = true
  }

  /**
   * 设置事件监听器
   */
  protected onSetupEventListeners(): void {
    // 事件监听已在 BaseComponentManager 中统一处理
  }

  /**
   * 设置页面元素
   */
  protected onSetupPage(): void {
    if (!this.state.isInitialized || this.state.hasError) {
      return
    }

    // 清理之前的按钮
    this.cleanupButtons()

    const codeBlocks = this.findComponentElements() as HTMLPreElement[]
    this.state.codeBlockCount = codeBlocks.length

    let buttonCount = 0

    for (let i = 0; i < codeBlocks.length; i++) {
      const preElement = codeBlocks[i]
      const codeElement = preElement.querySelector("code")

      if (codeElement) {
        this.setupCodeBlock(preElement, codeElement)
        buttonCount++
      }
    }

    this.state.buttonCount = buttonCount
  }

  /**
   * 清理资源
   */
  protected onCleanup(): void {
    this.cleanupButtons()
    this.clearAllFeedbackTimeouts()
    this.copyButtons.clear()
    this.feedbackTimeouts.clear()
  }

  /**
   * 设置单个代码块的复制功能
   */
  private setupCodeBlock(preElement: HTMLPreElement, codeElement: HTMLElement): void {
    // 获取要复制的源代码
    const source = this.getSourceCode(codeElement)

    // 创建复制按钮
    const button = this.createCopyButton(source)

    // 将按钮添加到代码块
    preElement.prepend(button)

    // 记录按钮映射
    this.copyButtons.set(preElement, button)

    this.log("Code block clipboard button set up", preElement)
  }


  /**
   * 获取代码元素的源代码
   */
  private getSourceCode(codeElement: HTMLElement): string {
    let source: string

    // 检查是否有自定义的 clipboard 数据
    if (codeElement.dataset.clipboard) {
      try {
        source = JSON.parse(codeElement.dataset.clipboard)
      } catch (error) {
        this.log("Failed to parse clipboard data, using innerText", error)
        source = codeElement.innerText
      }
    } else {
      source = codeElement.innerText
    }

    // 清理多余的换行符
    return source.replace(/\n\n/g, "\n")
  }

  /**
   * 创建复制按钮
   */
  private createCopyButton(source: string): HTMLButtonElement {
    const button = document.createElement("button")
    button.className = this.config.buttonClassName || "clipboard-button"
    button.type = "button"
    button.innerHTML = this.svgCopy
    button.setAttribute("aria-label", "Copy source code")
    button.setAttribute("title", "Copy to clipboard")

    // 添加点击事件处理器
    const clickHandler = () => this.handleCopyClick(button, source)
    button.addEventListener("click", clickHandler)

    // 注册清理任务
    this.addCleanupTask(() => {
      button.removeEventListener("click", clickHandler)
    })

    return button
  }

  /**
   * 处理复制按钮点击事件
   */
  private async handleCopyClick(button: HTMLButtonElement, source: string): Promise<void> {
    this.state.copyStats.totalCopies++

    try {
      await navigator.clipboard.writeText(source)

      // 复制成功
      this.state.copyStats.successfulCopies++
      this.state.lastCopiedContent = source

      this.showCopyFeedback(button, true)
      this.log("Code copied to clipboard successfully")
    } catch (error) {
      // 复制失败
      this.state.copyStats.failedCopies++

      this.showCopyFeedback(button, false)
      this.log("Failed to copy code to clipboard", error)
      console.error("Clipboard copy failed:", error)
    }
  }

  /**
   * 显示复制操作的视觉反馈
   */
  private showCopyFeedback(button: HTMLButtonElement, success: boolean): void {
    // 清除之前的反馈超时
    const existingTimeout = this.feedbackTimeouts.get(button)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // 失焦按钮
    button.blur()

    if (success) {
      // 显示成功图标
      button.innerHTML = this.svgCheck
      button.style.borderColor = "rgb(63, 185, 80)"
    } else {
      // 显示错误状态
      button.style.borderColor = "rgb(248, 81, 73)"
      button.setAttribute("title", "Copy failed - try again")
    }

    // 设置恢复原状的超时
    const timeout = setTimeout(() => {
      button.innerHTML = this.svgCopy
      button.style.borderColor = ""
      button.setAttribute("title", "Copy to clipboard")
      this.feedbackTimeouts.delete(button)
    }, this.config.feedbackDuration || 2000)

    this.feedbackTimeouts.set(button, timeout)
  }

  /**
   * 清理所有复制按钮
   */
  private cleanupButtons(): void {
    this.copyButtons.forEach((button, preElement) => {
      if (button.parentNode === preElement) {
        preElement.removeChild(button)
      }
    })
    this.copyButtons.clear()
  }

  /**
   * 清理所有反馈超时
   */
  private clearAllFeedbackTimeouts(): void {
    this.feedbackTimeouts.forEach((timeout) => {
      clearTimeout(timeout)
    })
    this.feedbackTimeouts.clear()
  }

  /**
   * 获取复制统计信息
   */
  public getCopyStats(): ClipboardState["copyStats"] {
    return { ...this.state.copyStats }
  }

  /**
   * 获取最近复制的内容
   */
  public getLastCopiedContent(): string | undefined {
    return this.state.lastCopiedContent
  }

  /**
   * 重置复制统计
   */
  public resetCopyStats(): void {
    this.state.copyStats = {
      totalCopies: 0,
      successfulCopies: 0,
      failedCopies: 0,
    }
    this.state.lastCopiedContent = undefined
    this.log("Copy stats reset")
  }

  /**
   * 手动触发复制操作
   */
  public async copyText(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      this.state.copyStats.totalCopies++
      this.state.copyStats.successfulCopies++
      this.state.lastCopiedContent = text
      return true
    } catch (error) {
      this.state.copyStats.totalCopies++
      this.state.copyStats.failedCopies++
      this.log("Manual copy failed", error)
      return false
    }
  }

  /**
   * 检查 Clipboard API 是否可用
   */
  public isClipboardSupported(): boolean {
    return !!navigator.clipboard
  }

  /**
   * 获取当前页面的代码块数量
   */
  public getCodeBlockCount(): number {
    return this.state.codeBlockCount
  }

  /**
   * 获取当前页面的复制按钮数量
   */
  public getButtonCount(): number {
    return this.state.buttonCount
  }
}
