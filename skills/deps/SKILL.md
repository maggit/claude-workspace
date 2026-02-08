---
name: deps
description: "Analyze, audit, and manage project dependencies. Use when the user says /deps, asks to check dependencies, find outdated packages, audit for vulnerabilities, analyze dependency trees, or clean up unused packages. Triggers: deps, dependencies, outdated, audit, vulnerabilities, upgrade packages, dependency tree, unused packages, npm audit, pip audit."
---

# Dependency Manager

Analyze, audit, and manage project dependencies.

## Workflow

1. **Detect the package ecosystem:**
   - `package.json` → npm/yarn/pnpm
   - `pyproject.toml` / `requirements.txt` → pip/poetry/uv
   - `Cargo.toml` → cargo
   - `go.mod` → Go modules
   - `Gemfile` → bundler
   - `pom.xml` / `build.gradle` → Maven/Gradle

2. **Run the requested analysis:**

### Outdated Dependencies
- `npm outdated` / `yarn outdated` / `pnpm outdated`
- `pip list --outdated`
- `cargo outdated` (if installed)
- `go list -u -m all`
- Present as a table: package, current, wanted, latest, type (major/minor/patch).

### Security Audit
- `npm audit` / `yarn audit` / `pnpm audit`
- `pip audit` / `safety check`
- `cargo audit`
- `govulncheck ./...`
- Categorize findings by severity (critical, high, medium, low).
- For each vulnerability, show: package, severity, description, fix available.

### Unused Dependencies
- Cross-reference declared dependencies against actual imports in the codebase.
- Check `devDependencies` vs runtime usage.
- Flag dependencies that are declared but never imported.

### Dependency Tree Analysis
- `npm ls --all` / `yarn why <pkg>` / `pnpm why <pkg>`
- `pipdeptree`
- Identify duplicate packages at different versions.
- Find heavy transitive dependencies.

### Upgrade Plan
For major upgrades, generate a plan:
```
1. Upgrade <package> from v2.x to v3.x
   - Breaking changes: <list from changelog>
   - Required code changes: <files affected>
   - Risk: <low/medium/high>
```

3. **Present findings with actionable recommendations.**

## Guidelines

- Always show the impact before suggesting upgrades (breaking changes, migration effort).
- For security vulnerabilities, prioritize by exploitability and exposure, not just CVSS score.
- Suggest pinning strategies: exact versions for apps, ranges for libraries.
- Warn about packages that are unmaintained (no commits in >1 year, deprecated).
- Don't auto-upgrade — always present the plan and get user confirmation.
- Check license compatibility if the user asks or if the project has a LICENSE file.
