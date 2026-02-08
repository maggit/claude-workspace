---
name: release
description: "Create release notes, prepare releases, and manage versioning. Use when the user says /release, asks to prepare a release, draft release notes, bump a version, create a git tag, or publish a GitHub release. Triggers: release, version bump, tag, release notes, ship it, cut a release."
---

# Release Manager

Prepare releases with proper versioning, tags, and release notes.

## Workflow

1. Detect the current version:
   - Check `package.json`, `pyproject.toml`, `Cargo.toml`, `version.txt`, or latest git tag.
   - If no version found, ask the user.
2. Determine the bump type:
   - Analyze commits since last release using conventional commits.
   - `BREAKING CHANGE` or `!` → major
   - `feat` → minor
   - `fix`, `perf`, `refactor` → patch
   - Allow user override.
3. Generate release notes:
   - Group commits by category (same as changelog skill).
   - Highlight breaking changes prominently at the top.
   - Include contributor list via `git shortlog -sne <range>`.
4. Prepare the release:
   - Update version in manifest files (package.json, pyproject.toml, etc.).
   - Update CHANGELOG.md if it exists.
   - Create a git tag with `git tag -a v<version> -m "Release v<version>"`.
5. Optionally create a GitHub release via `gh release create` if `gh` CLI is available.

## Version Format

Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- Pre-release: `v1.2.3-beta.1`
- Build metadata: `v1.2.3+build.123`

## Release Notes Template

```markdown
## v<version> - YYYY-MM-DD

### Breaking Changes
- Description

### Features
- Description

### Bug Fixes
- Description

### Other Changes
- Description

### Contributors
- @name (N commits)
```

## Guidelines

- Always confirm the version bump with the user before making changes.
- Never push tags or create GitHub releases without explicit permission.
- If CI/CD config exists (`.github/workflows/`, `.gitlab-ci.yml`), mention relevant release pipelines.
- Support `--dry-run` style behavior: show what would change before changing it.
