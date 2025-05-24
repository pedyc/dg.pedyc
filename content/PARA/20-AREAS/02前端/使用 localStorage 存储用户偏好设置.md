---
title: 使用 localStorage 存储用户偏好设置
date-created: 2025-05-23
date-modified: 2025-05-23
---

- 存储用户主题偏好

```javascript
// 设置主题
function setTheme(theme){
	document.documentElement.setAttribute('data-theme',theme);
	localStorage.setItem('theme',theme);
}

// 初始化时读取
const theme = localStorage.getItem('theme');
if(theme) setTheme(theme);
```
