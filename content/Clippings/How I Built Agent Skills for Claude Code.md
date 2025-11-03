---
title: How I Built Agent Skills for Claude Code
author: ["[[DEV Community]]"]
description: "How I stopped re-explaining my legacy database every single conversation  So I was working with this... Tagged with claude, ai, productivity, development."
tags: ["clippings"]
date-created: 2025-10-21
date-modified: 2025-10-21
created: 2025-10-21
published: 2025-10-21
source: "https://dev.to/nunc/how-i-built-agent-skills-for-claude-code-oj4"
---

**How I stopped re-explaining my legacy database every single conversation**

So I was working with this gnarly Oracle database - 1,048 packages, 20,913 stored procedures, Slovenian terminology, old-school SQL syntax from the 90s. You know the type.

Every time I asked Claude for help, I'd spend the first 10 minutes explaining:

- "No, use WHERE joins, not ANSI JOIN"
- "That's Slovenian for 'claim file'"
- "We always validate extraction quality"

It got old. Fast.

Then I discovered Agent Skills. Now Claude just… knows. It's like I taught it once, and it remembers forever.

Let me show you how I did it, because honestly, it's easier than you think.

## What Even Are Agent Skills?

Think of them as plugins for Claude. Little knowledge modules that Claude loads automatically when it needs them.

You write a markdown file saying "Here's how to work with my database" or "Here's how our API works" - and Claude references it whenever relevant. No more repetitive explanations.

**The magic part**: You don't manually activate skills. Claude reads the descriptions and figures out which ones to use. It's actually pretty smart about it.

## The Absolute Minimum You Need

One file. That's it.

```bash
~/.claude/skills/my-thing/
└── SKILL.md
```

Here's a complete working skill:

```bash
---
name: pdf-tools
description: Extract text from PDFs using pdfplumber. Use when working with PDF files.
---
```

```bash
# PDF Tools
```

```bash
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
    print(text)
```

Done. You now have a skill. Seriously.

## The One Rule That Matters

**Keep it short.**

Claude's context window is shared between your conversation, the code, other skills, and everything else. Don't waste tokens.

Here's what I mean:

### ❌ This wastes everyone's time

```bash
## Extract PDF text

PDF stands for Portable Document Format. It's a file format developed by Adobe in 1992 for presenting documents. PDFs can contain text, images, forms, and more. To extract text from a PDF, you'll need to use a specialized library. There are many options available in Python, such as PyPDF2, pdfplumber, and PyMuPDF. We recommend pdfplumber because it's actively maintained and handles most edge cases well. First, you'll need to install it using pip...
```

### ✅ This is what Claude actually needs

```bash
## Extract PDF text
```

```bash
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

Claude already knows what PDFs are. Show the code, move on.

**Target: Keep your main SKILL.md file under 500 lines.** If you need more, split it into reference files (I'll show you how in a sec).

## Writing Descriptions That Actually Work

The `description` in your YAML frontmatter is critical. It's how Claude decides whether to load your skill.

The formula that works:

**What it does + When to use it + Trigger words**

### Examples that work

```bash
description: Extract text from PDFs using pdfplumber. Use when working with PDF files, forms, or document extraction.
```

```bash
description: Connect to Oracle database, extract PL/SQL packages with old-style SQL syntax. Use for Oracle database operations or PL/SQL code extraction.
```

```bash
description: Analyze Excel spreadsheets, create pivot tables. Use when working with .xlsx files or tabular data.
```

### What doesn't work

```bash
description: Helps with files
description: Does database stuff
description: Utility functions
```

Too vague. Claude won't know when to use it.

**Pro tip**: Always write in third person ("Extracts text from PDFs" not "I can extract text"). Claude's system prompt uses third person, so first/second person confuses things.

## The Secret: Progressive Disclosure

This is the pattern that lets your skills scale without bloating the context window.

**The idea**: Your SKILL.md is like a table of contents. Point to details, don't include everything upfront.

Here's how it works:

1. Claude loads all skill descriptions at startup (just names + descriptions)
2. When triggered, Claude loads your SKILL.md
3. As needed, Claude reads specific reference files

### Example structure

```bash
# API Client

## Quick Start
[Basic code example here]

## Advanced

Need authentication? See [AUTH.md](AUTH.md)
Rate limiting? See [LIMITS.md](LIMITS.md)
Error handling? See [ERRORS.md](ERRORS.md)
```

Claude only reads AUTH.md when someone asks about authentication. Saves tons of context.

### Keep it one level deep though

❌ Don't do this:

```bash
SKILL.md → advanced.md → details.md → actual_info.md
```

✅ Do this:

```bash
SKILL.md → auth.md, limits.md, errors.md, examples.md
```

Claude sometimes only partially reads nested files, so keep references direct from SKILL.md.

### Table of Contents for long files

If a reference file gets over 100 lines, add a ToC at the top:

```bash
# API Reference

## Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Codes](#error-codes)

---

## Authentication
[...]
```

This helps Claude navigate even when it only partially reads the file.

## Real Example: My Oracle Nightmare (Now Solved)

Let me show you the actual skill I built. It started as a mess and ended up at 100% compliance with Anthropic's best practices.

### The Problem

I work with this insurance application database:

- 1,048 PL/SQL packages
- 20,913 procedures (yes, really)
- All the business terms in Slovenian
- SQL syntax from 1995 (WHERE clause joins only, no ANSI)

I'd have the same conversation every day:

- "Use WHERE joins, not INNER JOIN"
- "That column is 'skondi\_spis' which means claim file"
- "Check the line count after extraction to validate"

### The Solution: Two Skills, Not One

I almost made one giant skill with everything. Thank god I didn't.

Instead:

1. **db-toolkit** - How to connect, extract, query (technical stuff)
2. **business-domain** - What the tables mean, business processes (domain knowledge)

**Why separate?** They change at different rates. Database operations don't change much. Business knowledge updates constantly. Sometimes I only need one.

### Here's the db-toolkit structure

```bash
~/.claude/skills/db-toolkit/
├── SKILL.md (687 lines - yeah, over 500, but it's worth it)
├── reference.md (API docs for all methods)
├── usage-examples.md (10+ real scenarios)
├── sql-syntax-guide.md (old-style SQL examples)
├── troubleshooting.md (common errors)
└── scripts/
    └── oracle_toolkit_standalone.py (the actual code)
```

### What made it actually work

**1\. Everything's embedded**

No external dependencies. The Python code lives in `scripts/` inside the skill:

```bash
from pathlib import Path

skill_dir = Path.home() / '.claude' / 'skills' / 'db-toolkit'
sys.path.insert(0, str(skill_dir / 'scripts'))

from oracle_toolkit_standalone import OracleToolkit
```

Skill works anywhere.

**2\. Copy-paste checklists**

Best thing I added. For complex workflows, give Claude a checklist to track:

```bash
Copy this checklist:

Task Progress:
- [ ] Connect to database
- [ ] Extract package body
- [ ] Validate extraction (check line count)
- [ ] Copy to working directory
- [ ] Make changes
- [ ] Run tests
```

Claude checks items off as it works. I can see progress. Users love this.

**3\. Validate everything immediately**

Every operation gets validated right away with specific help:

```bash
pkg = await toolkit.extract_source('MY_SCHEMA', 'PKG_EXAMPLE', 'PACKAGE BODY')

if not pkg['success']:
    print("❌ Failed:", pkg['message'])
    print("🔄 Try these fixes:")
    print("  • Check package name spelling")
    print("  • Use 'PACKAGE BODY' not 'PACKAGE'")
    print("  • Verify schema owner is correct")
    return

# Also validate quality
if pkg['line_count'] < 10:
    print("⚠️  Suspiciously small extraction - double check")
```

No more mystery errors later.

**4\. Skills reference each other**

db-toolkit mentions business-domain for business context.
business-domain mentions db-toolkit for database operations.

Claude figures out when it needs both.

### Results

After refining over a few weeks:

- ✅ 100% compliance with Anthropic best practices
- ✅ 85.7% test pass rate (12 out of 14 tests)
- ✅ Saves me probably 10 hours a week
- ✅ Works reliably across sessions

**Note**: My SKILL.md is 687 lines, which is over the recommended 500. But it's validated workflows with checklists that users copy directly. Worth the trade-off.

## Patterns I Use All The Time

### 1\. The Template Pattern

When you need exact output format, put this in your SKILL.md:

**Example SKILL.md content:**

```bash
## Report Format

ALWAYS use this structure:
# [Title]
## Summary
[One paragraph]

## Findings
- Finding 1
- Finding 2
```

For flexible stuff, say "adapt as needed" instead of "ALWAYS."

### 2\. Show Examples, Not Descriptions

**Example SKILL.md content:**

One example beats ten paragraphs.

### 3\. Guide Through Decisions

**Example SKILL.md content:**

```bash
## What to do

Determine your situation:

**Creating new document?** → Use Creation Workflow below
**Editing existing?** → Use Editing Workflow below

### Creation Workflow
[steps...]

### Editing Workflow
[steps...]
```

## How I Actually Built It (Not How You'd Think)

I didn't sit down and write a massive spec. Here's what actually worked:

### 1\. Started with the pain points

Used Claude for a week without a skill. Noted every time I had to repeat myself:

- Explained old-style SQL 5 times → added syntax guide
- Kept saying "validate extraction" → added validation loops
- Explained Slovenian terms constantly → added glossary

Built the skill from actual problems, not imagined ones.

### 2\. Wrote tests first

Created 3 simple test scenarios:

```bash
Test 1: "Extract package PKG_EXAMPLE" → should connect and extract
Test 2: "Show me tables for this module" → should list relevant tables
Test 3: "Fix this SQL join" → should suggest old-style syntax
```

Then wrote just enough skill content to pass those tests.

### 3\. Observed what Claude actually read

Watched which files Claude opened:

- Went to sql-syntax-guide.md often → made it clearer
- Rarely opened troubleshooting.md → moved common stuff to SKILL.md
- Skipped parts of examples.md → added ToC for faster navigation

Adjusted based on behavior.

### 4\. The "3 times rule"

If I explained something 3 times in conversations → it went in the skill.

Example: Kept saying "use (+) for outer joins" → added to SQL guide with examples.

## What NOT to Do (I learned the hard way)

### ❌ Time-sensitive info

Don't write:

```bash
Before August 2025, use old API.
After August 2025, use new API.
```

Skills should be evergreen.

### ❌ Windows paths

```bash
# Bad
scripts\helper.py

# Good
scripts/helper.py
```

Always forward slashes.

### ❌ Offering too many options

```bash
# Bad
You could use library A, B, C, D, E, F, or G...

# Good
Use pdfplumber for most cases.
Edge cases? See [alternatives.md](alternatives.md)
```

### ❌ Mega-skills

Don't make one skill for everything:

```bash
database-and-api-and-deployment-and-monitoring/
```

Make focused skills:

```bash
database-toolkit/
api-client/
deployment/
monitoring/
```

## Quick Start: Build Your First Skill Right Now

Pick something you explain to Claude repeatedly. For me it was database stuff. For you maybe it's:

- How your API works
- Your company's coding standards
- Common git workflows
- Specific library you use a lot

### 5-minute version

```bash
mkdir -p ~/.claude/skills/my-thing
cd ~/.claude/skills/my-thing
nano SKILL.md
```

Write this:

```bash
---
name: my-thing
description: [What it does]. Use when [trigger words].
---

# My Thing

## Quick Start

[One code example]

## Common Tasks

[2-3 more examples]
```

Save it. Ask Claude a question that should trigger it.

That's it. You have a working skill.

## The Checklist (So You Know You're Done)

Before you call a skill "done":

**Structure**

- \[\] SKILL.md under 500 lines (or you have a good reason)
- \[\] Valid YAML with name and description
- \[\] If you have reference files, they link from SKILL.md (not nested deeper)

**Description**

- \[\] Third person ("Processes files" not "I process")
- \[\] Says what it does
- \[\] Says when to use it
- \[\] Under 1024 characters

**Content**

- \[\] Assumes Claude is smart (no explanations of basic concepts)
- \[\] Consistent terms throughout
- \[\] No dates or version numbers that'll expire
- \[\] Forward slashes in paths

**Testing**

- \[\] Tried it with real questions
- \[\] Claude activates it when it should
- \[\] Claude finds the right info
- \[\] At least 80% success rate

## What I Learned

Building the db-toolkit skill changed how I work with Claude. Instead of fighting with it every conversation, it just knows my database quirks.

The skill saves me probably 10 hours a week. No more:

- Re-explaining SQL syntax
- Translating Slovenian terms
- Reminding it to validate extractions
- Describing table relationships

It just works.

**Best part?** Skills improve with use. Each conversation shows you what's missing. Each addition makes the next session better.

I started with a 100-line SKILL.md. Over 3 months of actual use, it grew to 3,100 lines across multiple files - but only because I found real gaps worth filling.

## Your Turn

Start small. Don't try to document everything. Pick one thing you repeat constantly and build a skill for that.

Maybe it's:

- Your database schema
- API endpoints you use
- Git workflow your team follows
- Library you use every project
- Testing patterns
- Deployment process

Whatever it is, write a minimal SKILL.md. Use it for a week. See what's missing. Add that.

In a month you'll wonder how you ever worked without it.

---

**Questions? Built a skill and want to share? Drop a comment - I'm genuinely curious what you build.**

### Please help our partners improve AI tooling by completing this very short survey

## Google AI User Experience Survey

***None of your personal information will be shared.** Once you complete the survey you will not be prompted for completion anymore.*

**Thank you!! ❤️**
