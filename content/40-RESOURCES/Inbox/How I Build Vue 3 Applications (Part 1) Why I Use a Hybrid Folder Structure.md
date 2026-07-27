---
title: How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure
author:
description: When a Vue project starts, almost any folder structure works. With only a handful of components and... Tagged with vue, typescript, webdev, architecture.
tags: [clippings, 前端工程/架构]
date-created: 2026-07-25
date-modified: 2026-07-25
created: 2026-07-25
published: 2026-07-06
source: https://dev.to/lazydoomslayer/how-i-build-vue-3-applications-part-1-why-i-use-a-hybrid-folder-structure-48c2
---

> 收敛:[[Vue3 混合文件夹结构|SOP-Vue3-混合文件夹结构]]

When a Vue project starts, almost any folder structure works. With only a handful of components and pages, it's easy to find what you're looking for.

The challenge begins as the application grows. More features are added, more developers join the project, and suddenly finding the right file takes longer than writing it.

Over the years, I've experimented with different ways of organizing Vue applications. Instead of choosing between a **responsibility-first** structure (`components`, `services`, `stores` …) and a **feature-first** structure (`billing`, `users`, `products` …), I settled on combining both.

**My approach is simple: organize the project by responsibility at the root, then organize business-specific code by feature inside those responsibilities.**

I call this a **hybrid folder structure**, and in this article I'll explain why it has worked well for me.

---

## The Two Common Approaches

In my experience, most Vue project structures fall into **one of two categories**.

Some teams organize everything by **responsibility** (or file type), while others organize everything by **feature** (or domain). Both approaches have their strengths, and both have trade-offs.

Let's look at each one.

---

## Organizing by Responsibility

A **responsibility-first** structure groups files by **what they do**.

[![[../../_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/9a1f8150af1dffbc56100f8ea4902d1f_MD5.webp]]](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fig8z9d5jk1p02pzc6xcb.png)

This is probably the most common structure you'll see in Vue projects. It's **simple**, **familiar**, and easy for new developers to navigate. If you're looking for a component, you open `components/`. If you need a Pinia store, you know exactly where to find it.

For **small and medium-sized projects**, this works extremely well.

However, as the application grows, a **single feature** becomes spread across multiple directories. Implementing or modifying one feature often means jumping between `components/`, `services/`, `store/`, `types/`, and `composables/`.

The structure is **predictable**, but the feature itself becomes **fragmented**.

> 💡 **Trade-off**
>
> Finding a specific **type of file** is easy.
> Working on a specific **business feature** becomes harder.

## Organizing by Feature

A **feature-first** structure takes the opposite approach.

[![[../../_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/9977399c198c6319755040441f004288_MD5.webp]]](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F8c8y2qi3qtx11vuyzts1.png)

Everything related to a **business feature** lives together. Components, composables, services, stores, and types are colocated inside the same directory.

This makes working on a **single feature** very convenient because almost everything you need is in one place.

However, I personally found that this approach introduces a different challenge. **Not everything in an application belongs to a single business feature.** Shared UI components, layouts, transitions, global composables, application configuration, and other **cross-cutting concerns** still need their own place.

For the kinds of applications I build, a **purely feature-based** structure felt like solving one problem while creating another.

> 💡 **Trade-off**
>
> Working on a specific **feature** is easy.
> Organizing **shared application code** becomes more challenging.

---

After working with both approaches, I found myself naturally combining them.

I wanted the **predictability** of a **responsibility-first** structure while keeping **feature-specific code** grouped together.

That eventually led me to the hybrid structure I use today.

## The Hybrid Structure I Use

My approach follows one simple principle:

> **Responsibility first. Feature second.**

At the root of the project, I organize files by **responsibility**.

[![[../../_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/7b6b48d978fa659574af2e38db54ba3c_MD5.webp]]](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fxd1e8l3s7dwzc0b1t0a1.png)

Every top-level folder answers the first question:

> **What kind of file is this?**

For example:

- `components/` contains UI components.
- `composables/` contains reusable reactive logic.
- `services/` contains business operations.
- `store/` contains Pinia stores.
- `types/` contains TypeScript contracts.

However, organizing by responsibility only solves **half of the problem**.

It tells me **what** a file is, but not **which feature** it belongs to.

That's where the second part of my approach comes in.

[![[../../_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/5922f21cbfa6306a1d1dd8b4b924631e_MD5.webp]]](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fa3jpzykd3qkcjmpdtpiq.png)

Inside each responsibility, I organize code by **feature** or **business domain**.

For example, components related to billing stay together, pricing services stay together, and product composables stay together.

This keeps feature-specific code close together without sacrificing the predictability of the project's top-level structure.

The result is neither a purely **responsibility-first** nor a purely **feature-first** architecture.

Instead, it follows one simple principle:

> **Responsibility first. Feature second.**

---

## File Names Are Part of the Architecture

One thing I care about a lot is file naming.

I use suffixes like:

```bash
*.service.ts
*.pinia.ts
*.types.ts
*.helper.ts
*.guard.ts
*.vue
```

This may look like a small detail, but it improves searchability a lot.

When I search for product, I can quickly understand what each file does:

[![[../../_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/3484705978f821b752e1d89631ec4417_MD5.webp]]](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F5k6s51ruggs12c0f5moq.png)

The goal is simple:

> I should be able to understand what a file probably does before opening it.

---

## Conclusion

There is no single "correct" way to organize a Vue application.

Every team, product, and codebase has different requirements.

This hybrid approach has worked well for me because it keeps the project predictable while making feature-specific code easy to find and maintain. More importantly, it gives me a simple mental model that scales as the application grows.

This is simply the approach I've refined over the years, and it continues to evolve with every project.
