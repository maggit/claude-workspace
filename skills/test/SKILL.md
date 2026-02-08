---
name: test
description: "Generate unit tests for code. Use when the user says /test, asks to write tests, create test cases, add unit tests, or test a function/class/module. Triggers: test, unit test, write tests, add tests, test cases, spec, jest, pytest, mocha, vitest."
---

# Unit Test Generator

Generate comprehensive unit tests for code.

## Workflow

1. **Detect the testing ecosystem:**
   - Check for existing test config: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `pyproject.toml [tool.pytest]`, `Cargo.toml`, `.rspec`, `go test`.
   - Check for existing test files to match patterns and conventions.
   - Identify the test runner, assertion library, and mocking framework in use.

2. **Analyze the target code:**
   - Read the function/class/module to test.
   - Identify: inputs, outputs, side effects, dependencies, edge cases, error paths.
   - Map out the code paths (happy path, error paths, boundary conditions).

3. **Generate tests following the project's patterns:**
   - Match existing file naming: `*.test.ts`, `*_test.go`, `test_*.py`, `*_spec.rb`, etc.
   - Match existing directory structure (`__tests__/`, `tests/`, co-located, etc.).
   - Use the same assertion style and patterns as existing tests.

4. **Write tests covering:**

### Test Categories

| Category | What to test |
|----------|-------------|
| **Happy path** | Normal inputs produce expected outputs |
| **Edge cases** | Empty inputs, zero, null/undefined, max values, single element |
| **Error handling** | Invalid inputs throw/return appropriate errors |
| **Boundary values** | Min, max, off-by-one, type boundaries |
| **State changes** | Side effects, mutations, event emissions |
| **Async behavior** | Promises, callbacks, timeouts (if applicable) |

5. **Structure each test with AAA pattern:**
   - **Arrange** — set up preconditions and inputs.
   - **Act** — execute the code under test.
   - **Assert** — verify the expected outcome.

6. **Run the tests** to ensure they pass.

## Guidelines

- Tests should be independent — no shared mutable state between tests.
- Use descriptive test names that explain the scenario: `"returns empty array when input is empty"`.
- Mock external dependencies (APIs, databases, file system) but not the code under test.
- Prefer `toEqual` deep comparison over `toBe` reference comparison for objects.
- If the code is untestable, suggest refactoring to improve testability.
- Don't test implementation details — test behavior and public interfaces.
- Include at least one negative test (what should NOT happen).
