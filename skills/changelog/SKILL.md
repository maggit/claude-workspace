---
name: changelog
description: "Generate a changelog from git history. Use when the user says /changelog, asks to generate a changelog, wants a summary of changes between tags/commits/branches, or needs a CHANGELOG.md file created or updated. Triggers: changelog, changes since, release notes from git, what changed."
---

# Changelog Generator

Generate a well-structured changelog from git history.

## Workflow

1. Detect the repository root via `git rev-parse --show-toplevel`.
2. Determine the range:
   - If the user specifies two refs (tags, branches, SHAs), use that range.
   - Otherwise, find the latest tag with `git describe --tags --abbrev=0` and use `<latest-tag>..HEAD`.
   - If no tags exist, use the full history.
3. Collect commits with `git log --pretty=format:"%H|%s|%an|%ad" --date=short <range>`.
4. Categorize each commit by its conventional-commit prefix or keywords:
   - **Added** — `feat`, `add`
   - **Fixed** — `fix`, `bugfix`, `patch`
   - **Changed** — `refactor`, `update`, `change`
   - **Deprecated** — `deprecate`
   - **Removed** — `remove`, `delete`
   - **Security** — `security`, `vuln`
   - **Performance** — `perf`
   - **Documentation** — `docs`
   - **Other** — anything that doesn't match
5. Format output following [Keep a Changelog](https://keepachangelog.com/) conventions.
6. If a `CHANGELOG.md` already exists, prepend the new section below the title. Otherwise create a new file.

## Output Format

```markdown
# Changelog

## [<version-or-range>] - YYYY-MM-DD

### Added
- Description of feature (SHA short)

### Fixed
- Description of fix (SHA short)

...
```

## Guidelines

- Use imperative mood in descriptions ("Add feature" not "Added feature").
- Include short SHA (7 chars) for traceability.
- Group by category, then sort chronologically within each group.
- Omit empty categories.
- If the user requests a specific format (e.g., plain text, JSON), adapt accordingly.
- For monorepos, offer to scope by directory path using `git log -- <path>`.
