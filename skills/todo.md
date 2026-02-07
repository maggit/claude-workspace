# Skill: Task Breakdown

## Purpose

Decompose a project, feature, or initiative into actionable, well-defined tasks. Produce a structured checklist that a team can immediately pick up and work from, with clear priorities, effort estimates, and dependencies.

## When to Use

- Breaking down a feature or project into sprint-ready work items
- Creating a personal task list from a broad goal
- Estimating effort and identifying the critical path for a body of work

## Inputs

- **Work description**: The feature, project, or goal to decompose
- **Scope constraints**: Any boundaries on what to include or exclude (optional)
- **Team context**: Team size, roles, skill sets (optional)
- **Timeline**: Target completion date or sprint length (optional)

## Output Format

Produce a markdown document with the following structure:

### 1. Objective
One sentence stating what "done" looks like for this body of work.

### 2. Task List

For each task, use this checklist format:

```
- [ ] **Task title**
  - Description: What needs to be done (1-2 sentences)
  - Priority: P0 / P1 / P2
  - Effort: S (< 2h) / M (2-8h) / L (1-3d) / XL (3-5d)
  - Dependencies: List any tasks that must complete first
  - Acceptance criteria: How to verify this task is done
```

Group tasks into logical phases or categories using H3 headers.

### 3. Dependency Graph
A text summary of the critical path: which tasks block others and what can be parallelized.

### 4. Effort Summary
A quick table:

| Priority | Count | Total Effort |
|----------|-------|--------------|
| P0       |       |              |
| P1       |       |              |
| P2       |       |              |

### 5. Risks and Blockers
List anything that could delay or prevent completion.

## Example

**Input**: "Break down the work to add dark mode to our web app."

**Output**:
- Objective: Users can toggle between light and dark themes across all pages.
- Tasks grouped into phases:
  - **Design**: Audit existing color tokens, define dark palette, update design system
  - **Infrastructure**: Implement theme provider, add user preference storage, set up CSS variable system
  - **Implementation**: Update core components, update page layouts, handle third-party widget theming
  - **Testing**: Visual regression tests, accessibility contrast checks, cross-browser testing
  - **Rollout**: Feature flag setup, beta rollout, documentation update
- Dependency graph showing design must precede implementation, infrastructure can parallel with design
- Effort summary showing total estimated work

## Guidelines

- Make each task small enough to complete in one sitting (aim for S or M when possible)
- Every task should have a clear "done" state -- no vague tasks like "work on styling"
- Order tasks within each phase by dependency, then priority
- Flag tasks that require specific expertise or access
- Include testing and documentation tasks -- they are real work
- If a task is XL, consider whether it should be broken down further
