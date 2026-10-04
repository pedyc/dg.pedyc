---
title: 关键信息应该怎样放入Context？
date-created: 2026-10-03
date-modified: 2026-10-03
content-type: [question]
up: ["[[Context Quality]]"]
---

## 问题

关键信息应该以什么形式放入 Context？

## 背景

根据[[Context缺少关键信息会发生什么？]]判断出关键信息之后，下一个问题是：

> **同样一条信息，以不同形式放入 Context，效果差别很大。**

Context Engineering 不只是"放什么"，还包括"怎么放"。

## 回答

### 1. 结构化，而不是大段自然语言

LLM 对结构化的信息更容易定位和使用。

不推荐：

```text
项目是 React 的，登录页面在 src/pages/Login.jsx，
用的是 TypeScript，不能引入新依赖，
之前试过改 useState 但没成功……
```

推荐：

```yaml
project:
  framework: React
  language: TypeScript
  entry: src/pages/Login.jsx
constraints:
  - 不能引入新依赖
history:
  - 尝试过修改 useState，失败
```

**原则：**

> 能结构化，就不要写成散文。

---

### 2. 分层，而不是平铺

Context 应该有层次，让模型知道哪些是背景、哪些是重点。

常见分层：

```text
System / Role        → 身份和总体规则
Task                 → 当前目标
Constraints          → 硬性限制
State                → 当前状态
Relevant Facts       → 必要事实
History              → 历史与决策
Tool Results         → 最新工具结果
```

**原则：**

> 重要的放前面、放显眼位置，背景信息放后面。

---

### 3. 按需，而不是全量

不是所有关键信息都要一次性塞入。
应该根据当前步骤，只放入**此刻需要**的信息。

例如：

- 当前在定位 Bug → 放报错日志和相关代码
- 当前在写测试 → 放接口定义和测试规范
- 当前在重构 → 放依赖关系和约束

**原则：**

> 关键信息也分"现在需要"和"以后需要"，不要一次全给。

---

### 4. 摘要，而不是原文堆砌

长文件、长日志、长历史，应该先压缩再放入。

方式：

- 摘要关键结论
- 提取错误行
- 保留接口签名，去掉实现细节
- 用 diff 代替整个文件

**原则：**

> 放结论，不放全文；放差异，不放全量。

---

### 5. 带来源和时效，而不是孤立信息

信息要能判断新旧和权威性。

推荐形式：

```yaml
source: src/pages/Login.jsx
updated_at: 2026-10-04
confidence: high
```

或者：

```text
[最新] 用户已确认使用 Vue
[过期] 早期文档写的是 React
```

**原则：**

> 让模型知道信息从哪来、是否最新、可不可信。

---

### 6. 显式标注冲突和优先级

当信息冲突时，不要只是并列放进去，要明确谁优先。

不推荐：

```text
文档说用 React
用户说用 Vue
```

推荐：

```text
冲突：
- 旧文档：React（已废弃）
- 用户最新确认：Vue（以此为准）
```

**原则：**

> 不要指望模型自己解决冲突，要显式告诉它。

---

### 7. 用模型容易执行的形式

如果信息是为了让模型执行动作，尽量靠近"可执行结构"。

例如：

- 用 JSON / YAML 描述参数
- 用 checklist 描述步骤
- 用 diff 描述修改
- 用 schema 描述数据结构

**原则：**

> 信息的组织形式，应该服务于下一步要做的动作。

---

### 8. 控制噪声，而不是越多越好

Context 中每多一条信息，都会占用注意力和窗口。

所以：

- 无关信息删掉
- 重复信息合并
- 过期信息标注或移除
- 低置信信息降权

**原则：**

> 关键信息不是"加进去"，而是"加进去且不被噪声淹没"。

---

## 一个实用模板

把关键信息放入 Context 时，可以套这个结构：

```yaml
task:
  goal: 修复登录页面 Bug
  success: 登录流程正常，测试通过

constraints:
  - 不能引入新依赖
  - 保持 TypeScript 类型完整

state:
  current: 已定位到表单校验逻辑
  done:
    - 复现了 Bug
  remaining:
    - 修复校验
    - 补充测试

facts:
  - file: src/pages/Login.tsx
    note: 登录表单与校验逻辑
  - error: "TypeError: cannot read 'value' of undefined"

history:
  - tried: 修改 useState 初始值
    result: 无效

priority:
  - 用户最新描述 > 旧文档
```

---

## 总结

关键信息放入 Context 的形式，应遵循：

1. **结构化**，不写大段散文
2. **分层**，重要信息放显眼位置
3. **按需**，只给当前步骤需要的
4. **摘要**，放结论不放全文
5. **带来源和时效**
6. **显式标注冲突和优先级**
7. **贴近可执行形式**
8. **控制噪声**

一句话：

> 关键信息不仅要"放对"，还要"放好"。
