---
name: adr
description: "Create Architecture Decision Records (ADRs). Use when the user says /adr, asks to document an architecture decision, record a technical decision, or wants to create an ADR. Triggers: adr, architecture decision, decision record, technical decision, design decision, why did we choose."
---

# ADR (Architecture Decision Record) Generator

Create well-structured Architecture Decision Records.

## Workflow

1. **Determine ADR location and numbering:**
   - Check for existing ADR directory: `docs/adr/`, `docs/decisions/`, `adr/`, `doc/architecture/decisions/`.
   - If none exists, create `docs/adr/`.
   - Find the next sequence number from existing ADR files.
   - File naming: `NNNN-<kebab-case-title>.md` (e.g., `0005-use-postgresql-for-persistence.md`).

2. **Gather the decision context:**
   - What problem or question prompted this decision?
   - What constraints exist (technical, business, team)?
   - What options were considered?

3. **Generate the ADR using this template:**

```markdown
# <NUMBER>. <Title>

Date: YYYY-MM-DD

## Status

<Proposed | Accepted | Deprecated | Superseded by [ADR-NNNN](NNNN-title.md)>

## Context

<What is the issue that we're seeing that is motivating this decision or change?>

## Decision

<What is the change that we're proposing and/or doing?>

## Consequences

### Positive
- <benefit>

### Negative
- <trade-off>

### Neutral
- <side effect>
```

4. **Link related ADRs:**
   - If this supersedes a previous decision, update the old ADR's status.
   - Cross-reference related decisions.

## Guidelines

- Use the format from [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) as the default.
- Keep the context section factual and objective.
- List all options considered, not just the chosen one.
- Be explicit about trade-offs in consequences.
- Write for a future team member who needs to understand *why* this decision was made.
- Status should be "Proposed" unless the user specifies it's already accepted.
- If the user describes a decision conversationally, extract the structured ADR from their description.
