---
name: storecontext
description: "Store a context summary of the current session to ContextDB. Use when the user says /storecontext, asks to save context, log the session, store a summary, checkpoint the conversation, or persist what was discussed. Triggers: storecontext, store context, save context, log session, checkpoint, save progress, session summary."
---

# Store Context

Capture a summary of the current conversation session and persist it as a Markdown file in `ContextDB/context/` for future reference by humans and LLM tools.

## Workflow

1. **Determine the summary window:**
   - Check `ContextDB/context/` for the most recent existing summary file.
   - If a previous summary exists, this new summary should cover everything **since that summary was written** (avoid duplicating what was already captured).
   - If no previous summary exists, summarize the **entire session from the beginning**.

2. **Gather what happened in the window:**
   - What did the user ask for?
   - What decisions were made?
   - What was built, changed, or configured?
   - What files were created, modified, or deleted?
   - What problems were encountered and how were they resolved?
   - Any open questions, next steps, or TODOs that remain?

3. **Create the summary file:**
   - **Directory:** `ContextDB/context/`
   - **Filename:** `YYYY-MM-DD-HHMMSS-summary.md` using the current timestamp.
     - Example: `2026-02-07-143022-summary.md`
     - Include time (HHMMSS) so multiple summaries on the same day don't collide.
   - Get the current timestamp via `date "+%Y-%m-%d-%H%M%S"` in bash.

4. **Write the file using this structure:**

```markdown
# Session Summary — YYYY-MM-DD HH:MM

## Overview
<1-3 sentence high-level summary of what this session accomplished.>

## What Was Done
- <Concise bullet for each meaningful action, grouped logically.>
- <Include file paths for anything created or modified.>

## Decisions Made
- <Any technical or design decisions, with brief rationale.>

## Key Files
| File | Action | Description |
|------|--------|-------------|
| `path/to/file` | created / modified / deleted | Brief note |

## Open Items
- <Anything unfinished, deferred, or flagged for follow-up.>
- <Known issues or blockers.>

## Context for Next Session
<Paragraph aimed at a future Claude or human picking up where this left off. What should they know? What's the current state of things? What was the user's intent or direction?>
```

5. **Confirm to the user:**
   - Show the filename and path.
   - Give a one-line summary of what was captured.

## Guidelines

- Write for a future reader (human or LLM) who has **zero context** about this session.
- Be specific: include file paths, command names, config values — not vague descriptions.
- Keep it concise but complete. Aim for a summary that can be scanned in under 60 seconds.
- Use the project's actual file paths relative to the repo root.
- Do NOT include sensitive data (API keys, secrets, passwords) in the summary.
- Do NOT duplicate content already captured in a previous summary — reference it instead (e.g., "Continued from `2026-02-07-100000-summary.md`").
- Respect ContextDB conventions: plain Markdown, no proprietary formats, append-friendly.

## For LLM Tools Reading Context

When starting a new session or needing project context, read the files in `ContextDB/context/` in chronological order. The most recent summary represents the latest known state. Combine with `CLAUDE.md` and `ContextLoom.md` for full project understanding.
