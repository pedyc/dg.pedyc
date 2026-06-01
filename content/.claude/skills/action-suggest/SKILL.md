---
name: action-suggest
version: 1.2.0
description: |
  根据知识库当前状态和状态流转子系统生成行动建议，帮助快速建立工作焦点。
  触发条件：用户说"今天干什么"、"有什么建议"、"行动建议"、"不知道干什么"，或调用 /action-suggest。
argument-hint: "[light|full]"
allowed-tools:
  - Read
  - Grep
  - Glob
---

# action-suggest

根据状态流转子系统（有向无环的 status 演化链）和项目优先级字段生成行动建议。

## 项目优先级体系

| 字段 | 说明 | 范围 |
|------|------|------|
| `consequence` | 收益/影响 | 1-10 |
| `urgency` | 紧急程度 | 1-10 |
| `expire` | 截止日期 | YYYY-MM-DD |
| `quadrant` | 艾森豪威尔矩阵 | Q1-Q4 |

**优先级公式**：`priority = consequence × urgency`
**优先级排序**：同类内按 `consequence × urgency` 降序

## 状态流转链

```
fleeting → cultivating → active → completed → archived
```

**时间触发规则**：
- `fleeting > 30d` → 建议推进到 cultivating
- `cultivating > 60d` → 建议推进到 active 或归档
- `active` 项目停滞 > 14d → 建议继续或标记 completed
- `completed > 30d` 未归档 → 建议移至归档

## 数据来源

1. 扫描 `10-PROJECTS/` 和 `20-AREAS/` 获取 status、consequence、urgency、expire、date-modified
2. 读取 `00-META/Log/wiki-log.md` 最近一次 lint 报告
3. 读取 `00-META/Log/suggest-log.md` 上次建议（避免重复）

## 建议生成逻辑

### 优先级排序

1. **P0 - 逾期归档**：已完成但 >30d 未归档，或有 expired deadline 且已过期
2. **P1 - 紧急停滞**：`fleeting > 30d` 或 `cultivating > 60d`（按停滞时长降序）
3. **P2 - 重要继续**：`active` 项目按 `consequence × urgency` 降序，取 top 3
4. **P3 - 维护任务**：孤儿 MOC 页面

### 限制

- 总建议不超过 6 条
- active 项目最多 3 条

## 输出格式

```markdown
## 行动建议 - [日期]

### P0 逾期归档
- [[页面名]]（priority=N，expired）— 操作建议

### P1 紧急停滞
- [[页面名]]（[status]，N 天）— 操作建议

### P2 重要继续
- [[页面名]]（consequence=N, urgency=N）— 简短理由

### P3 维护
- [[页面名]] — 简短理由

---
[已记录到 suggest-log]
```

## 写入 suggest-log

每次调用后，将建议追加到 `00-META/Log/suggest-log.md`。
