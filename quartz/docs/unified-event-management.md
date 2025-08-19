# 统一事件管理模式设计文档

## 概述

本文档定义了 Quartz 组件系统的统一事件管理模式，确保所有组件都遵循一致的事件处理、清理和缓存管理策略。

## 当前状态分析

### 已实现的统一模式

1. **全局管理器实例**
   - `globalResourceManager` - 统一的资源和事件管理
   - `globalStorageManager` - 统一的存储管理
   - `globalCacheManager` - 统一的缓存管理

2. **缓存键生成**
   - `CacheKeyFactory` - 统一的缓存键生成工具
   - 所有组件应使用 `CacheKeyFactory.generateSystemKey()` 等方法

3. **事件清理机制**
   - `window.addCleanup()` - 统一的清理函数注册
   - `ICleanupManager` 接口 - 标准化的清理管理

### 组件事件管理现状

#### ✅ 已遵循统一模式的组件

1. **Explorer 组件**
   - 使用 `setupEventListeners()` 统一管理事件
   - 通过 `globalResourceManager` 注册事件监听器
   - 实现了完整的清理机制

2. **Darkmode 组件**
   - 使用 `CacheKeyFactory.generateSystemKey()` 生成缓存键
   - 通过 `globalStorageManager` 管理存储
   - 正确使用 `window.addCleanup()` 注册清理函数

3. **TOC 组件**
   - 使用 `window.addCleanup()` 注册事件清理
   - 在 `nav` 事件中重新初始化

#### ⚠️ 需要改进的组件

1. **Search 组件**
   - 已使用 `globalResourceManager` 但可以进一步标准化
   - 缓存键生成需要统一使用 `CacheKeyFactory`

2. **Graph 组件**
   - 已使用 `globalResourceManager` 但事件管理可以更加统一
   - 需要确保缓存键生成的一致性

3. **其他组件**
   - 大部分组件缺乏统一的事件管理模式
   - 需要引入标准化的初始化和清理流程

## 统一事件管理模式规范

### 1. 组件初始化模式

```typescript
// 标准组件初始化模板
import { globalResourceManager } from "./managers"
import { CacheKeyFactory } from "./cache"

// 防止重复初始化的标志
let componentEventListenersSetup = false

/**
 * 设置组件事件监听器
 */
function setupComponentEventListeners() {
  if (!globalResourceManager.instance) {
    console.error("[Component] Global instances not available")
    return
  }

  if (componentEventListenersSetup) {
    console.log("[Component] 事件监听器已设置，跳过重复注册")
    return
  }

  // 注册页面导航事件
  globalResourceManager.instance.addEventListener(document as any, "nav", setupComponentPage)

  // 注册 DOM 加载事件
  globalResourceManager.instance.addEventListener(
    document as any,
    "DOMContentLoaded",
    setupComponentPage,
  )

  // 注册清理任务
  globalResourceManager.instance.addCleanupTask(() => {
    // 组件特定的清理逻辑
    cleanupComponentState()
  })

  componentEventListenersSetup = true
}

/**
 * 设置组件页面逻辑
 */
function setupComponentPage() {
  // 组件特定的页面设置逻辑
}

/**
 * 清理组件状态
 */
function cleanupComponentState() {
  // 组件特定的清理逻辑
}
```

### 2. 缓存键生成规范

```typescript
import { CacheKeyFactory } from "./cache"

// ✅ 正确的缓存键生成
const themeKey = CacheKeyFactory.generateSystemKey("theme", "preference")
const userDataKey = CacheKeyFactory.generateUserKey("user", userId, "settings")
const contentKey = CacheKeyFactory.generateContentKey("page", slug, "data")

// ❌ 避免硬编码缓存键
const badKey = "theme_preference" // 不推荐
```

### 3. 存储管理规范

```typescript
import { globalStorageManager } from "./managers"

// ✅ 正确的存储操作
const storageManager = globalStorageManager.instance
storageManager.setItem("local", cacheKey, value)
const value = storageManager.getItem("local", cacheKey)

// ❌ 避免直接操作 localStorage
localStorage.setItem(key, value) // 不推荐
```

### 4. 事件清理规范

```typescript
// ✅ 正确的事件清理注册
function setupEventListener() {
  const handler = () => {
    /* 事件处理逻辑 */
  }
  element.addEventListener("click", handler)

  // 注册清理函数
  window.addCleanup(() => {
    element.removeEventListener("click", handler)
  })
}

// ✅ 使用 globalResourceManager 自动管理
globalResourceManager.instance.addEventListener(element, "click", handler)
// 清理会自动处理
```

## 实施计划

### 阶段 1: 核心组件标准化

- [ ] Search 组件事件管理标准化
- [ ] Graph 组件事件管理标准化
- [ ] 验证 Explorer、Darkmode、TOC 组件的一致性

### 阶段 2: 其他组件迁移

- [ ] Popover 组件
- [ ] Comments 组件
- [ ] Mermaid 组件
- [ ] 其他内联脚本组件

### 阶段 3: 工具和验证

- [ ] 创建组件事件管理检查工具
- [ ] 建立自动化测试
- [ ] 文档完善

## 最佳实践

1. **始终使用全局管理器实例**
   - 通过 `globalResourceManager` 管理事件
   - 通过 `globalStorageManager` 管理存储
   - 通过 `globalCacheManager` 管理缓存

2. **统一缓存键生成**
   - 使用 `CacheKeyFactory` 的标准方法
   - 避免硬编码缓存键
   - 保持键名的一致性和可预测性

3. **完整的清理机制**
   - 每个事件监听器都要有对应的清理函数
   - 使用 `window.addCleanup()` 或 `globalResourceManager.addCleanupTask()`
   - 在页面导航时自动清理

4. **防止重复初始化**
   - 使用标志变量防止重复设置事件监听器
   - 检查全局实例的可用性
   - 提供降级方案

5. **错误处理和日志**
   - 适当的错误处理和用户反馈
   - 统一的日志格式和级别
   - 开发环境下的调试信息

## 验证清单

对于每个组件，确保：

- [ ] 使用 `globalResourceManager` 管理事件监听器
- [ ] 使用 `CacheKeyFactory` 生成所有缓存键
- [ ] 使用 `globalStorageManager` 进行存储操作
- [ ] 实现完整的事件清理机制
- [ ] 防止重复初始化
- [ ] 适当的错误处理
- [ ] 遵循命名约定和代码风格
