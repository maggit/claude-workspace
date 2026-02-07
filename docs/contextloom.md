# ContextLoom Compatibility

[ContextLoom](https://contextloom.app) is a Markdown editor designed for organizing project context. Claude Workstation workspaces are fully compatible with ContextLoom.

## How They Work Together

Claude Workstation scaffolds the vault structure (folder taxonomy, naming conventions, file format rules). ContextLoom provides a visual editor for browsing, creating, and linking context documents within that structure.

## Vault Structure

The vault folder taxonomy matches ContextLoom's recommended layout:

| Folder | Purpose |
|--------|---------|
| `00_inbox/` | Unsorted notes, quick captures |
| `01_specs/` | Requirements, PRDs, feature specs |
| `02_architecture/` | System design, technical specs |
| `03_decisions/` | Architectural Decision Records |
| `04_knowledge/` | Reusable concepts, reference material |
| `05_prompts/` | LLM prompts, prompt templates |
| `06_agents/` | Agent roles, rules, memory |
| `07_diagrams/` | Mermaid diagrams, visuals |
| `08_todos/` | Task lists, backlogs |

## File Conventions

Both tools expect:

- UTF-8 Markdown (`.md`) files only
- `# Title` heading at the top of each file
- Relative Markdown links between documents
- Small, composable files (one topic per file)
- Descriptive, lowercase-with-hyphens filenames
- Date-prefixed filenames when chronology matters

## Context Bundles

ContextLoom can export Context Bundles — curated sets of documents assembled for LLM prompts. The vault structure created by Claude Workstation organizes files so that relevant context can be selected and bundled efficiently.

## Workflow

1. Run `claude-workstation init` to scaffold the workspace
2. Open the vault folder in ContextLoom
3. Create and organize context documents
4. Use Claude with the skills and CLAUDE.md instructions
5. Export Context Bundles from ContextLoom as needed
