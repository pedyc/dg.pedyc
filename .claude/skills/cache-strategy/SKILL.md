---
name: cache-strategy
description: 前端缓存策略指南。包含浏览器缓存、Web Storage、Service Worker、LRU 算法等最佳实践。
allowed-tools: Glob, Grep, Read, Write, Edit
---

# 前端缓存策略指南

## 一、缓存层次结构

```
┌─────────────────────────────────────────────────────┐
│                    请求发起                          │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│  1. Memory Cache (内存缓存)                          │
│     - 速度最快，容量小                                │
│     - 浏览器自动管理                                  │
│     - 关闭浏览器后失效                                │
└──────────────────────┬───────────────────────────────┘
                       ▼ miss
┌──────────────────────────────────────────────────────┐
│  2. Service Worker Cache / Cache API                 │
│     - 可编程缓存策略                                  │
│     - 支持离线访问                                    │
└──────────────────────┬───────────────────────────────┘
                       ▼ miss
┌──────────────────────────────────────────────────────┐
│  3. HTTP Cache (磁盘缓存)                            │
│     - 强缓存 (Cache-Control, Expires)               │
│     - 协商缓存 (ETag, Last-Modified)                 │
└──────────────────────┬───────────────────────────────┘
                       ▼ miss
┌──────────────────────────────────────────────────────┐
│  4. CDN 缓存                                         │
│     - 边缘节点缓存                                    │
└──────────────────────┬───────────────────────────────┘
                       ▼ miss
┌──────────────────────────────────────────────────────┐
│  5. 服务器                                          │
└──────────────────────────────────────────────────────┘
```

## 二、缓存策略分类

### 1. HTTP 缓存

| 策略 | 响应头 | 说明 |
|------|--------|------|
| 强缓存 | `Cache-Control: max-age=3600` | 直接使用缓存，不过服务器 |
| 强缓存 | `Expires: Wed, 21 Oct 2025 07:28:00 GMT` | 过期时间 |
| 协商缓存 | `ETag: "abc123"` | 资源版本标识 |
| 协商缓存 | `Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT` | 最后修改时间 |

### 2. Web Storage

| 存储方式 | 容量 | 作用域 | 有效期 |
|----------|------|--------|--------|
| localStorage | ~5MB | 同源 | 永久 |
| sessionStorage | ~5MB | 页面会话 | 关闭页面前 |

### 3. 缓存算法

| 算法 | 说明 | 适用场景 |
|------|------|----------|
| LRU | 最近最少使用 | 内存缓存、DOM 缓存 |
| LFU | 最不经常使用 | 频率统计 |
| FIFO | 先进先出 | 简单队列 |
| TTL | 时间过期 | 有时效性的数据 |

### 4. Service Worker

| 策略 | 说明 | 适用资源 |
|------|------|----------|
| Cache First | 先缓存，失败再网络 | 静态资源 |
| Network First | 先网络，失败用缓存 | API 数据 |
| Stale While Revalidate | 返回缓存同时更新 | 不频繁更新的资源 |
| Network Only | 仅网络 | 实时数据 |
| Cache Only | 仅缓存 | 离线可用资源 |

## 三、Quartz 项目缓存实现

### 推荐目录结构

```
quartz/components/scripts/
├── storage/
│   ├── index.ts        ← 导出入口
│   ├── cache.ts        ← LRU 内存缓存
│   ├── persistent.ts   ← 持久化存储 (localStorage/sessionStorage)
│   └── types.ts        ← 类型定义
```

### 实现示例

```typescript
// types.ts
export interface CacheEntry<T> {
  value: T
  timestamp: number
  accessCount: number
}

export interface StorageOptions {
  storageType: 'local' | 'session'
  prefix: string
  expiresIn?: number
}

// cache.ts - LRU 实现
class LRUCache<T> {
  private maxSize: number
  private cache: Map<string, CacheEntry<T>>

  constructor(maxSize: number) {
    this.maxSize = maxSize
    this.cache = new Map()
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    // 更新访问顺序（移到末尾）
    this.cache.delete(key)
    this.cache.set(key, entry)
    return entry.value
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的（第一个）
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0
    })
  }
}
```

## 四、选择策略

| 场景 | 推荐方案 |
|------|----------|
| 静态资源 (JS/CSS/图片) | HTTP 缓存 + Service Worker |
| 页面内容预加载 | LRU 内存缓存 |
| 用户偏好设置 | localStorage |
| 敏感数据 | sessionStorage |
| 离线支持 | Service Worker Cache |
| API 响应 | 内存缓存 + 持久化 |

## 五、注意事项

1. **缓存一致性**：数据更新时及时清除缓存
2. **存储限额**：localStorage 有 5-10MB 限制
3. **序列化开销**：JSON 序列化有性能损耗
4. **安全敏感**：避免存储敏感信息
5. **移动端**：移动网络下减少缓存以节省流量
