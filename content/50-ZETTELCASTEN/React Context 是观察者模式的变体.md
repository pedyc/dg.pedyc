---
uid: 202604221045
title: React Context 是观察者模式的变体
aliases: []
tags: []
date-created: 2026-04-21
date-modified: 2026-04-22
status: fleeting
content-type: atomic
up: "[[React Context]]"
---

> React Context 是观察者模式的变体，Provider（主题）提供数据，Consumer（观察者）消费数据，Provider 持有 Consumer 的引用

## 论据/示例

### 观察者模式结构对照

| 观察者模式 | React Context | 作用 |
|:---|:---|:---|
| Subject/Observable | Context.Provider | 持有数据，触发更新 |
| Observer | useContext/Consumer | 订阅数据变化 |
| subscribe() | useContext 调用 | 建立订阅关系 |
| notify() | Provider value 变化 | 通知所有订阅者 |

### 代码示例：手动实现简化版观察者模式

```typescript
// 观察者模式的最小化实现
type Listener<T> = (value: T) => void

class Subject<T> {
  private listeners: Set<Listener<T>> = new Set()

  // 订阅
  subscribe(listener: Listener<T>) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener) // 返回取消订阅函数
  }

  // 发布
  notify(value: T) {
    this.listeners.forEach(listener => listener(value))
  }
}

// React Context 的等价实现
function createContext<T>(defaultValue: T) {
  const subject = new Subject<T>()

  return {
    Provider: ({ value, children }: { value: T; children: React.ReactNode }) => {
      subject.notify(value) // 通知所有订阅者
      return children
    },
    Consumer: ({ children }: { children: (value: T) => React.ReactNode }) => {
      const [contextValue, setContextValue] = useState(defaultValue)
      useEffect(() => {
        return subject.subscribe(setContextValue) // 订阅
      }, [])
      return children(contextValue)
    }
  }
}
```

### 关键支撑

**1. Provider 持有 Consumer 引用**
React 在内部维护一个链表记录每个 Context 的所有消费者，当 Provider 调用时，遍历所有消费者触发更新。

**2. 订阅机制解耦**
观察者模式和 Context 都实现了 " 数据生产者不需要知道消费者是谁 "：

```typescript
// 生产者不知道谁在消费
<ThemeContext.Provider value={theme}>
  <App /> {/* App 里的任意组件都能通过 useContext 订阅 */}
</ThemeContext.Provider>
```

**3. 批量更新的优化**
React 18 后 Context 更新会自动批处理，类似观察者模式中常见的批量通知优化。

## 关联

- [[React Context]]
