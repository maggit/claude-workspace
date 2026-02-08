---
name: deadcode
description: "Find and remove dead, unused, or unreachable code in a codebase. Use when the user says /deadcode, asks to find unused code, dead code, unreachable code, orphaned files, unused imports, unused variables, or wants to clean up a codebase. Triggers: dead code, unused, unreachable, orphan, cleanup, prune."
---

# Dead Code Detector

Find and safely remove dead, unused, or unreachable code.

## Workflow

1. Determine scope:
   - Specific file/directory or entire project.
   - Specific language(s) to focus on.
2. Identify the project type and entry points:
   - Check for `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.
   - Identify entry points (main files, exported modules, route handlers).
3. Scan for dead code by category:

### Categories to Check

**Unused Imports/Requires**
- Scan each file for imported symbols not referenced in the file body.

**Unused Exports**
- Find exported functions/classes/constants and search the codebase for their usage.
- Use `grep -r` or equivalent to verify each export is imported elsewhere.

**Unused Variables & Parameters**
- Identify declared variables never read.
- Find function parameters never referenced in the function body.
- Respect `_` prefix convention for intentionally unused params.

**Unreachable Code**
- Code after unconditional `return`, `throw`, `break`, `continue`.
- Conditions that are always true/false (e.g., `if (false)`).

**Unused Files**
- Files not imported/required by any other file.
- Test files and config files should be excluded from this check.

**Commented-Out Code**
- Large blocks of commented code (>5 lines) that are likely stale.

4. Present findings grouped by category with file paths and line numbers.
5. For each finding, assess confidence (high/medium/low) based on static analysis limitations.
6. Remove only with user approval, starting with high-confidence items.

## Guidelines

- Never auto-delete — always present findings and ask for confirmation.
- Respect dynamic usage patterns: `getattr()`, `eval()`, reflection, decorators, dependency injection.
- Check for framework conventions (e.g., Django views referenced in urls.py, React components used in JSX).
- Exclude test files, config files, and type definition files from "unused" reports.
- For libraries/packages, exported public API should not be flagged as dead code.
- Note limitations: static analysis cannot catch all dynamic references.
