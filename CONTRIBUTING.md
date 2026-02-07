# Contributing to Claude Workstation

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/claude-workstation.git
   cd claude-workstation
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Build:**
   ```bash
   pnpm build
   ```

4. **Run tests:**
   ```bash
   pnpm test
   ```

## Project Structure

```
claude-workstation/
├── skills/                  # Skill markdown files (canonical source)
├── templates/               # Document templates (canonical source)
├── profiles/                # Profile JSON files (canonical source)
├── scripts/copy-assets.js   # Copies skills/templates/profiles into CLI assets at build time
├── packages/cli/
│   ├── src/
│   │   ├── bin.ts           # CLI entry point
│   │   ├── cli.ts           # Commander program setup
│   │   ├── constants.ts     # Shared constants
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── commands/        # Command definitions (flags, args)
│   │   ├── actions/         # Command orchestrators (business logic)
│   │   ├── services/        # Individual services (profiles, scaffold, claude-md, etc.)
│   │   ├── utils/           # Shared utilities (fs, paths, logger)
│   │   └── __tests__/       # Unit and integration tests
│   └── assets/              # Built assets (claude-md templates, vault templates, + copied files)
└── docs/                    # Documentation
```

**Key architectural decisions:**
- **Commands vs Actions vs Services** — Commands define CLI flags and call actions. Actions orchestrate the workflow. Services handle individual concerns.
- **Assets at repo root** — Skills, templates, and profiles live at the repo root for easy editing, and are copied into `packages/cli/assets/` at build time.
- **CLAUDE.example.md** — Init always writes `CLAUDE.example.md`, never `CLAUDE.md`, so we never overwrite user content.

## Development Workflow

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes in `packages/cli/src/`.

3. Run tests to verify:
   ```bash
   pnpm test
   ```

4. Build to verify:
   ```bash
   pnpm build
   ```

5. Test manually:
   ```bash
   node packages/cli/dist/bin.js init --yes --dir /tmp/test
   ```

### Adding a Skill

1. Create a new `.md` file in `skills/`.
2. Follow the existing skill structure: Purpose, When to Use, Inputs, Output Format, Example.
3. Add the skill filename to the appropriate profile(s) in `profiles/`.
4. Run `pnpm build` to copy it into assets.
5. Add a test or update existing tests as needed.

### Adding a Template

1. Create a new `.md` file in `templates/`.
2. Use placeholder brackets and italic guidance text consistent with existing templates.
3. Add the template filename to the appropriate profile(s) in `profiles/`.

### Adding a Profile

1. Create a new `.json` file in `profiles/`.
2. Create a matching CLAUDE.md template in `packages/cli/assets/claude-md/`.
3. Add the profile name to the `PROFILES` array in `packages/cli/src/constants.ts`.

## Code Style

- TypeScript with strict mode
- ESM modules (no CommonJS)
- Prefer `node:` protocol for Node.js built-in imports
- Use `fs-extra` for filesystem operations
- Keep functions small and focused
- No unnecessary abstractions — simplicity over cleverness

## Testing

Tests use [Vitest](https://vitest.dev/) and run against source files (not built output).

```bash
pnpm test              # Run all tests
pnpm --filter @claude-workstation/cli test:watch  # Watch mode
```

- **Unit tests** cover individual services (claude-md, profiles, config, fs-utils, scaffold)
- **Integration tests** run the full init flow in temp directories and verify output

When adding features, include tests that cover:
- The happy path
- Idempotency (running twice produces the same result)
- Edge cases (missing files, existing files, dry-run mode)

## Pull Requests

1. Keep PRs focused — one feature or fix per PR.
2. Include tests for new functionality.
3. Update documentation if the user-facing behavior changes.
4. Ensure `pnpm build && pnpm test` passes.

## Reporting Issues

Open an issue on GitHub with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your Node.js version and OS

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
