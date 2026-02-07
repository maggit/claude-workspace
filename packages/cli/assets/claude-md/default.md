# Project Workspace

This workspace is managed by [claude-workstation](https://github.com/raquelhernandez/claude-workstation).

## Vault

All project context lives in `{{vaultPath}}/`. This is a structured Markdown vault designed for both humans and AI tools.

### Folder Taxonomy

{{folderList}}

### Naming Conventions

{{namingConvention}}

## Skills

Skills are promptable mini-playbooks installed in `.claude/skills/`. Use them by referencing the skill name when asking Claude to produce a specific document type.

{{skillInstructions}}

## Templates

Document templates are available in `.claude/templates/`. Copy a template to start a new document with the right structure.

## Working Agreements

- Always read relevant context from the vault before starting work
- Write new context documents back to the appropriate vault folder
- Use the installed skills when producing standard document types
- Follow the naming conventions above for new files
- Keep documents small and composable — one topic per file
- Use relative Markdown links between documents
