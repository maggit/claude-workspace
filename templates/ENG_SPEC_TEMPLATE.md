# [Feature Name]: Engineering Specification

**Status:** Draft
**Author:** [Your Name]
**Date:** [YYYY-MM-DD]
**PRD Link:** [Link to related PRD]

---

## Overview

*High-level summary of what is being built and why. Keep to 2-3 sentences.*

## Architecture

*Describe the system design. Include a diagram if helpful (e.g., Mermaid, ASCII).*

### Components

*List the major components or services involved and their responsibilities.*

- **Component A** -- [responsibility]
- **Component B** -- [responsibility]

### Dependencies

*External services, libraries, or systems this design depends on.*

1.

## Data Model

*Define new or modified data structures, database tables, or schemas.*

```
Table/Model Name
-----------------
field_name    type        constraints
```

*Note any migrations required.*

## API Design

*Define new or modified endpoints, RPCs, or interfaces.*

### `METHOD /path`

- **Request:** describe body/params
- **Response:** describe shape
- **Errors:** list error codes and meanings

## Error Handling

*How will the system handle failures? Cover retries, fallbacks, and user-facing errors.*

| Error Scenario | Handling Strategy |
|---------------|-------------------|
| | |

## Testing Strategy

*Describe your approach to validating this work.*

- **Unit tests:** [scope and coverage targets]
- **Integration tests:** [what interactions are tested]
- **Manual/QA testing:** [key scenarios to verify]

## Rollout Plan

*How will this be deployed? Include feature flags, phased rollout, or canary steps.*

1. **Phase 1:** [description]
2. **Phase 2:** [description]

### Rollback Plan

*Steps to revert if something goes wrong.*

## Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | | | |
