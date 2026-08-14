---
title: ML Job Interviews The Ultimate Guide
author:
description:
tags: [clippings]
date-created: 2026-07-18
date-modified: 2026-08-14
content-type: [article]
created: 2026-07-18
published:
source: https://silviasapora.github.io/blog/ml-interviews.html#intro
---

I thought it might be helpful to write about my experience finding a job as a Research Scientist after a PhD in Machine Learning. There's [almost](https://gordicaleksa.medium.com/how-i-got-a-job-at-deepmind-as-a-research-engineer-without-a-machine-learning-degree-1a45f2a781de) zero information out there on this, and I wish someone had written it when I was starting out. I hope this is useful whether you're in the thick of it or just thinking about getting started.

My process was, overall, successful: I received offers from every company I completed interviews with including: DeepMind (which I accepted), Isomorphic Labs, Cohere, Meta, and a startup in stealth. A few caveats to the first claim: Anthropic, Mistral, and TeslaAI got back to me too late and I didn't complete those processes. ReflectionAI, the one genuine rejection: they didn't like me for the RS role but switched me to their Engineering track instead.

Most companies I applied to invited me for interviews, with the exception of: SpaceXAI, Waymo and Wayve. For SpaceXAI, I did let a friend write my application as a joke, but I didn't think it was that bad. For Waymo and Wayve: I love self-driving cars. I applied to Waymo every six months throughout my PhD (internships, then full-time) and never heard back once, despite people in my own lab getting replies. Waymo, if you're reading this, I'm open to forgiveness. My ~~love~~ cover letters were works of art. You can reach me at the email you already have on file, multiple times.

---

## Getting Interviews

Getting interviews is its own challenge, and if you're struggling with it, the levers are the usual ones: more papers, trendier topics, and better internships. You can look at my CV on my website for reference, but briefly: I had 4 first-author (or co-first) papers from my PhD, published at ICLR / NeurIPS / ICML, covering a mix of trendy topics (LLMs, RL) and less fashionable ones (Meta-Learning, Evolution Strategies). I also had an internship at Apple and prior industry experience as a Software Engineer at Meta. If I had to give a rough benchmark: 3+ first-author papers and at least one internship or industry role seems to be the threshold for consistently getting callbacks at top labs.

That said, if you're already getting interviews: more papers will not help you at this point. You need to pass the interviews, and often the people interviewing you won't even look at your CV. So, stop focusing on your research and your papers, and start focusing on interview prep! I understand the feeling of wanting to postpone, but you are never going to feel ready, so just start prepping **now**.

### A few other details worth knowing: cover letters, referrals, cold emails, and LinkedIn/X

**LinkedIn / X:** A lot of companies advertise roles here, and for internships in particular it's sometimes the only way to apply. You have to fill out a Google form linked from the post for your application to actually count. Follow the people you admire at the companies you're interested in so you don't miss these.

**Referrals:** Nice to have, but not necessary. At DeepMind I had a referral for two roles and none for a third, I got invited to interview for one referred role and the unreferred one. At Anthropic, I heard nothing until I discovered an ex-collegue of mine had recently joined and asked him to put in a referral for me. So, worth getting if you can, but don't let the absence of one stop you from applying.

**Cold emails:** Emailing the hiring manager or someone on the team directly (if you know who they are) is often appreciated. Don't just repeat your CV (you can attach it), use the email to explain why you'd be a good fit for that specific team and what genuinely excites you about their work. For this: at Deepmind I emailed my Hiring Manager, he was happy about it and replied. For another role, I saw the Hiring Manager explicitly encourage people to email him on X… but I could just not be bothered, since I was already going through interviews with the other team. I ended up getting an interview with them despite not sending the email.

**Cover letters:** Rarely required, but worth doing properly when they are. Please, for the love of everything I hold dear, do not just ask Claude / Gemini / ChatGPT to write it for you. You can absolutely write it yourself and then ask one of them to polish it, that's fine. But try to make some of your personality and excitement shine through.

---

## Companies: Startups vs Big Tech

The summary is: it depends, more than any generic pros/cons list I can write will tell you. But here are the main factors to consider.

**Finding startups is harder.** There's no central place to look. Ask your labmates, friends, and former colleagues… Word of mouth is the best way to find good ones in your area of research. At the same time, because they are harder to find, competition is generally less fierce for these positions.

**Interview processes vary more at startups.** Big tech follows a fairly predictable structure, while startups do their own thing. The difficulty level is comparable on average, but variance is high. Pay attention to what the interview process tells you about the company: if it feels too easy, that might be a signal about the complexity of the work you'd actually be doing. As with the interviews, I think there's simply more variance in the quality of work and people at startups compared to big tech.

**The work itself can go either way.** At the right startup, the research might be more interesting and more impactful than anything you'd work on at a big lab. But it can also come with more pressure, more engineering and infrastructure work you didn't sign up for, and a research agenda that shifts often. Ask questions in interviews! Who decides research priorities? What is the path to profitability? Who are the competitors? What if OpenAI wakes up tomorrow and decides to do the same thing?

**Room for growth.** Startups generally offer more opportunity to grow quickly, take on responsibility, and shape the direction of the work. At a big lab you're one of many, at a startup you're much more visible. This can be a big deal (I know it was for me).

**CV matters.** OpenAI or Anthropic on your CV is immediately recognised by anyone. A stealth startup nobody has heard of requires explanation. That's not a reason to avoid startups (and if you're a founder type, then it's completely different) but it's worth factoring in, honestly.

**On "security":** I'm not going to make that argument. Big tech has done mass layoffs without blinking many times over the past years, neither path is 100% safe.

### A note on compensation: RSUs vs stock options

This took me an embarrassingly long time to understand, so I'll try to save you the confusion. I'm speaking to UK law and taxation here.

With **RSUs** (typical at big tech), you receive actual shares in the company on a vesting schedule. When they vest, you can sell them or hold them. About half get sold immediately to cover income tax (because yes, to the absolute shock of 23-year-old me getting her first Meta shares… RSUs count as income).

With **stock options** (typical at startups), you're not getting shares. You're getting the *opportunity* to buy shares at a fixed price X, regardless of what the market price Y is at the time. If Y > X, great! You can exercise your option, buy at X, sell at Y, and pocket the difference. If Y < X, your options are worthless.

Here's where it gets wild. Stock options typically expire 90 days after you leave the company. If the company isn't publicly traded yet, you can't sell your shares after buying them, meaning you might have to spend (X × options) in cash to exercise (=use) them, with no guarantee you'll ever be able to sell. And in the UK, the moment you exercise your options, you owe income tax on the Y−X difference *even if you haven't sold a single share and haven't seen a penny of that money yet.*

So if you leave a startup after two years of working there, exercise your options, and the company isn't yet public, you would have to pay for: the cost to buy the shares (X × options) *plus* income tax on the paper gain ((Y−X) × options × your tax rate). Before you've made anything.

A few caveats: most companies offer a cashless exercise option, where you hand back some options to cover the cost of exercising the rest. Many also have liquidity events where they buy back some stock. But remember: each new funding round dilutes your shares, and any gains beyond the income-tax-liable portion get hit with capital gains tax (~20%) on top. Liquidity events typically value your stock below the official company valuation too.

**Summary:** when a recruiter quotes you a total compensation number that includes startup equity, smile politely and mentally discount it significantly. Most likely scenario: you are not retiring next year. But I wish you the best of luck.

---

## Interview Structure

Most companies follow roughly the same structure, though the weight given to each stage varies a lot.

**Recruiter screen.** This is usually just a chill, low stakes chat. It's an opportunity to show your skills are relevant to the job, and that you actually know and can talk about the papers you are an author of

**Technical interviews.** This is the bulk of the process and where preparation matters the most. Expect 3-8 of these interviews depending on the company:

- *Coding.* LeetCode-style problems, typically Medium or Hard difficulty
- *ML coding and debugging.* Implementing attention, writing backward passes, spotting bugs in training loops
- *ML knowledge.* Fundamentals, theory, applied ML, system design

**Behavioural interviews.** They split into two flavours, classic behavioural questions ("tell me about a time you had a conflict", "tell me a time you received feedback"…), research-style interviews ("what topics are you interested in?", "where do you see the field going?"). These are more casual compared to the technical interviews, but make sure to not underestimate these interviews and reflect on / prepare your answers.

---

## How I Prepared: Technical

**This is the key part! Don't skip this.** I know extremely impressive researchers who were rejected in interviews simply because they didn't prepare. Working with ML day in and day out is not the same as being ready to implement attention from scratch, derive the backward pass, or code flash attention. Allocate **at least** a month of regular study time.

**One meta-strategy that helped me:** I did little generic prep. Almost everything was targeted at the next specific interview or company. This kept me focused and meant the material l was asked about was fresh on my mind (essential for a goldfish like me). By the end, you'll have covered most of the material anyway. But I know people that prefer to adopt different strategies, so do whatever works for you!

By the end of my interview journey I'd built up a pretty comprehensive directory of resources and strategies, which I'll share below. I know, it's a lot. But the reality of ML Research Scientist / Engineer interviews is that you can be asked almost anything, from basic concepts like overfitting, to LeetCode, to implementing a transformer from scratch, to specific questions about fairly modern architectures (Griffin, TransformerXL, S4). The list reflects that range.

### Flashcards

For ML fundamentals, applied ML, and research discussions. I tried Anki first and didn't get on with it, physical flashcards worked much better for me. More importantly, **writing your own cards is half the learning**, don't just download someone else's deck. I'll link my full topic list at the end if you want a starting point. When reviewing, be curious: ask yourself questions and make sure you deeply understand each topic. Multiple times while studying, I asked myself questions I was later asked in interviews. Better to solve doubts beforehand!

### LLM mock interviews (Claude / Gemini)

Before each interview, I'd paste a description of the role, interview and company into my favourite LLM for the day (usually Claude) and ask it to interview me. There was surprisingly frequent overlap between those practice questions and what interviewers actually asked. I'd recommend doing this for every interview. If the difficulty feels off, start a new chat and specify your level and background more explicitly. I think Claude was the best LLM for learning, and I thought its feedback was generally fair, Gemini was a bit too flattering ("they are lucky to be interviewing you" ~ cit Gemini).

### LeetCode / NeetCode

Do at least Blind 75 and optionally NeetCode 150, focusing on Mediums. Try to get the optimal solution for each question, an O(N²) solution for TwoSum doesn't count as a solution. Don't spend much time on Hards. If you haven't done LeetCode before: it will feel awful at first, you'll feel stupid, that's normal and it passes. By question 100 you'll feel much more confident. Just make sure to know the basic patterns (DFS, BFS, Graphs, Backtracking, DP, Binary Search…) and make sure you can implement them confidently and very quickly. Target 20 minutes or less per Medium. If you're stuck for more than 15 minutes, look up the solution, understand it, flag it for review, and move on. **Breadth matters more than depth here!** I did around 150 Mediums total

### Books

- *Designing Machine Learning Systems* by Chip Huyen: covers a lot of the fundamentals and applied ML questions you'll encounter. Highlight and take notes.
- *The [JAX Scaling Book](https://jax-ml.github.io/scaling-book/)*: I found this after my interviews, unfortunately, but it's excellent and I'd have used it heavily.
- *Reinforcement Learning* by Sutton & Barto: only if you're new to RL. I think it's overkill if you're already working in the area.

### Courses

- **Linear algebra:** [Gilbert Strang's lectures on YouTube](https://www.youtube.com/watch?v=7UJ4CFRGd-U&list=PLE7DDD91010BC51F8). You can get through the whole course at 2x speed in under a day (I may be speaking from experience). He's the only reason I passed linear algebra in my undergrad. May he live another 91 years.
- **Diffusion / Flow Matching:** the [MIT](https://www.youtube.com/watch?v=9eJQQVrUUoI&list=PL57nT7tSGAAXwjhDYcxEycx5W7YoSrZyt) and [Stanford](https://www.youtube.com/watch?v=tr-CUpw--ck&list=PLoROMvodv4rNdy8rt2rZ4T2xM0OjADnfu) courses are both good but quite math-heavy. If you're not actively researching in this area, questions will likely be superficial, so just get a high-level intuition and memorise the basics (e.g. diffusion SDEs and flow matching ODEs).

### ML coding and debugging

This is where I found the fewest good resources, and where actual experience matters most. The debugging interviews were especially hard to practice, LLMs couldn't reliably generate convincingly buggy code when asked. Reviewing your own codebase (or a friend's) is probably your best bet. [DeepML](https://www.deep-ml.com/problems) has some good questions but there is also a lot of useless ones. I also found these [Tensor Puzzles](https://github.com/srush/Tensor-Puzzles) quite helpful. The baseline you should aim for:

- Implement a transformer end-to-end
- Implement causal, cross, and self attention
- Implement flash attention
- Implement the attention backward pass
- Implement an MLP forward and backward pass
- Implement a simple training loop with SGD in PyTorch or JAX

If you can do all of these from scratch under time pressure, you're in good shape.

---

## How I Prepared: Emotional

I can't speak for everyone, but for me this process was where my resilience went to die. I've always handled interviews and exams well without any particular strategy… not this time.

If you're doing okay emotionally, skip this section. I don't want to plant anxiety where there isn't any.

### The practical stuff first

My biggest problem was sleep: I couldn't sleep well the night before an interview, which becomes a serious issue when you have 10 interviews in a week. I also couldn't eat, I'd get nauseous at the sight of food before an interview. My solution was to chug litres of Coke for the sugar. I'm not claiming this is optimal, but it's the best solution I could come up with.

Beyond survival, I would recommend: regular exercise, a consistent evening routine, and not isolating yourself socially. Running before interviews helped me a lot, it burned off nervous energy and reset my head. (If you do this: take it easy and eat enough carbs). During the worst weeks I made a rule to have dinner with friends any evening I didn't have an interview the next morning. It helped me a lot.

### The pre-interview ritual

I found a lot of comfort in having a consistent pre-interview ritual. I'd put fresh flowers in my background (I got quite a few compliments on that), do my make-up (it was relaxing to focus on something else for a while — for the guys, maybe try skincare?), and watch the same few comfort videos on YouTube. My rotation: Alysa Liu's [ice skating](https://www.youtube.com/watch?v=n-I6fkQcUL4) and [life teachings](https://www.youtube.com/watch?v=PhsGMgZtTYY), alongside the classic [Lord of the Rings](https://www.youtube.com/watch?v=EmTz7EAYLrs), [Lord of the Rings](https://www.youtube.com/watch?v=dQ_-rmuPZC4), and [Lord of the Rings](https://www.youtube.com/watch?v=DgNrvnY1mo0). Email me for more wholesome video recommendations

### The harder part

At a certain point my anxiety was holding me back more than my preparation was. My mind would occasionally go blank mid-interview. I genuinely considered starting therapy during the process, but ran out of time before I could. In hindsight, that kind of reflection is more useful *before* you start (knowing your triggers, your relationship with failure, what your sense of worth is actually tied to) so you're not discovering it under fire like I did. Wouldn't recommend lol

But this brings me to the thing I most want to say: your worth as a human being is not going to be decided by these interviews (I know I would have rolled my eyes at this a few months ago but it's true!). The process is inherently stochastic, and sometimes the universe has a sense of humour about it. The morning of my DeepMind interview I woke up at 5am in a cold sweat having suddenly remembered I hadn't reviewed topic X. I got my phone and asked Claude to summarise topic X for me, then I went back to sleep. When I joined the interview at 9am, the interviewer said: "What do you know about topic X?". I'm not saying there's a god, but if there is, they were clearly on my side that day. But also, you are allowed to have a bad day. Failing to explain why forward KL is mean-covering and reverse KL is mode-seeking in an interview does not make you a bad ML researcher. I absolutely bawled my eyes out after messing up exactly that question after dealing with forward vs reverse KL in two separate papers. You will mess up, even on things you know, and that's okay.

### Books that helped

Not specific to interview anxiety, but useful for the underlying mindset work: *The Now Habit* by Neil Fiore, *The Gifts of Imperfection* by Brené Brown, *Mindset* by Carol Dweck, and *The Tyranny of Merit* by Michael Sandel.

---

## How I Prepared: Logistics

**One interview per day** Personally, I preferred it this way, when I could manage it. It's not always possible, but interviews are exhausting and you are naturally going to underperform in your third interview of the day. My rhythm was: do the interview in the morning, then spend the rest of the day preparing for the next one. It helped me avoid feeling like I was constantly context-switching mid-day.

**Start with companies you care less about.** Smaller startups, companies in locations you're not keen on, roles that are interesting but not your top choice. You'll get a feel for what the process looks like, calibrate your confidence, and get a realistic sense of what compensation looks like before you're negotiating for the offers you actually want.

**Think about timing.** Some companies move fast, others are extremely (and unpredictably) slow. Once a process starts it tends to move at a predictable pace, so if company A sent you a link to a test you can do whenever to start your interview process, and you are waiting to hear back from Company B… wait for Company B to schedule their first interview before doing the test from Company A. The goal is to have offers land in roughly the same window so you have real leverage and real choices. Obviously, the process is, again, very stochastic so timing is hard in practice. For example: I tried to message someone I knew at Anthropic to try and speed things up with them but ultimately I failed to start the process with them before the deadline from Deepmind expired.

**Tell every company about your other processes.** I know it feels uncomfortable for some people but it's completely normal and expected. It keeps timelines clear, encourages processes to chug along nicely, and often prompts companies to move faster if they're interested. I think companies will also consider you as a more serious candidate if they know multiple other companies consider you a serious candidate.

---

## Negotiation

I found [this blog post](https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/) helpful as a starting point, though I'll be honest, I didn't follow its advice. The post recommends treating it like a blind auction and not revealing competing offers. That didn't work for me: several companies explicitly asked for proof of other offers before increasing theirs, and one even questioned my screenshots (lol). So much for the poker face approach.

A few things I learned:

**Companies can move their numbers significantly if they want you**… more than I expected. It's always worth asking. Most companies were open to negotiating.

**Deadlines varied** from one week to two weeks to a vague "take a reasonable amount of time." In my experience companies weren't flexible about extending them (but they were for some friends of mine!), so factor that into your timing.

**Recruiters are surprisingly good at reading you.** A few figured out my actual preferences just by asking vague questions, but in fairness I'm extremely transparent and probably very easy to read. Be careful, even small signals matter: how often you mention a company, how you talk about them, all of it gets noted. If a recruiter knows their company is already your preferred choice, negotiating is going to be harder.

**Companies track historical data on candidate choices.** If you tell Anthropic you're seriously considering an offer from [Peppers Burgers](https://www.bbc.co.uk/news/articles/cp8p2gmvv37o), they have data on how often candidates with both offers actually chose the latter. If the answer is "almost never," your bluff doesn't work. This is also why competing offers from actual peers (OpenAI or another top lab) carry actual weight in a way that other offers don't. But again, it's very difficult to line up these processes.

---

## Decision Making Process

I cannot speak to your situation, but personally I was quite insecure at the beginning of this process and I was tempted to accept some of the early offers I got (rather than letting them expire and keep interviewing) out of fear I wouldn't find anything else. I did find better. Obviously it's impossible to predict how future processes are going to go, but trust your gut.

For choosing between offers: everyone weighs things differently: location, compensation, prestige, type of work, free food and Coke (the last two are very important to me). I had a rough preference ordering before I started, which shifted as I learned more about teams and culture and compensation. My very sophisticated vibe-based ranking system then collapsed entirely when I fell in love with Isomorphic Labs and then DeepMind made me an offer.

My solution was to speak to essentially everyone at both companies. In a shocking twist of events, every single person at DeepMind told me they'd choose DeepMind, and every single person at Isomorphic told me they'd choose Isomorphic. Extremely helpful. In the end the most useful thing was talking it through with the people who actually know me (in my case, my boyfriend) and figuring it out from there.

---

## What I'd Do Differently

Even if the process was successful overall, there is a few things I would change if I was to do this again in the future:

**Keep a spreadsheet.** I was convinced I could track everything in my head. Technically yes, but a simple spreadsheet (companies to apply to, where you are in each process, deadlines, contacts) would have stopped me from forgetting to apply to places I was actually interested in. Not rocket science, I know.

**Prepare emotionally, not just technically.** The interview process has a way of feeling like a final verdict on your abilities as a researcher and whether your PhD was worth anything. That's not a rational framing, but it's hard to avoid when you're in it. I didn't handle it well, and I think some therapy or at least serious introspection before starting (rather than during) would have helped a lot.

**Be more proactive about the companies that ignored me.** In hindsight I should have cold-emailed someone at the company, expressed my interest directly, and tried to actually get on someone's radar rather than hoping the application form would do it for me. If you really want to work somewhere and you're not hearing back, do something about it.

---

## Technical Topics

Here is a list of topics I created before I started interviewing. Personally, I was asked a lot about LLMs and RL, reflecting my background. If you have a diffusion background, expect more questions there. I was asked (in some form or capacity) about pretty much all the topics I studied in at least one interview. So… make sure to cover everything well!

### Reinforcement Learning

- Q-Learning / TD Learning
- Bellman Equations
- PPO
- GRPO
- GAE
- Variance Reduction in RL
- DPO (Direct Preference Optimisation)
- Policy Gradient Theorem
- On-Policy vs Off-Policy
- Exploration vs Exploitation Dilemma
- Credit Assignment Problem
- MuZero
- World Models / Dreamer
- AlphaGo
- Soft Actor-Critic
- Model-Based vs Model-Free
- Markov Property
- Monte Carlo vs TD
- Actor Critic
- SARSA
- Importance Sampling
- Markov Decision Process
- Curriculum Learning

### LLMs

- Flash Attention
- LoRA
- TransformerXL
- Griffin
- Perceiver
- Scaling Laws
- Mixture of Experts
- LLM scaling factor
- RoPE
- Sinusoidal embeddings
- Relative positional embeddings
- LLM vs RNN vs S4
- Tokenisation
- Pretraining
- Finetuning
- RLHF
- Decoding techniques
- Causal Attention
- Cross Attention

### Generative Modelling

- GANs
- VAEs and VAE ELBO
- Score Function
- Diffusion Forward Process
- Diffusion Reverse Process (DDIM / DDPM)
- Diffusion Forward / Reverse SDE
- Flow Matching ODE
- Classifier Free Guidance

### Applied ML

- Tensor Parallelism
- FSDP
- DDP
- Pipeline Parallelism
- Communication Primitives
- Mixed precision training
- Gradient checkpointing
- Gradient accumulation
- Profiling
- Gradient clipping
- Numerical precision tricks
- Exploding / vanishing gradients
- Floating point representation
- JIT compiling
- JAX, PyTorch, TensorFlow

### General ML

- Curse of dimensionality
- S4
- CNNs
- RNNs / LSTMs
- Autoencoders
- Gumbel-Softmax
- MLE vs MAP
- Newton's Method
- Linear Regression
- Activation Functions
- Loss Functions
- No Free Lunch Theorem
- BatchNorm / LayerNorm / RMSNorm
- Variance and Covariance
- Adam / AdamW / Adagrad
- Bias-Variance Tradeoff
- Backprop
- Regularisation Methods
- Unsupervised vs Supervised
- Clustering Algorithms (e.g. k-means)
- K-Nearest Neighbours
- SVMs
- Boosting
- Bagging
- Decision Trees
- Ensembles
- Bayes Theorem
- Precision / Recall / F1 / AUC-ROC
- KL Divergence
- Jensen-Shannon Divergence
- Weight initialisation
- Gradient Descent / SGD
- Overfitting / Underfitting
- Cross validation
- Data Whitening
- Convex functions
- Early Stopping
- Domain Adaptation
- Dimensiolity Reduction
- Transfer Learning
- Few shot / Zero shot learning
- Second Order Methods
- Expectation
- Entropy
- PDF / PMF
- Confidence Intervals

### Linear Algebra

- Positive Semi-Definite
- Jacobian
- Eigenvectors / Eigenvalues
- Hessian
- Inverse of a matrix
- Dot product
- Null space / Image space
- Orthogonality
- Linear independence
- Singular matrices
- Rank / Span
- Determinant
