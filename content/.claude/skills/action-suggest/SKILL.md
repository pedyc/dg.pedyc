---
name: action-suggest
version: 1.3.0
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

**优先级公式**：
```
raw_priority = consequence × urgency
time_decay  = clamp((expire_days_remaining / 30), -1, 1)  // -1 到 +1，越近截止越加分
final_priority = raw_priority × (1 + time_decay)
quadrant_boost = Q1 ? 1.5 : (Q2 ? 1.2 : (Q3 ? 0.8 : 0.5))
```

**Q1 自动升权**：Q1 项目 final_priority × 1.5
**Q4 自动降权**：Q4 项目 final_priority × 0.5

## 状态流转链

```
fleeting → active → archived
```

**时间触发规则**（2026-10-23 起为三值模型，原 cultivating / completed 已并入 active）：
- `fleeting > 30d` → 建议推进到 active，或判断为废稿直接归档
- `active` 停滞 > 90d → 建议复核内容是否过时，过时则归档
- `active` 项目停滞 > 14d → 建议继续或标记归档
- `archived` 为终态，不再产生动作

## 数据来源

1. 扫描 `10-PROJECTS/` 和 `20-AREAS/` 获取 status、consequence、urgency、expire、date-modified（`quadrant` 已于 2026-10-23 移除，改为由 consequence × urgency 派生；`date-modified` 是判断陈旧的主要依据）
2. 读取项目文件的"阶段一/二/三"结构，识别当前阶段
3. 读取 `01-META/Log/wiki-log.md` 最近一次 lint 报告

## 建议生成逻辑

### 优先级排序

1. **P0 - 逾期归档**：`expire` 已过期且无实质进展（`completed` 状态已不存在，改看 `date-modified` 停滞时长）
2. **P1 - 紧急停滞**：`fleeting > 30d` 未加工，或 `active` 停滞 > 90d 待复核（按停滞时长降序）
3. **P2 - 重要继续**：按 `consequence × urgency` 算出的优先级降序，Q1 项目优先，top 3（`quadrant` 字段已移除，此处为派生值）
4. **P3 - 维护任务**：孤儿 MOC 页面

### 具体化建议规则

根据项目当前阶段生成具体行动：

| 阶段 | 建议格式 |
|------|---------|
| 准备期 | 建议完成"阶段一"的第 N 个待办 |
| 攻坚期 | 建议推进"阶段二"的下一个模块 |
| 收尾期 | 建议收尾或归档 |

**示例**：
- 原始：`[[P-求职前端岗位]] — 最高优先级，建议继续推进`
- 优化后：`[[P-求职前端岗位]] — 最高优先级，当前阶段：面试冲刺（expired），建议：更新 [[投递记录表]]，补充面试复盘`

### 限制

- 总建议不超过 6 条
- P2 最多 3 条

## 输出格式

```markdown
## 行动建议 - [日期]

### P0 逾期归档
- [[页面名]]（final_priority=N，expired N 天）— 具体建议

### P1 紧急停滞
- [[页面名]]（[status]，N 天，quadrant=N）— 具体建议

### P2 重要继续
- [[页面名]]（final_priority=N，Q1）— 当前阶段 + 具体下一步

### P3 维护
- [[页面名]] — 简短理由

---
[已记录到 suggest-log]
```

## 写入 suggest-log

每次调用后，将建议追加到 `01-META/Log/suggest-log.md`。
