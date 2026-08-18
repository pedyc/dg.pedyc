---
uid: 202605060800
title: NextJS 的本质是 React 框架与服务端能力的深度融合
aliases: []
description: "NextJS 的本质是 React 框架与 Node.js 服务端能力的深度融合"
tags: []
date-created: 2026-05-06
date-modified: 2026-05-06
status: fleeting
content-type: atomic
up:
---

> NextJS 的本质是 React 框架与 Node.js 服务端能力的深度融合

## 论据/示例

**1. 服务端渲染（SSR）**

```jsx
// pages/index.tsx - 默认服务端渲染
export default function Home({ data }) {
  return <div>{data.message}</div>
}

export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return { props: { data } }
}
```

NextJS 让 React 组件可以在服务器端执行，直接返回完整 HTML。

**2. API Routes**

```js
// pages/api/user.ts
export default function handler(req, res) {
  res.status(200).json({ name: 'NextJS' })
}
```

前后端代码可以在同一个项目中管理。

**3. App Router（NextJS 13+）**

```jsx
// app/page.tsx - React Server Components
async function Page() {
  const data = await db.query('SELECT * FROM posts')
  return <div>{data.map(post => <Post key={post.id} post={post} />)}</div>
}
```

服务端组件直接查询数据库，无需 API 层。

## 关联

- [[React]]
- [[NodeJS]]
- [[服务端渲染]]
