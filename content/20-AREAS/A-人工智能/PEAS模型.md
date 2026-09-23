---
title: PEAS模型
aliases:
  - PEAS
  - T-PEAS模型
date-created: 2026-09-22
date-modified: 2026-09-22
content-type: [term]
up: ["[[人工智能]]"]
---

PEAS模型是人工智能中用来描述一个智能体（Agent）所处任务环境（Task Environment）的经典框架。

PEAS是四个英文单词的首字母：

| 字母                      | 含义   | 解释           |
| ----------------------- | ---- | ------------ |
| P — Performance measure | 性能度量 | 怎么判断Agent的效能 |
| E — Environment         | 环境   | Agent所交互的世界  |
| A — Actuators           | 执行器  | Agent能够采取的行动 |
| S — Sensors             | 传感器  | Agent能够感知的信息 |

## 示例

如果设计一个自动驾驶Agent，可以设计PEAS模型如下：

| P      | E    | A   | S       |
| ------ | ---- | --- | ------- |
| 安全     | 道路   | 加速  | 摄像头     |
| 到达目的地  | 其他车辆 | 减速  | 雷达      |
| 遵守交通规则 | 天气   | 刹车  | GPS     |
| 减少行驶时间 | 路况   | 转向  | 车辆自身传感器 |
| 减少能耗   | 红绿灯  | 变道  |         |

在这个任务环境中，一个Agent如果想要达到目标需要受到多个因素的影响，例如加速可能影响安全；
天气可能影响摄像头等等。

## FAQ

[[为什么PEAS很重要？]]
