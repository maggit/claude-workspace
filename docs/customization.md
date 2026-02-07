# Customization

## Custom Profiles

Profiles are JSON files in `profiles/` that define which skills and templates to install. To create a custom profile:

1. Copy an existing profile:
   ```bash
   cp profiles/default.json profiles/my-team.json
   ```

2. Edit the profile to select your skills and templates:
   ```json
   {
     "name": "my-team",
     "description": "Custom profile for my team",
     "skills": ["prd.md", "eng-spec.md", "todo.md"],
     "templates": ["PRD_TEMPLATE.md", "ENG_SPEC_TEMPLATE.md"],
     "claudeMdTemplate": "default.md"
   }
   ```

3. Add the profile name to the `PROFILES` array in `packages/cli/src/constants.ts`.

4. Use it:
   ```bash
   claude-workstation init --profile my-team
   ```

## Custom Skills

Skills are Markdown files in `skills/`. Each skill should include:

- **Purpose** — What this skill produces
- **When to Use** — Situations that call for this skill
- **Inputs** — What information Claude needs
- **Output Format** — Structure of the output
- **Example** — A concrete example

To add a skill:

1. Create a new `.md` file in `skills/`.
2. Add the filename to the `skills` array in the profile(s) that should include it.
3. Run `pnpm build` to copy the asset into the CLI package.

## Custom Templates

Templates are Markdown files in `templates/`. They use placeholder brackets (`[...]`) and italic guidance text for sections the user fills in.

To add a template:

1. Create a new `.md` file in `templates/`.
2. Add the filename to the `templates` array in the profile(s) that should include it.

## Vault Folder Names

Change the vault folder name with `--vault`:

```bash
claude-workstation init --vault docs
claude-workstation init --vault knowledge-base
```

The internal folder taxonomy (`00_inbox`, `01_specs`, etc.) remains the same regardless of the vault name.

## CLAUDE.md Templates

CLAUDE.md templates live in `packages/cli/assets/claude-md/`. They use `{{variable}}` placeholders that are interpolated at build time:

| Placeholder | Value |
|-------------|-------|
| `{{vaultPath}}` | Vault folder name |
| `{{folderList}}` | Formatted list of vault folders |
| `{{skillInstructions}}` | List of installed skills |
| `{{namingConvention}}` | File naming rules |

To create a custom template, add a `.md` file to `packages/cli/assets/claude-md/` and reference it in your profile's `claudeMdTemplate` field.

## Modifying Installed Files

After initialization, you can freely edit any file in `.claude/`. Claude Workstation tracks managed files via SHA-256 hashes in `.claude/profiles/active.json`. On re-run:

- **Unmodified files** are skipped (already up to date)
- **User-modified files** are preserved unless `--force` is used
- **`--force`** creates a `.bak` backup before overwriting
