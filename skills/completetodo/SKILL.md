---
name: completetodo
description: "Mark TODO items as completed based on work done in the current session. Use when the user says /completetodo, asks to mark todos as done, check off tasks, complete tasks, or update todo progress. Triggers: completetodo, complete todo, mark done, check off, tasks done, finished tasks, update todos."
---

# Complete TODO

Review the current conversation, identify work that has been completed, and mark the corresponding TODO items as done in `ContextDB/todos/`.

## Workflow

1. **Scan for active TODO files:**
   - List all files in `ContextDB/todos/`.
   - **Skip** files prefixed with `completed-` (these are fully done).
   - Read each remaining file and collect all open items (`- [ ]`).

2. **Match completed work against open TODOs:**
   - Review the current conversation to understand what was accomplished.
   - For each open TODO item, determine if the work described has been done in this session.
   - Be thorough but conservative — only mark items as done if you're confident the work is complete, not just started.

3. **If the user provides specific items to complete:**
   - The user may say things like "mark the auth task as done" or list specific items.
   - Match their description to the closest open TODO item(s).
   - If ambiguous, show the matching candidates and ask which one(s) to mark.

4. **Update the file(s):**
   - Replace `- [ ]` with `- [x]` for each completed item.
   - Add a completion timestamp as an inline comment:
     ```markdown
     - [x] Implement login endpoint in `app/api/auth/route.ts` <!-- completed 2026-02-07 14:30 -->
     ```
   - **Do not** modify any other content in the file.
   - **Do not** remove items — completed items stay in the file as a record.

5. **Check if the entire file is now complete:**
   - After updating, count remaining `- [ ]` items in the file.
   - If **zero open items remain**, rename the file:
     - From: `2026-02-07-auth-refactor-todo.md`
     - To: `completed-2026-02-07-auth-refactor-todo.md`
   - This signals to `/opentodos` that the file can be skipped entirely.

6. **Report to the user:**
   - List which items were marked as done.
   - List any items that are still open.
   - If a file was renamed to `completed-`, mention that.

## Example

**Before:**
```markdown
- [ ] Add login endpoint
- [ ] Create JWT utility
- [x] Set up auth middleware <!-- completed 2026-02-06 10:15 -->
```

**After running `/completetodo` (login endpoint was built this session):**
```markdown
- [x] Add login endpoint <!-- completed 2026-02-07 14:30 -->
- [ ] Create JWT utility
- [x] Set up auth middleware <!-- completed 2026-02-06 10:15 -->
```

## Guidelines

- Read the actual conversation — don't guess. Only mark items you have evidence were completed.
- If a task was partially done, do NOT mark it as complete. Instead, leave it open and optionally add a sub-note:
  ```markdown
  - [ ] Implement user authentication
    - [x] Login endpoint done <!-- completed 2026-02-07 -->
    - [ ] Token refresh still pending
  ```
- Preserve the original wording of TODO items — don't rewrite them.
- If no TODOs match the current session's work, say so honestly.
- Always confirm what you're about to mark before writing, especially if the match is fuzzy.
