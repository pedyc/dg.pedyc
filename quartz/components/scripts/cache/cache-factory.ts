/**
 * 缓存工厂模块（重构）
 * 统一通过 GlobalManagerController 管理所有缓存实例
 */

import {
  GlobalManagerController,
  globalCacheManager,
  globalStorageManager
} from "../managers/global-instances"
import { ManagerType } from "../managers"
import type { OptimizedCacheManager } from "../managers/OptimizedCacheManager"
import type { UnifiedStorageManager } from "../managers/UnifiedStorageManager"
import type { UnifiedContentCacheManager } from "../managers/UnifiedContentCacheManager"
import { type CacheConfig } from "./unified-cache"


/**
 * 缓存实例类型枚举
 */
export enum CacheInstanceType {
  CONTENT = "CONTENT",
  LINK = "LINK",
  SEARCH = "SEARCH",
  USER = "USER",
  SYSTEM = "SYSTEM",
  DEFAULT = "DEFAULT",
}

/**
 * 缓存实例配置接口
 */
export interface CacheInstanceConfig {
  type: CacheInstanceType
  configOverride?: Partial<CacheConfig>
}

/**
 * 缓存工厂类（代理到 GlobalManagerController）
 */
export class CacheFactory {
  /**
   * 创建或获取优化缓存管理器实例
   */
  static createOptimizedCache<T = any>(
    config: CacheInstanceConfig
  ): OptimizedCacheManager<T> {
    console.log(`[CacheFactory] Requesting OptimizedCacheManager for ${config.type}`)
    // 默认返回全局缓存实例，未来可根据类型扩展
    return globalCacheManager.instance as OptimizedCacheManager<T>
  }

  /**
   * 获取存储管理器实例
   */
  static getStorageManager(): UnifiedStorageManager {
    console.log(`[CacheFactory] Requesting UnifiedStorageManager`)
    return globalStorageManager.instance
  }

  /**
   * 获取已注册的缓存实例
   */
  static getInstance(
    type: CacheInstanceType,
    unified: boolean = false
  ): OptimizedCacheManager<any> | UnifiedContentCacheManager | null {
    const identifier = type.toString()
    const managerType = unified ? ManagerType.UNIFIED_CONTENT_CACHE : ManagerType.CACHE

    const instance = GlobalManagerController.getInstance(managerType, identifier);
    return instance || null;
  }

  /**
   * 清理所有缓存实例（由 GlobalManagerController 统一处理）
   */
  static cleanup(): void {
    console.log(`[CacheFactory] Delegating cleanup to GlobalManagerController`)
    GlobalManagerController.cleanup()
  }

  /**
   * 销毁所有缓存实例（由 GlobalManagerController 统一处理）
   */
  static destroy(): void {
    console.log(`[CacheFactory] Delegating destroy to GlobalManagerController`)
    GlobalManagerController.destroy()
  }
}