---
name: rebase
description: "Help with git rebase operations, including squashing, reordering, and cleaning up commit history. Use when the user says /rebase, asks to rebase a branch, squash commits, clean up history, fixup commits, or reorganize their git log. Triggers: rebase, squash, fixup, clean up commits, reorder commits, interactive rebase."
---

# Rebase Assistant

Guide and execute git rebase operations safely.

## Workflow

1. Assess the current state:
   - `git status` — ensure working tree is clean (stash if needed).
   - `git log --oneline -20` — show recent history.
   - `git branch -vv` — identify tracking branch.
2. Determine the rebase target:
   - If user says "squash last N commits" → use `HEAD~N`.
   - If user says "rebase onto main" → use `main` (or `master`).
   - If user says "clean up" → find the merge base with the default branch.
3. Plan the rebase:
   - Show the user exactly which commits will be affected.
   - Propose a plan (pick, squash, fixup, reword, drop).
   - Get user confirmation before executing.
4. Execute:
   - For squashing: use `git rebase` with the appropriate flags.
   - For rebase onto branch: `git rebase <target>`.
   - IMPORTANT: never use `-i` flag as it requires interactive input. Instead use `git rebase` with `--autosquash`, environment variables like `GIT_SEQUENCE_EDITOR`, or sequential cherry-pick operations.
5. Handle conflicts:
   - Show conflicting files with `git diff --name-only --diff-filter=U`.
   - Show each conflict with context.
   - Suggest resolutions and apply with user approval.
   - `git add <file>` then `git rebase --continue`.
6. Verify the result:
   - `git log --oneline` to show the new history.
   - `git diff <original-ref>..HEAD` to confirm no content was lost.

## Safety Rules

- Always create a backup ref: `git branch backup-<branch>-<date>` before rebasing.
- Never force-push without explicit user permission.
- Warn if rebasing commits that are already pushed to a shared branch.
- If rebase goes wrong, guide recovery with `git rebase --abort` or the backup branch.

## Common Patterns

**Squash last N into one:**
```bash
git reset --soft HEAD~N && git commit
```

**Rebase onto updated main:**
```bash
git fetch origin && git rebase origin/main
```

**Fixup a specific commit:**
```bash
git commit --fixup=<sha> && GIT_SEQUENCE_EDITOR=: git rebase --autosquash <sha>~1
```
