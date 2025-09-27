---
title: EP177 The Modern Software Stack
author: ["[[ByteByteGo]]"]
description: "In today’s world, building software means working across multiple layers, each with its own role, tools, and technologies."
tags: ["clippings"]
date-created: 2025-09-17
date-modified: 2025-09-17
created: 2025-09-17
published: 2025-08-23
source: "https://blog.bytebytego.com/p/ep177-the-modern-software-stack?ref=dailydev"
---

## ✂️ Cut your QA cycles down to minutes with QA Wolf (Sponsored)

![[Clippings/_resources/EP177 The Modern Software Stack/52c6ca5161aada67230128a3d16e152a_MD5.webp]]

If slow QA processes bottleneck you or your software engineering team and you're releasing slower because of it — you need to check out QA Wolf.

QA Wolf's AI-native service **supports web and mobiles apps**, delivering [80% automated test coverage in weeks](https://bit.ly/QAWolf_082325Automated) and helping teams **ship 5x faster** by reducing QA cycles to minutes.

[QA Wolf](https://bit.ly/QAWolf_082325QAWolf) takes testing off your plate. They can get you:

- Unlimited parallel test runs for mobile and web apps
- 24-hour maintenance and on-demand test creation
- Human-verified bug reports sent directly to your team
- Zero flakes guarantee

The benefit? No more manual E2E testing. No more slow QA cycles. No more bugs reaching production.

With QA Wolf, [Drata’s team of 80+ engineers](https://bit.ly/QAWolf_082325Drata) achieved 4x more test cases and **86% faster QA cycles**.

---

This week's system design refresher:

- How Key value Stores Work (Redis, DynamoDB, Memcached)? (Youtube video)
- The Modern Software Stack
- Concurrency is NOT Parallelism
- JWT vs PASETO: The Two Players of Token-Based Authentication
- The Linux Cron Cheatsheet
- AI Agent versus MCP
- SPONSOR US

---

## How Key value Stores Work (Redis, DynamoDB, Memcached)?

<iframe src="https://www.youtube-nocookie.com/embed/Dwt8R0KPu7k?rel=0&amp;autoplay=0&amp;showinfo=0&amp;enablejsapi=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="true" width="728" height="409"></iframe>

---

## The Modern Software Stack

![[Clippings/_resources/EP177 The Modern Software Stack/ac9a0c973e1860dc0ae75601ad9ef6e9_MD5.webp]]

In today's world, building software means working across multiple layers, each with its own role, tools, and technologies. Here are 9 layers that make up most modern applications:

1. Presentation Layer (UI/UX): Handles how users interact with the application, focusing on visuals, layout, and usability.
2. Edge and Delivery (Optional): Brings content closer to users through global delivery networks, reducing latency and improving performance.
3. Integration Layer (API): Defines how different parts of the system communicate, enabling interoperability between components.
4. Messaging & Async Processing (Optional): Processes tasks and events in the background to improve scalability and responsiveness.
5. Business Logic Layer: Implements the core rules, workflows, and decision-making processes of the application.
6. Data Access Layer: Acts as a bridge between application logic and stored data, ensuring secure and efficient retrieval or updates.
7. Data Storage Layer: Stores, organizes, and manages the application's structured and unstructured data.
8. Analytics & ML (Optional): Analyzes data to generate insights, predictions, and intelligent features.
9. Infrastructure Layer (Hosting / Runtime): Provides the computing environment and resources for deploying, running, and scaling the application.

Over to you: Which layer do you think is the most underrated in modern software development?

---

## Data-in-Motion Transparency (Sponsored)

![[Clippings/_resources/EP177 The Modern Software Stack/215c5bc7e5ec46551645ebfd6d2f9a1f_MD5.webp]]

Your backend makes thousands of encrypted connections daily. What sensitive data is flowing through them? Which processes are talking to which APIs? Traditional tools can't tell you without proxies, cert management, or performance hits.

Qtap changes that.

This lightweight eBPF agent gives you kernel-level visibility into all TLS/SSL traffic—showing you the actual unencrypted payloads, their originating processes, and full context. Zero performance impact. No code changes.

Whether you're debugging API issues, auditing for sensitive data leaks, validating compliance, or investigating third-party integrations, Qtap illuminates what was invisible.

---

## Concurrency is NOT Parallelism

![[Clippings/_resources/EP177 The Modern Software Stack/1e0c43a4caa11b9c31b44a06f746bc1c_MD5.webp]]

Concurrency: It's a design approach where tasks can start, run, and complete in overlapping periods, even on a single CPU core. It is about managing multiple tasks at the same time.

The CPU rapidly switches between tasks (context switching), creating the illusion that tasks are progressing simultaneously, though they are not.

Concurrency is great for tasks that involve waiting, like I/O operations. It allows other tasks to progress during the wait, improving overall efficiency.

Parallelism: Refers to the simultaneous execution of multiple tasks, using multiple CPU cores.

Parallelism excels at heavy computations like data analysis or rendering graphics, where tasks can be divided and run simultaneously on different cores.

**How They Work Together**

It's important to note that while concurrency and parallelism are different concepts, they are closely related. A well-designed concurrent program can scale to use multiple cores for parallelism when needed.

By understanding the differences and interplay between concurrency and parallelism, we can design more efficient systems and create better-performing applications.

Over to you: Have you encountered any challenges with concurrency or parallelism?

---

## Out Ship, Out Deliver, Out Perform. (Sponsored)

![[Clippings/_resources/EP177 The Modern Software Stack/9ede500e163b1dfa88f690c752b3dcf7_MD5.webp]]

DevStats helps engineering leaders unpack metrics, experience flow, and ship faster so every release drives real business impact.

✅ Spot bottlenecks before they stall delivery

✅ Tie dev work to business goals

✅ Ship more, miss less, prove your impact

It's time to ship more and make your impact impossible to ignore.

---

## JWT vs PASETO: The Two Players of Token-Based Authentication

Token-based authentication has become quite popular over the years. Traditionally, JWTs have dominated this space.

![[Clippings/_resources/EP177 The Modern Software Stack/f756ae68b084999aeef7b2b9a6117568_MD5.webp]]

But now, a new player is making waves: PASETO, or Platform-Agnostic Security Tokens.

So, what's the difference between the two?

1. JWTs
	JWT or JSON Web Tokens is an open standard for securely transmitting information between two parties.

	A JWT consists of a Header, Payload, and Signature.

	JWTs can be used to implement stateless authentication between client and server applications.
2. PASETO
	PASETO is a modern alternative to JWT. It addresses JWT's security flaws by implementing secure defaults.

	Unlike JWT, PASETO enforces strong, cryptographically sound algorithms, reducing the risk of vulnerabilities.

	A PASETO typically consists of Version, Purpose, and Payload. There are two types of PASETO:
	- Public PASETO: They are signed using asymmetric cryptography and ensure the integrity of the data, but not its confidentiality.
	- Local PASETO: They are encrypted using symmetric encryption algorithms, ensuring the confidentiality of the data contained within the token.

Over to you: Have you used JWTs or PASETO in your applications?

---

## The Linux Cron Cheatsheet

Cron is a time-based job scheduler that allows users to automate repetitive tasks by running commands or scripts at specified intervals. It uses a Cron expression, a syntax defining the schedule, which consists of five fields (minute, hours, day, month, weekday).

![[Clippings/_resources/EP177 The Modern Software Stack/e05cb683cc02e29e08f53d5165ac25f6_MD5.webp]]

Cron is widely for system maintenance, backups, log rotation, and automation of tasks like sending emails or running scripts at regular intervals. In this cheatsheet, we cover:

1. The Cron Format
2. Some Cron Examples
3. Special Cron Strings
4. Special characters

Over to you: Have you used Cron?

---

## AI Agent versus MCP

![[Clippings/_resources/EP177 The Modern Software Stack/0ee808d11fffdf316feb0ad40583d37d_MD5.webp]]

An AI agent is a software program that can interact with its environment, gather data, and use that data to achieve predetermined goals. AI agents can choose the best actions to perform to meet those goals.

Key characteristics of AI agents are as follows:

1. An agent can perform autonomous actions without constant human intervention. Also, they can have a human in the loop to maintain control.
2. Agents have a memory to store individual preferences and allow for personalization. It can also store knowledge. An LLM can undertake information processing and decision-making functions.
3. Agents must be able to perceive and process the information available from their environment.

Model Context Protocol (MCP) is a new system introduced by Anthropic to make AI models more powerful.

It is an open standard that allows AI models (like Claude) to connect to databases, APIs, file systems, and other tools without needing custom code for each new integration.

MCP follows a client-server model with 3 key components:

1. Host: AI applications like Claude
2. MCP Client: Component inside an AI model (like Claude) that allows it to communicate with MCP servers
3. MCP Server: Middleman that connects an AI model to an external system

Over to you: Have you used AI Agents or MCP?

---

## SPONSOR US

Get your product in front of more than 1,000,000 tech professionals.

Our newsletter puts your products and services directly in front of an audience that matters - hundreds of thousands of engineering leaders and senior engineers - who have influence over significant tech decisions and big purchases.

Space Fills Up Fast - Reserve Today

Ad spots typically sell out about 4 weeks in advance. To ensure your ad reaches this influential audience, reserve your space now by emailing **sponsorship@bytebytego.com.**
