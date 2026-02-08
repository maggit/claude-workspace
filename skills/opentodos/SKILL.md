---
name: opentodos
description: "Show the latest open TODO items for review and discussion. Use when the user says /opentodos, asks to see pending todos, review open tasks, what's left to do, or wants to pick what to work on next. Triggers: opentodos, open todos, pending tasks, what's left, remaining tasks, show todos, review tasks, backlog."
---

# Open TODOs

Retrieve and display the latest open (unchecked) TODO items from `ContextDB/todos/` so the user can decide what to work on.

## Workflow

1. **List all TODO files:**
   - List files in `ContextDB/todos/`.
   - **Immediately skip** files prefixed with `completed-` — these are fully done.
   - Sort remaining files by date (newest first), extracted from the filename `YYYY-MM-DD-*-todo.md`.

2. **Collect open items (up to 10):**
   - Starting from the **most recent** active file, read it and extract all `- [ ]` lines.
   - Collect open items into a list, tracking which file each came from.
   - If the current file yields fewer than 10 open items, move to the **next most recent** file and continue.
   - Stop once you have 10 open items, or you've exhausted all active files.

3. **Handle fully-completed files found during scanning:**
   - If while reading a file you discover it has **zero** `- [ ]` items (all are `- [x]`), rename it:
     - From: `2026-02-05-backend-todo.md`
     - To: `completed-2026-02-05-backend-todo.md`
   - Log this to the user: "Archived `2026-02-05-backend-todo.md` — all items completed."
   - Continue scanning the next file.

4. **Present the open items:**

```
## Open TODOs (10 most recent)

### From `2026-02-07-auth-refactor-todo.md` (3 open)
1. [ ] Add login endpoint in `app/api/auth/route.ts`
2. [ ] Create JWT utility in `lib/jwt.ts`
3. [ ] Write auth integration tests

### From `2026-02-06-general-todo.md` (4 open)
4. [ ] Set up CI/CD pipeline
5. [ ] Configure staging environment
6. [ ] Add error monitoring (Sentry)
7. [ ] Review PR #42

### From `2026-02-05-ui-todo.md` (3 open)
8. [ ] Implement dark mode toggle
9. [ ] Fix mobile nav breakpoint
10. [ ] Add loading skeletons to dashboard

---
Showing 10 of 15 open items across 3 files.
Use `/opentodos` again to see the next batch, or tell me which items to work on.
```

5. **Prompt the user for a decision:**
   - Ask which items they want to tackle now.
   - They can refer to items by number, description, or file.
   - Once they pick, proceed with the work (or create a focused plan).

## Pagination

- Each invocation shows **10 open items**.
- If the user asks to "see more" or "next page", skip the first 10 and show the next 10.
- Track the offset by counting items shown so far in the conversation.

## Edge Cases

- **No open items at all:** "All TODOs are completed! No open items found in `ContextDB/todos/`."
- **No TODO files exist:** "No TODO files found in `ContextDB/todos/`. Use `/createtodo` to create one."
- **Only completed files exist:** Same as no open items — mention that all files have been archived.

## Guidelines

- Present items clearly with numbers for easy reference.
- Show which file each item comes from so the user has context.
- Don't modify any items during this read-only operation (except renaming fully-completed files).
- If an item has priority markers (`[P0]`, `[P1]`) or categories (`**backend**`), preserve them in the display.
- Keep the output scannable — the user should be able to pick a task in under 30 seconds.
