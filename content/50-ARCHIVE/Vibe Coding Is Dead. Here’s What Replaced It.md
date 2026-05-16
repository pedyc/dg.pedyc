---
title: Vibe Coding Is Dead. Here’s What Replaced It
author: ["[[Ayesha Mughal]]"]
description: Vibe Coding Is Dead. Here’s What Replaced It. Exactly one year ago, Andrej Karpathy posted a tweet.“There’s a new kind of coding I call ‘vibe coding’, where you fully give in to the vibes …
tags: [clippings]
date-created: 2026-04-07
date-modified: 2026-05-14
content-type: [article]
created: 2026-04-07
published: 2026-03-16
source: https://ai.plainenglish.io/vibe-coding-is-dead-heres-what-replaced-it-aa7d2889b05a
---

![[af9dea2bc29ba0596fb41eff7820b913_MD5.webp]]

Exactly one year ago, Andrej Karpathy posted a tweet.*"There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."*

Developers loved it. The term went everywhere. Tutorials appeared overnight. "Just vibe code it" became the answer to every "how do I build this" question.

Then people tried to ship vibe-coded apps to production.

The results weren't great.

On February 4, 2026 — exactly one year after that original tweet — Karpathy posted again. Same topic. Different conclusion:

*"Today, programming via LLM agents is increasingly becoming a default workflow for professionals, except with more oversight and scrutiny. Personally, my current favorite term: 'agentic engineering.'"*

The person who ==invented== vibe coding just moved on from it.

Here's what changed, what replaced it, and why it matters for how you build software right now.

*If you're new here — I write the practical guides professionals wish existed. Follow once, get the whole series.*

## 🎯 The Real Difference — Not Tools, Discipline

This is the part most explainers get wrong. They describe agentic engineering as "using better AI tools" or "more automation." That's not it.

Vibe coding means going with the vibes and not reviewing the code. That's the defining characteristic. You prompt, you accept, you run it, you see if it works. If it doesn't, you paste the error back in and try again.

==The problem isn't the AI. The problem is the human not reviewing what the AI built.==

==Agentic engineering means AI does the implementation, human owns the architecture, quality, and correctness. You might write only a fraction of the code by hand. The rest comes from agents working under your direction. That's agentic. And you're applying engineering discipline throughout.==

Same tools. Completely different discipline.

**The one-line distinction:**

> *Vibe coding = YOLO. Agentic engineering = AI builds, human owns.*

## 🧠 Why Vibe Coding Failed at Scale

Without proper expertise in using LLMs for software engineering, vibe coding produces "AI slop" — code that is not useful or breaks existing code. Such broken code often increases the technical debt of engineering teams, with much of their time spent understanding, debugging, and refactoring the code.

Three specific failure modes that killed it in production:

**1\. Security holes at scale** An agent writing code fast doesn't mean it's writing secure code. Agents can introduce vulnerabilities at scale — an agent writing 1,000 PRs per week with a 1% vulnerability rate creates 10 new vulnerabilities weekly. Vibe coding had no gate for this. You shipped whatever the agent produced.

**2\. Unmaintainable architecture** Vibe coding skips the design phase. You prompt a feature, the agent implements it, you move on. ==Three months later nobody — not you, not the agent — understands why the codebase is structured the way it is.== There's no reasoning to follow because there was no reasoning to begin with.

**3\. Context collapse** The longer a vibe coding session runs, the worse the output gets. The agent loses track of earlier decisions. Code starts contradicting itself. The developer doesn't notice because they're not reading the diffs.

In 2026, cognitive debt — the accumulated cost of poorly managed AI interactions, context loss, and unreliable agent behavior — is taking over as the primary threat to engineering teams. Vibe coding created cognitive debt faster than any previous development style.

## ✅ What Agentic Engineering Actually Looks Like

The workflow isn't complicated, but it requires discipline that vibe coding explicitly abandons.

**Step 1 — Write the spec first**

Before prompting anything, write a design document. What does this feature do? What are the edge cases? What does the data model look like? What can go wrong?

This is the step vibe coders skip. It's also the step that determines whether your agent produces good code or plausible-looking garbage.

You can write the spec with AI assistance. But you write it. Before the agent touches a single file.

**Step 2 — Break it into scoped tasks**

Well-designed agentic systems break tasks into smaller modules, enabling agents to generate self-contained components in real-time that integrate cleanly into the existing codebase without increasing technical debt."Build me a user authentication system" is a vibe coding prompt. It's too large, too vague, and the agent will make architectural decisions you never agreed to.

"Implement the password reset email flow using our existing Resend integration. The token should be stored in Redis with a 15-minute TTL. Here's the spec." — that's an agentic engineering task. Scoped. Constrained. Reviewable.

**Step 3 —** ==**Review with the same rigor as a human PR**==

You review the code with the same rigor you'd apply to a human teammate's PR. If you can't explain what a module does, it doesn't go in.

This is the hardest discipline to maintain. Agents ==produce== code fast. Reviewing takes time. The temptation is to skim and approve. That temptation is exactly what produces the unmaintainable codebases everyone is complaining about.

Read the diff. Understand every function. If something is unclear, ask the agent to explain it before merging.

**Step 4 — Test relentlessly**

The single biggest differentiator between agentic engineering and vibe coding is testing.

Vibe coding ships when it "looks like it works." Agentic engineering ships when the tests pass — tests you wrote or reviewed, not tests the agent generated and you skimmed.

## 📊 The Results When It's Done Right

This isn't theoretical. Companies doing agentic engineering properly are posting results:

TELUS saved 500,000+ hours with 13,000 AI solutions. Zapier hit 89% AI adoption across their entire organization. Stripe's agents produce 1,000+ merged PRs per week.

These aren't vibe coding results. These are what happens when you build the governance, the review processes, and the agent orchestration properly — then let agents execute at scale under that structure.

The structure is what makes the scale safe.

## 🔄 The New Mental Model — Architect, Not Author

The role of developers is shifting. Where vibe coding captured the excitement of early generative tools, agentic engineering represents a more grounded reality. For engineers, this means a shift in skill sets.

You are no longer the person who writes the code. You are the person who:

- Defines what gets built and why
- Designs the architecture the agent works within
- Reviews what the agent produces
- Decides what ships and what doesn't

In this new era, your value as a developer is no longer defined by your typing speed or your memorization of API parameters. It is defined by the clarity with which you define problems and the accuracy with which you judge results.

The developers who thrive in this era aren't the fastest prompters. They're the best architects. The clearest thinkers. The most rigorous reviewers.

That's a different skill than vibe coding required. It's also a more valuable one.

## 🎯 The Three Things to Change This Week

You don't need new tools. You need new habits.

**1\. Write a spec before every agent task** Even one paragraph. Even bullet points. Force yourself to think before prompting. This single habit separates agentic engineering from vibe coding more than any tool.

**2\. Read every diff** Not skim. Read. If the agent changed 200 lines, you read 200 lines. If you don't understand something, you ask. Nothing merges until you can explain it.

**3\. Run the tests before calling anything done** If there are no tests, write them first — then ask the agent to make them pass. Tests before implementation. Always.

Three habits. Same tools you already have. Completely different outcomes.

**One question before you go:**

What's the hardest part of this shift for you — writing specs before prompting, reviewing AI code rigorously, or trusting the agent enough to delegate in the first place? Drop it below.
