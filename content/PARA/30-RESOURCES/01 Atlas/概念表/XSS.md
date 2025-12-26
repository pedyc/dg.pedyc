---
title: XSS
aliases: [Cross-Site Scripting, 跨站脚本攻击]
tags: [领域/安全, 核心概念, 面试/高频]
date-created: 2025-12-17
date-modified: 2025-12-25
type: concept
---

## 🛡️ 核心概念：XSS (跨站脚本攻击)

### 🔎 核心定义

> [!abstract] 数据变成了代码
> **XSS (Cross-Site Scripting)** 是一种代码注入攻击。
> 攻击者往 Web 页面里插入恶意 Script 代码，当用户浏览该页之时，嵌入在 Web 里面的 Script 代码会被执行，从而达到恶意攻击用户的目的。
>
> *本质*：浏览器无法区分**" 用户的数据 "**和**" 开发者的代码 "**，盲目信任并执行了。

---

### 🆚 三种类型对比 (面试必考)

| 类型                   | 存储位置 (Payload Location) | 触发机制                             | 危害程度             | 典型场景            |
|:------------------- |:---------------------- |:------------------------------- |:--------------- |:-------------- |
| 存储型<br>(Stored)      | 数据库 (后端)                | 用户访问页面 -> 读取数据库 -> 渲染            | 🔥 最高 (持久化，受害者广) | 论坛发帖、商品评论、私信    |
| 反射型<br>(Reflected)   | URL 参数                  | 用户点击恶意链接 -> 服务器解析 -> 拼接到 HTML 返回 | ⚠️ 中等 (需要诱导点击)   | 搜索结果页、错误跳转页     |
| DOM 型<br>(DOM-based) | HTML/JS (前端)            | JS 读取 URL/Input -> 修改 DOM        | ⚠️ 中等 (纯前端漏洞)    | 路由跳转、动态 Hash 渲染 |

#### 流程可视化

```mermaid
graph TD
    subgraph 存储型
        A1[攻击者提交恶意脚本] --> DB[(数据库)]
        DB -->|用户访问| Server1[服务端拼接 HTML]
        Server1 --> Browser1[浏览器执行]
    end

    subgraph 反射型
        A2[诱导点击恶意链接] --> URL
        URL --> Server2[服务端解析参数]
        Server2 -->|反射回| Browser2[浏览器执行]
    end

    subgraph DOM型
        A3[诱导点击恶意链接] --> URL2
        URL2 -->|JS 读取并操作 DOM| Browser3[浏览器执行]
        note[⚠️ 不经过服务端]
    end
````

---

### 💉 常见攻击载荷 (Payloads)

攻击者不仅仅使用 `<script>`，还有很多绕过姿势：

1. **直接执行**：`<script>alert(document.cookie)</script>`
2. **属性注入**：`<img src=x onerror=alert(1)>` (利用图片加载失败触发)
3. **伪协议**：`<a href="javascript:alert(1)">点击领奖</a>`
4. **利用 CSS**：`background-image: url("javascript:…")` (较旧，但在某些环境仍有效)

---

### 🛡️ 防御体系 (Defense)

#### 1. 核心原则：不要信任任何输入

- **输入过滤 (Input Validation)**：在数据入口（如表单提交时）进行类型检查和长度限制。（*注意：主要为了业务正确性，安全上不能仅依赖此项*）
- **输出转义 (Output Encoding)**：**这是最有效的防御**。在将数据输出到 HTML 上下文时，将特殊字符（`<`, `>`, `&`, `"`, `'`）转换为 HTML 实体。
	- `<` 转义为 `&lt;`
	- `>` 转义为 `&gt;`

#### 2. 现代框架的自动防御

现代前端框架（React/Vue/Angular）默认进行转义，大大降低了 XSS 风险。

> [!warning] ⚠️ 危险操作区
>
> 只有当你手动使用以下 API 时，才可能导致 XSS：
>
> - **React**: `dangerouslySetInnerHTML`
> 
> - **Vue**: `v-html`
> 
> - **原生 JS**: `innerHTML`, `outerHTML`
> 
> 
> **正确做法**：如果必须渲染富文本，务必使用清洗库！

#### 3. 代码实战 (Sanitization)

使用权威库 **DOMPurify** 进行清洗，而非自己写正则。

JavaScript

```bash
import DOMPurify from 'dompurify';

// 假设这是攻击者传来的数据
const dirty = '<img src="x" onerror="alert(1)">I love React';

// ❌ 错误示范：直接渲染
// <div dangerouslySetInnerHTML={{ __html: dirty }}></div>

// ✅ 正确示范：清洗后再渲染
const clean = DOMPurify.sanitize(dirty); 
// 结果: <img src="x">I love React (onerror 事件被剥离)

// <div dangerouslySetInnerHTML={{ __html: clean }}></div>
```

#### 4. 兜底策略：[[CSP]]

配置 **Content Security Policy** (内容安全策略) 是最后一道防线。

- **原理**：告诉浏览器，只允许加载指定域名的脚本，禁止内联脚本 (`unsafe-inline`)。
- **效果**：即使攻击者注入了 `<script>`，浏览器也会拒绝执行。

---

### 📝 自检清单 (Checklist)

- [ ] **面试题**：能清晰说出存储型、反射型、DOM 型的区别吗？（关键点：数据库 vs URL vs 纯前端）
- [ ] **面试题**：HttpOnly Cookie 能防御 XSS 吗？（答案：**不能防御 XSS 本身**，但能防止 XSS 攻击成功后**窃取 Cookie**，属于减损措施。）
- [ ] **代码审查**：项目中是否有裸写 `innerHTML` 或 `v-html` 的地方？是否有引入 DOMPurify？
- [ ] **代码审查**：URL 参数直接回显到页面时，是否进行了转义？

### 🔗 参考资料

- [[MDN Web Security]]
- [[OWASP Top 10]]
