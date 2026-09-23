---
title: React中应该如何选择useState、useReducer和Context？
date-created: 2026-09-22
date-modified: 2026-09-22
content-type:
  - question
up:
  - "[[前端状态管理]]"
---

- `useState`解决「状态是什么」，关注单个简单状态
- `useReducer`解决「状态如何变化」，关注状态变化逻辑
- `Context`解决「状态如何跨组件传递」，关注状态跨组件传递

**决策树**

```bash
                   状态在哪里使用？
                           │
             ┌──────┴──────┐
             │                          │
          局部使用                  跨组件使用
             │                          │
          useState                    Context
             │                          │
             │                     状态变化复杂？
             │                       /       \
             │                     否         是
             │                    │          │
             │                  Context     Context
             │                                 +
             │                            useReducer
             │
        状态变化复杂？
          /       \
        否         是
        │          │
    useState    useReducer
```
