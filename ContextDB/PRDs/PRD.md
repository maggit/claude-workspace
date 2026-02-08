# PRD: Claude Workstation (`@claude-workstation/cli`)

> Dotfiles for Claude — scaffold structured AI workspaces into any project with one command.
>
> **Package:** `@claude-workstation/cli` v0.1.0
> **Status:** MVP complete (Phase 1 + partial Phase 2)
> **Last updated:** 2026-02-07

---

## 1) Goal

A public GitHub repository and npm package that works like "dotfiles for Claude", installable into any existing or new project directory. The CLI:

* Scaffolds a standard Claude workspace layout (ContextDB vault + templates)
* Generates `CLAUDE.example.md` with profile-specific instructions and skill references
* Copies a curated set of 32 "skills" (promptable Markdown playbooks) and 5 document templates
* Is fully idempotent via SHA-256 hash tracking (safe to run multiple times)
* Supports 4 profiles for different workflows (default, engineering-exec, indie-maker, marketing)
* Provides a `doctor` command to validate workspace health

## 2) Non-goals

* No cloud services required
* No authentication
* No dependency on Claude proprietary APIs
* No complex UI (optional TUI later, but not required)

---

## 3) User stories

### Implemented

1. As a user, I can run `npx @claude-workstation/cli init` in any folder and get a ready Claude workspace.
2. As a user, I can run init in an existing repo and it merges safely — never overwrites `CLAUDE.md`, creates `.bak` backups when using `--force`.
3. As a user, I can choose a profile (`default`, `engineering-exec`, `indie-maker`, `marketing`) that tailors the installed skills and templates.
4. As a user, I can validate my workspace with `doctor` to catch missing files, broken config, or incomplete setup.
5. As a user, I can preview the generated `CLAUDE.md` content with `print-claude-md` before committing to a profile.
6. As a user, I can run `init` again and it skips unchanged files, detects user-modified files, and only updates what's needed.
7. As a user, I can use `--dry-run` to see what would change without modifying anything.
8. As a user, I can use `--yes` to skip interactive prompts for CI/scripted workflows.

### Not yet implemented

9. As a user, I can run `update` to pull new skills/templates without re-running full init.
10. As a user, I can customize vault folder names via config overrides.

---

## 4) Installation UX

### Primary: npx (implemented)

```bash
npx @claude-workstation/cli init
```

* Prompts for profile and vault name (interactive)
* Works without global install
* Supports `--yes` for non-interactive mode

### Local development

```bash
node packages/cli/dist/bin.js init --yes --dir /tmp/test
```

### Not implemented

* `curl | bash` installer
* Git template clone flow

---

## 5) Repository structure

### Monorepo root

```
claude-workspace/
├── packages/cli/              # Main CLI package (TypeScript, ESM)
│   ├── src/                   # Source code
│   │   ├── bin.ts             # Entry point
│   │   ├── cli.ts             # Commander program setup
│   │   ├── constants.ts       # App constants (profiles, vault folders)
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── commands/          # CLI command definitions (flag parsing only)
│   │   ├── actions/           # Command orchestrators (business logic)
│   │   ├── services/          # Individual concerns (profiles, scaffold, config)
│   │   ├── utils/             # Shared utilities (fs, logger, paths)
│   │   └── __tests__/         # Vitest test files (6 files, 44+ tests)
│   ├── assets/                # Built assets (copied at build time, DO NOT edit)
│   └── dist/                  # Compiled output
├── skills/                    # Canonical skill source (32 skills)
├── templates/                 # Canonical template source (5 templates)
├── profiles/                  # Profile definitions (4 JSON files)
├── scripts/copy-assets.js     # Build script: copies sources → assets/
└── ContextDB/                 # Project knowledge vault
```

### Installed workspace layout (in user's project)

```
project/
├── CLAUDE.example.md              # Generated; user renames to CLAUDE.md
├── .claude/
│   ├── config.json                # Workspace configuration
│   ├── profiles/
│   │   └── active.json            # Idempotency tracking (SHA-256 hashes)
│   ├── skills/                    # Installed skills
│   │   ├── prd/SKILL.md
│   │   ├── eng-spec/SKILL.md
│   │   ├── todo/SKILL.md
│   │   └── ... (profile-dependent)
│   ├── templates/                 # Document templates
│   │   ├── PRD_TEMPLATE.md
│   │   ├── ENG_SPEC_TEMPLATE.md
│   │   └── ... (profile-dependent)
│   ├── snippets/                  # Reusable text blocks (empty)
│   └── logs/                      # Installer logs (empty)
└── ContextDB/                     # Vault (name configurable via --vault)
    ├── README.md
    ├── _index.md
    ├── 00_inbox/
    ├── 01_specs/
    ├── 02_architecture/
    ├── 03_decisions/
    ├── 04_knowledge/
    ├── 05_prompts/
    ├── 06_agents/
    ├── 07_diagrams/
    └── 08_todos/
```

---

## 6) CLAUDE.md content spec

The CLI generates `CLAUDE.example.md` (never overwrites an existing `CLAUDE.md`). Each profile has its own template with these substitution variables:

| Variable | Rendered as |
|----------|-------------|
| `{{vaultPath}}` | Vault directory name (e.g., `ContextDB`) |
| `{{folderList}}` | Enumerated list of vault taxonomy folders |
| `{{skillInstructions}}` | List of installed skills with descriptions |
| `{{namingConvention}}` | File naming guidelines |

Templates live in `packages/cli/assets/claude-md/<profile>.md` and are profile-specific (default, engineering-exec, indie-maker, marketing).

---

## 7) Skills library (32 skills)

All skills use the directory format `skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`).

### Original 9 (from initial PRD)

| Skill | Description |
|-------|-------------|
| `prd` | Product Requirements Documents |
| `eng-spec` | Engineering Specifications |
| `requirements` | Structured Requirements |
| `todo` | Task Breakdowns |
| `summary` | Summaries and Recaps |
| `meeting-notes` | Meeting Notes |
| `release-plan` | Release Plans |
| `seo-brief` | SEO Content Briefs |
| `landing-page-copy` | Landing Page Copy |

### 23 additional skills (added in Phase 1)

| Skill | Description |
|-------|-------------|
| `adr` | Architecture Decision Records |
| `apidoc` | API Documentation |
| `changelog` | Changelog Generation |
| `commit` | Commit Message Generation |
| `completetodo` | Complete TODO Items |
| `createtodo` | Create TODO Items |
| `deadcode` | Dead Code Detection |
| `debug` | Debugging Assistant |
| `deps` | Dependency Management |
| `e2e` | End-to-End Testing |
| `envcheck` | Environment Configuration Check |
| `explain` | Code Explanation |
| `migration` | Database/Code Migrations |
| `openpr` | Open Pull Request |
| `opentodos` | List Open TODOs |
| `perf` | Performance Analysis |
| `readme` | README Generation |
| `rebase` | Git Rebase Assistant |
| `release` | Release Management |
| `standup` | Standup Report Generation |
| `storecontext` | Store Context to Vault |
| `test` | Test Writing |
| `testcoverage` | Test Coverage Analysis |

---

## 8) Profiles (4 implemented)

Each profile is a JSON manifest in `profiles/<name>.json` specifying which skills and templates to install.

| Profile | Skills | Templates | Description |
|---------|--------|-----------|-------------|
| `default` | 32 (all) | 5 (all) | Full workspace with all skills and templates |
| `engineering-exec` | 28 | 5 | Engineering leadership — specs, planning, and requirements |
| `indie-maker` | 20 | 3 | Solo builders — lean planning, shipping, and iteration |
| `marketing` | 15 | 3 | Content and marketing — copy, SEO, and communication |

### Profile JSON schema

```json
{
  "name": "string",
  "description": "string",
  "skills": ["skill-name", ...],
  "templates": ["TEMPLATE_NAME.md", ...],
  "claudeMdTemplate": "profile-name.md"
}
```

---

## 9) CLI commands and flags

### `init` — Scaffold workspace

Creates `.claude/` directory, copies skills/templates, scaffolds vault, generates `CLAUDE.example.md`.

**Flags:**
| Flag | Default | Description |
|------|---------|-------------|
| `-d, --dir <path>` | `.` (cwd) | Target directory |
| `-p, --profile <name>` | `default` | Profile to use |
| `--vault <name>` | `ContextDB` | Vault folder name |
| `--force` | `false` | Overwrite user-modified files (with `.bak` backup) |
| `--dry-run` | `false` | Show what would be done without changes |
| `-y, --yes` | `false` | Skip interactive prompts |

**Execution flow:**
1. Interactive prompts (profile, vault name) — skipped with `--yes`
2. Load profile definition from JSON
3. Read existing `active.json` for idempotency
4. Scaffold `.claude/` directory (skills/, templates/, snippets/, logs/, profiles/)
5. Copy skills as `skills/<name>/SKILL.md` with SHA-256 hashing
6. Copy templates to `templates/`
7. Scaffold vault (9 numbered subdirectories with `.gitkeep`)
8. Generate `CLAUDE.example.md` from profile template
9. Write `.claude/config.json` and `.claude/profiles/active.json`
10. Print summary with next steps

### `doctor` — Validate workspace

Runs 9 health checks and reports pass/fail with suggested fixes.

**Flags:**
| Flag | Default | Description |
|------|---------|-------------|
| `-d, --dir <path>` | `.` (cwd) | Target directory |

**Checks performed:**
1. `.claude/` directory exists
2. `config.json` is valid
3. `active.json` exists
4. All profile skills present at `.claude/skills/<name>/SKILL.md`
5. All profile templates present in `.claude/templates/`
6. Profile can be loaded
7. Vault directory exists
8. All 9 vault subfolders exist
9. `CLAUDE.md` or `CLAUDE.example.md` present

### `print-claude-md` — Preview generated content

Outputs the rendered `CLAUDE.md` content to stdout.

**Flags:**
| Flag | Default | Description |
|------|---------|-------------|
| `-p, --profile <name>` | `default` | Profile to use |
| `--vault <name>` | `ContextDB` | Vault folder name |

### `update` — Not yet implemented

Planned: update managed skills/templates based on installed profile without re-running full init.

---

## 10) Config spec

### `.claude/config.json`

```typescript
interface ClaudeConfig {
  version: string;      // CLI version used
  profile: string;      // Active profile name
  vaultPath: string;    // Vault directory name (e.g., "ContextDB")
  createdAt: string;    // ISO timestamp of first init
  updatedAt: string;    // ISO timestamp of last init
}
```

### `.claude/profiles/active.json`

```typescript
interface ActiveProfile {
  profile: string;             // Current profile name
  installedAt: string;         // ISO timestamp
  managedFiles: ManagedFile[]; // Array of tracked files
}

interface ManagedFile {
  path: string;   // Relative path (e.g., "skills/prd/SKILL.md")
  hash: string;   // SHA-256 hash of file content
}
```

### Precedence

CLI flags > existing `.claude/config.json` > profile defaults > hard defaults

---

## 11) Templates (5 implemented)

Installed into `.claude/templates/`:

| Template | Purpose |
|----------|---------|
| `PRD_TEMPLATE.md` | Product Requirements Document |
| `ENG_SPEC_TEMPLATE.md` | Engineering Specification |
| `DECISION_RECORD_TEMPLATE.md` | Architecture Decision Record (ADR) |
| `WEEKLY_REVIEW_TEMPLATE.md` | Weekly Review |
| `PROJECT_INDEX_TEMPLATE.md` | Project Index / Navigation Hub |

---

## 12) Vault taxonomy (ContextDB)

Default name: `ContextDB` (configurable via `--vault`).

| Folder | Purpose |
|--------|---------|
| `00_inbox/` | Unsorted notes, quick captures |
| `01_specs/` | Requirements, PRDs, feature specs |
| `02_architecture/` | System design, technical specs, diagrams |
| `03_decisions/` | Architecture Decision Records (ADRs) |
| `04_knowledge/` | Reusable concepts, reference material |
| `05_prompts/` | LLM prompts, prompt templates |
| `06_agents/` | Agent roles, rules, memory, configuration |
| `07_diagrams/` | Mermaid diagrams, visual references |
| `08_todos/` | Task lists, backlogs, sprint plans |

Each subfolder is created with a `.gitkeep` placeholder. Includes a `README.md` and `_index.md` at the vault root.

---

## 13) Idempotency mechanism

The scaffold system tracks every managed file via SHA-256 hashing in `.claude/profiles/active.json`.

**On first run:** Copy all files, compute and store hashes.

**On subsequent runs:**
| Scenario | Behavior |
|----------|----------|
| File doesn't exist | Create it |
| File exists, hash matches source | Skip (unchanged) |
| File exists, hash differs from source but matches previous install hash | Update (source changed, user didn't modify) |
| File exists, hash differs from both source and previous hash (user modified) | Skip with warning |
| User-modified file + `--force` flag | Create `.bak` backup, then overwrite |

**Dry-run mode:** Logs all operations as "Would create/update..." without writing anything.

---

## 14) Tech stack (implemented)

| Concern | Choice |
|---------|--------|
| Runtime | Node.js >= 18 |
| Language | TypeScript (strict, ESM) |
| Build | tsup (ESM, sourcemaps, shebang injection) |
| Test | Vitest (6 files, 44+ tests, 30s timeout) |
| CLI framework | Commander |
| Styling | Chalk |
| Spinners | Ora |
| Prompting | Prompts |
| File ops | fs-extra |
| Hashing | Node.js `crypto` (built-in) |
| Package manager | pnpm |

---

## 15) Build pipeline

```
pnpm build
  1. scripts/copy-assets.js
     - Cleans packages/cli/assets/ destination dirs
     - Copies skills/ → packages/cli/assets/skills/
     - Copies templates/ → packages/cli/assets/templates/
     - Copies profiles/ → packages/cli/assets/profiles/
  2. tsup compiles TypeScript → packages/cli/dist/
```

**Important:** Never edit files in `packages/cli/assets/` directly — they are overwritten on every build. Edit canonical sources at the monorepo root.

---

## 16) Architecture

Source is layered with clear separation of concerns:

```
commands/   → CLI flag parsing (Commander definitions)
    ↓
actions/    → Command orchestrators (business logic coordination)
    ↓
services/   → Individual concerns (single-responsibility modules)
    ↓
utils/      → Shared helpers (fs, logger, paths)
```

### Key services

| Service | Responsibility |
|---------|---------------|
| `profiles.ts` | Load and validate profile definitions from JSON |
| `scaffold-claude-dir.ts` | Copy skills/templates with SHA-256 hash tracking |
| `scaffold-vault.ts` | Create vault directory structure with subfolders |
| `claude-md.ts` | Generate CLAUDE.md content from profile templates |
| `config.ts` | Read/write `.claude/config.json` |
| `active-profile.ts` | Manage `.claude/profiles/active.json` idempotency state |
| `prompts.ts` | Interactive CLI prompts for init |

---

## 17) Testing

* **Framework:** Vitest with 30s timeout per test
* **Location:** `packages/cli/src/__tests__/` (6 test files)
* **Test count:** 44+ tests
* **Approach:** Each test uses isolated temp directories, cleaned per test

**Coverage areas:**
* Idempotency (hash-based skip, update, force-overwrite)
* File preservation (user-modified files not destroyed)
* Dry-run mode (no side effects)
* Profile loading and validation
* Full scaffold flow (skills, templates, vault, config)
* Doctor checks

---

## 18) Acceptance criteria — current status

| Criterion | Status |
|-----------|--------|
| `npx init` creates CLAUDE.example.md, .claude/, and vault | Done |
| Running `init` again is idempotent (skips unchanged, warns on modified) | Done |
| `--force` overwrites with `.bak` backup | Done |
| `--dry-run` shows changes without writing | Done |
| `--yes` skips prompts | Done |
| 4 profiles with tailored skill/template sets | Done |
| `doctor` validates 9 workspace health checks | Done |
| `print-claude-md` previews generated content | Done |
| `update` command for incremental skill/template updates | Not started |
| `curl \| bash` installer | Not planned |
| Example demo folder under `examples/` | Not started |

---

## 19) What's next (Phase 2 backlog)

* `update` command — update managed skills/templates without full re-init
* Profile switching — change profile on an existing workspace
* Custom skill authoring — documentation and tooling for user-created skills
* `examples/` directory — demo output for each profile
* CI publishing — automated npm publish workflow
* Better CLAUDE.md merge — section-level replacement via markers for existing CLAUDE.md files
