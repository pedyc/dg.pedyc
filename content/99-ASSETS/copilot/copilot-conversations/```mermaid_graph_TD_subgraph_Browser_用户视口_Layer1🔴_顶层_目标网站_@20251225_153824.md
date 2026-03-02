---
epoch: 1766648304892
modelKey: "gemini-2.5-flash|google"
topic: "Clickjacking Phishing Layers"


tags:
  - copilot-conversation
---

**user**: ```mermaid
graph TD
    subgraph Browser [用户视口]
        Layer1[🔴 顶层: 目标网站 iframe<br>(opacity: 0, z-index: 999)]
        Layer2[🟢 底层: 钓鱼页面<br>(诱导按钮: '点击中奖')]
        Mouse[🖱️ 用户点击]
    end
    
    Mouse -->|穿透视觉| Layer1
    Layer1 -->|触发真实操作| Target[目标网站后端<br>(转账/关注/删除)]
    
    style Layer1 fill:#ffcccc,stroke:#333,stroke-dasharray: 5 5
    style Layer2 fill:#ccffcc,stroke:#333
````

语法是否存在错误
[Context: Notes: PARA/20-AREAS/A 前端开发/点击劫持.md]
[Timestamp: 2025/12/25 15:38:24]

**ai**: ```architect-analysis
内容粒度: Term
归档建议: 这是一个对“点击劫持”这一术语的详细定义和防御策略的描述，属于术语范畴。
```
```yaml
---
uid: 202512170403
title: "点击劫持"
aliases: ["Clickjacking", "UI Redressing", "界面伪装攻击"]
type: term
status: cultivating
up: "[[Web安全]]"
tags:
  - term
  - 浏览器/安全
date-created: 2025-12-17
---
```
该 Mermaid 语法是正确的，没有发现语法错误。

```mermaid
graph TD
    subgraph Browser [用户视口]
        Layer1[🔴 顶层: 目标网站 iframe<br>(opacity: 0, z-index: 999)]
        Layer2[🟢 底层: 钓鱼页面<br>(诱导按钮: '点击中奖')]
        Mouse[🖱️ 用户点击]
    end
    
    Mouse -->|穿透视觉| Layer1
    Layer1 -->|触发真实操作| Target[目标网站后端<br>(转账/关注/删除)]
    
    style Layer1 fill:#ffcccc,stroke:#333,stroke-dasharray: 5 5
    style Layer2 fill:#ccffcc,stroke:#333
```
[Timestamp: 2025/12/25 15:38:45]