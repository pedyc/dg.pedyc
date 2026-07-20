---
uid: 202604111800
title: SOP-CSS实现文字横向滚动效果
aliases: [SOP-CSS实现文字横向滚动效果]
description: 使用纯 CSS 实现无限循环文字横向滚动（跑马灯）效果的标准流程
tags: [CSS, 前端开发/动画]
date-created: 2026-04-11
date-modified: 2026-04-12
status: cultivating
content-type: sop
up: "[[CSS Animation]]"
---

## SOP：CSS 实现文字横向滚动效果

> 本 SOP 定义使用纯 CSS 实现无限循环横向文字滚动效果的标准流程，核心思路是**精确宽度计算 + 等距位移**，适用于标语展示、品牌跑马灯、公告通知等场景。

[[40-RESOURCES/_resources/SOP-CSS实现文字横向滚动效果/e655c36112b327b457605e6ccaf06d92_MD5.gif|Open: 2026-04-12-18-21-37.gif]]
![[40-RESOURCES/_resources/SOP-CSS实现文字横向滚动效果/e655c36112b327b457605e6ccaf06d92_MD5.gif]]
---

### 适用场景

- ✅ 场景 1：全屏品牌标语的循环滚动展示
- ✅ 场景 2：网站公告栏的滚动通知
- ✅ 场景 3：导航栏或 Hero 区域的文字动效

---

### 流程图解

```mermaid
flowchart LR
    A[确定每屏显示数量 N] --> B[计算单项宽度 = 100vw / N]
    B --> C[准备 2 组内容共 2N 个元素]
    C --> D[动画位移 = -100vw / N]
    D --> E[无缝循环]
```

---

### 核心原理

无缝滚动的本质是：**动画结束位置 = 动画起始位置**。

实现方式：把内容复制一份（共 2N 个元素），每次动画只滚动一个元素的宽度。当第一个元素滚出视口时，后面的复制内容已经补上，视觉上感知不到重置。

```bash
初始：[A][B][C][D] [A][B][C][D]
         ↓ 滚动一个元素宽度
结束：    [B][C][D] [A][B][C][D]
         ↓ 动画重置（瞬间，无感知）
初始：[A][B][C][D] [A][B][C][D]
```

---

### 核心步骤

#### 步骤 1：确定每屏显示数量 N，计算宽度

每屏显示 4 个元素时，单个元素宽度 = `100vw / 4`：

```css
.marquee-content span {
  width: calc(100vw / 4);   /* 单项宽度 */
  flex-shrink: 0;            /* 禁止压缩，保持计算宽度 */
}
```

> `flex-shrink: 0` 是必须的，否则 flex 容器可能压缩元素，破坏宽度计算。

#### 步骤 2：准备 2 组完整内容

HTML 中准备 **2N 个元素**（2 组相同内容），且**所有元素必须写在同一行，不能有换行或空格**：

```html
<!-- ✅ 正确：无换行，无空格 -->
<div class="marquee-content">
  <span>HELLO</span><span>WORLD</span><span>HELLO</span><span>WORLD</span>
</div>

<!-- ❌ 错误：span 之间有换行 -->
<div class="marquee-content">
  <span>HELLO</span>
  <span>WORLD</span>
</div>
```

> HTML 换行会被浏览器解析为空白字符，导致元素间出现意外间隙，破坏宽度计算。

#### 步骤 3：设置容器与动画

```css
/* 外层容器：隐藏溢出 */
.marquee {
  width: 100vw;
  overflow: hidden;
  display: flex;
  align-items: center;
}

/* 内容区：flex 布局，宽度由内容撑开 */
.marquee-content {
  display: flex;
  /* ❌ 禁止使用 gap / justify-content，会破坏精确宽度计算 */
  animation: marquee 4s linear infinite;
}

/* 动画：每次位移恰好一个元素的宽度 */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-100vw / 4)); } /* = 一个元素的宽度 */
}
```

#### 步骤 4：调整动画时长

动画时长决定滚动速度，与内容数量无关，只与视觉节奏有关：

| 场景 | 时长 | 效果 |
|:---|:---|:---|
| 快速展示 | 2 ~ 4s | 急促、活力 |
| 正常节奏 | 4 ~ 8s | 舒适阅读 |
| 慢速高端 | 10s+ | 沉稳、优雅 |

#### 步骤 5：添加悬停暂停（可选）

```css
.marquee-content:hover {
  animation-play-state: paused;
}
```

---

### 完整示例

```html
<div class="marquee">
  <div class="marquee-content">
    <span>WELCOME TO</span><span>WELCOME TO</span><span>WELCOME TO</span><span>WELCOME TO</span><span>WELCOME TO</span><span>WELCOME TO</span><span>WELCOME TO</span><span>WELCOME TO</span>
  </div>
</div>
```

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

.marquee {
  width: 100vw;
  height: 100vh;
  background-color: #7ec1f9;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.marquee-content {
  display: flex;
  animation: marquee 4s linear infinite;
}

.marquee-content span {
  font-size: calc(100vw / 10);
  width: calc(100vw / 4);
  text-align: center;
  flex-shrink: 0;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-100vw / 4)); }
}
```

---

### 常见坑点

- ⛔ **span 之间有空格/换行**
	- **原因**：HTML 换行被解析为空白字符，元素间出现额外间距
	- **排查**：所有 `span` 写在同一行，不留任何空格和换行
- ⛔ **滚动有跳跃感**
	- **原因**：动画位移距离与元素实际宽度不一致，或使用了 `gap` / `justify-content`
	- **排查**：`translateX` 的值必须精确等于单个元素宽度；去掉 `gap`
- ⛔ **元素被压缩变形**
	- **原因**：缺少 `flex-shrink: 0`，flex 容器压缩了子元素
	- **排查**：为每个滚动项添加 `flex-shrink: 0`
- ⛔ **屏幕边缘出现空白**
	- **原因**：内容组数不足，动画结束前内容已耗尽
	- **排查**：内容至少准备 2 组（2N 个元素），保证动画重置时内容连续
- 🔧 **响应式适配**：使用 `calc(100vw / N)` 计算宽度，自动适配所有屏幕，无需媒体查询

---

### 知识图谱

- **父级概念**：[[CSS Animation]] — 本 SOP 是 CSS 动画的具体应用场景
- **关联概念**：
	- [[SOP-在React中实现文字故障动画]] — 另一种文字动画效果
	- [[Canvas实现无限滑动效果]] — Canvas 实现的无限滑动
