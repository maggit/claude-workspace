---
name: standup
description: "Generate a standup report from recent git activity. Use when the user says /standup, asks for a standup update, daily summary, what they worked on yesterday, or a status report based on recent commits. Triggers: standup, daily update, what did I do, status report, yesterday's work, daily summary."
---

# Standup Report Generator

Generate a concise standup report from recent git activity.

## Workflow

1. Identify the user:
   - `git config user.name` and `git config user.email`.
2. Determine the time range:
   - Default: since last business day (skip weekends).
   - Monday → since Friday.
   - Other days → since yesterday.
   - Allow user override (e.g., "last 3 days", "this week").
3. Gather activity:
   - Commits: `git log --author="<email>" --since="<date>" --pretty=format:"%h %s (%ar)" --all`
   - Branches touched: `git branch --sort=-committerdate --format="%(refname:short) %(committerdate:relative)" | head -10`
   - If multiple repos, offer to scan them.
4. Summarize into standup format.

## Output Format

```markdown
## Standup — YYYY-MM-DD

### Yesterday
- Worked on <feature/area>: <concise summary of commits>
- Fixed <bug>: <summary>

### Today
- Plan to continue <work in progress>
- [Suggested based on open branches and recent context]

### Blockers
- [Any merge conflicts, failing CI, or stale PRs detected]
```

## Guidelines

- Group related commits into logical work items rather than listing each commit.
- Use natural language, not commit hashes.
- Keep it concise — a real standup is 30 seconds.
- If `gh` CLI is available, include open PRs authored by the user.
- Detect and mention any unfinished work (branches with no PR, uncommitted stashes).
