# Context Vault

This vault is a structured Markdown knowledge base for your project. It is designed to be readable and writable by both humans and AI tools.

## Folder Taxonomy

| Folder | Purpose |
|--------|---------|
| `00_inbox/` | Unsorted notes, quick captures, raw inputs |
| `01_specs/` | Requirements, PRDs, feature specs |
| `02_architecture/` | System design, technical specs, diagrams |
| `03_decisions/` | Architectural Decision Records (ADRs) |
| `04_knowledge/` | Reusable concepts, reference material, guides |
| `05_prompts/` | LLM prompts, prompt templates |
| `06_agents/` | Agent roles, rules, memory, configuration |
| `07_diagrams/` | Mermaid diagrams, visual references |
| `08_todos/` | Task lists, backlogs, sprint plans |

## Naming Conventions

- Use lowercase with hyphens: `my-feature-spec.md`
- Prefix with date when chronology matters: `2026-02-07-auth-decision.md`
- Keep filenames descriptive and specific
- One topic per file — keep documents small and composable

## File Format

- All files should be UTF-8 Markdown (`.md`)
- Start each file with a `# Title` heading
- Use relative Markdown links between documents: `[link text](../01_specs/feature.md)`

## Working with AI Tools

AI tools can freely read any file and create new `.md` files. Overwriting or deleting existing files requires explicit permission.
