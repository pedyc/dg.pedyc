---
uid: 202605121800
title: Web App Manifest
aliases: [T-Web-App-Manifest]
description: PWA 的配置文件，定义应用元数据实现可安装性
tags: []
date-created: 2026-05-12
date-modified: 2026-05-12
status: cultivating
content-type: term
---

## 术语：Web App Manifest

> **领域**：#前端/PWA

### 定义

Web App Manifest（应用清单）是 PWA 的配置文件，以 JSON 格式定义应用的元数据，告诉浏览器如何将 Web 应用安装到用户主屏幕，包括名称、图标、主题色、启动方式等。

**必需字段**：
- `name`：应用全名
- `icons`：应用图标数组（至少包含 192x192 和 512x512）
- `start_url`：用户启动时的起始 URL
- `display`：显示模式（standalone、fullscreen、minimal-ui、browser）

**可选字段**：
- `short_name`：应用短名称（主屏幕空间有限时使用）
- `description`：应用描述
- `background_color`：启动画面背景色
- `theme_color`：主题色（影响状态栏颜色）
- `orientation`：屏幕方向（portrait、landscape）
- `categories`：应用分类
- `scope`：应用的作用域

**基本示例**：

```json
{
  "name": "我的 PWA 应用",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4CAF50",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 跨学科含义

- **在 PWA 中**：Manifest 是 PWA 可安装性的三大条件之一（ HTTPS + Manifest + Service Worker）
- **在用户体验中**：通过配置启动画面和主题色，提供类原生的开屏体验
- **在前端开发中**：集中管理应用元数据，无需修改 HTML 即可更新

### 知识网络

> 知识图谱分类基于奥苏贝尔同化理论：上位（父级）、下位（子集）、并列、相关

- **父级概念**：[[PWA]] — Manifest 是 PWA 的三大核心技术之一
- **并列概念**：
	- [[Service Worker]] — PWA 另一核心技术（离线能力）
	- [[HTTPS]] — PWA 安全基础
- **相关概念**：
	- [[前端性能优化]] — Manifest 优化可缩短首屏渲染时间
	- [[SOP-开发一个最小PWA应用]] — Manifest 在 PWA 开发中的使用
