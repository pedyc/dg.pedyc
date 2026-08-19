---
uid: 202606121200
title: Angular面试题
aliases: [MOC-Angular面试题]
description: Angular 面试题目汇总，按模块分类，关联知识库笔记
tags: [前端开发/Angular, 前端面试]
date-created: 2026-06-12
date-modified: 2026-06-12
status: cultivating
content-type: moc
up:
  - - 前端面试真题库|前端面试题
---

## MOC-Angular 面试题

> 基于知识库笔记整理的 Angular 面试题汇总，按模块分类

---

### 依赖注入

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 的依赖注入是如何工作的？ | [[依赖注入]] |
| @Injectable() 的 providedIn 各选项有什么区别？ | [[依赖注入]] |
| @Injectable 和 @Component 中 providers 的区别是什么？ | [[依赖注入]] |
| 分层注入 (Hierarchical Injector) 是如何查找依赖的？ | [[依赖注入]] |
| useClass / useExisting / useFactory / useValue 各适用于什么场景？ | [[依赖注入]] |

---

### 组件基础

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 组件的生命周期钩子执行顺序是怎样的？ | [[Angular]] |
| OnPush 变更检测策略与 Default 有什么区别？ | [[Angular]] |
| 父子组件通信方式有哪些？ | 待补充 |
| @Input / @Output 的底层实现原理 | [[Angular]] |
| ContentChild / ViewChild 的区别 | 待补充 |

---

### 变更检测

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 的变更检测机制是如何工作的？ | [[Angular]] |
| 什么情况下会触发变更检测？ | [[Angular]] |
| NgZone 的作用是什么？如何优化变更检测性能？ | [[Angular]] |
| ChangeDetectorRef.detectChanges() 和 markForCheck() 的区别 | [[Angular]] |

---

### 模板与指令

| 示例题目 | 关联笔记 |
|---|:---|
| 结构型指令与属性型指令的区别 | 待补充 |
| *ngIf / *ngFor / *ngSwitch 的工作原理 | 待补充 |
| 自定义指令的典型应用场景 | 待补充 |
| 模板引用变量 (#var) 的作用域规则 | 待补充 |

---

### 管道

| 示例题目 | 关联笔记 |
|---|:---|
| 纯管道 (pure) 与非纯管道 (impure) 的区别 | 待补充 |
| async pipe 的工作原理和优势 | [[RxJS]] |
| 如何自定义管道？ | 待补充 |

---

### 表单

| 示例题目 | 关联笔记 |
|---|:---|
| 模板驱动表单 vs 响应式表单，各自优缺点 | 待补充 |
| 自定义表单验证器如何实现？ | 待补充 |
| FormControl 的状态和样式绑定 | 待补充 |
| ValueChanges / StatusChanges 的使用场景 | 待补充 |

---

### 路由

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 路由的激活策略是什么？ | [[路由守卫]] |
| 路由守卫的种类和执行顺序 | [[路由守卫]] |
| 懒加载模块的路由配置方式 | 待补充 |
| Resolve 守卫的使用场景 | [[路由守卫]] |

---

### HTTP 与拦截器

| 示例题目 | 关联笔记 |
|---|:---|
| HttpClient 拦截器的执行顺序是怎样的？ | 待补充 |
| 如何在拦截器中处理全局错误和 Token 刷新？ | 待补充 |
| HttpInterceptor 的多实例执行顺序 | 待补充 |
| HttpClient 请求取消 (switchMap / takeUntil / AbortController) | [[AbortController API]] |

---

### RxJS 在 Angular 中的应用

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 中如何管理订阅的生命周期？ | [[RxJS]] |
| async pipe 如何自动管理订阅？ | [[RxJS]] |
| 组件间数据共享用 Subject / BehaviorSubject / ReplaySubject 如何选择？ | [[RxJS]] |
| 取消订阅的几种方式对比 | [[RxJS]] |

---

### 状态管理

| 示例题目 | 关联笔记 |
|---|:---|
| NgRx 的核心概念 (Store / Action / Reducer / Effect / Selector) | 待补充 |
| NgRx ComponentStore 适用于哪些场景？ | 待补充 |
| 什么时候不需要 NgRx？ | 待补充 |

---

### 性能优化

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 性能优化的常见手段有哪些？ | [[Angular]] |
| trackBy 的作用和原理 | 待补充 |
| 虚拟滚动 (CDK Scrolling) 的使用场景 | 待补充 |
| 懒加载对首屏性能的提升 | [[SPA]] |

---

### 模块与架构

| 示例题目 | 关联笔记 |
|---|:---|
| 什么是单体仓库 (Monorepo)？Nx 解决了什么问题？ | [[Monorepo架构]] |
| Angular 模块 (NgModule) 的作用域隔离机制 | 待补充 |
| standalone component 与 NgModule 的区别 | 待补充 |
| 微前端架构中 Angular 的集成方式 | [[微前端]] |

---

### 测试

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 单元测试的核心依赖 (TestBed / ComponentFixture) | 待补充 |
| 如何模拟 HttpClient 请求？ | 待补充 |
| 组件测试中如何触发变更检测？ | 待补充 |

---

### 安全

| 示例题目 | 关联笔记 |
|---|:---|
| Angular 的默认 XSS 防护机制 (DomSanitizer) | [[现代框架默认防御XSS但危险API仍需注意]] |
| 什么时候需要使用 bypassSecurityTrustXxx？风险是什么？ | [[现代框架默认防御XSS但危险API仍需注意]] |

---

### 待探索

- [ ] Angular 信号 (Signals) 的原理及其与 Zone.js 的关系
- [ ] Angular 18+ 的新特性一览
- [ ] Standalone Component 全面取代 NgModule 的迁移路径
- [ ] Angular Server-Side Rendering (SSR / Angular Universal) 面试要点
- [ ] Angular CDK 面试常见问题
- [ ] 如何实现 Angular 国际化 (i18n)
- [ ] Angular 动画 (Animation) 面试题
