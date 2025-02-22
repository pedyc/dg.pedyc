---
title: Angular
aliases: []
uid: 
author: 
description: 
date-created: 2024-08-15
date-modified: 2024-11-21
status: 
type: 
tags: [angular]
---

[[Roadmap for Angular|Angular知识地图]]
[[Angular.json|Angular配置]]

---

## 基础知识

### 语法

装饰器（用于 class）

```Javascript
@Module
@Component
```

流程控制

```Javascript
@if(NgIf <= v16)
@for(NgFor <= v16)
```

属性绑定

```Javascript
<div [contentEditable]="isEditable" />
```

事件绑定

```Javascript
<button (click)="greet()" />
```

组件通信

```Javascript
@Input
```
