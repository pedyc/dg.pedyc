/**
 * Checkbox 组件管理器
 * 管理页面中复选框的状态持久化
 */

import { BaseComponentManager, ComponentConfig, ComponentState } from "./BaseComponentManager"

/**
 * Checkbox 组件配置接口
 */
export interface CheckboxConfig extends ComponentConfig {
  /** 是否启用状态持久化 */
  enableStatePersistence?: boolean
  /** 存储类型 */
  storageType?: "local"
  /** 是否自动恢复状态 */
  autoRestoreState?: boolean
}

/**
 * Checkbox 组件状态接口
 */
export interface CheckboxState extends ComponentState {
  /** 复选框元素列表 */
  checkboxElements: HTMLInputElement[]
  /** 复选框状态映射 */
  checkboxStates: Map<string, boolean>
  /** 事件监听器映射 */
  eventListeners: Map<HTMLInputElement, (e: Event) => void>
}

/**
 * Checkbox 组件管理器
 * 负责管理页面中所有复选框的状态持久化
 */
export class CheckboxComponentManager extends BaseComponentManager<CheckboxConfig, CheckboxState> {
  private static readonly SELECTORS = {
    CHECKBOX: "input[type=checkbox]",
  } as const

  constructor(config: Partial<CheckboxConfig> = {}) {
    super({
      name: "checkbox",
      debug: false,
      enableStatePersistence: true,
      storageType: "local",
      autoRestoreState: true,
      ...config,
    })
  }

  /**
   * 查找页面中的复选框元素
   */
  protected findComponentElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLInputElement>(CheckboxComponentManager.SELECTORS.CHECKBOX),
    )
  }

  /**
   * 初始化组件状态
   */
  protected async onInitialize(): Promise<void> {
    this.state.checkboxElements = []
    this.state.checkboxStates = new Map()
    this.state.eventListeners = new Map()

    this.log("Checkbox component initialized")
  }

  /**
   * 设置事件监听器
   */
  protected async onSetupEventListeners(): Promise<void> {
    // 页面导航时重新设置
    // 事件监听已在 BaseComponentManager 中统一处理
  }

  /**
   * 设置页面元素
   */
  protected async onSetupPage(): Promise<void> {
    // 清理之前的状态
    this.cleanupCheckboxListeners()

    // 重新查找复选框元素
    const checkboxElements = document.querySelectorAll<HTMLInputElement>(
      CheckboxComponentManager.SELECTORS.CHECKBOX,
    )
    this.state.checkboxElements = Array.from(checkboxElements)

    // 为每个复选框设置状态管理
    for (const checkbox of this.state.checkboxElements) {
      this.setupCheckboxElement(checkbox)
    }

    this.log(`Setup ${this.state.checkboxElements.length} checkbox elements`)
  }

  /**
   * 清理资源
   */
  protected async onCleanup(): Promise<void> {
    this.cleanupCheckboxListeners()
    this.state.checkboxElements = []
    this.state.checkboxStates.clear()
    this.state.eventListeners.clear()
    this.log("Checkbox resources cleaned up")
  }

  /**
   * 设置单个复选框元素
   */
  private setupCheckboxElement(checkbox: HTMLInputElement): void {
    const checkboxId = checkbox.id
    if (!checkboxId) {
      this.log("Checkbox without ID found, skipping state persistence", { checkbox })
      return
    }

    // 生成缓存键
    const cacheKey = this.generateUserCacheKey(checkboxId)

    // 恢复保存的状态
    if (this.config.autoRestoreState && this.config.enableStatePersistence) {
      this.restoreCheckboxState(checkbox, cacheKey)
    }

    // 创建状态变更监听器
    const changeHandler = (e: Event) => {
      this.handleCheckboxChange(e, cacheKey)
    }

    // 添加事件监听器
    this.addEventListener(checkbox, "change", changeHandler)
    this.state.eventListeners.set(checkbox, changeHandler)

    // 记录当前状态
    this.state.checkboxStates.set(checkboxId, checkbox.checked)

    this.log(`Setup checkbox: ${checkboxId}`, { checked: checkbox.checked })
  }

  /**
   * 处理复选框状态变更
   */
  private handleCheckboxChange(event: Event, cacheKey: string): void {
    const checkbox = event.target as HTMLInputElement
    const newState = checkbox.checked

    // 更新内部状态
    if (checkbox.id) {
      this.state.checkboxStates.set(checkbox.id, newState)
    }

    // 持久化状态
    if (this.config.enableStatePersistence) {
      this.saveCheckboxState(cacheKey, newState)
    }

    this.log(`Checkbox state changed: ${checkbox.id}`, { checked: newState })
  }

  /**
   * 恢复复选框状态
   */
  private restoreCheckboxState(checkbox: HTMLInputElement, cacheKey: string): void {
    try {
      const savedState = this.getStorageItem(this.config.storageType!, cacheKey)
      if (savedState === "true") {
        checkbox.checked = true
        this.log(`Restored checkbox state: ${checkbox.id}`, { checked: true })
      } else if (savedState === "false") {
        checkbox.checked = false
        this.log(`Restored checkbox state: ${checkbox.id}`, { checked: false })
      }
    } catch (error) {
      this.error(`Failed to restore checkbox state: ${checkbox.id}`, error)
    }
  }

  /**
   * 保存复选框状态
   */
  private saveCheckboxState(cacheKey: string, checked: boolean): void {
    try {
      this.setStorageItem(this.config.storageType!, cacheKey)
    } catch (error) {
      this.error("Failed to save checkbox state", { cacheKey, checked, error })
    }
  }

  /**
   * 清理复选框事件监听器
   */
  private cleanupCheckboxListeners(): void {
    // 事件监听器会通过 BaseComponentManager 的清理机制自动清理
    this.state.eventListeners.clear()
  }

  /**
   * 获取指定复选框的状态
   */
  public getCheckboxState(checkboxId: string): boolean | undefined {
    return this.state.checkboxStates.get(checkboxId)
  }

  /**
   * 设置指定复选框的状态
   */
  public setCheckboxState(checkboxId: string, checked: boolean): void {
    const checkbox = this.state.checkboxElements.find((el) => el.id === checkboxId)
    if (checkbox) {
      checkbox.checked = checked
      this.state.checkboxStates.set(checkboxId, checked)

      // 保存状态
      if (this.config.enableStatePersistence) {
        const cacheKey = this.generateUserCacheKey(checkboxId)
        this.saveCheckboxState(cacheKey, checked)
      }

      this.log(`Set checkbox state: ${checkboxId}`, { checked })
    } else {
      this.error(`Checkbox not found: ${checkboxId}`)
    }
  }

  /**
   * 获取所有复选框状态
   */
  public getAllCheckboxStates(): Record<string, boolean> {
    const states: Record<string, boolean> = {}
    for (const [id, checked] of this.state.checkboxStates) {
      states[id] = checked
    }
    return states
  }

  /**
   * 重置所有复选框状态
   */
  public resetAllCheckboxes(): void {
    for (const checkbox of this.state.checkboxElements) {
      if (checkbox.id) {
        this.setCheckboxState(checkbox.id, false)
      }
    }
    this.log("All checkboxes reset")
  }

  /**
   * 清除所有保存的复选框状态
   */
  public clearAllSavedStates(): void {
    for (const checkbox of this.state.checkboxElements) {
      if (checkbox.id) {
        const cacheKey = this.generateUserCacheKey(checkbox.id)
        try {
          this.setStorageItem(this.config.storageType!, cacheKey)
        } catch (error) {
          this.error(`Failed to clear saved state for checkbox: ${checkbox.id}`, error)
        }
      }
    }
    this.log("All saved checkbox states cleared")
  }
}
