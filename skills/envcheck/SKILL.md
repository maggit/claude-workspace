---
name: envcheck
description: "Check environment setup, dependencies, and configuration for issues. Use when the user says /envcheck, asks to verify their environment, diagnose setup issues, check prerequisites, or troubleshoot configuration problems. Triggers: envcheck, environment check, setup check, verify setup, check config, prerequisites, system requirements, doctor, health check."
---

# Environment Check

Diagnose environment setup, dependencies, and configuration.

## Workflow

1. **Detect the project type** from manifest files and directory structure.

2. **Run checks by category:**

### Runtime & Tools
- Language version: `node -v`, `python3 --version`, `go version`, `rustc --version`, `java -version`.
- Package manager: `npm -v`, `yarn -v`, `pnpm -v`, `pip --version`, `cargo --version`.
- Required CLI tools: `git`, `docker`, `gh`, framework CLIs.
- Compare against version requirements in `.nvmrc`, `.python-version`, `.tool-versions`, `engines` field, etc.

### Dependencies
- Are dependencies installed? Check for `node_modules/`, `venv/`, `vendor/`.
- Are lockfiles up to date? Compare `package.json` vs `package-lock.json` timestamps.
- Any missing native dependencies? (e.g., `sharp`, `bcrypt`, `psycopg2`).

### Configuration
- Required environment variables: scan `.env.example`, `.env.template`, or code for `process.env.*`, `os.environ.*`.
- Compare against actual `.env` file — report missing variables.
- Config file validity: JSON/YAML syntax, required fields.

### Services
- Database connectivity: check if expected port is open (`pg`, `mysql`, `redis`, `mongo`).
- Docker: `docker compose ps` if `docker-compose.yml` exists.
- Required services running.

### Permissions & Paths
- File permissions on scripts, SSH keys.
- PATH includes required directories.
- Write permissions on output directories.

3. **Present results as a checklist:**

```
Environment Check Results
=========================
[PASS] Node.js v20.11.0 (required: >=18)
[PASS] npm v10.2.0
[PASS] Dependencies installed (node_modules exists)
[WARN] Lockfile is 3 days older than package.json — consider running npm install
[FAIL] Missing env var: DATABASE_URL (required by src/db.ts)
[FAIL] PostgreSQL not reachable on localhost:5432
[PASS] Docker running
[PASS] Git configured (user.name and user.email set)

3 passed, 1 warning, 2 failures
```

## Guidelines

- Use color-coded symbols: PASS, WARN, FAIL.
- For each failure, include the fix command or action needed.
- Run non-destructive checks only — never modify the environment.
- Check project-specific requirements first (from docs or config), then general tooling.
- If a `.env.example` exists, use it as the source of truth for required variables.
