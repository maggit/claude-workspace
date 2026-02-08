---
name: testcoverage
description: "Analyze test coverage and identify gaps. Use when the user says /testcoverage, asks about test coverage, wants to improve coverage, find untested code, or reach a coverage target. Triggers: test coverage, coverage report, untested code, coverage gap, coverage target, uncovered lines, branch coverage."
---

# Test Coverage Analyzer

Analyze test coverage and generate tests to fill gaps.

## Workflow

1. **Run coverage analysis:**
   - Detect the test framework and run with coverage enabled:
     - **JS/TS**: `npx jest --coverage` or `npx vitest --coverage` or `npx nyc mocha`
     - **Python**: `pytest --cov=<package> --cov-report=term-missing`
     - **Go**: `go test -coverprofile=coverage.out ./... && go tool cover -func=coverage.out`
     - **Rust**: `cargo tarpaulin` or `cargo llvm-cov`
   - Parse the coverage output.

2. **Analyze coverage gaps:**
   - Identify files with lowest coverage.
   - Identify uncovered lines and branches.
   - Categorize gaps:
     - **Critical**: Business logic, data validation, security checks.
     - **Important**: Error handling, edge cases.
     - **Low priority**: Logging, formatting, simple getters/setters.

3. **Present a coverage report:**

```
Coverage Summary: XX.X% (target: YY%)

Critical Gaps:
  src/auth/login.ts        45%  — lines 23-40, 67-89 (authentication logic)
  src/api/payments.ts      38%  — lines 12-35 (payment processing)

Important Gaps:
  src/utils/validator.ts   62%  — lines 44-58 (error handling)

Files at 100%: 12/30
```

4. **Generate tests for the highest-priority gaps:**
   - Start with critical business logic.
   - Focus on untested branches and error paths.
   - Follow the project's existing test patterns.

5. **Re-run coverage to verify improvement.**

## Guidelines

- Focus on meaningful coverage, not just hitting a number.
- 100% coverage doesn't mean bug-free — test quality matters more than quantity.
- Prioritize branch coverage over line coverage.
- Don't test trivially obvious code just for the coverage number.
- If coverage tooling isn't set up, help configure it first.
- Consider setting up coverage thresholds in CI config if not already present.
