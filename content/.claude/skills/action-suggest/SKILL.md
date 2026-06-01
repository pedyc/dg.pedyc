---
name: action-suggest
version: 1.1.0
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

根据状态流转子系统（有向无环的 status 演化链）生成优先级行动建议。

## 状态流转链

```
fleeting → cultivating → active → completed → archived
  ↓           ↓            ↓         ↓          ↓
闪念/草稿    培育中       活跃      已完成     已归档
```

**时间触发规则**：
- `fleeting > 30d` → 建议推进到 cultivating
- `cultivating > 60d` → 建议推进到 active 或归档
- `active` 项目停滞 > 14d → 建议继续或标记 completed
- `completed > 30d` 未归档 → 建议移至归档

## 数据来源

1. 扫描 `10-PROJECTS/` 和 `20-AREAS/` 获取 status 分布和 date-modified
2. 读取 `00-META/Log/wiki-log.md` 最近一次 lint 报告
3. 读取 `00-META/Log/suggest-log.md` 上次建议（避免重复）

## 建议生成逻辑

按优先级排序：

1. **紧急**：健康检查预警（矛盾>3 或 孤儿>5 或 概念缺口>5）
2. **逾期培育**：`fleeting` 超过 30 天未推进
3. **长期培育**：`cultivating` 超过 60 天未激活
4. **停滞项目**：`active` 项目超过 14 天无更新
5. **待归档**：`completed` 超过 30 天未归档
6. **正常进行**：按 status=active > cultivating > fleeting 排序

## 输出格式

```markdown
## 行动建议 - [日期]

### 紧急
- [建议]

### 逾期任务（按停滞时长排序）
- [[页面名]]：处于 [status] 已 N 天，建议 [操作]

### 正常进行
- [[项目/领域名]] — 简短理由

---
[已记录到 suggest-log]
```

## 写入 suggest-log

每次调用后，将建议追加到 `00-META/Log/suggest-log.md`。
