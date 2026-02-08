---
name: readme
description: "Generate or update a README.md for a project. Use when the user says /readme, asks to create a README, update project documentation, or add a project overview. Triggers: readme, README, project docs, project documentation, getting started guide, how to use."
---

# README Generator

Generate a comprehensive, well-structured README for any project.

## Workflow

1. **Analyze the project:**
   - Read `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Makefile`, or similar.
   - Scan directory structure for major components.
   - Check for existing README to update rather than replace.
   - Identify the language, framework, and project type.

2. **Gather information:**
   - Project name and description from manifest files.
   - Installation steps from lockfiles and config.
   - Available scripts/commands from `package.json scripts`, `Makefile` targets, etc.
   - Environment variables from `.env.example`, `.env.template`, or code references.
   - License from `LICENSE` file.
   - CI/CD configuration for badges.

3. **Generate the README with these sections:**

### Required Sections

- **Title** — Project name, one-line description, badges (CI, coverage, license, version).
- **Overview** — 2-3 sentences on what the project does and why it exists.
- **Getting Started** — Prerequisites, installation, and first-run instructions.
- **Usage** — Key commands, API examples, or configuration.

### Optional Sections (include if relevant)

- **Architecture** — High-level diagram or description for larger projects.
- **Configuration** — Environment variables, config files.
- **Development** — How to set up a dev environment, run tests, lint, build.
- **Deployment** — How to deploy (if applicable).
- **Contributing** — Guidelines for contributors.
- **License** — License type and link.

4. **If updating an existing README:**
   - Preserve custom content the user has written.
   - Update auto-detectable sections (install steps, commands, env vars).
   - Flag sections that may be outdated.

## Guidelines

- Write for a developer who has never seen the project before.
- Include copy-pasteable commands (with proper shell syntax).
- Use real values from the project, not placeholder text.
- Keep it concise — a README is a quick-start guide, not full documentation.
- Match the tone and style of the existing project documentation.
