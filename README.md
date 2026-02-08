# Claude Workspace

**Dotfiles for Claude** — scaffold a structured AI workspace into any project with one command.

Claude Workspace sets up everything you need to work effectively with Claude: a Markdown knowledge vault, curated skills (promptable playbooks), document templates, and a ready-to-use `CLAUDE.example.md`. It's idempotent, profile-based, and designed for teams and solo builders alike.

---

## Quick Start

```bash
npx @maggit/claude-workspace init
```

That's it. You'll be prompted to pick a profile and vault name, and your workspace is ready.

For non-interactive setup:

```bash
npx @maggit/claude-workspace init --profile engineering-exec --yes
```

## What You Get

```
your-project/
├── CLAUDE.example.md              # Workspace instructions for Claude (rename to CLAUDE.md)
├── .claude/
│   ├── config.json                # Workspace configuration
│   ├── skills/                    # Promptable mini-playbooks
│   │   ├── prd/SKILL.md
│   │   ├── eng-spec/SKILL.md
│   │   └── ...
│   ├── templates/                 # Document templates
│   │   ├── PRD_TEMPLATE.md
│   │   ├── ENG_SPEC_TEMPLATE.md
│   │   └── ...
│   ├── snippets/                  # Your snippets (empty)
│   ├── logs/                      # Your logs (empty)
│   └── profiles/
│       └── active.json            # Tracks installed files for idempotency
└── ContextDB/                     # Markdown knowledge vault
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

## Setting Up CLAUDE.md

Claude Workspace never touches your `CLAUDE.md`. It writes `CLAUDE.example.md` so you stay in control.

**New project** — rename it:

```bash
mv CLAUDE.example.md CLAUDE.md
```

**Existing project with a CLAUDE.md** — open `CLAUDE.example.md` and merge the parts you want (vault references, skill instructions, conventions) into your existing file.

## Profiles

Profiles determine which skills and templates get installed:

| Profile | Skills | Best for |
|---------|--------|----------|
| **default** | All 9 skills, all 5 templates | Full workspace — everything included |
| **engineering-exec** | PRD, eng-spec, requirements, todo, release-plan | Engineering leads and architects |
| **indie-maker** | PRD, todo, summary, release-plan | Solo builders shipping fast |
| **marketing** | PRD, SEO brief, landing page copy, summary, meeting notes | Content and growth teams |

```bash
# Use a specific profile
cws init --profile marketing
```

## Skills

Skills are Markdown playbooks that teach Claude how to produce specific document types. They live in `.claude/skills/` and are referenced by name:

| Skill | Produces |
|-------|----------|
| `prd.md` | Product Requirements Documents |
| `eng-spec.md` | Engineering Specifications |
| `requirements.md` | Structured Requirements |
| `todo.md` | Task Breakdowns |
| `summary.md` | Summaries and Recaps |
| `meeting-notes.md` | Meeting Notes |
| `release-plan.md` | Release Plans |
| `seo-brief.md` | SEO Content Briefs |
| `landing-page-copy.md` | Landing Page Copy |

## Commands

### `init`

Scaffold a workspace. Safe to run multiple times — existing files are preserved, unchanged managed files are skipped.

```bash
cws init [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-d, --dir <path>` | Target directory | `.` |
| `-p, --profile <name>` | Profile | `default` |
| `--vault <name>` | Vault folder name | `ContextDB` |
| `--force` | Overwrite user-modified managed files (backs up first) | `false` |
| `--dry-run` | Preview what would happen | `false` |
| `-y, --yes` | Skip prompts, use defaults | `false` |

### `doctor`

Check that your workspace is healthy:

```bash
cws doctor
```

```
PASS  .claude/ directory exists
PASS  config.json valid (profile: default)
PASS  All 9 skill files present
PASS  All 5 template files present
PASS  Vault directory exists: ContextDB/
PASS  All 9 vault subfolders present
PASS  CLAUDE.md present
```

### `add-skill`

Install a single skill without running a full `init`:

```bash
cws add-skill prd
cws add-skill --list
```

| Option | Description | Default |
|--------|-------------|---------|
| `-d, --dir <path>` | Target directory | `.` |
| `--force` | Overwrite existing skill (backs up first) | `false` |
| `--dry-run` | Preview what would happen | `false` |
| `-l, --list` | List all available skills | `false` |

### `print-claude-md`

Preview the CLAUDE.md content for a profile without writing any files:

```bash
cws print-claude-md --profile indie-maker
```

## Installation

### npx (recommended)

```bash
npx @maggit/claude-workspace init
```

### Global install

```bash
npm install -g @maggit/claude-workspace
cws init
```

### Clone and run

```bash
git clone https://github.com/raquelhernandez/claude-workstation.git
cd claude-workstation
pnpm install && pnpm build
node packages/cli/dist/bin.js init --dir ~/my-project
```

## Idempotency

Running `init` again is always safe:

- **Managed files** (skills, templates) are tracked by SHA-256 hash. If the file hasn't changed, it's skipped.
- **User-modified files** are detected and preserved. Use `--force` to overwrite (a `.bak` backup is created first).
- **Unmanaged files** (existing skills not tracked by the CLI) are skipped with a warning. Use `--force` to overwrite, or delete them and re-run.
- **CLAUDE.example.md** is regenerated on each run — it's the reference file, not your working file.
- **Vault folders** are created if missing, never deleted.

## Customization

See [docs/customization.md](docs/customization.md) for:

- Creating custom profiles
- Writing new skills
- Adding templates
- Changing vault structure
- Custom CLAUDE.md templates

## ContextLoom

Claude Workspace is designed to work with [ContextLoom](https://contextloom.app), a Markdown editor for managing project context. The vault taxonomy and file conventions are fully compatible. See [docs/contextloom.md](docs/contextloom.md) for details.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Setting up the development environment
- Adding skills, templates, and profiles
- Code style and testing expectations
- Pull request process

## Development

```bash
pnpm install        # Install dependencies
pnpm build          # Build (copies assets + compiles TypeScript)
pnpm test           # Run all tests
```

## License

[MIT](LICENSE)
