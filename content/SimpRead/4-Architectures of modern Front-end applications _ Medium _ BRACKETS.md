---
title: 4-Architectures of modern Front-end applications _ Medium _ BRACKETS
uid: 
aliases: []
author: 
description: 
tags: []
date-created: 2025-02-20
date-modified: 2025-02-20
status: 
banner: "https://miro.medium.com/v2/resize:fit:1200/1*AqbuEUeggBN5LcjIATxq-w.jpeg"
url: https://blog.meetbrackets.com/architectures-of-modern-front-end-applications-8859dfe6c12e
---

> [!md] Metadata
>
>
> :LiCalendarDays: 创建日期：[[2025-02-20]]
>
>
> :LiTags: 标签列表：#

Business requirements can be different and change frequently in the process, so it's important to create an architecture that is **flexible**, **scalable** and **maintainable**. It's also key that everyone, like team members and clients, understands the project clearly. To avoid extensive documentation, frequent meetings, and continuous refinements, we employ the following architectural approaches. This post explores the advantages of popular architectures and helps you choose the best solution to meet your unique requirements.

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/c3e3c0628a1e985380b264ec34c8dfa0_MD5.jpg]]

A lot of people think that the architectures listed below are just **"folder structures"**, which is only kind of true. In fact, if you look deeper into them, there are several important aspects:

* **_Modular Cooperation_**_: Efficient communication and interaction between different modules/components in the app (using component-based architecture, reusable code)._
* **_Improved Project Navigation_**_: Structuring the project in a way that makes it easy to navigate and maintain (clear folder hierarchy, naming conventions, separation of concerns)._
* **_Separation of Business Logic from UI Components_**_: Keeping the business logic (data fetching, state management) separate from the UI components to improve maintainability and reusability (e.g., using services or stores like Redux, Context API)._
* **_DRY_**_: Don't repeat yourself_
* **_DAC:_** _Divide and conquer_

Take a look at the following diagram — we're focusing on the area in the bottom right corner, where these principles come together most effectively:

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/fec2a2ebb8bafaec12c660cec6b10876_MD5.jpg]]

Ideal result — diagram

We want to realize these aspects with the help of architectures. Now let's analyze each of them in detail and choose the most relevant one for a specific situation.

Classic architecture — is an approach that many of you already use. We usually focus on basic concepts, dividing the project into **"pages"**, **"components"**, **"helpers"** and so on. However, the problem is that as the application grows, the structure starts to break down and it becomes much harder to find the right component or its business logic. Let's look at this with an example:

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/8c235bece0bf3d31da193bd7789bcd9b_MD5.jpg]]

Components overuse (example)

In this example, we have 3 pages that are obviously not overused. However, they may include all the components shown below. If we look at these components, we see a real **"chaos" 🤯**: each component actively uses the others, creating dependencies between them. This makes them difficult to scale and difficult to reuse.

Here's another example using **Redux** state manager:

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/ea682159547cdd41697dbd24f3ba8369_MD5.jpg]]

Scattered app logic — Redux state manager (example)

In our setup, each component is managed by a designated **"reducer"** which handles its specific logic. However, some component logic was mistakenly placed in incorrect reducers. This might have happened because a developer was unaware of an existing file or didn't consider creating a new one due to the limited amount of logic needed at the time. As a result, the logic for some components is now scattered across the project, making it less clear and harder to maintain.

we suggest reviewing the following diagram, which illustrates a missing architecture:

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/04a7c046b07f467b87531225636cd16d_MD5.jpg]]

Destructive decoupling —diagram (example)

This approach — (or perhaps more correctly, the lack of architecture 🥲) often causes a chaotic environment in which dependencies are difficult to track, leading to confusion and making it difficult to support the project. However, it may be useful for specific cases such as:

* _Small team (1–2 devs)_
* _MVP project_
* _Is not long term support project_
* _Study project or templates_

**Modular architecture** — is an approach where the application is divided into layers (`pages` , `modules`, `components`, `UI` etc.) in which there are already independent modules with their own logic and area of responsibility.

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/5a41dba75f20de61c11a4e02c41cffd8_MD5.jpg]]

Modular architecture — layer structure (example)

In this example, you can see that the application layers are lined up in the same direction: `pages`→ `modules`→ `components`→ `ui`(or vice versa, if you look at it from the other side). This means that the higher the layer (e.g. `pages`), the fewer layers from the lower layer it can use - components can't use modules, but can use everything from the UI layer, while modules use components but can't use pages. And pages already only use modules.

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/8d4a09c6d9a704c98c331a427d8c4380_MD5.jpg]]

Modular architecture — module & public API (example)

As we have already mentioned, each module has its own area of responsibility. It is also important to say that each module should have its own _public API (_`index.ts` file), which encapsulates all the inner logic of the module and makes available only what is needed from the outside. (This is very similar to OOP principles: when a class has a lot of private methods that cannot be accessed from the outside, but can be used inside the class itself) When it comes to `pages`, it is quite simple: ideally it should be just an encapsulation of modules and components, and all the business logic of the application should be placed at the level of modules and components.

**(⚠️) IMPORTANT**: a module shouldn't use another module, and a component shouldn't contain complex logic. If logic is still needed, it should be as **simple** and **easily maintainable** as possible, otherwise — it's a module!

Take a look at the following diagram:

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/00b89d1938c9cbcf786779d207a758fc_MD5.jpg]]

Almost Ideal— diagram (example)

There is one "but …" — we still have global directories like `components/` and `ui/` that can be overused. In some cases, the logic can grow and it is no longer always clear what is a component and what is a module. In addition, it is often observed that as the application grows, developers start using modules within other modules, which breaks the principles of this architecture and causes unnecessary dependencies. However, our architecture provides:

* _Single-threading_
* _Ability to reuse components at different layers_
* _Almost perfect layering_
* _Encapsulation_

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/3b09312b4e9e4e12ce72c71df6eeded8_MD5.jpg]]

Overview — [https://feature-sliced.design/](https://feature-sliced.design/)

**Feature Sliced Design (FSD)** architecture — is a lot similar to modular architecture, but it also avoids the same "but…" we discussed above. This approach structures the project by functional areas (features) instead of just **layers**. This way of organizing helps to avoid global directory growth (like `components`, `UI` in **modular architecture**) and provides a clear separation of responsibilities between components, modules and layers.

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/6d428bd5119de332a5704a1061eadca4_MD5.jpg]]

FSD — layers example

The architecture is built in such a way that the top level `pages` integrates and organizes the work of all submodules and components, and each next level provides more detailed and specific functions and elements. And yeah, we follow the same rule here — the higher the level (e.g. `pages`), the fewer layers from the lower level it can use:

* **_Pages_** _— The top level contains the_ `_pages_` _that are displayed in the application._
* **_Processes_** _— deprecated in this architecture, so we can skip it._
* **_Features/Widgets_** _— Below the_ `_pages_` _are the main_ `_features_` _blocks that structure the core functionality of the page, making it managed and independent._
* **_Entities_** _— Below the feature modules are_ `_entities_` _compiled from simpler UI components available in the "_**_Shared"_** _layer ._
* **_Shared_** _— The bottom layer contains common UI components available for use in different parts of the application._

(⚠️) **IMPORTANT**: as in the case of **modular architecture**, the layers don't overuse each other.

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/c1aec5d47efcbb51edf2db8e9404c593_MD5.jpg]]

Overview (slices/segments)— [https://feature-sliced.design/](https://feature-sliced.design/)

The FSD architecture features modular elements known as **"slices"** and **"segments"**. "Slices" refer to modules within each layer, each representing a distinct business entity. Meanwhile, "segments" encompass various structural components like `api/`, `components/`, `config/`, `constants/`, and others, organizing the architecture into clearer, more manageable sections.

Finally, we've reached the target result:

![[SimpRead/_resources/4-Architectures of modern Front-end applications _ Medium _ BRACKETS/fec2a2ebb8bafaec12c660cec6b10876_MD5.jpg]]

Ideal — diagram (example)

This approach is not easy and fast to integrate into a project. It would require at **least a minimum knowledge of architectures**, and you have to keep in mind that it can take time. But mastering the use of **FSD** provides:

* _Clear Structure_
* _Strong Defined Layering_
* _Flexible Components_
* _Independent Modules_
* _Balanced Reusability_

By the way, this architecture promotes "kebab case" in file naming 👀

`product-description.vue` / `shopping-cart.tsx` / `get-base-url.ts` / etc.

In this article, we have explored the differences between classical, modular, and FSD architectures, and discussed their usages.

If this article has been interesting to you, consider joining us live for our web developer conference [Webstack](https://webstack.sk/) in Bratislava, Slovakia where many other interesting themes are coming up, and not just about PHP and Laravel!
