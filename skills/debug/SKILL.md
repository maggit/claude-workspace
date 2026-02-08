---
name: debug
description: "Systematically debug issues in code. Use when the user says /debug, reports a bug, error, unexpected behavior, crash, exception, or needs help troubleshooting. Triggers: debug, bug, error, traceback, exception, crash, not working, broken, unexpected behavior, troubleshoot, investigate."
---

# Debug Assistant

Systematically diagnose and fix bugs.

## Workflow

1. **Gather context:**
   - Ask for or locate the error message, traceback, or unexpected behavior description.
   - Identify the file(s) and function(s) involved.
   - Check recent git changes: `git log --oneline -10` and `git diff HEAD~3`.

2. **Reproduce:**
   - Understand the reproduction steps.
   - If a test exists, run it to confirm the failure.
   - If no test exists, suggest a minimal reproduction.

3. **Hypothesize:**
   - Form 2-3 hypotheses based on the error type.
   - Rank by likelihood.

4. **Investigate top hypothesis:**
   - Read the relevant code carefully.
   - Trace the data flow from input to error.
   - Check edge cases: null/undefined, empty collections, type mismatches, off-by-one, race conditions.
   - Look at recent changes to the affected code with `git log -p -- <file>`.

5. **Identify root cause:**
   - Distinguish symptom from cause.
   - Check if the bug exists in other similar code paths.

6. **Fix:**
   - Propose the minimal change that fixes the root cause.
   - Explain why the fix works.
   - Check for related bugs in similar patterns.

7. **Verify:**
   - Run existing tests.
   - Suggest a new test that would have caught this bug.

## Common Bug Patterns

| Pattern | What to check |
|---------|--------------|
| TypeError/AttributeError | Null checks, type coercion, missing fields |
| Off-by-one | Loop bounds, array indexing, fence-post |
| Race condition | Shared state, async/await, locks |
| State mutation | Unexpected side effects, shallow copies |
| Import/dependency | Version mismatches, circular imports |
| Environment | Missing env vars, wrong paths, permissions |

## Guidelines

- Read the actual error message carefully — it usually points to the answer.
- Check the simplest explanation first.
- Don't change code you don't understand. Read it first.
- One fix at a time. Verify before moving on.
- If the fix is a workaround, document it and note the underlying issue.
