---
name: createtodo
description: "Create a TODO list in ContextDB/todos/. Use when the user says /createtodo, asks to create a todo, add tasks, make a task list, or track work items. Triggers: createtodo, create todo, add todo, new todo, task list, things to do, track tasks, add tasks."
---

# Create TODO

Create or append to a TODO list stored as a Markdown file in `ContextDB/todos/`.

## Workflow

1. **Determine the TODOs to add:**
   - If the user provides explicit items → use those exactly as stated.
   - If the user says something vague like "create a todo for what's pending" → review the current conversation and extract actionable items that are unfinished, discussed, or planned.
   - Ask for clarification only if you truly can't determine what should go on the list.

2. **Check for an existing active TODO file for today:**
   - Look in `ContextDB/todos/` for a file matching today's date pattern: `YYYY-MM-DD-*-todo.md` (excluding files prefixed with `completed-`).
   - If one exists for today → **append** new items to it rather than creating a duplicate file.
   - If none exists → create a new file.

3. **Create or update the file:**
   - **Directory:** `ContextDB/todos/`
   - **Filename format:** `YYYY-MM-DD-<topic>-todo.md`
     - `<topic>` is a short kebab-case label derived from the user's request or the main theme.
     - If no clear topic, use `general`: `2026-02-07-general-todo.md`
     - Examples: `2026-02-07-auth-refactor-todo.md`, `2026-02-07-general-todo.md`
   - Get the current date via `date "+%Y-%m-%d"` in bash.

4. **File format:**

```markdown
# TODO — <Topic> — YYYY-MM-DD

## Tasks

- [ ] Task description
- [ ] Task description with details
- [ ] Task description

## Notes

<Optional section for any context, links, or background that helps understand the tasks.>
```

### Rules for TODO items:
- Each item uses a Markdown checkbox: `- [ ]` (open) or `- [x]` (completed).
- Items should be **actionable and specific** — not vague ("fix stuff") but clear ("Fix the auth redirect bug in `lib/auth.ts`").
- Include file paths, function names, or specific details when relevant.
- You may add sub-items with indentation for complex tasks:
  ```
  - [ ] Implement user authentication
    - [ ] Add login endpoint in `app/api/auth/route.ts`
    - [ ] Create JWT token utility in `lib/jwt.ts`
    - [ ] Add auth middleware in `middleware.ts`
  ```
- You may add priority with a prefix: `[P0]`, `[P1]`, `[P2]` (where P0 = critical, P1 = important, P2 = nice to have).
- You may add categories with a prefix in **bold**: `**frontend**`, `**backend**`, `**infra**`, etc.

5. **When appending to an existing file:**
   - Read the current file first.
   - Add new items **below the existing items** in the `## Tasks` section.
   - Add a separator comment so it's clear when items were added:
     ```
     <!-- Added YYYY-MM-DD HH:MM -->
     - [ ] New task
     ```

6. **Confirm to the user:**
   - Show the filename.
   - List the items that were added.

## Guidelines

- Never overwrite existing TODO items — only append.
- If the user asks to "update" a todo, read it first and ask what to change.
- Keep descriptions concise but unambiguous.
- This skill only **creates/appends** items. Use `/completetodo` to mark items done.
- Use `/opentodos` to review pending items.
