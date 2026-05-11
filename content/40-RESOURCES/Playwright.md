---
uid: 202604011300
title: Playwright
aliases:
  - T-Playwright
description: 微软开发的现代 E2E 测试框架，支持 Chromium、Firefox、WebKit 多浏览器
tags:
  - term
  - 前端工程化
  - 测试
date-created: 2026-04-01
date-modified: 2026-04-01
status: active
content-type: term
related:
  - "[[E2E]]"
  - "[[前端工程]]"
---

## 术语：Playwright

> **领域**：#前端工程化/测试

### 定义

Playwright 是微软开发的现代 E2E 测试框架，支持 Chromium、Firefox、WebKit 多浏览器，提供一致的 API 和强大的自动化能力。

```javascript
// 基本示例
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.click('button#submit');
  await browser.close();
})();
```

---

### 核心特性

| 特性 | 说明 |
|:---|:---|
| **多浏览器支持** | Chromium、Firefox、WebKit（Safari） |
| **跨平台** | Windows、macOS、Linux |
| **自动等待** | 智能等待元素就绪，无需硬编码 sleep |
| **隔离性** | 每个测试独立 browser context |
| **截图/视频** | 内置支持测试失败时的证据捕获 |
| **网络拦截** | 可模拟 API 响应，进行 mock |

---

### 常用 API

| API | 说明 |
|:---|:---|
| `page.goto(url)` | 导航到页面 |
| `page.click(selector)` | 点击元素 |
| `page.fill(selector, text)` | 填写输入框 |
| `page.locator()` | 语义化定位器（推荐） |
| `page.waitForSelector()` | 等待元素出现 |
| `page.evaluate()` | 执行 JavaScript |
| `browser.newPage()` | 创建新页面 |
| `browserContext.storageState()` | 保存登录状态 |

---

### Locator vs Selector

```javascript
// 不推荐：CSS 选择器脆弱
await page.click('#submit-btn');

// 推荐：Locator 语义化
const submitBtn = page.locator('#submit-btn');
await submitBtn.click();

// 最佳：文本定位
await page.getByRole('button', { name: 'Submit' }).click();
```

---

### 实践示例

#### 页面对象模型 (POM)

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitBtn = page.getByRole('button', { name: 'Login' });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }
}

module.exports = { LoginPage };
```

#### 网络拦截

```javascript
await page.route('**/api/user', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ name: 'Test User' }),
  });
});
```

---

### 常见问题

- ⛔ **选择器脆弱**：避免使用 CSS 路径，优先使用 `getByRole`、`getByText`
- ⛔ **硬编码等待**：使用 `waitForSelector` 而非 `sleep`
- ⛔ **测试间数据污染**：每个测试使用独立的 `browser.newContext()`

---

### 知识网络

- **父级概念**：[[E2E]] — 属于端到端测试领域
- **相关概念**：
	- [[Cypress]] — 另一个 E2E 测试框架
	- [[前端工程]] — Playwright 是质量保障工具
- **相关工具**：
	- Playwright CLI — 测试运行器
	- Playwright Test — 测试运行器（@playwright/test）

---

### 参考延伸

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
