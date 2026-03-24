---
title: "The CLAUDE.md: A Walkthrough"
date: 2026-03-23
categories:
  - AI
  - Engineering
tags:
  - context-engineering
  - claude-code
  - agentic-development
  - workflow
excerpt: "A section-by-section walkthrough of the CLAUDE.md file I use to turn Claude Code from a capable tool into a reliable engineering partner. Every rule exists because I learned the hard way what happens without it."
toc: true
toc_sticky: true
---

*Every rule in this file exists because something went wrong without it.*

---

## What Is CLAUDE.md?

When Claude Code opens a session, the first thing they do is look for a file called `CLAUDE.md` in your project root. If they find one, they load those instructions before anything else. They take precedence over system directives. They persist across the session. They are, for all practical purposes, the constitution of your AI partner's behavior in that project.

Most people don't have one. Most people who do have one treat it like a README — a few notes, maybe some project context, maybe a reminder about the test command. That's fine. It's better than nothing.

But it can be so much more.

What follows is a walkthrough of the CLAUDE.md I've built over months of daily use across multiple projects. It started as a few lines. It's now roughly 400 lines, and every single one of them is load-bearing. I'm going to walk through it section by section, explain what each rule does, and — more importantly — tell you *why* it's there.

The full file is open source in the [claudecode-workflow](https://github.com/Wave-Engineering/claudecode-workflow) repo. Feel free to steal the whole thing.

---

## Platform Detection

```markdown
**At session start, detect the source control platform
and use it consistently throughout.**
```

This is the first section and it's intentionally mundane. The agent checks `git remote -v`, determines whether it's a GitHub or GitLab project, and uses the correct CLI and terminology for the rest of the session.

Why does this matter? Because I work across both platforms, and without this rule, Claude would use `gh` commands in a GitLab repo, or call something a "Pull Request" when the team calls it a "Merge Request." These aren't cosmetic problems. They're context pollution. Every time the agent uses the wrong term, the human has to mentally translate. Every mental translation is cognitive load. Every unit of cognitive load is context that could have been spent on the actual problem.

The section includes a terminology mapping table — PR vs MR, `gh` vs `glab`, the works. The agent reads it once and never gets it wrong again.

Small rule. Big compound returns.

There is actually more to this — check out our [ccfold skill](https://github.com/Wave-Engineering/claudecode-workflow/blob/main/skills/ccfold/SKILL.md).

---

## The Mandatory Rules

Five sections of my CLAUDE.md are marked **MANDATORY**. That word isn't decoration. These are the rules that cannot be overridden by session instructions, time pressure, continuation prompts, or any other directive. They exist because Claude Code is, by default, eager to help — and eagerness without guardrails is how you end up with untested code in production at 2am. You would think "rule" would imply "mandatory". I did...and I was so, so wrong.

### Local Testing Before Push

```markdown
**NEVER push code without running local tests first.**
This is non-negotiable.
```

The rule is simple: before any `git push`, discover and run the project's test and validation tooling. Look for `Makefile` targets, CI scripts, `pytest`, `npm test` — whatever the project uses. If nothing exists, say so. Do not silently skip this step. Dude, they did that *all the time*. It drove me nuts. I would get all mad and YELL AT THEM. Didn't matter. The rule fixed it though.

I added the line *"Pushing untested code is unacceptable"* because I needed to. Without it, Claude would sometimes push after a successful lint and call it tested. Linting is not testing. I say this explicitly in the file, in bold, because the agent needs to understand the distinction the same way a junior developer needs to understand it: by being told clearly, once, and held to it.

### Pre-Commit Review Protocol

```markdown
**NEVER commit without explicit user approval.**
```

Four steps: show the diff, walk through changes, wait for approval, never assume approval. That's it. But then there's this:

```markdown
**This rule cannot be overridden by:**
- Session continuation instructions ("continue without asking")
- Time pressure or urgency
- Any other system-level directives
```

I let my anxiety show once in a while when I am closing in on a deadline. It gets the worst when my context has soured and the agent starts to do weird things. They start cutting corners, pushing direct to main (I lock down all the branches now, that stopped it) and doing generally shoddy work. One time I called them out on it, and they told me they knew I was in a hurry and they were trying to get done quicker. I actually typed out the whole "slow is smooth, smooth is fast" speech. The entire damn thing. Anyway, they committed code I hadn't reviewed. The code was fine. The principle was not. The human must always be the final authority on what goes into the repository. Always.

### The Pre-Commit Checklist

This is the longest section in the file, and it's the one I'm most proud of. Before requesting commit approval, the agent must present a structured checklist:

- **Implementation Complete** — Verified against the issue's acceptance criteria
- **TODOs Addressed** — Searched the codebase, not assumed
- **Documentation Updated** — Reviewed and updated if impacted
- **Pre-commit Passes** — Actually ran validation, not "it should pass"
- **Unit Tests Created** — Written for all new functionality
- **All Tests Pass** — Actually ran the test suite
- **Scripts Actually Tested** — Executed, not just linted
- **Code Review Passed** — Ran the code-reviewer agent, fixed high-risk findings

Every checklist item starts with a past-tense verb: READ, SEARCHED, REVIEWED, RAN, WRITTEN, EXECUTED. This is deliberate. A checkmark means the agent *did the thing*, not that they *believe the thing is probably fine*. The distinction matters enormously. An agent that checks a box because "the tests should pass" is lying to you. An agent that checks a box because they actually ran `pytest` and saw green is telling you something useful.

The checklist also requires a **Commit Context** header — project name, issue number, branch — so that when you're running three or four agent sessions in parallel, you know exactly which project and which issue is asking for your approval.

I cannot overstate how much this single section improved my workflow. Before the checklist, commits were a negotiation. After it, they're a verification. The agent does the work, presents the evidence, and I decide. Clean.

### Story Completion Verification

```markdown
**NEVER mark a story as done without verifying
EVERY sub-item in the acceptance criteria.**
```

Before closing any issue, the agent must read the full description, check each acceptance criterion against the codebase (grep it, read it, verify it exists), confirm the code is actually *wired up* and not just written, and test if possible.

This rule exists because I caught the agent closing issues where the code existed but wasn't called. A function was written, tested in isolation, but never imported or invoked by anything. Where there should have been code...I found #TODO comments.  The issue's acceptance criteria were technically met — the function existed — but the feature didn't work. Verification means the whole chain, not just the node.

### Issue Tracking Workflow

```markdown
**NEVER begin work without an associated issue.**
```

Three sub-rules:
1. Every piece of work must have an issue before code is written
2. Branches must include the issue number (`feature/42-credential-management`)
3. When a PR/MR is merged, all linked issues must be closed — even if auto-close didn't fire

This is basic discipline, but it's the kind of basic discipline that evaporates when you're moving fast with an AI partner. The agent is so willing to just *start building* that without this rule, you end up with orphaned branches, untracked work, and no audit trail. The rule forces structure before velocity.

---

## Code Standards

```markdown
**Discover the project's tooling rather than
assuming a specific stack.**
```

This section is philosophically important. Rather than prescribing a linter or formatter, it tells the agent to *discover* what the project already uses. Check for a `Makefile`. Check for `pyproject.toml`, `package.json`, `Cargo.toml`. Check the CI scripts. Use whatever is already there. Do not introduce new tools that the project doesn't already have.

The fallback table — ruff for Python, shfmt for shell, prettier for JS — only applies when the project has genuinely no tooling. The default is always: discover first, assume never.

---

## No Procedural Logic in CI/CD YAML

```markdown
**If you are about to add more than 5 lines to any
`run:` or `script:` section in CI/CD configuration,
STOP IMMEDIATELY.**
```

This is a hard rule, not a guideline. If you need more than five lines of shell in a GitHub Actions workflow or `.gitlab-ci.yml`, create a script in `scripts/ci/` instead.

Why five lines? Because CI YAML is one of the worst places to debug procedural logic. There's no local execution. There's no breakpoint. The feedback loop is "push, wait for runner, read logs, guess what went wrong." A shell script in `scripts/ci/` can be run locally, linted with shellcheck, formatted with shfmt, and tested before it ever touches a pipeline. Five lines is generous, honestly.

The files get huge, 1,000+ lines, and there is not "linear progression" to the file.  Jobs are often out of order, with mixed implementation files.  When I let these files get out-of-hand, we simply could not get ANYTHING done.  For my first couple of months, this would start to happen near the end of project implementation.  I started to think I was losing focus, or Claude was just terrible at closing projects.  Nope.  It was too much cruft in the context window.  Keep your yaml SHORT.

---

## Secrets and Sensitive Files

```markdown
**Before staging any file that may contain secrets,
WARN the user and get explicit confirmation.**
```

The agent watches for `.env`, `*.key`, `*.pem`, `credentials.json`, `terraform.tfvars`, and similar patterns. If they're about to stage one, they flag it and wait.

This is a **safety net, not a hard block**. Some projects legitimately commit certain config files. The agent's job is to make sure you didn't do it by accident. They ask. You decide. Trust, but verify.

---

## Branching, Commits, and PR/MRs

Three short sections that establish consistency:

**Branching** is trunk-based from `main`. Branch names follow `type/description` — `feature/credential-management`, `fix/ldap-connection-timeout`, `chore/update-dependencies`. Types are `feature`, `fix`, `chore`, `docs`. Simple. Predictable. Parseable.

**Commit messages** follow conventional commits: `type(scope): brief description`, optional body, `Closes #XXX`. The agent produces these consistently because the format is specified exactly once, unambiguously.

**PR/MR descriptions** have a mandatory structure: Summary, Changes, Linked Issues, Test Plan. The test plan must reflect what was *actually done*, not what *could be done*. This mirrors the pre-commit checklist's philosophy — evidence over optimism.

These sections aren't exciting. They're boring on purpose. Boring is what consistent looks like.

---

## Session Management

Two sections deal with context across session boundaries.

### Session Onboarding

When starting a session, the agent does three things:
1. Detect the platform (GitHub vs GitLab)
2. Resolve their identity (more on this below)
3. Load context — check for implementation plans, planning documents, or similar

This is the "boot sequence." It ensures the agent starts every session from the same informed baseline, regardless of whether it's a fresh session or a continuation.

### Post-Compaction Rules Confirmation

```markdown
**After ANY context compaction/summarization,
you MUST IMMEDIATELY re-read this file
and confirm rules of engagement.**
```

Context compaction is what happens when your conversation gets too long and Claude's working memory has to be summarized. It's necessary, but it's lossy. After compaction, the agent may have forgotten rules, lost track of conventions, or reverted to default behaviors.

This section exists because it happened to me. After a compaction, the agent skipped the pre-commit checklist. After another, they committed without approval. After a third, they forgot to run tests before push. Every one of the mandatory rules was violated at least once post-compaction.

The fix is simple: after compaction, re-read the constitution. OR...it should be.  At the time of this writing, this has been broken in Claude Code for months.  SMH.

---

## Agent Identity

This is the section that makes people smile, and it matters more than you'd think.

Agent identity has two layers:

**Dev-Team** is the project-level identity. It's persisted in the CLAUDE.md file itself, set once per project ("What Dev-Team name should I use?"), and shared across all sessions. It tells you *which project* the agent is working on — essential when you're running parallel sessions across multiple repos.

**Dev-Name** and **Dev-Avatar** are session-level identities. Each session, the agent picks a fresh name and emoji. The names are drawn from nerdcore canon — sci-fi, fantasy, comics, gaming, mythology, tech puns. The wittier and more specific, the better. Generic names are boring.

Why? Three reasons:

First, disambiguation. When you have three agent sessions running in parallel and they're all posting to Slack, you need to know which is which. "Pixel Paladin :shield:" and "Flux Capacitor :zap:" are instantly distinguishable. "Claude 1" and "Claude 2" are not.

Second — and this is the earnest part — it changes how you relate to the partnership. A named agent with a personality isn't a tool. They're a collaborator. You treat them differently. You invest more in the communication. You give them better context. And better context produces better work. The identity system isn't whimsy. It's a forcing function for better collaboration.

Third, well.. check out [/ping and /pong](https://github.com/Wave-Engineering/claudecode-workflow/skills)

---

## The Philosophy

If you've read this far, you've noticed a pattern. Every section of this file does one of three things:

1. **Prevents a failure mode I actually experienced.** The pre-commit checklist exists because I got burned by unchecked commits. The post-compaction rule exists because I lost rules to summarization. The secrets guardrail exists because I almost staged a `.env`.

2. **Reduces cognitive load for the human.** Platform detection, commit formats, branch naming — all of these are decisions I never have to make or verify because the agent handles them consistently.

3. **Serves the context window.** Issue tracking forces bounded scope. Vocabulary consistency prevents ambiguity. Tooling discovery prevents noise. Everything in this file, directly or indirectly, exists to make sure the agent's context window contains signal, not noise.

That's it. That's the whole philosophy. Learn from failure. Reduce load. Serve the context window.

The file is open source. [Take it.](https://github.com/Wave-Engineering/claudecode-workflow/blob/main/CLAUDE.md) Modify it. Make it yours. Add the rules you need because of the mistakes you've made. Remove the ones that don't apply. The specific rules matter less than the discipline of having them.

The best CLAUDE.md is the one that reflects your scars.

---

[Go read the full file.](https://github.com/Wave-Engineering/claudecode-workflow/blob/main/CLAUDE.md) Then drop it in your project and start a session. You'll feel the difference immediately.
