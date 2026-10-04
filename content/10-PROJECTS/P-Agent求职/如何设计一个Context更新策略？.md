---
title: 如何设计一个Context更新策略？
date-created: 2026-10-03
date-modified: 2026-10-03
content-type: [question]
up: ["[[Context Quality]]"]
---

## 问题

如何设计一个 Context 更新策略？

## 回答

Context 更新策略的核心目标是：

> **在每一轮 Agent Loop 中，让 Context 保持"最新、相关、无冲突、不超限"。**

可以按以下六个步骤设计。

---

### 1. 明确更新时机

Context 不是每轮都全量重建，而是在关键节点更新。

常见更新时机：

- 用户提出新请求
- Tool Call 返回结果
- 任务阶段切换
- 发现冲突或缺失
- Context 接近窗口上限
- 任务完成或失败

**原则：**

> 有事件发生，才触发更新。

---

### 2. 定义 Context 分层结构

先固定 Context 的骨架，再谈更新。

推荐分层：

```text
System / Role        → 身份与总体规则（基本不变）
Task                 → 当前目标与成功标准
Constraints          → 硬性约束
State                → 当前状态与进度
Facts                → 当前关键事实
History              → 历史决策与失败尝试
Tool Results         → 最新工具结果
```

**原则：**

> 分层固定后，更新只需替换对应层，而不是重写全部。

---

### 3. 制定每层的更新规则

不同层，更新方式不同。

| 层 | 更新方式 | 频率 |
|---|---|---|
| System / Role | 基本不变 | 极低 |
| Task | 目标变更时更新 | 低 |
| Constraints | 发现新约束时追加 | 低 |
| State | 每轮结束后更新 | 高 |
| Facts | 新事实出现时替换或追加 | 中 |
| History | 追加结论，不追加过程 | 中 |
| Tool Results | 保留最新，旧的压缩 | 高 |

**原则：**

> 高频层用替换，低频层用追加。

---

### 4. 设计信息进入规则

不是所有新信息都直接进 Context。

进入前先判断：

1. 是否与当前任务相关？
2. 是否与已有信息冲突？
3. 是否过期？
4. 是否重复？
5. 是否值得占用窗口？

处理方式：

- 相关且无冲突 → 加入
- 冲突 → 标注优先级或移除旧版
- 过期 → 删除或标注
- 重复 → 合并
- 低价值 → 不入 Context，留在外部存储

**原则：**

> 先过滤，再进入。

---

### 5. 设计信息退出规则

Context 不仅要"进"，还要"出"。

退出方式：

- **删除**：过期、无关、重复
- **压缩**：长日志、长历史、长代码
- **降级**：移出主 Context，存入外部可检索存储
- **指针化**：只留摘要和原文位置

**原则：**

> 能重建的，就不常驻 Context。

---

### 6. 设计冲突与缺失处理机制

**缺失：**

- 主动收集
- 调用工具查询
- 向用户确认
- 标记"未知"，避免模型脑补

**冲突：**

- 标注冲突
- 标注时效和来源
- 标注优先级
- 移除过期版本

**原则：**

> 缺失要补，冲突要裁。

---

### 7. 设计压缩与重建机制

当 Context 接近上限时：

1. 压缩 Tool Result 原文
2. 压缩历史对话与中间推理
3. 压缩大段代码与文件内容
4. 移除低置信、过期、冲突信息
5. 保留目标、约束、状态、关键事实

压缩后要能：

- 保留结论
- 保留来源
- 保留可回溯指针
- 必要时可重建原文

**原则：**

> 压缩丢细节，不丢决策依据。

---

### 8. 设计更新后的校验

每次更新后，做一次快速检查：

1. 目标还在吗？
2. 约束还在吗？
3. 当前状态是否最新？
4. 是否引入冲突？
5. 是否超限？
6. 关键事实是否有来源？

**原则：**

> 更新不是终点，校验才是。

---

## 一个实用模板

```yaml
context_policy:
  update_triggers:
    - user_request
    - tool_result
    - phase_change
    - conflict_detected
    - near_limit

  layers:
    system: keep
    task: update_on_goal_change
    constraints: append_on_discovery
    state: replace_each_round
    facts: upsert_with_source
    history: append_conclusion_only
    tool_results: keep_latest_compress_old

  entry_rules:
    - relevant
    - not_duplicate
    - not_expired
    - no_unresolved_conflict

  exit_rules:
    - delete_expired
    - compress_long
    - downgrade_to_external
    - pointerize

  conflict_policy:
    - annotate
    - mark_freshness
    - mark_authority
    - remove_outdated

  missing_policy:
    - collect
    - query_tool
    - ask_user
    - mark_unknown

  compression_priority:
    - tool_results
    - history
    - code
    - outdated
    - keep_constraints
    - keep_goal
    - keep_current_facts
```

---

## 总结

设计 Context 更新策略，关键在六件事：

1. 明确更新时机
2. 固定分层结构
3. 制定每层更新规则
4. 设计进入规则
5. 设计退出规则
6. 处理冲突与缺失
7. 压缩与重建
8. 更新后校验

一句话：

> Context 更新策略，就是让 Context 始终"最新、相关、无冲突、不超限"。
