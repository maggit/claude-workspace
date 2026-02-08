---
name: e2e
description: "Generate end-to-end tests for applications. Use when the user says /e2e, asks for end-to-end tests, integration tests, browser tests, API tests, or wants to test a full user workflow. Triggers: e2e, end-to-end, integration test, browser test, playwright, cypress, selenium, API test, smoke test, user flow."
---

# E2E Test Generator

Generate end-to-end tests covering full user workflows.

## Workflow

1. **Detect the E2E framework:**
   - Check for existing config: `playwright.config.*`, `cypress.config.*`, `wdio.conf.*`.
   - Check `package.json` for Playwright, Cypress, Selenium, Puppeteer, or similar.
   - For API-only: check for Supertest, httpx, REST-assured.
   - If none exists, recommend Playwright (most versatile) and help set it up.

2. **Identify the user flow to test:**
   - Ask the user or infer from the feature being discussed.
   - Map out the steps: navigation, input, actions, expected outcomes.
   - Identify preconditions (auth state, seed data, feature flags).

3. **Generate the test:**

### For Browser E2E (Playwright/Cypress)

```
- Navigate to the page.
- Interact with elements using accessible selectors (role, label, text).
- Assert on visible outcomes (text content, URL, element state).
- Handle async loading (wait for network idle, element visibility).
```

### For API E2E

```
- Set up auth headers/tokens.
- Make requests in the order a real client would.
- Assert on status codes, response bodies, and side effects.
- Clean up test data.
```

4. **Add robustness:**
   - Use data-testid or accessible selectors, not brittle CSS selectors.
   - Add proper waits instead of fixed timeouts.
   - Handle flakiness: retry logic, deterministic test data.
   - Set up and tear down test state.

5. **Run the test** to verify it passes.

## Test Structure

```
describe('User flow: <flow name>')
  before: Set up preconditions (login, seed data)
  test: Step-by-step user actions with assertions
  after: Clean up (delete test data, logout)
```

## Guidelines

- E2E tests should mirror real user behavior — interact via the UI, not internal APIs.
- Keep E2E tests focused on critical paths (login, checkout, core CRUD).
- Use accessible selectors: `getByRole`, `getByLabel`, `getByText` over CSS.
- Isolate test data — don't depend on shared mutable state.
- E2E tests are slow; keep the suite lean. Test edge cases in unit tests.
- For flaky tests, add retry annotations rather than arbitrary sleeps.
- Include visual regression snapshots for UI-critical flows if the framework supports it.
