---
name: openpr
description: "Generate a PR description and open a pull request. Use when the user says /openpr, asks to open a PR, create a pull request, or push and open a PR. Triggers: openpr, open pr, pull request, create pr, push and pr."
---

# Open PR

Generate a comprehensive pull request description based on all commits on the current branch (compared to the default base branch), then open the PR using the GitHub CLI (`gh`).

## Workflow

### 1. Detect the Base Branch

```bash
# Try to detect the default branch (main or master)
git remote show origin | grep "HEAD branch" | awk '{print $NF}'
```

Store the result as `BASE_BRANCH`.

### 2. Get the Current Branch Name

```bash
git branch --show-current
```

Store the result as `CURRENT_BRANCH`. If the current branch is the same as `BASE_BRANCH`, stop and inform the user they need to be on a feature branch.

### 3. Gather Commit History

```bash
git log ${BASE_BRANCH}..${CURRENT_BRANCH} --pretty=format:"%h %s" --reverse
```

This gives the list of all commits on this branch that are not on the base branch, in chronological order.

### 4. Gather the Full Diff Summary

```bash
git diff ${BASE_BRANCH}...${CURRENT_BRANCH} --stat
```

This gives a summary of files changed, insertions, and deletions.

### 5. Optionally Read Detailed Diffs

If the diff is small enough (under ~2000 lines), also read the full diff for richer context:

```bash
git diff ${BASE_BRANCH}...${CURRENT_BRANCH}
```

If the diff is too large, rely on the commit messages and `--stat` output only.

### 6. Generate the PR Title

- Derive a concise, descriptive PR title from the overall theme of the changes.
- Format: imperative mood, no prefix, max ~72 characters.
- Examples: `Add user authentication flow`, `Fix race condition in job scheduler`, `Refactor database connection pooling`.

### 7. Generate the PR Description

Use the following markdown template. Fill in every section thoughtfully based on the commits and diff:

```markdown
## Summary

<!-- 2-4 sentence high-level overview of what this PR does and why -->

## Changes

<!-- Grouped list of meaningful changes. Group by area/theme, not by commit.
     Each item should describe WHAT changed and WHY, not just repeat commit messages. -->

- **Area/Module**: Description of change
- **Area/Module**: Description of change

## How to Test

<!-- Step-by-step instructions a reviewer can follow to verify the changes work -->

1. Step one
2. Step two

## Notes for Reviewers

<!-- Optional: anything reviewers should pay attention to, open questions,
     trade-offs made, or follow-up work planned -->
```

**Guidelines for the description:**

- **Summary**: Explain the motivation and the approach. A reviewer who reads only this section should understand the PR.
- **Changes**: Group related changes together by theme or module. Do NOT just list commits verbatim — synthesize them into meaningful bullets. If a commit was a fixup or correction of a previous commit on the branch, merge them into one bullet.
- **How to Test**: Be specific. Include commands, URLs, or user flows. If there are automated tests, mention how to run them.
- **Notes for Reviewers**: Include anything unusual — risky areas, things you're unsure about, intentional shortcuts, or planned follow-ups. If there's nothing noteworthy, omit this section.

### 8. Confirm with the User

Before opening the PR, display the generated title and description to the user and ask for confirmation or edits.

### 9. Push and Open the PR

Once confirmed:

```bash
# Ensure the branch is pushed
git push -u origin ${CURRENT_BRANCH}

# Open the PR via GitHub CLI
gh pr create --title "<GENERATED_TITLE>" --body "<GENERATED_DESCRIPTION>" --base ${BASE_BRANCH}
```

If `gh` is not installed or not authenticated, inform the user and provide the generated title and description so they can copy/paste it manually.

### 10. Share the PR Link

After the PR is created, display the PR URL to the user.

## Edge Cases

- **No commits on branch**: Inform the user there are no changes to open a PR for.
- **Unpushed base branch changes**: Warn the user if the local base branch is behind remote.
- **Draft PRs**: If the user says `/openpr draft`, add the `--draft` flag to `gh pr create`.
- **Existing PR**: If a PR already exists for this branch, inform the user and provide the link. Check with `gh pr view --json url`.
- **Merge conflicts**: If the branch has conflicts with base, warn the user but still allow PR creation.

## Dependencies

- `git` (required)
- `gh` — GitHub CLI (required for automatic PR creation; graceful fallback if missing)

## Examples

**User input:**
```
/openpr
```

**User input (draft):**
```
/openpr draft
```
