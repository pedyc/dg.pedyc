---
uid: 202605121100
title: Speculation Rules API
aliases: [T-Speculation-Rules-API]
description: 浏览器预取/预渲染 API，通过声明式规则提前加载用户可能访问的页面
tags: []
date-created: 2026-05-12
date-modified: 2026-05-12
status: cultivating
content-type: term
up: "[[Web API]]"
---

## 术语：Speculation Rules API

> **领域**：#前端/浏览器API

### 定义

Speculation Rules API 是浏览器提供的声明式预取/预渲染 API。通过在页面中嵌入 `<script type="speculationrules">` 标签，浏览器可以预测用户可能访问的链接并提前加载资源，显著提升页面导航速度。

**核心机制**：
- **Prefetch**：在后台获取目标页面的资源（HTML、JS、CSS），但不完全渲染
- **Prerender**：在后台完全渲染目标页面，用户点击时立即显示

**基本语法**：

```html
<script type="speculationrules">
{
  "prefetch": [
    {
      "source": "document",
      "where": { "href_matches": "/about/*" },
      "eagerness": "moderate"
    }
  ],
  "prerender": [
    {
      "source": "document",
      "where": { "selector_matches": ".product-link" }
    }
  ]
}
</script>
```

**配置参数**：
- `source`：数据来源，`document` 表示从当前文档中的链接提取
- `where.href_matches`：URL 匹配模式
- `where.selector_matches`：CSS 选择器匹配
- `eagerness`：预取积极性（`conservative`/`moderate`/`eager`）

### 跨学科含义

- **在性能优化中**：Speculation Rules 是预测性加载策略，比传统 `<link rel="prefetch">` 更灵活
- **在前端监控中**：预取/预渲染行为会影响 Performance API 的测量结果
- **在 SEO 中**：合理使用预渲染可提升用户体验，但需避免过度预取浪费带宽

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：[[前端性能优化]] — Speculation Rules 是性能优化的手段之一
- **并列概念**：
	- [[Preload]] — 资源预加载 API
	- [[Prefetch]] — 资源预获取 API
- **相关概念**：
	- [[Performance API]] — 测量预取/预渲染效果
	- [[前端监控]] — 监控页面加载性能
