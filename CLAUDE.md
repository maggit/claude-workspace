# Claude Workstation

Dotfiles for Claude — scaffold structured AI workspaces into any project with one command.

## Project Overview

CLI tool (`@claude-workstation/cli`) that installs curated skills (Markdown playbooks), document templates, and a structured knowledge vault (ContextDB) into any project's `.claude/` directory.

## Monorepo Structure

```
claude-workspace/
├── packages/cli/          # Main CLI package (TypeScript, ESM)
│   ├── src/               # Source code
│   │   ├── bin.ts         # Entry point
│   │   ├── cli.ts         # Commander program setup
│   │   ├── constants.ts   # App constants (profiles, vault folders, etc.)
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── commands/      # CLI command definitions (flag parsing only)
│   │   ├── actions/       # Command orchestrators (business logic)
│   │   ├── services/      # Individual concerns (profiles, scaffold, config)
│   │   ├── utils/         # Shared utilities (fs, logger, paths)
│   │   └── __tests__/     # Vitest test files
│   ├── assets/            # Built assets (copied at build time, DO NOT edit directly)
│   └── dist/              # Compiled output
├── skills/                # Canonical skill source — edit skills here
├── templates/             # Canonical template source — edit templates here
├── profiles/              # Profile definitions (JSON) — edit profiles here
├── scripts/copy-assets.js # Build script: copies skills/templates/profiles → assets/
└── ContextDB/             # Example knowledge vault
```

## Build Pipeline

```bash
pnpm build    # 1. copy-assets.js copies skills/templates/profiles → packages/cli/assets/
              # 2. tsup compiles TypeScript → packages/cli/dist/
```

`copy-assets.js` cleans destination directories before copying to prevent stale files. **Never edit files inside `packages/cli/assets/` directly** — they are overwritten on every build.

## Commands

```bash
pnpm build              # Build everything
pnpm test               # Run all tests (Vitest)
pnpm clean              # Remove dist and assets
```

### Local testing

```bash
node packages/cli/dist/bin.js init --yes --dir /tmp/test
node packages/cli/dist/bin.js doctor --dir /tmp/test
node packages/cli/dist/bin.js print-claude-md --profile default
```

## CLI Commands

| Command | Purpose |
|---------|---------|
| `init` | Scaffold workspace (skills, templates, vault, CLAUDE.example.md) |
| `doctor` | Verify workspace health (files, config, hashes) |
| `print-claude-md` | Preview CLAUDE.md content for a profile |

## Architecture

Source is layered: **commands/** (CLI parsing) → **actions/** (orchestration) → **services/** (business logic) → **utils/** (shared helpers).

Key services:
- `profiles.ts` — load profile definitions from JSON
- `scaffold-claude-dir.ts` — copy skills/templates with SHA-256 hash tracking
- `scaffold-vault.ts` — create vault directory structure
- `claude-md.ts` — generate CLAUDE.md content from templates
- `config.ts` — read/write `.claude/config.json`
- `active-profile.ts` — idempotency via `.claude/profiles/active.json`

## Skills

32 skills in `skills/<name>/SKILL.md` format with YAML frontmatter (`name`, `description`). Each skill is a self-contained Markdown playbook.

When adding a skill:
1. Create `skills/<name>/SKILL.md` with YAML frontmatter
2. Add `<name>` to relevant profile(s) in `profiles/*.json`
3. Run `pnpm build`

## Profiles

4 profiles in `profiles/*.json`, each specifying which skills and templates to install:

| Profile | Skills | Templates |
|---------|--------|-----------|
| `default` | 32 (all) | 5 (all) |
| `engineering-exec` | 28 | 5 |
| `indie-maker` | 20 | 3 |
| `marketing` | 15 | 3 |

When adding a profile:
1. Create `profiles/<name>.json`
2. Create `packages/cli/assets/claude-md/<name>.md` template
3. Add to `PROFILES` array in `packages/cli/src/constants.ts`

## Idempotency

Init tracks SHA-256 hashes of all managed files in `.claude/profiles/active.json`. Re-running init skips unmodified files, warns on user-modified files, and supports `--force` (with `.bak` backup).

`CLAUDE.example.md` is always written — never overwrites an existing `CLAUDE.md`.

## Testing

- 6 test files, 44+ tests in `packages/cli/src/__tests__/`
- Framework: Vitest with 30s timeout
- Tests use temp directories, cleaned per test
- Coverage: idempotency, file preservation, dry-run, profiles, scaffold flow

## Tech Stack

- **Runtime:** Node.js >= 18
- **Language:** TypeScript (strict, ESM)
- **Build:** tsup (ESM, sourcemaps, shebang injection)
- **Test:** Vitest
- **CLI:** Commander + Chalk + Ora + Prompts
- **FS:** fs-extra

## ContextDB — Project context repository

This project uses a `ContextDB/` directory (managed by ContextLoom) as a local context repository. It is the **canonical place** for all long-lived project context.

### Folder Taxonomy

ContextDB/
├─ README.md          ← ContextDB overview (do not modify)
├─ 00_index/          ← Entry points, overviews, maps
├─ 01_specs/          ← Requirements, PRDs, feature specs
├─ 02_architecture/   ← System design, data flow, components
├─ 03_decisions/      ← Architecture Decision Records (ADRs), tradeoffs
├─ 04_knowledge/      ← Reusable concepts & explanations
├─ 05_prompts/        ← Reusable LLM prompts & system instructions
├─ 06_agents/         ← Agent roles, rules, memory
├─ 07_diagrams/       ← Mermaid diagrams (one per file)
├─ 08_logs/           ← Append-only logs, session summaries, changelogs
├─ 99_scratch/        ← Drafts, temporary thinking, WIP notes
└─ todos/             ← TODO lists and task tracking

Numeric prefixes preserve intentional ordering and make traversal predictable.

### Routing — Where to put things

When the user asks you to save, update, or generate context, route to the correct folder:

| User says | Target folder | Example filename |
|---|---|---|
| "save/update the PRD", "write a spec", "document requirements" | `01_specs/` | `neuromint-prd.md`, `export-feature-spec.md` |
| "document the architecture", "explain how X works" | `02_architecture/` | `auth-flow.md`, `ingestion-pipeline.md` |
| "record this decision", "why did we choose X", "create an ADR" | `03_decisions/` | `2026-02-07-prisma-downgrade.md` |
| "save this knowledge", "document this pattern" | `04_knowledge/` | `stripe-webhook-patterns.md` |
| "save this prompt", "store the system prompt", "save latest prompt" | `05_prompts/` | `code-review-prompt.md` |
| "save agent config", "store agent instructions" | `06_agents/` | `categorization-agent.md` |
| "create a diagram", "draw this flow" | `07_diagrams/` | `onboarding-flow.mmd.md` |
| "save a summary", "log this session", "store context", "update context" | `08_logs/` | `2026-02-07-session-summary.md` |
| "jot this down", "scratch notes", "draft" | `99_scratch/` | `billing-ideas.md` |
| "create a todo", "track these tasks" | `todos/` | `2026-02-07-refactor-tasks.md` |
| "update the index", "add an overview" | `00_index/` | `project-map.md` |

### Reading context
- Before starting work, check `ContextDB/` for relevant notes, decisions, and specs
- Read `ContextDB/README.md` to understand folder structure and conventions
- Check `00_index/` for project maps and entry points
- Check for existing files before creating new ones (prefer appending)

### Writing context
- Route files to the correct taxonomy folder (see table above)
- Use descriptive filenames — date-prefix when chronology matters: `2026-02-07-auth-decision.md`
- Always **append** to existing files rather than overwriting, unless explicitly instructed
- Do **not** delete files without explicit user permission
- Create taxonomy folders on first use if they don't exist yet

### Conventions
- Plain Markdown only (`.md`)
- Include a `# Title` heading in every file
- Use relative links to reference other files: `[see spec](../01_specs/export-spec.md)`
- Prefer **small, composable files** over large monoliths
- Do not create files outside `ContextDB/` without user permission
