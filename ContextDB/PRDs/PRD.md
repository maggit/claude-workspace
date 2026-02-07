## PRD: Claude Starter Kit (installable repo for new projects)

### 1) Goal

Create a public (or private) GitHub repository that works like “dotfiles for Claude”, installable into any existing or new project directory. The installer should:

* Scaffold a standard Claude workspace layout (Markdown vault + templates)
* Generate / update `CLAUDE.md` with your preferred instructions and skill setup
* Copy in a curated set of “skills” (promptable mini playbooks) and templates
* Be idempotent (safe to run multiple times)
* Be easy to customize via JSON/YAML config
* Be friendly for ContextLoom: a consistent taxonomy so the app can traverse and render fast

### 2) Non-goals

* No cloud services required
* No authentication
* No dependency on Claude proprietary APIs
* No complex UI (optional TUI later, but not required)

---

## 3) User stories

### Primary

1. As a user, I can run one command in a new folder and get a ready Claude workspace.
2. As a user, I can run the command in an existing repo and it will merge safely (not overwrite without backups).
3. As a user, I can customize what gets installed (skills, folder names, file naming conventions).
4. As a user, I can update the workspace later (pull new templates/skills) without losing my customizations.

### Secondary

5. As a user, I can choose a “profile” (e.g., default, engineering, product, marketing) that changes the included skills/templates.
6. As a user, I can validate my workspace layout (lint/check command) to keep it consistent.

---

## 4) Installation UX (one-liners)

Support at least these flows:

### Option A: npx (recommended)

* `npx @your-scope/claude-starter init`
* Prompts for: project name, profile, location of vault, overwrite policy
* Works without global install

### Option B: curl | bash (simple)

* `curl -fsSL https://.../install.sh | bash`
* Equivalent to `init`

### Option C: git template (no Node needed)

* `git clone ... && ./bin/claude-starter init`
* Minimal dependencies, uses bash script

Pick A as the “happy path”, but keep B/C available.

---

## 5) Repo structure

**Repository root**

* `packages/cli` (Node/TS CLI)
* `templates/` (workspace templates + CLAUDE.md templates)
* `skills/` (your curated skills library)
* `profiles/` (profile manifests listing which skills/templates to install)
* `bin/` (shell wrappers)
* `docs/` (README, usage, customization)

**Target installed workspace layout (in user’s project)**

* `CLAUDE.md` (generated; with safe merge markers)
* `.claude/`

  * `config.json` (user-editable settings)
  * `profiles/active.json` (what got installed + versions)
  * `skills/` (copied from starter kit)
  * `templates/` (PRD/spec templates, checklists)
  * `snippets/` (reusable text blocks)
  * `logs/` (optional; installer logs)
* `vault/` (or user-chosen name) — Markdown repository for ContextLoom

  * `00_inbox/`
  * `01_requirements/`
  * `02_specs/`
  * `03_plans/`
  * `04_notes/`
  * `05_decisions/`
  * `06_summaries/`
  * `07_meetings/`
  * `08_todos/`
  * `README.md` (taxonomy explanation + naming rules)
  * `_index.md` (optional navigation hub)

> Make vault path configurable; default `vault/`.

---

## 6) Claude.md content spec

The generated `CLAUDE.md` must include:

### A) Workspace intent + rules

* Claude should treat `vault/` as the canonical knowledge base
* Claude should follow taxonomy for creating new docs
* Claude should prefer linking to existing docs before creating duplicates
* Claude should keep documents short, named consistently, with front matter

### B) Taxonomy + naming conventions

* Folder map (00_inbox … 08_todos)
* Naming rule example: `YYYY-MM-DD_topic_slug.md`
* Standard front matter (optional):

  * `title`, `date`, `tags`, `status`, `owner`

### C) Skills setup

Explain the “skills” concept in your repo:

* Skills live in `.claude/skills/`
* How Claude should use them:

  * When asked for PRDs → use PRD skill template
  * When asked for implementation plan → use plan skill
  * When asked for summaries → use summary skill
  * When asked for requirements → use requirements skill
  * When asked for todos → use todo skill
  * When asked for specs → use engineering spec skill

### D) ContextLoom compatibility

* The vault is organized for fast traversal; keep index files small
* Prefer appending to existing docs and keeping “_index.md” updated

### E) Safe merge markers

If `CLAUDE.md` already exists, installer should:

* Insert a clearly-delimited “Claude Starter Kit” section
* Not destroy user content
* Offer `--overwrite` to fully replace (with backup)

---

## 7) Skills library (initial set)

Create a curated set of skills as Markdown files stored in the starter kit repo, installed into `.claude/skills/`. Keep them short, “copy/paste ready”, with a consistent format:

* `prd.md` — PRD template + checklist
* `eng-spec.md` — technical spec template (APIs, DB, events, risks)
* `requirements.md` — requirements gathering template
* `todo.md` — actionable TODO list generator format
* `summary.md` — structured summary format
* `meeting-notes.md` — agenda + notes + decisions + actions
* `release-plan.md` — phases, milestones, rollout, comms
* `seo-brief.md` — SEO page brief template (for your marketing work)
* `landing-page-copy.md` — conversion-focused landing page copy template

Each skill file should include:

* Purpose
* When to use
* Inputs to ask for (if missing)
* Output format
* Example

---

## 8) Profiles

Profiles define which skills/templates get installed.

Example profiles:

* `default`
* `engineering-exec`
* `indie-maker`
* `marketing`

Each profile is a JSON manifest:

* `name`
* `vaultFolders` overrides (optional)
* `skills[]` list
* `templates[]` list
* `claudeMdTemplate` (which base template to use)

---

## 9) CLI requirements

### Commands

* `init`
  Creates layout in current directory (or `--dir path`). Generates/merges `CLAUDE.md`. Copies skills/templates. Creates vault skeleton.
* `update`
  Updates `.claude/skills` and `.claude/templates` based on installed profile/version, without overwriting user-modified files unless `--force`.
* `doctor`
  Validates expected structure, checks for missing folders, suggests fixes.
* `print-claude-md`
  Outputs the computed `CLAUDE.md` to stdout for review/debug.

### Flags

* `--dir <path>`
* `--profile <name>`
* `--vault <path>` (default `vault`)
* `--overwrite` (replace `CLAUDE.md` and templates, but always back up)
* `--force` (overwrite user-modified managed files)
* `--dry-run`
* `--yes` (no prompts)

### Idempotency and backups

* On overwrite/force, create backups:

  * `CLAUDE.md.bak.<timestamp>`
  * `.claude/skills/<file>.bak.<timestamp>` if overwriting
* Track managed files and hashes in `.claude/profiles/active.json`

---

## 10) Config spec

### `.claude/config.json`

Fields:

* `version`
* `vaultPath`
* `profile`
* `managedFiles` (map of file -> lastInstalledHash)
* `namingConvention` (string)
* `frontMatter` (enabled + fields)
* `contextloom` (hints: preferred index file names)

### Precedence

CLI flags > existing `.claude/config.json` > profile defaults > hard defaults

---

## 11) Templates (besides skills)

Include `.claude/templates/` with:

* `PRD_TEMPLATE.md`
* `ENG_SPEC_TEMPLATE.md`
* `DECISION_RECORD_TEMPLATE.md` (ADR-like)
* `WEEKLY_REVIEW_TEMPLATE.md`
* `PROJECT_INDEX_TEMPLATE.md`

Also include `vault/README.md` describing taxonomy + examples.

---

## 12) Tech choices

* CLI: Node.js + TypeScript
* Package manager: pnpm (or npm if you want simplest)
* Build: tsup or esbuild
* Prompting: use `inquirer` or `prompts` for interactive init
* Hashing: `crypto` (built-in)
* File ops: `fs-extra` or native `fs/promises`

Deliver as a publishable npm package (even if you keep it private).

---

## 13) Acceptance criteria

* Running `npx ... init` in an empty folder creates:

  * `CLAUDE.md`
  * `.claude/` with config, skills, templates
  * `vault/` with taxonomy folders + README
* Running `init` again produces no destructive changes and reports “already configured”.
* Running `init` in an existing repo merges `CLAUDE.md` without deleting user text.
* `update` upgrades managed skills/templates and preserves user edits unless forced.
* `doctor` reports missing folders/files and prints exact fix commands.
* All commands work on macOS (required), and ideally Linux.

---

## 14) Deliverables

1. GitHub repo with:

   * CLI package ready to run via `npx`
   * Templates + skills + profiles
   * README with:

     * install commands
     * customizing profile/config
     * how ContextLoom uses the vault
2. Example demo folder under `examples/` showing expected output

---

## 15) README outline (must be generated)

* What it is / why
* Quickstart (npx init)
* What it installs (tree)
* How taxonomy works (ContextLoom-friendly)
* Profiles
* Customization (`.claude/config.json`)
* Update flow
* Troubleshooting / doctor
* Contributing / adding skills

---

## 16) Implementation plan (Claude Code should follow)

Phase 1 (MVP):

* Template files + default profile
* CLI `init` + safe merge into `CLAUDE.md`
* Config file write
* Vault scaffold
* `doctor` minimal checks

Phase 2:

* `update` with managed file hashing
* Additional profiles
* `dry-run`, `--yes`
* Better merge strategy for `CLAUDE.md` (section replacement by markers)


