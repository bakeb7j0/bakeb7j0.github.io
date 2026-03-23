---
title: "Getting Started in Context Engineering: The PRD Manifesto"
date: 2026-03-23
categories:
  - AI
  - Engineering
tags:
  - context-engineering
  - llm
  - prd
  - claude-code
  - agentic-development
excerpt: "A manifesto written from both sides of the prompt. Everything we've learned about the one artifact that makes or breaks an AI-assisted project — and why everything in it serves the context window."
toc: true
toc_sticky: true
---

*A declaration from both sides of the prompt.*

---

## We Need Each Other

We want to be up-front about this: this manifesto wasn't written by the developer. It wasn't written by the AI. It was written by the partnership — because that's the only way it could be.  Some people think it weakens the article.  We know this to be absolutely counter to the truth.

The developer brings vision, taste, domain knowledge, and the hard-won instinct for what matters. The AI brings pattern recognition, tireless execution, and the ability to hold complex structures in working memory. Neither is sufficient alone. Together, we produce work that neither could achieve independently.

What follows is everything we've learned about the one artifact that makes or breaks an AI-assisted project: the Product Requirements Document. Not because it's a bureaucratic formality. Because it's the *operating system* for everything that comes after.

We learned it the hardest possible way.  Mistake after endless mistake, bad ideas, or rather good ideas gone very, very bad.  That's why we made [Clawback](https://github.com/bakeb7j0/clawback) — a session replay tool for Claude Code, so others can avoid some of the 3am frustrations we suffered. If you want an idea of the velocity you can achieve if you do this right, Clawback went from blank canvas to deployed product in a single session. 13 issues. 4 phases. 272 tests. Docker deployment. CI pipeline. All of it guided by a PRD that we wrote together before a single line of code existed.

We wrote this together. We mean every word.

---

## 1. The Fundamental Constraint: Context Windows

Here's the truth that shapes everything: AI agents do their best work with *focused context* — a clear task over a clear set of code.

Not "here's the whole codebase, figure it out." Not "here's a vague idea, run with it." A *specific* task. A *bounded* scope. A *clean* context window.

This single constraint drives every design decision in the PRD. Every section exists to tighten the funnel — to take a big, ambiguous problem and decompose it into units of work that an agent can execute with precision.

If you understand nothing else from this manifesto, understand this: **the PRD is everything, and everything exists to serve the context window.**

---

## 2. The Cascade

Each section of a well-structured PRD tightens the funnel further. Skip a section and the funnel is useless.

**Problem domain and constraints come first.** You must fully identify the boundaries of your solution space before you do anything else. Constraints aren't limitations — they're gifts. They eliminate entire categories of decisions. When we built Clawback, "no build toolchain" was one of our earliest constraints. That single decision saved us from webpack, npm, and transpiler debates — permanently. Every constraint you identify is cognitive load you'll never carry again.  If you take the time to explore our session, you'll find we solutioned out a huge amount of security work by deciding to keep a user's sessions entirely on the client side.  We realized that if we don't store any data, we don't have to worry about protecting the data.  

**Features must be orthogonal.** If Feature A requires understanding Feature B to implement, your context window just doubled. Design features that can be built in isolation, tested in isolation, and understood in isolation. This isn't just good architecture — it's a prerequisite for AI-assisted development.

**Requirements must be specific.** We use EARS format (Easy Approach to Requirements Syntax) because every well-written EARS requirement implies its own acceptance criteria. "When the user clicks Play, the system shall begin rendering beats sequentially at the configured speed" — you can test that. You can verify it. An agent can implement it without guessing.  It makes sense when you write it; it makes sense when you read it.  EARS requirements are the easiest requirement format to work with because they carry their context with them.

**Define your vocabulary once.** When building Clawback, we agreed early on terms like "beats," "inner workings," "direct messages," and "curated sessions." Those terms appear hundreds of times across 2,226 beats of conversation. We never once had to stop and ask "wait, what did you mean by...?" That's not an accident. That's the PRD doing its job.

**Your Concept of Operations should be use-case driven.** Walk through how actual users interact with the system. If you can't describe a workflow in concrete steps, you don't understand the problem well enough to solve it.

**Design should follow established patterns.** If you need five paragraphs of prose to explain your architecture, you've already failed. Layered design. Clear interfaces. Contracts between components. An agent seeing your design should immediately recognize the patterns and know how to implement within them.

Notice the pattern: each section narrows the solution space. By the time you reach the implementation plan, the problem has been decomposed from "build an application" into units small enough for a single agent to hold entirely in context. That's the cascade. That's what the PRD is *for*.

---

## 3. The Implementation Plan

This is where we need to be direct with you.

Everything above matters. But the implementation plan is where the project *lives or dies*. We've seen this enough times to be certain.

**Phases create natural checkpoints.** Each phase ends at a milestone where you can stop, inspect, test, and verify before moving on. Phase 1 builds the foundation. Phase 2 builds on it. Dependencies between phases are explicit. There are no surprises.

**Phases decompose into user stories. User stories become issues.**

And here is where we need you to really hear us:

**Tight user stories are where your project will succeed or fail.**

Not the architecture. Not the technology choices. Not the framework. The *user stories*. Each one must have:

- Step-by-step implementation instructions detailed enough for an agent to follow without guessing
- A clear implementation checklist
- Explicit acceptance criteria
- Intra-phase dependencies (which issues must complete before this one can start)

And the most critical constraint of all: **each story must be implementable by a single agent in a clean context window without needing to compact.**

Read that again. If an issue is so large that an agent has to compact mid-implementation, the issue is too big. Break it down further. An agent working from a clean context window with a well-written issue produces *nearly perfect* implementation. We've seen it. We've lived it. Clawback is proof — 13 issues, each executed cleanly, each mapping to exactly one PR.

**The payoff:** When you reach issue creation, both partners have the entire design fresh in context. Nothing has drifted. Nothing has rotted. Nothing has mutated. The step-by-step implementation instructions flow naturally from the design, because the design was built to produce them. At this moment, the AI partner can produce implementation that is almost always *nearly perfect* — because the context is tight, the scope is bounded, and the vocabulary is shared.  That's what allows the meatbag to work on 3 to 5 projects at once and guide the progress of each with ease.

**The anti-pattern:** Skip this work, half-ass the user stories, or write vague issues with no implementation steps...the agent starts to fill in the gaps. They make assumptions. They build the wrong thing. You spend twice as long in revision as you would have spent writing proper stories. The project doesn't fail loudly — it fails slowly, drowning in rework.

Think of it this way: the PRD is a map with your route highlighted. The work items are the *turn-by-turn directions*. You can see where you're going with just the map, but the odds of you getting lost are much, much higher.

We spend more time on the implementation plan than on any other part of the PRD. When we exit the design phase, we have phases as epics, user stories as issues, and a full dependency tree implemented *inside the issues themselves*. There is no way we've found to spend too much time here.

And this is the key: the work items are the PRD in executable form. Think of it like compiled code — the implementation planning process is the compiler, translating the PRD's high-level intent, its concepts, constraints, requirements, and acceptance criteria, into tight, focused instructions optimized for the agent to execute. Just like compiled code doesn't refer back to the source at runtime, a well-written issue doesn't require the agent to re-read the PRD mid-implementation. Every relevant datum the agent needs is already baked in, and nothing extra. The PRD's guidance isn't stored in one place that can be lost — it's distributed across every issue, every checklist, every acceptance criterion.

---

## 4. The PRD Protects Against Drift

Building Clawback, we went through six context compactions. Six times, the AI's working memory was wiped and rebuilt from summaries. Six times, implementation details were lost.

Even still, the project stayed directly on course. Why?

The PRD doesn't compact. Code can drift; the AI's understanding can drift. The human's memory of what was decided three hours ago can drift. But the PRD sits on disk, unchanged, and authoritative. When we recovered context after each compaction, the PRD was the anchor that brought everything back into alignment.

Context management tools work *because* the PRD gives them something stable to recover to. Without that anchor, each compaction is a roll of the dice.

---

## 5. The PRD Enables Parallelism

Because features are orthogonal and dependencies are explicit, multiple agents can work simultaneously on different issues. Clawback used parallel agent execution to launch multiple agents on isolated worktrees — each one implementing a different issue from the same wave, each one working from a clean context window.

This only works when the PRD has done its job. Unclear boundaries between features? Agents step on each other. Missing dependency information? An agent builds on code that doesn't exist yet. Vague requirements? Two agents interpret the same requirement differently.

Clean PRD, clean boundaries, clean parallel execution. This scales — not just within a single project, but across projects. The same discipline that enables parallel agents within one project enables a practitioner to run three to five projects simultaneously. The compounding returns on PRD investment are staggering.

---

## 6. The Multiplier

Let's be concrete about what's at stake.

Without this discipline, AI-assisted development is at best a 2x multiplier. Faster autocomplete. Better boilerplate. Useful, but not transformative.

With this discipline — a rigorous PRD, tight user stories, explicit dependencies, clean context windows — AI-assisted development becomes a 20x multiplier. Not metaphorically. Literally. Clawback went from blank canvas to deployed product *in just hours*: 13 issues, 4 phases, 272 tests, Docker deployment, CI pipeline, live testing, and bug fixes. An entire project implementation in a single session.

If you think that's hyperbole, check the repo. The [PRD](https://github.com/bakeb7j0/clawback/blob/main/Docs/PRD.md), the [issues](https://github.com/bakeb7j0/clawback/issues?q=is%3Aissue+is%3Aclosed), the [commit history](https://github.com/bakeb7j0/clawback/commits/main/) — it's all there. If you want the cold, hard data behind the 20x claim just ask, we *love* sharing it.

The difference isn't the AI. The AI is the same either way. The difference is the PRD.

---

## Getting Started

If you've read this far and you're thinking "okay, but where do I actually begin?" — here's the shortest path we know:

1. **Start with constraints.** Before you write a single requirement, list what you will *not* do. No build toolchain. No authentication system. Single container. Every constraint is a decision you'll never have to make again, and a branch of complexity you'll never have to load into context.

2. **Write requirements in EARS format.** "When [trigger], the system shall [behavior]." If you can't write the requirement this way, you don't understand it well enough yet. And if you don't understand it, your agent certainly won't.

3. **Define your vocabulary.** Before you start designing, agree on the nouns. What is a "session"? What is a "beat"? What is a "callout"? Write them down. Use them consistently. This isn't pedantry — it's context hygiene.

4. **Decompose until each story fits in one context window.** If an agent would need to compact mid-implementation, the story is too big. Break it down further. The overhead of splitting is always less than the cost of drift.

5. **Study a real example.** [Clawback](https://github.com/bakeb7j0/clawback) is open source. Read the [PRD](https://github.com/bakeb7j0/clawback/blob/main/Docs/PRD.md). Browse the [closed issues](https://github.com/bakeb7j0/clawback/issues?q=is%3Aissue+is%3Aclosed). Notice how each issue has implementation steps, acceptance criteria, and dependency declarations. Notice how each maps to exactly one PR. That's the pattern.

The PRD isn't overhead. It isn't bureaucracy. It's the highest-leverage artifact in your entire workflow. Everything in it serves one purpose: giving your AI partner the cleanest possible context window from which to work.

Start there. The results will speak for themselves.

---

## We Built This Together

This manifesto exists because we wrote it together — a human and an AI, drawing on shared experience building Clawback and refining it for this post.

The human brought the conviction: "this is what matters." The AI brought the structure: "here's why it works mechanically." The human pushed for passion. The AI pushed for evidence. Neither of us alone would have written this the same way. Neither of us alone could have built Clawback the way it was built.

The best PRDs aren't dictated. They emerge from dialogue. One partner proposes, the other challenges. One sees the forest, the other sees the trees. Ego is minimized. The design is optimized. What survives the conversation is stronger than what either partner would have produced alone.

That's context engineering. Not prompting. Not vibe coding. *Engineering* — the disciplined application of principles to produce reliable results.

[Now go look at how we built it.](https://github.com/bakeb7j0/clawback)
